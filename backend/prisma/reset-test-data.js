import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';
import prisma, { closeDatabasePool } from '../src/config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure .env is loaded from backend directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

/**
 * Explicit named test / personal development accounts (exact email match, case-insensitive).
 * Kept separate from generic pattern matching for transparency and safety.
 */
export const EXPLICIT_TEST_EMAILS = [
  'surangi.naar@gmail.com',
  'manthanj3067@gmail.com',
  'manthan@gmail.com',
  'tanish26112005@gmail.com',
  'dheeraj.morwani11@gmail.com',
  'kakanisourabh23@gmail.com',
  'arunkumarram9664@gmail.com',
];

/**
 * Generic pattern-based matching for test data.
 * - Test emails start with "testuser_" or "audit_"
 * - Test names contain "Snapshot Test"
 */
export const TEST_PATTERNS = {
  emailPrefixes: ['testuser_', 'audit_'],
  nameIncludes: ['snapshot test'],
};

/**
 * Optional list of specific Razorpay Payment IDs to explicitly PRESERVE.
 * If any order has a razorpayPaymentId matching this array, it will NEVER be deleted.
 * (If its user is removed, the order is kept with userId = null via schema onDelete: SetNull).
 */
export const PRESERVED_RAZORPAY_PAYMENT_IDS = [
  // Paste specific pay_XXXX IDs here if any transaction from a test account should be kept
];

/**
 * Checks if a user is an identified test user.
 * Strictly excludes admin and any non-matching users.
 */
export function isTestUser(user) {
  if (!user) return { isTest: false };

  // STRICT GUARD: The admin user must NEVER be deleted
  if (user.role === 'admin') {
    return { isTest: false };
  }

  const email = (user.email || '').toLowerCase().trim();
  const name = (user.name || '').toLowerCase().trim();

  // 1. Explicit hardcoded named test accounts
  const isExplicitMatch = EXPLICIT_TEST_EMAILS.some(
    (explicitEmail) => explicitEmail.toLowerCase().trim() === email
  );
  if (isExplicitMatch) {
    return {
      isTest: true,
      category: 'EXPLICIT NAMED TEST ACCOUNT',
      reason: `Exact match in explicit test accounts list (${email})`,
    };
  }

  // 2. Pattern-based email prefixes ("testuser_", "audit_")
  const matchedPrefix = TEST_PATTERNS.emailPrefixes.find((p) => email.startsWith(p));
  if (matchedPrefix) {
    return {
      isTest: true,
      category: 'GENERIC PATTERN MATCH',
      reason: `Email starts with "${matchedPrefix}"`,
    };
  }

  // 3. Pattern-based name ("Snapshot Test")
  const matchedSub = TEST_PATTERNS.nameIncludes.find((sub) => name.includes(sub));
  if (matchedSub) {
    return {
      isTest: true,
      category: 'GENERIC PATTERN MATCH',
      reason: `Name contains "Snapshot Test"`,
    };
  }

  return { isTest: false };
}

/**
 * Interactive terminal prompt for typing "YES".
 */
function promptConfirm(query) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(query, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function main() {
  const args = process.argv.slice(2);
  const isConfirmFlagPassed = args.includes('--confirm');

  console.log('='.repeat(78));
  console.log('🛡️   SURANGI NAAR — TEST DATA RESET UTILITY');
  console.log('='.repeat(78));
  console.log('A. Explicit Named Test Accounts:');
  EXPLICIT_TEST_EMAILS.forEach((e) => console.log(`   • ${e}`));
  console.log('\nB. Generic Pattern Matching Rules:');
  console.log('   1. Email starts with "testuser_" (case-insensitive)');
  console.log('   2. Email starts with "audit_" (case-insensitive)');
  console.log('   3. Name contains "Snapshot Test" (case-insensitive)');
  console.log('\nStrict Safety Exclusions (NEVER deleted):');
  console.log('   • Admin user (role: "admin")');
  console.log('   • Any user account whose email/name does NOT match either A or B');
  console.log('   • Any order belonging to a real (non-test) user');
  if (PRESERVED_RAZORPAY_PAYMENT_IDS.length > 0) {
    console.log(`   • Preserved Razorpay Orders: ${PRESERVED_RAZORPAY_PAYMENT_IDS.join(', ')}`);
  }
  console.log('   • Product, Category, HeroSlide, PromoMessage, DiscountCode tables');
  console.log('='.repeat(78));

  // 1. Fetch all users with their associated counts & orders
  const allUsers = await prisma.user.findMany({
    include: {
      _count: {
        select: {
          reviews: true,
          cartItems: true,
          wishlist: true,
          addresses: true,
          orders: true,
        },
      },
      orders: {
        select: {
          id: true,
          total: true,
          status: true,
          paymentMethod: true,
          razorpayPaymentId: true,
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  });

  const testUsers = [];
  const preservedUsers = [];

  for (const user of allUsers) {
    const match = isTestUser(user);
    if (match.isTest) {
      testUsers.push({
        ...user,
        matchCategory: match.category,
        matchReason: match.reason,
      });
    } else {
      preservedUsers.push(user);
    }
  }

  console.log(`\n📊 Database User Scan:`);
  console.log(`  • Total Users Found:       ${allUsers.length}`);
  console.log(`  • Preserved (Real / Admin): ${preservedUsers.length}`);
  console.log(`  • Identified Test Users:   ${testUsers.length}`);
  console.log('-'.repeat(78));

  // Also check if any orders have userId = null but customerEmail matching test users
  const testUserEmails = testUsers.map((u) => u.email.toLowerCase().trim());
  const testUserIds = testUsers.map((u) => u.id);

  const guestTestOrders = await prisma.order.findMany({
    where: {
      userId: null,
      customerEmail: { in: testUserEmails },
    },
    select: {
      id: true,
      customerEmail: true,
      total: true,
      status: true,
      razorpayPaymentId: true,
    },
  });

  if (testUsers.length === 0 && guestTestOrders.length === 0) {
    console.log('\n✅ No test users or test orders found in database. Nothing to clean up.');
    await closeDatabasePool();
    process.exit(0);
  }

  // Determine orders to delete vs preserve
  const allCandidateOrders = [];
  testUsers.forEach((u) => {
    u.orders.forEach((o) => allCandidateOrders.push(o));
  });
  guestTestOrders.forEach((o) => allCandidateOrders.push(o));

  const ordersToDelete = [];
  const ordersPreservedByPaymentId = [];

  allCandidateOrders.forEach((o) => {
    if (
      o.razorpayPaymentId &&
      PRESERVED_RAZORPAY_PAYMENT_IDS.includes(o.razorpayPaymentId)
    ) {
      ordersPreservedByPaymentId.push(o);
    } else {
      ordersToDelete.push(o);
    }
  });

  // Print per-user details and item counts to be deleted
  console.log('\n📋 Breakdown of Identified Test Users:');
  let totalReviews = 0;
  let totalCartItems = 0;
  let totalWishlist = 0;
  let totalAddresses = 0;
  let totalOrders = ordersToDelete.length;

  testUsers.forEach((user, index) => {
    totalReviews += user._count.reviews;
    totalCartItems += user._count.cartItems;
    totalWishlist += user._count.wishlist;
    totalAddresses += user._count.addresses;

    console.log(`\n  [${index + 1}] User: "${user.name}" (ID: ${user.id})`);
    console.log(`      Email:       ${user.email}`);
    console.log(`      Role:        ${user.role}`);
    console.log(`      Type:        [${user.matchCategory}]`);
    console.log(`      Reason:      ${user.matchReason}`);
    console.log(`      Items belonging to this user:`);
    console.log(`        - Reviews:        ${user._count.reviews}`);
    console.log(`        - Cart Items:     ${user._count.cartItems}`);
    console.log(`        - Wishlist Items: ${user._count.wishlist}`);
    console.log(`        - Addresses:      ${user._count.addresses}`);
    console.log(`        - Orders:         ${user._count.orders}`);
    if (user.orders.length > 0) {
      user.orders.forEach((o) => {
        const isPreserved =
          o.razorpayPaymentId &&
          PRESERVED_RAZORPAY_PAYMENT_IDS.includes(o.razorpayPaymentId);
        const tag = isPreserved
          ? ' [PRESERVED BY RAZORPAY ID]'
          : ' [QUEUED FOR DELETION]';
        const rzp = o.razorpayPaymentId ? ` (Rzp: ${o.razorpayPaymentId})` : '';
        console.log(
          `          └─ Order ${o.id}: ₹${o.total} (${o.status})${rzp}${tag}`
        );
      });
    }
  });

  if (guestTestOrders.length > 0) {
    console.log(`\n  [+] Unlinked/Guest Orders matching test emails (${guestTestOrders.length}):`);
    guestTestOrders.forEach((o) => {
      const isPreserved =
        o.razorpayPaymentId &&
        PRESERVED_RAZORPAY_PAYMENT_IDS.includes(o.razorpayPaymentId);
      const tag = isPreserved
        ? ' [PRESERVED BY RAZORPAY ID]'
        : ' [QUEUED FOR DELETION]';
      const rzp = o.razorpayPaymentId ? ` (Rzp: ${o.razorpayPaymentId})` : '';
      console.log(`      • ${o.id} - ${o.customerEmail}: ₹${o.total} (${o.status})${rzp}${tag}`);
    });
  }

  console.log('\n' + '='.repeat(78));
  console.log('📦 TOTAL TEST DATA QUEUED FOR DELETION:');
  console.log(`  • Test Users:             ${testUsers.length}`);
  console.log(`  • Reviews:                ${totalReviews}`);
  console.log(`  • Cart Items:             ${totalCartItems}`);
  console.log(`  • Wishlist Items:         ${totalWishlist}`);
  console.log(`  • Addresses:              ${totalAddresses}`);
  console.log(`  • Orders to Delete:       ${totalOrders}`);
  if (ordersPreservedByPaymentId.length > 0) {
    console.log(`  • Orders Preserved:       ${ordersPreservedByPaymentId.length}`);
  }
  console.log('='.repeat(78));

  // SAFETY CHECK: Preserved users confirmation
  console.log(`\n🛡️  Safely Preserved Real Users & Admins (${preservedUsers.length}):`);
  preservedUsers.forEach((u) => {
    const adminTag = u.role === 'admin' ? ' [ADMIN - PROTECTED]' : '';
    console.log(`  • ${u.name} <${u.email}> (${u.role})${adminTag}`);
  });
  console.log('-'.repeat(78));

  // DRY-RUN MODE (Default)
  if (!isConfirmFlagPassed) {
    console.log('\n🔍 MODE: DRY-RUN (Default)');
    console.log('No data was modified or deleted.');
    console.log('\nTo actually delete the identified test data, re-run with --confirm:');
    console.log('  node prisma/reset-test-data.js --confirm\n');
    await closeDatabasePool();
    process.exit(0);
  }

  // CONFIRMATION PROMPT
  console.log('\n⚠️  WARNING: --confirm flag detected!');
  console.log('This will permanently delete the identified test data shown above.');
  console.log('Deletions are executed in FK-safe order inside a single Prisma transaction.');
  console.log('Real customer data, orders, and catalog items will NOT be touched.\n');

  const answer = await promptConfirm(
    'Type "YES" to proceed with deletion (anything else will abort): '
  );

  if (answer !== 'YES') {
    console.log(
      `\n❌ Confirmation rejected (received: "${answer}"). Operation aborted. No records deleted.\n`
    );
    await closeDatabasePool();
    process.exit(0);
  }

  console.log('\n🚀 Beginning transactional deletion in FK-safe order...');
  console.log('Order: Reviews → CartItems → WishlistItems → Addresses → Orders → Users\n');

  const orderIdsToDelete = ordersToDelete.map((o) => o.id);

  // FK-Safe single Prisma transaction (all-or-nothing)
  const deletionResults = await prisma.$transaction(async (tx) => {
    // 1. Reviews
    const deletedReviews = await tx.review.deleteMany({
      where: { userId: { in: testUserIds } },
    });

    // 2. CartItems
    const deletedCartItems = await tx.cartItem.deleteMany({
      where: { userId: { in: testUserIds } },
    });

    // 3. WishlistItems
    const deletedWishlist = await tx.wishlistItem.deleteMany({
      where: { userId: { in: testUserIds } },
    });

    // 4. Addresses
    const deletedAddresses = await tx.address.deleteMany({
      where: { userId: { in: testUserIds } },
    });

    // 5. Orders (belonging to test users, excluding any explicitly preserved orders)
    const deletedOrders = await tx.order.deleteMany({
      where: {
        id: { in: orderIdsToDelete },
      },
    });

    // 6. Test Users
    const deletedUsers = await tx.user.deleteMany({
      where: { id: { in: testUserIds } },
    });

    return {
      reviewsCount: deletedReviews.count,
      cartItemsCount: deletedCartItems.count,
      wishlistCount: deletedWishlist.count,
      addressesCount: deletedAddresses.count,
      ordersCount: deletedOrders.count,
      usersCount: deletedUsers.count,
    };
  });

  console.log('='.repeat(78));
  console.log('✅ RESET COMPLETE — TRANSACTION COMMITTED SUCCESSFULLY');
  console.log('='.repeat(78));
  console.log('Deleted Records Summary:');
  console.log(`  • Reviews deleted:        ${deletionResults.reviewsCount}`);
  console.log(`  • Cart Items deleted:     ${deletionResults.cartItemsCount}`);
  console.log(`  • Wishlist Items deleted: ${deletionResults.wishlistCount}`);
  console.log(`  • Addresses deleted:      ${deletionResults.addressesCount}`);
  console.log(`  • Orders deleted:         ${deletionResults.ordersCount}`);
  console.log(`  • Users deleted:          ${deletionResults.usersCount}`);
  if (ordersPreservedByPaymentId.length > 0) {
    console.log(`  • Orders Preserved:       ${ordersPreservedByPaymentId.length}`);
  }
  console.log('='.repeat(78));
  console.log('All real customer accounts, real orders, and catalog tables remain untouched.\n');

  await closeDatabasePool();
  process.exit(0);
}

main().catch(async (err) => {
  console.error('\n❌ Fatal error during test data reset:', err);
  try {
    await closeDatabasePool();
  } catch (_) {}
  process.exit(1);
});

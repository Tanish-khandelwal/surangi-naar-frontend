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
 * Exact list of 4 order IDs to delete.
 */
const TARGET_ORDER_IDS = [
  'ORD-3603',
  'ORD-9844',
  'ORD-9843',
  'ORD-9842',
];

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
  console.log('='.repeat(78));
  console.log('🗑️   SURANGI NAAR — DELETE SPECIFIC ORDERS');
  console.log('='.repeat(78));
  console.log('Target Order IDs:');
  TARGET_ORDER_IDS.forEach((id) => console.log(`  • ${id}`));
  console.log('='.repeat(78));

  // 1. Fetch orders matching target IDs
  const matchedOrders = await prisma.order.findMany({
    where: {
      id: { in: TARGET_ORDER_IDS },
    },
    select: {
      id: true,
      customerName: true,
      customerEmail: true,
      customerPhone: true,
      total: true,
      status: true,
      paymentMethod: true,
      razorpayPaymentId: true,
      createdAt: true,
    },
  });

  if (matchedOrders.length === 0) {
    console.log('\n⚠️  None of the targeted orders were found in the database. Nothing to delete.\n');
    await closeDatabasePool();
    process.exit(0);
  }

  console.log(`\n📋 Found ${matchedOrders.length} of ${TARGET_ORDER_IDS.length} target orders:\n`);
  matchedOrders.forEach((order, index) => {
    console.log(`  [${index + 1}] Order ID:      ${order.id}`);
    console.log(`      Customer Name: ${order.customerName}`);
    console.log(`      Customer Email: ${order.customerEmail}`);
    console.log(`      Total:         ₹${order.total}`);
    console.log(`      Status:        ${order.status}`);
    console.log(`      Payment Method:${order.paymentMethod}`);
    console.log(`      Razorpay ID:   ${order.razorpayPaymentId || 'N/A'}`);
    console.log(`      Created At:    ${order.createdAt.toISOString()}`);
    console.log('');
  });

  // Safety confirmation
  console.log('='.repeat(78));
  console.log('⚠️  WARNING: Deletion is permanent and affects ONLY the Order table.');
  console.log('No other tables will be touched.');
  console.log('='.repeat(78));

  const answer = await promptConfirm('\nType "YES" to proceed with deletion (anything else will abort): ');

  if (answer !== 'YES') {
    console.log(`\n❌ Confirmation rejected (received: "${answer}"). Operation aborted. No records deleted.\n`);
    await closeDatabasePool();
    process.exit(0);
  }

  console.log('\n🚀 Deleting targeted orders from Order table...');

  const deleteResult = await prisma.order.deleteMany({
    where: {
      id: { in: matchedOrders.map((o) => o.id) },
    },
  });

  console.log('\n' + '='.repeat(78));
  console.log('✅ DELETION SUCCESSFUL');
  console.log('='.repeat(78));
  console.log(`Deleted Orders: ${deleteResult.count} row(s) removed from Order table.`);
  matchedOrders.forEach((o) => {
    console.log(`  • Removed ${o.id} (${o.customerName}, ₹${o.total})`);
  });
  console.log('='.repeat(78) + '\n');

  await closeDatabasePool();
  process.exit(0);
}

main().catch(async (err) => {
  console.error('\n❌ Fatal error during order deletion:', err);
  try {
    await closeDatabasePool();
  } catch (_) {}
  process.exit(1);
});

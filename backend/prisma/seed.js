import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const BRAND_CONTACT = {
  id: 1,
  phone: "+91 9116655814",
  displayPhone: "+91 91166 55814",
  email: "surangi.naar@gmail.com",
  instagram: "https://www.instagram.com/surangi.naar",
  instagramHandle: "@surangi.naar",
  facebook: "https://www.facebook.com/profile.php?id=1274421192401737&hr=1&wtsid=rdr_0GcwbFGifB7kgtTxr",
  whatsapp: "https://wa.me/919116655814",
  address: "Tiranga Marg, Manyawas, Jaipur, Rajasthan 302020, India",
  googleMaps: "https://maps.app.goo.gl/9kU8jVfN7ZBhj5fG9",
  hours: "Mon - Sat: 10:30 AM - 7:30 PM IST"
};

const PROMO_MESSAGES = [
  "5% OFF first order — use code HAPPY5 at checkout",
  "10% OFF prepaid orders — use code LAH10",
  "Complimentary Express Shipping across India on orders over ₹5,000"
];

const CATEGORIES_GRID = [
  {
    id: "kurtis",
    slug: "kurtis",
    name: "Kurtis",
    count: "28 Styles",
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236587/surangi-naar/products/real_product_3.jpg",
    tagline: "Handprinted Malmal & Chanderi Tunics"
  },
  {
    id: "short-kurtis",
    slug: "short-kurtis",
    name: "Short Kurtis",
    count: "24 Styles",
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236591/surangi-naar/products/real_product_6.jpg",
    tagline: "Resort Luxe & Linen Sets"
  },
  {
    id: "festive-wear",
    slug: "festive-wear",
    name: "Festive Wear",
    count: "32 Styles",
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236590/surangi-naar/products/real_product_5.jpg",
    tagline: "Heavy Embroidered Anarkalis & Festive Sets"
  }
];

const HERO_SLIDES = [
  {
    id: 1,
    subtitle: "Royal Festive Collection 2026",
    title: "Festive Grandeur",
    description: "Intricate hand-highlighted Zardosi & Gota Patti festive ensembles for grand celebrations.",
    cta: "Explore Festive Wear",
    categorySlug: "festive-wear",
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236592/surangi-naar/products/real_product_7.jpg",
    order: 1
  },
  {
    id: 2,
    subtitle: "Contemporary Silk Staples",
    title: "Luxe Short Kurtis",
    description: "Flowing breathable fabrics designed for sunshine, warm breezes, and effortless elegance.",
    cta: "Shop Short Kurtis",
    categorySlug: "short-kurtis",
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236588/surangi-naar/products/real_product_4.jpg",
    order: 2
  },
  {
    id: 3,
    subtitle: "Hand-Block Artisanal Prints",
    title: "Handcrafted Kurtis",
    description: "Versatile Mul Chanderi & Soft Cotton Kurtis featuring authentic Jaipur embroidery and prints.",
    cta: "Discover Kurtis",
    categorySlug: "kurtis",
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236586/surangi-naar/products/real_product_2.jpg",
    order: 3
  }
];

const PRODUCTS_CURATED = [
  {
    id: "p1",
    name: "Lavender Mul Chanderi Kurti Set (D.No 061)",
    category: "Kurtis",
    categorySlug: "kurtis",
    price: 3999,
    originalPrice: 4999,
    colorVariants: [
      { name: "Lavender Lilac", hex: "#b497d6", image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236556/surangi-naar/products/real_product_1.jpg", secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236586/surangi-naar/products/real_product_2.jpg" }
    ],
    sizes: ["M", "L", "XL", "XXL"],
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236556/surangi-naar/products/real_product_1.jpg",
    secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236586/surangi-naar/products/real_product_2.jpg",
    badge: "Bestseller",
    rating: 4.9,
    isSoldOut: false,
    description: "Premium Mul Chanderi kurti with Roman pant and matching organza embroidered dupatta set. Features intricate multi floral thread embroidery.",
    fabric: "Mul Chanderi & Roman Pant",
    care: "Dry Clean Only.",
    shipping: "Dispatched within 2-3 business days. Free shipping across India over ₹5,000."
  },
  {
    id: "p2",
    name: "Sage Green Mul Chanderi Kurti Set (D.No 061)",
    category: "Kurtis",
    categorySlug: "kurtis",
    price: 3999,
    originalPrice: 4999,
    colorVariants: [
      { name: "Sage Green", hex: "#95a383", image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236586/surangi-naar/products/real_product_2.jpg", secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236556/surangi-naar/products/real_product_1.jpg" }
    ],
    sizes: ["M", "L", "XL", "XXL"],
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236586/surangi-naar/products/real_product_2.jpg",
    secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236556/surangi-naar/products/real_product_1.jpg",
    badge: "New Arrival",
    rating: 4.92,
    isSoldOut: false,
    description: "Serene sage green Mul Chanderi tunic paired with Roman pants and scalloped dupatta. Features white daisy motif neck embroidery.",
    fabric: "Mul Chanderi with Cotton Inner",
    care: "Dry Clean Only.",
    shipping: "Dispatched within 2-3 business days."
  },
  {
    id: "p3",
    name: "Grey Embroidered Cotton Suit Set (D.No 2709)",
    category: "Kurtis",
    categorySlug: "kurtis",
    price: 4299,
    originalPrice: 5499,
    colorVariants: [
      { name: "Slate Grey", hex: "#87888a", image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236587/surangi-naar/products/real_product_3.jpg", secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236588/surangi-naar/products/real_product_4.jpg" }
    ],
    sizes: ["M", "L", "XL", "XXL"],
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236587/surangi-naar/products/real_product_3.jpg",
    secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236588/surangi-naar/products/real_product_4.jpg",
    badge: "Trending",
    rating: 4.88,
    isSoldOut: false,
    description: "Sophisticated slate grey cotton kurti combo with cotton inner lining, embroidered neckline, and scalloped drapes.",
    fabric: "Pure Cotton 60-60 with Inner",
    care: "Gentle Hand Wash / Dry Clean.",
    shipping: "Dispatched within 2 business days."
  },
  {
    id: "p4",
    name: "Mustard Yellow Cotton Kurti Set (D.No 065)",
    category: "Kurtis",
    categorySlug: "kurtis",
    price: 4599,
    originalPrice: 5999,
    colorVariants: [
      { name: "Mustard Gold", hex: "#d4a017", image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236588/surangi-naar/products/real_product_4.jpg", secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236590/surangi-naar/products/real_product_5.jpg" }
    ],
    sizes: ["M", "L", "XL", "XXL"],
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236588/surangi-naar/products/real_product_4.jpg",
    secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236590/surangi-naar/products/real_product_5.jpg",
    badge: "Featured",
    rating: 4.85,
    isSoldOut: false,
    description: "Vibrant mustard yellow Cotton 60-60 kurti pant set with Malmal dupatta featuring multi-embroidery rose motifs.",
    fabric: "Cotton 60-60 with Malmal Dupatta",
    care: "Dry Clean Only.",
    shipping: "Dispatched within 3 business days."
  },
  {
    id: "p5",
    name: "Royal Purple Roman Silk Handwork Set (D.No 3301)",
    category: "Kurtis",
    categorySlug: "kurtis",
    price: 4999,
    originalPrice: 6499,
    colorVariants: [
      { name: "Royal Purple", hex: "#5a2d82", image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236590/surangi-naar/products/real_product_5.jpg", secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236591/surangi-naar/products/real_product_6.jpg" }
    ],
    sizes: ["M", "L", "XL", "XXL"],
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236590/surangi-naar/products/real_product_5.jpg",
    secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236591/surangi-naar/products/real_product_6.jpg",
    badge: "Glamour Edit",
    rating: 4.95,
    isSoldOut: false,
    description: "Graceful royal purple Roman silk kurti featuring neck & sleeve handwork tie details and woven zari dupatta.",
    fabric: "Pure Roman Silk with Handwork",
    care: "Dry Clean Only.",
    shipping: "Dispatched within 3-4 business days."
  },
  {
    id: "p6",
    name: "Jaipur Floral Chanderi Straight Tunic",
    category: "Kurtis",
    categorySlug: "kurtis",
    price: 3799,
    originalPrice: 4799,
    colorVariants: [
      { name: "Royal Red", hex: "#c83228", image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236591/surangi-naar/products/real_product_6.jpg", secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236592/surangi-naar/products/real_product_7.jpg" }
    ],
    sizes: ["M", "L", "XL", "XXL"],
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236591/surangi-naar/products/real_product_6.jpg",
    secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236592/surangi-naar/products/real_product_7.jpg",
    badge: "Popular",
    rating: 4.8,
    isSoldOut: false,
    description: "Straight cut Jaipur Chanderi tunic with delicate floral thread embroidery on the neckline.",
    fabric: "Chanderi Silk with Malmal Lining",
    care: "Dry Clean Only.",
    shipping: "Dispatched within 2 days."
  },
  {
    id: "p7",
    name: "Luxe Silk Satin Resort Short Kurti Set",
    category: "Short Kurtis",
    categorySlug: "short-kurtis",
    price: 7499,
    originalPrice: 8999,
    colorVariants: [
      { name: "Champagne Gold", hex: "#e0c9a6", image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236595/surangi-naar/products/real_product_9.jpg", secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236557/surangi-naar/products/real_product_10.jpg" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236595/surangi-naar/products/real_product_9.jpg",
    secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236557/surangi-naar/products/real_product_10.jpg",
    badge: "Trending",
    rating: 4.89,
    isSoldOut: false,
    description: "Flowing silk satin short kurti and trouser set designed for summer retreats and evening gatherings.",
    fabric: "100% Mulberry Silk Satin",
    care: "Dry Clean Only.",
    shipping: "Dispatched within 2-4 business days."
  },
  {
    id: "p8",
    name: "Organic European Linen Short Kurti Set",
    category: "Short Kurtis",
    categorySlug: "short-kurtis",
    price: 6999,
    originalPrice: 8499,
    colorVariants: [
      { name: "Terracotta Earth", hex: "#c86d51", image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236557/surangi-naar/products/real_product_10.jpg", secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236561/surangi-naar/products/real_product_11.png" }
    ],
    sizes: ["S", "M", "L", "XL"],
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236557/surangi-naar/products/real_product_10.jpg",
    secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236561/surangi-naar/products/real_product_11.png",
    badge: "Resort Luxe",
    rating: 4.91,
    isSoldOut: false,
    description: "Tailored organic linen short kurti and wide-leg pant set with mother-of-pearl buttons.",
    fabric: "100% Organic European Linen",
    care: "Gentle cold hand wash.",
    shipping: "Dispatched within 3 business days."
  },
  {
    id: "p9",
    name: "Botanical Printed Silk Lounge Short Kurti",
    category: "Short Kurtis",
    categorySlug: "short-kurtis",
    price: 8499,
    originalPrice: 9999,
    colorVariants: [
      { name: "Olive Palm", hex: "#4b5320", image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236561/surangi-naar/products/real_product_11.png", secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236562/surangi-naar/products/real_product_12.jpg" }
    ],
    sizes: ["XS", "S", "M", "L"],
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236561/surangi-naar/products/real_product_11.png",
    secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236562/surangi-naar/products/real_product_12.jpg",
    badge: "Must Have",
    rating: 4.86,
    isSoldOut: false,
    description: "Contemporary fluid botanical print short kurti and high-waisted trousers ensemble.",
    fabric: "Pure Silk Chiffon & Satin Base",
    care: "Dry Clean Only.",
    shipping: "Dispatched within 3 days."
  },
  {
    id: "p10",
    name: "Royal Zardosi Heavy Festive Anarkali Set",
    category: "Festive Wear",
    categorySlug: "festive-wear",
    price: 18500,
    originalPrice: 22000,
    colorVariants: [
      { name: "Royal Emerald", hex: "#1b4332", image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236569/surangi-naar/products/real_product_14.png", secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236573/surangi-naar/products/real_product_15.png" }
    ],
    sizes: ["S", "M", "L", "XL"],
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236569/surangi-naar/products/real_product_14.png",
    secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236573/surangi-naar/products/real_product_15.png",
    badge: "Exclusive",
    rating: 5.0,
    isSoldOut: false,
    description: "Royal flared festive Anarkali suit set heavily hand-embroidered with authentic Zardosi work and organza dupatta.",
    fabric: "Chanderi Silk & Organza Dupatta",
    care: "Dry Clean Only.",
    shipping: "Dispatched within 4-7 business days."
  },
  {
    id: "p11",
    name: "Gota Patti Heavily Embroidered Festive Set",
    category: "Festive Wear",
    categorySlug: "festive-wear",
    price: 21000,
    originalPrice: 25000,
    colorVariants: [
      { name: "Crimson Red", hex: "#8b0000", image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236573/surangi-naar/products/real_product_15.png", secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236578/surangi-naar/products/real_product_16.png" }
    ],
    sizes: ["S", "M", "L", "Custom"],
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236573/surangi-naar/products/real_product_15.png",
    secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236578/surangi-naar/products/real_product_16.png",
    badge: "Royal Edit",
    rating: 4.96,
    isSoldOut: false,
    description: "Grand wedding festive ensemble featuring Gota Patti and antique tilla hand-embroidery over weighted raw silk.",
    fabric: "Raw Silk & Net Dupatta",
    care: "Dry Clean Only.",
    shipping: "Dispatched within 5-7 business days."
  },
  {
    id: "p12",
    name: "Haute Couture Bridal Wedding Suit Set",
    category: "Festive Wear",
    categorySlug: "festive-wear",
    price: 24500,
    originalPrice: 29000,
    colorVariants: [
      { name: "Deep Ruby", hex: "#5c1325", image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236578/surangi-naar/products/real_product_16.png", secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236582/surangi-naar/products/real_product_17.png" }
    ],
    sizes: ["S", "M", "L", "Custom"],
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236578/surangi-naar/products/real_product_16.png",
    secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236582/surangi-naar/products/real_product_17.png",
    badge: "Bridal Couture",
    rating: 4.98,
    isSoldOut: false,
    description: "Intricately detailed bridal festive set with antique metallic threadwork and heavy zari tissue drapes.",
    fabric: "Pure Raw Silk & Tissue Dupatta",
    care: "Dry Clean Only.",
    shipping: "Dispatched within 7 business days."
  },
  {
    id: "na1",
    name: "Hand-Embroidered Zari Chanderi Kurti",
    category: "Kurtis",
    categorySlug: "kurtis",
    price: 5499,
    originalPrice: 6999,
    colorVariants: [
      { name: "Rust Orange", hex: "#d9531e", image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236592/surangi-naar/products/real_product_7.jpg", secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236593/surangi-naar/products/real_product_8.jpg" }
    ],
    sizes: ["S", "M", "L", "XL"],
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236592/surangi-naar/products/real_product_7.jpg",
    secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236593/surangi-naar/products/real_product_8.jpg",
    badge: "New Arrival",
    isSoldOut: false,
    rating: 4.9,
    description: "Rich straight kurti with intricate metallic zari border highlights.",
    fabric: "Chanderi Silk with Fine Zari Work",
    care: "Dry Clean Only.",
    shipping: "Dispatched within 2-4 business days."
  },
  {
    id: "na2",
    name: "Resort Linen Chic Short Kurti Set",
    category: "Short Kurtis",
    categorySlug: "short-kurtis",
    price: 7999,
    originalPrice: 9499,
    colorVariants: [
      { name: "Olive Green", hex: "#556b2f", image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236562/surangi-naar/products/real_product_12.jpg", secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236564/surangi-naar/products/real_product_13.jpg" }
    ],
    sizes: ["XS", "S", "M", "L"],
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236562/surangi-naar/products/real_product_12.jpg",
    secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236564/surangi-naar/products/real_product_13.jpg",
    isSoldOut: false,
    rating: 4.88,
    description: "Breathable natural linen resort short kurti set with tailored high-rise pants.",
    fabric: "100% Organic Linen",
    care: "Gentle cold hand wash.",
    shipping: "Dispatched within 3-5 business days."
  },
  {
    id: "na3",
    name: "Tara Royal Organza Festive Suit",
    category: "Festive Wear",
    categorySlug: "festive-wear",
    price: 16999,
    originalPrice: 19999,
    colorVariants: [
      { name: "Royal Purple", hex: "#5a2d82", image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236582/surangi-naar/products/real_product_17.png", secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236584/surangi-naar/products/real_product_18.png" }
    ],
    sizes: ["S", "M", "L"],
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236582/surangi-naar/products/real_product_17.png",
    secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236584/surangi-naar/products/real_product_18.png",
    badge: "New Arrival",
    isSoldOut: false,
    rating: 4.95,
    description: "Pastel organza flared tunic set with sequin motifs and a heavy tissue dupatta.",
    fabric: "Organza Silk & Tissue",
    care: "Dry Clean Only.",
    shipping: "Dispatched within 4 business days."
  }
];

const INITIAL_DISCOUNTS = [
  { code: "HAPPY5", discountPercent: 5, minSpend: 0, description: "5% OFF first order", isActive: true },
  { code: "LAH10", discountPercent: 10, minSpend: 2500, description: "10% OFF prepaid orders", isActive: true },
  { code: "FESTIVE20", discountPercent: 20, minSpend: 10000, description: "20% OFF festive orders above ₹10,000", isActive: true }
];

const INITIAL_ORDERS = [
  {
    id: "ORD-9842",
    customerName: "Ananya Sharma",
    customerEmail: "ananya.s@gmail.com",
    customerPhone: "+91 98765 43210",
    customerAddress: "B-402 Palm Heights, Cyber City, Gurgaon 122002",
    items: [
      { id: "p1", name: "Lavender Mul Chanderi Kurti Set (D.No 061)", size: "M", color: "Lavender Lilac", quantity: 1, price: 3999 }
    ],
    total: 3999,
    status: "Delivered",
    paymentMethod: "Prepaid (UPI)",
    createdAt: new Date("2026-08-16T14:32:00Z")
  },
  {
    id: "ORD-9843",
    customerName: "Priyanka Verma",
    customerEmail: "priyanka.v@yahoo.com",
    customerPhone: "+91 98112 87654",
    customerAddress: "72 Luxury Enclave, Jubilee Hills, Hyderabad 500033",
    items: [
      { id: "p10", name: "Royal Zardosi Heavy Festive Anarkali Set", size: "L", color: "Royal Emerald", quantity: 1, price: 18500 }
    ],
    total: 18500,
    status: "Processing",
    paymentMethod: "Prepaid (Credit Card)",
    createdAt: new Date("2026-08-17T09:15:00Z")
  },
  {
    id: "ORD-9844",
    customerName: "Meera Kapoor",
    customerEmail: "meera.kapoor@gmail.com",
    customerPhone: "+91 99001 22334",
    customerAddress: "14 Sterling Apartments, Bandra West, Mumbai 400050",
    items: [
      { id: "p7", name: "Luxe Silk Satin Resort Short Kurti Set", size: "S", color: "Champagne Gold", quantity: 1, price: 7499 }
    ],
    total: 7499,
    status: "Pending",
    paymentMethod: "Cash on Delivery",
    createdAt: new Date("2026-08-17T11:45:00Z")
  }
];

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Store Settings
  await prisma.storeSettings.upsert({
    where: { id: 1 },
    update: BRAND_CONTACT,
    create: BRAND_CONTACT,
  });
  console.log('✅ Store Settings seeded');

  // 2. Promo Messages
  await prisma.promoMessage.deleteMany({});
  for (let i = 0; i < PROMO_MESSAGES.length; i++) {
    await prisma.promoMessage.create({
      data: {
        message: PROMO_MESSAGES[i],
        order: i + 1,
      },
    });
  }
  console.log('✅ Promo Messages seeded');

  // 3. Categories
  await prisma.category.deleteMany({});
  for (const cat of CATEGORIES_GRID) {
    await prisma.category.create({
      data: cat,
    });
  }
  console.log('✅ Categories seeded');

  // 4. Hero Slides
  await prisma.heroSlide.deleteMany({});
  for (const slide of HERO_SLIDES) {
    await prisma.heroSlide.create({
      data: slide,
    });
  }
  console.log('✅ Hero Slides seeded');

  // 5. Products
  await prisma.product.deleteMany({});
  for (const prod of PRODUCTS_CURATED) {
    const formattedVariants = (prod.colorVariants || []).map(v => {
      if (v.images && Array.isArray(v.images)) return v;
      const images = [];
      if (v.image) images.push(v.image);
      if (v.secondaryImage && v.secondaryImage !== v.image) images.push(v.secondaryImage);
      if (images.length === 0 && prod.image) images.push(prod.image);
      const { image, secondaryImage, ...rest } = v;
      return { ...rest, images };
    });

    await prisma.product.create({
      data: {
        ...prod,
        colorVariants: formattedVariants,
        image: formattedVariants[0]?.images[0] || prod.image,
        secondaryImage: formattedVariants[0]?.images[1] || formattedVariants[0]?.images[0] || prod.secondaryImage,
      },
    });
  }
  console.log('✅ Products seeded');

  // 6. Discount Codes
  for (const discount of INITIAL_DISCOUNTS) {
    await prisma.discountCode.upsert({
      where: { code: discount.code },
      update: discount,
      create: discount,
    });
  }
  console.log('✅ Discount Codes seeded');

  // 7. Orders
  for (const order of INITIAL_ORDERS) {
    await prisma.order.upsert({
      where: { id: order.id },
      update: order,
      create: order,
    });
  }
  console.log('✅ Initial Orders seeded');

  // 8. Admin User
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@suranginaar.com';
  const hashedAdminPassword = process.env.ADMIN_PASSWORD_HASH || (await bcrypt.hash('admin123', 10));

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: 'admin',
      name: 'Admin User',
    },
    create: {
      name: 'Admin User',
      email: adminEmail,
      passwordHash: hashedAdminPassword,
      role: 'admin',
      provider: 'email',
    },
  });
  console.log('✅ Admin User seeded');

  console.log('🎉 Database seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

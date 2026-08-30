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
    name: "Pink Lehariya Silk Kurta Set",
    category: "Kurtis",
    categorySlug: "kurtis",
    price: 899,
    originalPrice: 1999,
    colorVariants: [
      { name: "Lavender Lilac", hex: "#b497d6", image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236556/surangi-naar/products/real_product_1.jpg", secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236586/surangi-naar/products/real_product_2.jpg" }
    ],
    sizes: ["M", "L", "XL", "XXL"],
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236556/surangi-naar/products/real_product_1.jpg",
    secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236586/surangi-naar/products/real_product_2.jpg",
    badge: "Bestseller",
    rating: 4.9,
    isSoldOut: false,
    description: "Add a festive touch to your wardrobe with this elegant Pink Lehariya Silk Kurta Set. Featuring a beautiful traditional lehariya pattern and rich pink tones, this outfit is perfect for festive celebrations, family gatherings, and special occasions.",
    fabric: "Silk",
    care: "Machine Wash",
    shipping: "Dispatched within 5-7 business days. Free shipping across India over ₹5,000."
  },
  {
    id: "p2",
    name: "Mustard Yellow Cotton Mirror Embroidered Kurta Set",
    category: "Kurtis",
    categorySlug: "kurtis",
    price: 1199,
    originalPrice: 1499,
    colorVariants: [
      { name: "Sage Green", hex: "#95a383", image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236586/surangi-naar/products/real_product_2.jpg", secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236556/surangi-naar/products/real_product_1.jpg" }
    ],
    sizes: ["M", "L", "XL", "XXL"],
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236586/surangi-naar/products/real_product_2.jpg",
    secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236556/surangi-naar/products/real_product_1.jpg",
    badge: "New Arrival",
    rating: 4.92,
    isSoldOut: false,
    description: "Brighten your ethnic wardrobe with this elegant Mustard Yellow Cotton Kurta Set, featuring beautiful embroidery and delicate mirror-style detailing around the neckline. The vibrant mustard shade adds a festive touch, while the soft cotton fabric keeps the outfit comfortable and breathable.",
    fabric: "Cotton",
    care: "Machine Wash.",
    shipping: "Dispatched within 4-7 business days."
  },
  {
    id: "p3",
    name: "Chocolate Brown Rose Printed Cotton Daily Wear Kurta Set",
    category: "Kurtis",
    categorySlug: "kurtis",
    price: 999,
    originalPrice: 1299,
    colorVariants: [
      { name: "Slate Grey", hex: "#87888a", image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236587/surangi-naar/products/real_product_3.jpg", secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236588/surangi-naar/products/real_product_4.jpg" }
    ],
    sizes: ["M", "L", "XL", "XXL"],
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236587/surangi-naar/products/real_product_3.jpg",
    secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236588/surangi-naar/products/real_product_4.jpg",
    badge: "Trending",
    rating: 4.88,
    isSoldOut: false,
    description: "Comfortable and stylish Rose Printed Cotton Kurta Set, designed for effortless everyday wear. The set features a beautiful rose print with matching pants and dupatta, making it perfect for work, casual outings, and daily ethnic styling.",
    fabric: "Pure Cotton",
    care: "Machine Wash",
    shipping: "Dispatched within 4-7 business days."
  },
  {
    id: "p4",
    name: "Orange Rose Printed Cotton Daily Wear Kurta Set",
    category: "Kurtis",
    categorySlug: "kurtis",
    price: 999,
    originalPrice: 1299,
    colorVariants: [
      { name: "Mustard Gold", hex: "#d4a017", image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236588/surangi-naar/products/real_product_4.jpg", secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236590/surangi-naar/products/real_product_5.jpg" }
    ],
    sizes: ["M", "L", "XL", "XXL"],
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236588/surangi-naar/products/real_product_4.jpg",
    secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236590/surangi-naar/products/real_product_5.jpg",
    badge: "Featured",
    rating: 4.85,
    isSoldOut: false,
    description: "Comfortable and stylish Rose Printed Cotton Kurta Set, designed for effortless everyday wear. The set features a beautiful rose print with matching pants and dupatta, making it perfect for work, casual outings, and daily ethnic styling.",
    fabric: "Cotton",
    care: "Machine Wash",
    shipping: "Dispatched within 5-7 business days."
  },
  {
    id: "p5",
    name: "Wine Rose Printed Cotton Daily Wear Kurta Set",
    category: "Kurtis",
    categorySlug: "kurtis",
    price: 999,
    originalPrice: 1299,
    colorVariants: [
      { name: "Royal Purple", hex: "#5a2d82", image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236590/surangi-naar/products/real_product_5.jpg", secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236591/surangi-naar/products/real_product_6.jpg" }
    ],
    sizes: ["M", "L", "XL", "XXL"],
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236590/surangi-naar/products/real_product_5.jpg",
    secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236591/surangi-naar/products/real_product_6.jpg",
    badge: "Glamour Edit",
    rating: 4.95,
    isSoldOut: false,
    description: "Comfortable and stylish Rose Printed Cotton Kurta Set, designed for effortless everyday wear. The set features a beautiful rose print with matching pants and dupatta, making it perfect for work, casual outings, and daily ethnic styling.",
    fabric: "Cotton",
    care: "Machine Wash.",
    shipping: "Dispatched within 4-7 business days."
  },
  {
    id: "p6",
    name: "Embroidered Kurta Set",
    category: "Kurtis",
    categorySlug: "kurtis",
    price: 1199,
    originalPrice: 1499,
    colorVariants: [
      { name: "Royal Red", hex: "#c83228", image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236591/surangi-naar/products/real_product_6.jpg", secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236592/surangi-naar/products/real_product_7.jpg" }
    ],
    sizes: ["M", "L", "XL", "XXL"],
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236591/surangi-naar/products/real_product_6.jpg",
    secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236592/surangi-naar/products/real_product_7.jpg",
    badge: "Popular",
    rating: 4.8,
    isSoldOut: false,
    description: "Elegant 100% Pure Cotton Kurta Set featuring beautiful ethnic embroidery on the neckline, paired with matching pants and a dupatta. Available in Orange & Pink, perfect for comfortable daily wear and festive occasions.",
    fabric: "Cotton",
    care: "Machine Wash",
    shipping: "Dispatched within 4-7 days."
  },
  {
    id: "p7",
    name: "Floral Embroidered Mul Chanderi Kurta Set",
    category: "Short Kurtis",
    categorySlug: "short-kurtis",
    price: 1349,
    originalPrice: 1799,
    colorVariants: [
      { name: "Champagne Gold", hex: "#e0c9a6", image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236595/surangi-naar/products/real_product_9.jpg", secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236557/surangi-naar/products/real_product_10.jpg" }
    ],
    sizes: ["M", "L", "XL", "XXL"],
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236595/surangi-naar/products/real_product_9.jpg",
    secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236557/surangi-naar/products/real_product_10.jpg",
    badge: "Trending",
    rating: 4.89,
    isSoldOut: false,
    description: "Elegant Mul Chanderi Kurta Set featuring delicate floral embroidery, paired with Roman pants and a graceful dupatta. Available in Green & Lavender, perfect for festive occasions and special gatherings.",
    fabric: "Mul Chanderi",
    care: "Dry Clean Only",
    shipping: "Dispatched within 4-7 business days."
  },
  {
    id: "p8",
    name: "Floral Embroidered Mul Chanderi Kurta Set",
    category: "Short Kurtis",
    categorySlug: "short-kurtis",
    price: 1349,
    originalPrice: 1799,
    colorVariants: [
      { name: "Terracotta Earth", hex: "#c86d51", image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236557/surangi-naar/products/real_product_10.jpg", secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236561/surangi-naar/products/real_product_11.png" }
    ],
    sizes: ["M", "L", "XL", "XXL"],
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236557/surangi-naar/products/real_product_10.jpg",
    secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236561/surangi-naar/products/real_product_11.png",
    badge: "Resort Luxe",
    rating: 4.91,
    isSoldOut: false,
    description: "Elegant Mul Chanderi Kurta Set featuring delicate floral embroidery, paired with Roman pants and a graceful dupatta. Available in Green & Lavender, perfect for festive occasions and special gatherings.",
    fabric: "Mul Chanderi",
    care: "Dry Clean Only",
    shipping: "Dispatched within 5-7 business days."
  },
  {
    id: "p9",
    name: "Mustard Yellow Cotton Embroidered Kurti Set",
    category: "Short Kurtis",
    categorySlug: "short-kurtis",
    price: 1299,
    originalPrice: 1699,
    colorVariants: [
      { name: "Olive Palm", hex: "#4b5320", image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236561/surangi-naar/products/real_product_11.png", secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236562/surangi-naar/products/real_product_12.jpg" }
    ],
    sizes: ["M", "L", "XL", "XXL"],
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236561/surangi-naar/products/real_product_11.png",
    secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236562/surangi-naar/products/real_product_12.jpg",
    badge: "Must Have",
    rating: 4.86,
    isSoldOut: false,
    description: "Elegant Mustard Yellow Cotton Kurti Set featuring beautiful multi-colour floral embroidery on the neckline and hem. Paired with matching pants and a lightweight Malmal dupatta, perfect for a graceful festive look.",
    fabric: "Cotton 60-60",
    care: "Dry Clean Only",
    shipping: "Dispatched within 2-3 days."
  },
  {
    id: "p10",
    name: "Teal Blue Floral Printed Kurta Set",
    category: "Festive Wear",
    categorySlug: "festive-wear",
    price: 1299,
    originalPrice: 1699,
    colorVariants: [
      { name: "Royal Emerald", hex: "#1b4332", image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236569/surangi-naar/products/real_product_14.png", secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236573/surangi-naar/products/real_product_15.png" }
    ],
    sizes: ["M", "L", "XL", "XXL"],
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236569/surangi-naar/products/real_product_14.png",
    secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236573/surangi-naar/products/real_product_15.png",
    badge: "Exclusive",
    rating: 5.0,
    isSoldOut: false,
    description: "Elegant Teal Blue Kurta Set featuring beautiful floral print detailing on the neckline, sleeves, and hem. Paired with matching pants and dupatta, it is perfect for comfortable daily wear and festive ethnic styling.",
    fabric: "Cotton 60-60",
    care: "Machine Wash",
    shipping: "Dispatched within 4-7 business days."
  },
  {
    id: "p11",
    name: "Mustard Floral Printed Cotton Kurta Set",
    category: "Festive Wear",
    categorySlug: "festive-wear",
    price: 999,
    originalPrice: 1299,
    colorVariants: [
      { name: "Crimson Red", hex: "#8b0000", image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236573/surangi-naar/products/real_product_15.png", secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236578/surangi-naar/products/real_product_16.png" }
    ],
    sizes: ["M", "L", "XL", "XXL"],
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236573/surangi-naar/products/real_product_15.png",
    secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236578/surangi-naar/products/real_product_16.png",
    badge: "Royal Edit",
    rating: 4.96,
    isSoldOut: false,
    description: "Comfortable Mustard Cotton Kurta Set featuring bold cream floral prints with elegant border detailing. Paired with matching pants and dupatta, making it perfect for daily wear and casual outings.",
    fabric: "Cotton",
    care: "Machine Wash",
    shipping: "Dispatched within 5-7 business days."
  },
  {
    id: "p12",
    name: "Green Floral Printed Cotton Kurta Set",
    category: "Festive Wear",
    categorySlug: "festive-wear",
    price: 999,
    originalPrice: 1299,
    colorVariants: [
      { name: "Deep Ruby", hex: "#5c1325", image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236578/surangi-naar/products/real_product_16.png", secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236582/surangi-naar/products/real_product_17.png" }
    ],
    sizes: ["M", "L", "XL", "XXL"],
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236578/surangi-naar/products/real_product_16.png",
    secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236582/surangi-naar/products/real_product_17.png",
    badge: "Bridal Couture",
    rating: 4.98,
    isSoldOut: false,
    description: "Comfortable Green Cotton Kurta Set featuring a beautiful floral print with contrasting cream motifs and elegant border detailing. Paired with matching pants and dupatta, making it perfect for daily wear and casual outings.",
    fabric: "Cotton",
    care: "Machine Wash",
    shipping: "Dispatched within 4-7 business days."
  },
  {
    id: "na1",
    name: "Orange Cotton Embroidered Kurta Set",
    category: "Kurtis",
    categorySlug: "kurtis",
    price: 1199,
    originalPrice: 1499,
    colorVariants: [
      { name: "Rust Orange", hex: "#d9531e", image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236592/surangi-naar/products/real_product_7.jpg", secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236593/surangi-naar/products/real_product_8.jpg" }
    ],
    sizes: ["M", "L", "XL", "XXL"],
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236592/surangi-naar/products/real_product_7.jpg",
    secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236593/surangi-naar/products/real_product_8.jpg",
    isSoldOut: false,
    rating: 4.9,
    description: "Elegant Orange Cotton Kurta Set featuring delicate floral embroidery on the front, paired with matching pants and a graceful dupatta. A comfortable and stylish choice for daily wear and festive occasions.",
    fabric: "Cotton",
    care: "Machine Wash",
    shipping: "Dispatched within 5-7 business days."
  },
  {
    id: "na2",
    name: "Grey Floral Embroidered Cotton Kurta Set",
    category: "Short Kurtis",
    categorySlug: "short-kurtis",
    price: 1499,
    originalPrice: 1799,
    colorVariants: [
      { name: "Olive Green", hex: "#556b2f", image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236562/surangi-naar/products/real_product_12.jpg", secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236564/surangi-naar/products/real_product_13.jpg" }
    ],
    sizes: ["M", "L", "XL", "XXL"],
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236562/surangi-naar/products/real_product_12.jpg",
    secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236564/surangi-naar/products/real_product_13.jpg",
    isSoldOut: false,
    rating: 4.88,
    description: "Elegant Grey Cotton Kurta Set featuring delicate multi-colour floral embroidery on the neckline, kurta and dupatta. Paired with matching pants, this set is perfect for festive occasions and graceful everyday ethnic wear.",
    fabric: "Cotton",
    care: "Machine Wash",
    shipping: "Dispatched within 5-7 business days."
  },
  {
    id: "na3",
    name: "Purple Floral Embroidered Cotton Kurta Set",
    category: "Festive Wear",
    categorySlug: "festive-wear",
    price: 1199,
    originalPrice: 1499,
    colorVariants: [
      { name: "Royal Purple", hex: "#5a2d82", image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236582/surangi-naar/products/real_product_17.png", secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236584/surangi-naar/products/real_product_18.png" }
    ],
    sizes: ["M", "L", "XL", "XXL"],
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236582/surangi-naar/products/real_product_17.png",
    secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236584/surangi-naar/products/real_product_18.png",
    isSoldOut: false,
    rating: 4.95,
    description: "Elegant Purple Cotton Kurta Set featuring beautiful floral embroidery with delicate detailing on the neckline and sleeves. Paired with matching pants and a lightweight dupatta, perfect for daily wear and festive occasions.",
    fabric: "Cotton",
    care: "Machine Wash",
    shipping: "Dispatched within 4-7 business days."
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
  const hashedAdminPassword = process.env.ADMIN_PASSWORD_HASH || (await bcrypt.hash('admin@1234', 10));

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

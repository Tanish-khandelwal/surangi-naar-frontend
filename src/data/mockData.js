// Mock Data for Surangi Naar E-Commerce Store with Real Catalog Images

export const BRAND_CONTACT = {
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

export const PROMO_MESSAGES = [
  "5% OFF first order — use code HAPPY5 at checkout",
  "10% OFF prepaid orders — use code LAH10",
  "Complimentary Express Shipping across India on orders over ₹5,000"
];

// Core 3 Categories
export const CATEGORIES_LIST = [
  { name: "Kurtis", slug: "kurtis", tag: "New Drop", description: "Everyday & Designer Handprinted Kurtis" },
  { name: "Short Kurties", slug: "short-kurties", tag: "Trending", description: "Modern Silk & Linen Short Kurties" },
  { name: "Festive Wear", slug: "festive-wear", tag: "Exclusive", description: "Royal Zardosi & Gota Patti Festive Wear" }
];

export const CATEGORIES_GRID = [
  {
    id: "kurtis",
    slug: "kurtis",
    name: "Kurtis",
    count: "28 Styles",
    image: "/images/products/real_product_3.jpg",
    tagline: "Handprinted Malmal & Chanderi Tunics"
  },
  {
    id: "short-kurties",
    slug: "short-kurties",
    name: "Short Kurties",
    count: "24 Styles",
    image: "/images/products/real_product_6.jpg",
    tagline: "Resort Luxe & Linen Sets"
  },
  {
    id: "festive-wear",
    slug: "festive-wear",
    name: "Festive Wear",
    count: "32 Styles",
    image: "/images/products/real_product_5.jpg",
    tagline: "Heavy Embroidered Anarkalis & Festive Sets"
  }
];

export const HERO_SLIDES = [
  {
    id: 1,
    subtitle: "Royal Festive Collection 2026",
    title: "Festive Grandeur",
    description: "Intricate hand-highlighted Zardosi & Gota Patti festive ensembles for grand celebrations.",
    cta: "Explore Festive Wear",
    categorySlug: "festive-wear",
    image: "/images/products/real_product_7.jpg"
  },
  {
    id: 2,
    subtitle: "Contemporary Silk Staples",
    title: "Luxe Short Kurties",
    description: "Flowing breathable fabrics designed for sunshine, warm breezes, and effortless elegance.",
    cta: "Shop Short Kurties",
    categorySlug: "short-kurties",
    image: "/images/products/real_product_4.jpg"
  },
  {
    id: 3,
    subtitle: "Hand-Block Artisanal Prints",
    title: "Handcrafted Kurtis",
    description: "Versatile Mul Chanderi & Soft Cotton Kurtis featuring authentic Jaipur embroidery and prints.",
    cta: "Discover Kurtis",
    categorySlug: "kurtis",
    image: "/images/products/real_product_2.jpg"
  }
];

export const PRODUCTS_CURATED = [
  {
    id: "p1",
    name: "Lavender Mul Chanderi Kurti Set (D.No 061)",
    category: "Kurtis",
    categorySlug: "kurtis",
    price: 3999,
    originalPrice: 4999,
    colors: [
      { name: "Lavender Lilac", hex: "#b497d6" }
    ],
    sizes: ["M", "L", "XL", "XXL"],
    image: "/images/products/real_product_1.jpg",
    secondaryImage: "/images/products/real_product_2.jpg",
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
    colors: [
      { name: "Sage Green", hex: "#95a383" }
    ],
    sizes: ["M", "L", "XL", "XXL"],
    image: "/images/products/real_product_2.jpg",
    secondaryImage: "/images/products/real_product_1.jpg",
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
    colors: [
      { name: "Slate Grey", hex: "#87888a" }
    ],
    sizes: ["M", "L", "XL", "XXL"],
    image: "/images/products/real_product_3.jpg",
    secondaryImage: "/images/products/real_product_4.jpg",
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
    colors: [
      { name: "Mustard Gold", hex: "#d4a017" }
    ],
    sizes: ["M", "L", "XL", "XXL"],
    image: "/images/products/real_product_4.jpg",
    secondaryImage: "/images/products/real_product_5.jpg",
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
    colors: [
      { name: "Royal Purple", hex: "#5a2d82" }
    ],
    sizes: ["M", "L", "XL", "XXL"],
    image: "/images/products/real_product_5.jpg",
    secondaryImage: "/images/products/real_product_6.jpg",
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
    colors: [
      { name: "Royal Red", hex: "#c83228" }
    ],
    sizes: ["M", "L", "XL", "XXL"],
    image: "/images/products/real_product_6.jpg",
    secondaryImage: "/images/products/real_product_7.jpg",
    badge: "Popular",
    rating: 4.8,
    isSoldOut: false,
    description: "Straight cut Jaipur Chanderi tunic with delicate floral thread embroidery on the neckline.",
    fabric: "Chanderi Silk with Malmal Lining",
    care: "Dry Clean Only.",
    shipping: "Dispatched within 2 days."
  },

  // Short Kurties
  {
    id: "p7",
    name: "Luxe Silk Satin Resort Short Kurtie Set",
    category: "Short Kurties",
    categorySlug: "short-kurties",
    price: 7499,
    originalPrice: 8999,
    colors: [
      { name: "Champagne Gold", hex: "#e0c9a6" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    image: "/images/products/real_product_9.jpg",
    secondaryImage: "/images/products/real_product_10.jpg",
    badge: "Trending",
    rating: 4.89,
    isSoldOut: false,
    description: "Flowing silk satin short kurtie and trouser set designed for summer retreats and evening gatherings.",
    fabric: "100% Mulberry Silk Satin",
    care: "Dry Clean Only.",
    shipping: "Dispatched within 2-4 business days."
  },
  {
    id: "p8",
    name: "Organic European Linen Short Kurtie Set",
    category: "Short Kurties",
    categorySlug: "short-kurties",
    price: 6999,
    originalPrice: 8499,
    colors: [
      { name: "Terracotta Earth", hex: "#c86d51" }
    ],
    sizes: ["S", "M", "L", "XL"],
    image: "/images/products/real_product_10.jpg",
    secondaryImage: "/images/products/real_product_11.jpg",
    badge: "Resort Luxe",
    rating: 4.91,
    isSoldOut: false,
    description: "Tailored organic linen short kurtie and wide-leg pant set with mother-of-pearl buttons.",
    fabric: "100% Organic European Linen",
    care: "Gentle cold hand wash.",
    shipping: "Dispatched within 3 business days."
  },
  {
    id: "p9",
    name: "Botanical Printed Silk Lounge Short Kurtie",
    category: "Short Kurties",
    categorySlug: "short-kurties",
    price: 8499,
    originalPrice: 9999,
    colors: [
      { name: "Olive Palm", hex: "#4b5320" }
    ],
    sizes: ["XS", "S", "M", "L"],
    image: "/images/products/real_product_11.jpg",
    secondaryImage: "/images/products/real_product_12.jpg",
    badge: "Must Have",
    rating: 4.86,
    isSoldOut: false,
    description: "Contemporary fluid botanical print short kurtie and high-waisted trousers ensemble.",
    fabric: "Pure Silk Chiffon & Satin Base",
    care: "Dry Clean Only.",
    shipping: "Dispatched within 3 days."
  },

  // Festive Wear
  {
    id: "p10",
    name: "Royal Zardosi Heavy Festive Anarkali Set",
    category: "Festive Wear",
    categorySlug: "festive-wear",
    price: 18500,
    originalPrice: 22000,
    colors: [
      { name: "Royal Emerald", hex: "#1b4332" }
    ],
    sizes: ["S", "M", "L", "XL"],
    image: "/images/products/real_product_14.jpg",
    secondaryImage: "/images/products/real_product_15.jpg",
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
    colors: [
      { name: "Crimson Red", hex: "#8b0000" }
    ],
    sizes: ["S", "M", "L", "Custom"],
    image: "/images/products/real_product_15.jpg",
    secondaryImage: "/images/products/real_product_16.jpg",
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
    colors: [
      { name: "Deep Ruby", hex: "#5c1325" }
    ],
    sizes: ["S", "M", "L", "Custom"],
    image: "/images/products/real_product_16.jpg",
    secondaryImage: "/images/products/real_product_17.jpg",
    badge: "Bridal Couture",
    rating: 4.98,
    isSoldOut: false,
    description: "Intricately detailed bridal festive set with antique metallic threadwork and heavy zari tissue drapes.",
    fabric: "Pure Raw Silk & Tissue Dupatta",
    care: "Dry Clean Only.",
    shipping: "Dispatched within 7 business days."
  }
];

export const NEW_ARRIVALS = [
  {
    id: "na1",
    name: "Hand-Embroidered Zari Chanderi Kurti",
    category: "Kurtis",
    categorySlug: "kurtis",
    price: 5499,
    originalPrice: 6999,
    colors: [
      { name: "Rust Orange", hex: "#d9531e" }
    ],
    sizes: ["S", "M", "L", "XL"],
    image: "/images/products/real_product_7.jpg",
    secondaryImage: "/images/products/real_product_8.jpg",
    isSoldOut: false,
    rating: 4.9,
    description: "Rich straight kurti with intricate metallic zari border highlights.",
    fabric: "Chanderi Silk with Fine Zari Work",
    care: "Dry Clean Only.",
    shipping: "Dispatched within 2-4 business days."
  },
  {
    id: "na2",
    name: "Resort Linen Chic Short Kurtie Set",
    category: "Short Kurties",
    categorySlug: "short-kurties",
    price: 7999,
    originalPrice: 9499,
    colors: [
      { name: "Olive Green", hex: "#556b2f" }
    ],
    sizes: ["XS", "S", "M", "L"],
    image: "/images/products/real_product_12.jpg",
    secondaryImage: "/images/products/real_product_13.jpg",
    isSoldOut: false,
    rating: 4.88,
    description: "Breathable natural linen resort short kurtie set with tailored high-rise pants.",
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
    colors: [
      { name: "Royal Purple", hex: "#5a2d82" }
    ],
    sizes: ["S", "M", "L"],
    image: "/images/products/real_product_17.jpg",
    secondaryImage: "/images/products/real_product_18.jpg",
    isSoldOut: false,
    rating: 4.95,
    description: "Pastel organza flared tunic set with sequin motifs and a heavy tissue dupatta.",
    fabric: "Organza Silk & Tissue",
    care: "Dry Clean Only.",
    shipping: "Dispatched within 4 business days."
  }
];

export const EXCLUSIVE_COLLECTION = [
  {
    id: "ex1",
    title: "Handcrafted Kurtis Collection",
    tagline: "Timeless motifs block-printed and embroidered by master craftsmen of Jaipur.",
    categorySlug: "kurtis",
    image: "/images/products/real_product_1.jpg"
  },
  {
    id: "ex2",
    title: "Luxury Silk Short Kurties",
    tagline: "Fluid resort silhouettes woven with pure Mulberry silk and organic linen.",
    categorySlug: "short-kurties",
    image: "/images/products/real_product_9.jpg"
  },
  {
    id: "ex3",
    title: "Royal Festive Wear Edit",
    tagline: "Intricate Zardosi & Gota Patti handcrafted for grand celebrations.",
    categorySlug: "festive-wear",
    image: "/images/products/real_product_14.jpg"
  }
];

export const FOUNDER_INFO = {
  name: "Surangi Naar",
  role: "Creative Director & Founder",
  quote: "“Fashion at Surangi Naar is not merely attire — it is an emotional ode to traditional Indian craftsmanship re-imagined for the global woman.”",
  storyParagraph1: "Surangi Naar emerged from a passion for preserving India’s rich textile heritage while catering to modern aesthetic sensibilities. Each garment tells a story of dedicated master artisans, hand-selected pure fabrics, and meticulous embroidery.",
  storyParagraph2: "From royal Chanderi weaves to contemporary fluid short kurties, the label blends understated luxury with expressive, feminine grace — creating timeless pieces crafted to be cherished across generations.",
  image: "/images/products/real_product_18.jpg",
  badges: [
    { label: "Handcrafted in India", icon: "Sparkles" },
    { label: "Sustainable Fabrics", icon: "Leaf" },
    { label: "Artisanal Embroidery", icon: "Crown" },
    { label: "Worldwide Express Delivery", icon: "Globe" },
    { label: "Bespoke Custom Fitting", icon: "Scissors" },
    { label: "Ethical & Fair Trade", icon: "ShieldCheck" }
  ]
};

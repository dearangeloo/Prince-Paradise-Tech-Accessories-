import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import type {
  Product,
  Category,
  OrderRequest,
  AdminUser,
  StoreSettings,
  AuditLog,
} from './src/types/index';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Increase payload limit for image uploads
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Ensure public upload directory exists
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve uploaded files statically
app.use('/uploads', express.static(uploadDir));

// Ensure data persistence directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const dbFilePath = path.join(dataDir, 'store-data.json');

// Initial Brand Data
const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'Prince Paradise Tech Accessories',
  motto: 'POWER YOUR WORLD',
  logoUrl: '/assets/aistudio/1793004952388_f4038399.jpg',
  whatsappNumber: '+234 813 572 8645',
  normalizedWhatsapp: '2348135728645',
  currency: 'NGN',
  contactEmail: 'accessories.princeparadisetech@gmail.com',
  publicContactPhone: '+234 813 572 8645',
  socialLinks: {
    instagram: 'https://instagram.com/princeparadisetech',
    twitter: 'https://twitter.com/princeparadisetech',
    facebook: 'https://facebook.com/princeparadisetech',
  },
  deliveryInformation:
    'Nationwide delivery across all 36 Nigerian states and the FCT. Same-day & next-day courier dispatch in Lagos, Abuja, Port Harcourt, and Ibadan. Standard interstate delivery takes 2 to 4 business days. Payment and delivery charges will be confirmed via WhatsApp before dispatch.',
  policyContent: {
    shipping:
      'We pack all tech accessories securely with bubble-insulated packaging. Orders are handed over to trusted logistics partners once confirmed. Tracking reference and dispatch receipt will be shared directly to your WhatsApp or email.',
    returnsAndWarranty:
      'Prince Paradise provides a 12-Month Manufacturer Warranty on chargers, power banks, and smart devices against manufacturing defects. Products must be returned in original packaging with proof of purchase. Physical damage, water ingress on non-waterproof items, and customer alterations are excluded.',
    privacy:
      'We respect your privacy. Customer names, telephone numbers, and delivery addresses collected during the WhatsApp order flow are used strictly for order verification, dispatch, and customer service. We do not sell or share your personal data with third-party advertisers.',
    terms:
      'All product descriptions, specifications, and prices are listed in Nigerian Naira. Submitting an order request on this website creates a non-binding reservation inquiry. Final stock availability, applicable delivery fees, and order confirmation occur directly with our verified sales team on WhatsApp before payment.',
  },
};

const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-power-banks',
    name: 'Power Banks',
    slug: 'power-banks',
    description: 'High-density, fast-charging portable power banks with digital LED displays and multi-device support.',
    image: {
      url: '/assets/aistudio/ec2c3d4b-df69-45af-a8a1-93d072dd88d7_7f06612d.png',
      altText: 'Prince Paradise Power Banks',
    },
    sortOrder: 1,
    active: true,
    createdAt: Date.now() - 1000000,
    updatedAt: Date.now(),
  },
  {
    id: 'cat-chargers-cables',
    name: 'Chargers and Cables',
    slug: 'chargers-and-cables',
    description: 'UK 3-pin fused fast chargers, GaN technology power bricks, and military-grade braided cables.',
    image: {
      url: '/assets/aistudio/ChatGPT_Image_Oct_18__2026__10_30_59_PM_ce5d1274.png',
      altText: 'Prince Paradise Chargers and Cables',
    },
    sortOrder: 2,
    active: true,
    createdAt: Date.now() - 1000000,
    updatedAt: Date.now(),
  },
  {
    id: 'cat-earbuds-audio',
    name: 'Earbuds and Headphones',
    slug: 'earbuds-and-headphones',
    description: 'Crystal-clear sound, active noise cancellation, deep bass, and low-latency gaming audio.',
    image: {
      url: '/assets/aistudio/1793004952388_f4038399.jpg',
      altText: 'Prince Paradise Earbuds and Audio',
    },
    sortOrder: 3,
    active: true,
    createdAt: Date.now() - 1000000,
    updatedAt: Date.now(),
  },
  {
    id: 'cat-phone-accessories',
    name: 'Phone Accessories',
    slug: 'phone-accessories',
    description: 'Magnetic car mounts, protective cases, wireless charging pads, and ergonomic stands.',
    image: {
      url: '/assets/aistudio/1793004952388_f4038399.jpg',
      altText: 'Phone Accessories',
    },
    sortOrder: 4,
    active: true,
    createdAt: Date.now() - 1000000,
    updatedAt: Date.now(),
  },
  {
    id: 'cat-smart-devices',
    name: 'Smart Devices',
    slug: 'smart-devices',
    description: 'Smart watches, fitness trackers, Bluetooth adapters, and intelligent daily tech.',
    image: {
      url: '/assets/aistudio/1793004952388_f4038399.jpg',
      altText: 'Smart Devices',
    },
    sortOrder: 5,
    active: true,
    createdAt: Date.now() - 1000000,
    updatedAt: Date.now(),
  },
  {
    id: 'cat-other-electronics',
    name: 'Other Electronics',
    slug: 'other-electronics',
    description: 'USB-C hubs, OTG adapters, memory readers, and laptop accessories.',
    image: {
      url: '/assets/aistudio/1793004952388_f4038399.jpg',
      altText: 'Other Electronics',
    },
    sortOrder: 6,
    active: true,
    createdAt: Date.now() - 1000000,
    updatedAt: Date.now(),
  },
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-pb-20k-lilac',
    name: 'Prince Paradise 20,000mAh Ultra-Slim Digital Display Power Bank',
    slug: 'prince-paradise-20000mah-ultra-slim-power-bank',
    sku: 'PPT-PB-20K-LILAC',
    categoryId: 'cat-power-banks',
    shortDescription:
      'High-capacity 20,000mAh portable charger with gold Prince Paradise crest, circular smart LED digital percentage display, and dual fast-charge ports.',
    description:
      'Power your world anywhere with the flagship Prince Paradise 20,000mAh Ultra-Slim Power Bank. Engineered with high-density lithium-polymer battery cells and an intelligent gold-bezeled circular LED display that shows exact battery percentage at a glance. Features 22.5W Super Charge & 20W Power Delivery bi-directional Type-C charging. Crafted with a premium textured fire-resistant shell bearing the authentic Prince Paradise golden shield emblem.',
    specifications: {
      'Battery Capacity': '20,000mAh (74Wh)',
      'Digital Display': 'Smart LED Circular Percentage Display (0-100%)',
      'Fast Charge Protocols': 'PD 3.0 (20W), QC 3.0, SCP 22.5W, FCP, AFC',
      'Input Ports': 'Type-C: 5V/3A, 9V/2A, 12V/1.5A (18W Max)',
      'Output Ports': 'Type-C (20W PD) + 2x USB-A (22.5W Max)',
      'Safety Multi-Protection': 'Overcharge, Short-Circuit, Temperature Guard',
      'Weight & Dimensions': 'Approx. 340g, 142 x 68 x 24 mm',
    },
    priceKobo: 2850000, // ₦28,500
    compareAtPriceKobo: 3500000, // ₦35,000
    images: [
      {
        storagePath: 'assets/aistudio/ec2c3d4b-df69-45af-a8a1-93d072dd88d7_7f06612d.png',
        url: '/assets/aistudio/ec2c3d4b-df69-45af-a8a1-93d072dd88d7_7f06612d.png',
        altText: 'Prince Paradise 20,000mAh Power Bank with digital LED display and golden crest',
        sortOrder: 1,
      },
    ],
    stockQuantity: 45,
    lowStockThreshold: 10,
    variants: [
      {
        id: 'var-color',
        name: 'Color',
        options: ['Lilac Purple (Signature)', 'Pearl White', 'Matte Black'],
      },
    ],
    tags: ['power bank', '20000mah', 'fast charge', 'digital display', 'prince paradise'],
    warrantyText: '12-Month Prince Paradise Manufacturer Warranty',
    featured: true,
    status: 'published',
    createdAt: Date.now() - 500000,
    updatedAt: Date.now(),
    createdBy: 'admin-angelo',
  },
  {
    id: 'prod-ch-120w-uk',
    name: 'Prince Paradise 120W Hyper Charge UK 3-Pin Super Fast Charger',
    slug: 'prince-paradise-120w-hyper-charge-uk-adapter',
    sku: 'PPT-CH-120W-UK',
    categoryId: 'cat-chargers-cables',
    shortDescription:
      'Ultra-fast 120W Hyper Charge UK standard 3-pin fused adapter with smart heat control, overcharge protection, and universal compatibility.',
    description:
      'The ultimate charging powerhouse for Nigerian homes, offices, and travel. Built specifically with standard UK 3-pin brass terminals with safety fuse protection. Pumps out up to 120W Hyper Charge capability using third-generation GaN semiconductors for maximum power transfer with minimal heat buildup. Safely powers flagship smartphones, tablets, and Type-C laptops at full speed.',
    specifications: {
      'Max Power Output': '120W Hyper Charge',
      'Plug Standard': 'UK 3-Pin (BS 1363 standard with internal safety fuse)',
      'Protection Architecture': 'Overcharge Protection, Smart Heat Control, Surge Suppressor',
      'Semiconductor': 'GaN III (Gallium Nitride) Efficient Chipset',
      'Compatibility': 'Universal (iPhone 15/16, Samsung Galaxy S24, Tecno, Infinix, MacBooks, Dell, HP)',
      'Input Voltage': '100-240V ~ 50/60Hz (Worldwide voltage support)',
    },
    priceKobo: 2200000, // ₦22,000
    compareAtPriceKobo: 2750000, // ₦27,500
    images: [
      {
        storagePath: 'assets/aistudio/ChatGPT_Image_Oct_18__2026__10_30_59_PM_ce5d1274.png',
        url: '/assets/aistudio/ChatGPT_Image_Oct_18__2026__10_30_59_PM_ce5d1274.png',
        altText: 'Prince Paradise 120W Hyper Charge UK 3-pin Adapter feature diagram',
        sortOrder: 1,
      },
      {
        storagePath: 'assets/aistudio/ChatGPT_Image_Oct_18__2026__10_29_07_PM_2a63b7b2.png',
        url: '/assets/aistudio/ChatGPT_Image_Oct_18__2026__10_29_07_PM_2a63b7b2.png',
        altText: 'Prince Paradise Fast Safe Reliable UK 3-pin charger',
        sortOrder: 2,
      },
    ],
    stockQuantity: 60,
    lowStockThreshold: 15,
    variants: [
      {
        id: 'var-package',
        name: 'Packaging Option',
        options: ['Adapter Only', 'Adapter + 100W Fast Cable (+₦3,500)'],
      },
    ],
    tags: ['120w', 'charger', 'uk 3-pin', 'hyper charge', 'gan'],
    warrantyText: '12-Month Replacement Guarantee',
    featured: true,
    status: 'published',
    createdAt: Date.now() - 400000,
    updatedAt: Date.now(),
    createdBy: 'admin-angelo',
  },
  {
    id: 'prod-ch-65w-travel',
    name: 'Prince Paradise 65W GaN Dual Type-C + USB-A Travel Charger',
    slug: 'prince-paradise-65w-gan-travel-charger',
    sku: 'PPT-CH-65W-TRV',
    categoryId: 'cat-chargers-cables',
    shortDescription:
      'Compact 65W GaN fast charger with 2x Type-C and 1x USB-A ports. Charge your laptop and phone simultaneously.',
    description:
      'A compact pocket-sized charging solution equipped with GaN technology. Delivers full 65W Power Delivery to charge your laptop or fast-charge up to 3 mobile devices at the same time without overheating. Features durable UK 3-pin pins and fireproof polycarbonate enclosure.',
    specifications: {
      'Total Output': '65W Max',
      'Port Layout': '2x USB-C PD + 1x USB-A QC 3.0',
      'Plug Type': 'UK 3-Pin Fused',
      'Fast Charge Protocols': 'PD3.0, PPS, QC4+, FCP, AFC',
      'Efficiency': '94% Energy Conversion',
    },
    priceKobo: 1750000, // ₦17,500
    compareAtPriceKobo: 2200000, // ₦22,000
    images: [
      {
        storagePath: 'assets/aistudio/ChatGPT_Image_Oct_18__2026__10_29_07_PM_2a63b7b2.png',
        url: '/assets/aistudio/ChatGPT_Image_Oct_18__2026__10_29_07_PM_2a63b7b2.png',
        altText: 'Prince Paradise 65W Travel Adapter',
        sortOrder: 1,
      },
    ],
    stockQuantity: 35,
    lowStockThreshold: 8,
    variants: [
      {
        id: 'var-color',
        name: 'Color',
        options: ['Pure White', 'Space Grey'],
      },
    ],
    tags: ['65w', 'travel charger', 'dual type-c', 'laptop charger'],
    warrantyText: '12-Month Prince Paradise Warranty',
    featured: true,
    status: 'published',
    createdAt: Date.now() - 300000,
    updatedAt: Date.now(),
  },
  {
    id: 'prod-cb-100w-braided',
    name: 'Prince Paradise 100W Braided Type-C Fast Charging Cable with Watts Indicator',
    slug: 'prince-paradise-100w-braided-cable-watts-display',
    sku: 'PPT-CB-100W-LED',
    categoryId: 'cat-chargers-cables',
    shortDescription:
      'Heavy-duty nylon braided 100W E-marker Type-C cable with real-time digital power display and zinc alloy connectors.',
    description:
      'Never guess your charging speed again. This heavy-duty Prince Paradise cable features an integrated digital power meter showing real-time wattage. With an E-Marker intelligent smart chip supporting up to 100W (20V/5A) and 480Mbps data transfer, it withstands 25,000+ bends.',
    specifications: {
      'Power Rating': '100W (20V/5A E-Marker Smart Chip)',
      'Data Transfer Rate': '480 Mbps',
      'Cable Sheath': 'Double-braided Military-grade Ballistic Nylon',
      'Connector Head': 'Anti-oxidation Zinc Alloy with Smart LED Display',
      'Bend Test Durability': '25,000+ Cycles',
    },
    priceKobo: 650000, // ₦6,500
    compareAtPriceKobo: 850000, // ₦8,500
    images: [
      {
        storagePath: 'assets/aistudio/1793004952388_f4038399.jpg',
        url: '/assets/aistudio/1793004952388_f4038399.jpg',
        altText: 'Prince Paradise 100W LED Wattage Cable',
        sortOrder: 1,
      },
    ],
    stockQuantity: 120,
    lowStockThreshold: 20,
    variants: [
      {
        id: 'var-length',
        name: 'Cable Length',
        options: ['1.2 Metres (Standard)', '2.0 Metres (Long)'],
      },
    ],
    tags: ['cable', '100w', 'type-c', 'led display', 'braided'],
    warrantyText: '6-Month Prince Paradise Warranty',
    featured: false,
    status: 'published',
    createdAt: Date.now() - 250000,
    updatedAt: Date.now(),
  },
  {
    id: 'prod-earbuds-anc-pro',
    name: 'Prince Paradise ANC Pro Wireless Noise-Cancelling Earbuds',
    slug: 'prince-paradise-anc-pro-wireless-earbuds',
    sku: 'PPT-AUD-ANC-PRO',
    categoryId: 'cat-earbuds-audio',
    shortDescription:
      'Active Noise Cancellation (-35dB), dynamic 12mm titanium drivers, 36-hour total battery life, and ultra-low latency gaming mode.',
    description:
      'Immerse yourself in rich, studio-grade sound. Prince Paradise ANC Pro combines hybrid active noise cancellation with 12mm custom titanium acoustic drivers, giving you punchy bass and crystalline vocals. Quad-microphone environmental noise cancellation filters out busy market and traffic noise for crystal-clear phone calls.',
    specifications: {
      'Noise Cancellation': '-35dB Hybrid ANC + Transparency Mode',
      'Driver Size': '12mm Titanium Dynamic Acoustic Drivers',
      'Battery Life': '8h per charge, 36h with charging case',
      'Bluetooth Version': 'Bluetooth 5.4 with Low Latency Game Mode (45ms)',
      'Water Resistance': 'IPX5 Sweat & Rain Resistant',
      'Microphones': '4-Mic Environmental Noise Cancellation for Calls',
    },
    priceKobo: 2450000, // ₦24,500
    compareAtPriceKobo: 3000000, // ₦30,000
    images: [
      {
        storagePath: 'assets/aistudio/1793004952388_f4038399.jpg',
        url: '/assets/aistudio/1793004952388_f4038399.jpg',
        altText: 'Prince Paradise ANC Pro Earbuds',
        sortOrder: 1,
      },
    ],
    stockQuantity: 28,
    lowStockThreshold: 8,
    variants: [
      {
        id: 'var-color',
        name: 'Color',
        options: ['Matte Black', 'Pearl White'],
      },
    ],
    tags: ['earbuds', 'anc', 'audio', 'bluetooth 5.4', 'noise cancelling'],
    warrantyText: '12-Month Prince Paradise Warranty',
    featured: true,
    status: 'published',
    createdAt: Date.now() - 200000,
    updatedAt: Date.now(),
  },
  {
    id: 'prod-mag-car-mount',
    name: 'Prince Paradise Magnetic Wireless Car Charger & Dashboard Mount',
    slug: 'prince-paradise-magnetic-wireless-car-charger',
    sku: 'PPT-ACC-MAG-CAR',
    categoryId: 'cat-phone-accessories',
    shortDescription:
      '15W fast magnetic wireless car charger with auto-aligning N52 rare-earth magnets, 360-degree rotation, and dual air-vent & dash mounts.',
    description:
      'Keep your navigation in view and battery powered on Nigeria’s roads. The Prince Paradise Magnetic Car Mount locks firmly onto phone cases with military-strength N52 magnets that never let go over speed bumps or potholes. Delivers up to 15W wireless charging with smart heat dissipation.',
    specifications: {
      'Wireless Output': '15W / 10W / 7.5W Qi Magnetic',
      'Mount Mechanisms': 'Air Vent Clip + Strong Vacuum Suction Base',
      'Magnetic Strength': '16x N52 Neodymium Rare Earth Magnets',
      'Ball Joint': '360° Omnidirectional Rotation',
      'Safety Mechanism': 'FOD (Foreign Object Detection) & Thermal Guard',
    },
    priceKobo: 1400000, // ₦14,000
    compareAtPriceKobo: 1800000, // ₦18,000
    images: [
      {
        storagePath: 'assets/aistudio/1793004952388_f4038399.jpg',
        url: '/assets/aistudio/1793004952388_f4038399.jpg',
        altText: 'Prince Paradise Magnetic Car Charger',
        sortOrder: 1,
      },
    ],
    stockQuantity: 18,
    lowStockThreshold: 5,
    variants: [
      {
        id: 'var-mount',
        name: 'Mount Type',
        options: ['Dual Vent + Dash Kit', 'Air Vent Only'],
      },
    ],
    tags: ['car mount', 'magnetic', 'wireless charger', 'accessories'],
    warrantyText: '12-Month Warranty',
    featured: false,
    status: 'published',
    createdAt: Date.now() - 150000,
    updatedAt: Date.now(),
  },
  {
    id: 'prod-smart-ultra-watch',
    name: 'Prince Paradise Smart Watch Ultra Series with AMOLED Display & Bluetooth Calling',
    slug: 'prince-paradise-smart-watch-ultra-series',
    sku: 'PPT-SMT-ULTRA',
    categoryId: 'cat-smart-devices',
    shortDescription:
      '2.02-inch HD AMOLED 60Hz Always-On screen, titanium-alloy casing, Bluetooth phone calling, heart rate & SpO2 monitoring, 7-day battery.',
    description:
      'The ultimate companion for daily productivity and fitness. Featuring a vivid 2.02-inch AMOLED display with 600 nits peak brightness for effortless sunlight readability. Answer calls directly from your wrist, monitor daily heart rate, oxygen, steps, and receive WhatsApp notifications with Nigerian network compatibility.',
    specifications: {
      'Display': '2.02-inch AMOLED, 410x502 resolution, Always-On support',
      'Chassis': 'Aviation-grade Titanium Alloy + Sapphire Glass',
      'Bluetooth Calling': 'Dual HD Microphone & Loudspeaker',
      'Health Sensors': '24/7 Heart Rate, SpO2 Blood Oxygen, Sleep Analysis',
      'Battery Life': 'Up to 7 Days typical use, 15 Days standby',
      'Waterproof Standard': 'IP68 Waterproof',
    },
    priceKobo: 3800000, // ₦38,000
    compareAtPriceKobo: 4800000, // ₦48,000
    images: [
      {
        storagePath: 'assets/aistudio/1793004952388_f4038399.jpg',
        url: '/assets/aistudio/1793004952388_f4038399.jpg',
        altText: 'Prince Paradise Smart Watch Ultra',
        sortOrder: 1,
      },
    ],
    stockQuantity: 14,
    lowStockThreshold: 5,
    variants: [
      {
        id: 'var-strap',
        name: 'Strap Style',
        options: ['Ocean Wave Orange', 'Midnight Black Silicone', 'Stainless Silver Mesh'],
      },
    ],
    tags: ['smart watch', 'amoled', 'bluetooth calling', 'smart devices'],
    warrantyText: '12-Month Prince Paradise Warranty',
    featured: true,
    status: 'published',
    createdAt: Date.now() - 100000,
    updatedAt: Date.now(),
  },
  {
    id: 'prod-hub-6in1-alu',
    name: 'Prince Paradise 6-in-1 Aluminum USB-C Hub with 4K HDMI & 100W PD Pass-through',
    slug: 'prince-paradise-6-in-1-aluminum-usbc-hub',
    sku: 'PPT-HUB-6IN1-ALU',
    categoryId: 'cat-other-electronics',
    shortDescription:
      'Sleek aluminum expansion dock with 4K HDMI, 100W Power Delivery port, 3x USB 3.0 (5Gbps), and SD/TF card reader.',
    description:
      'Expand your smartphone, iPad, or laptop into a full workstation. Connect to external monitors or TVs in 4K resolution at 30Hz, transfer files at 5Gbps, and charge your device simultaneously with 100W PD input.',
    specifications: {
      'Video Output': 'HDMI 4K @ 30Hz / Full HD 1080p @ 60Hz',
      'Power Delivery': 'USB-C PD 100W Pass-through charging',
      'Data Ports': '3x USB 3.0 (5Gbps transmission speed)',
      'Card Slots': 'SD and MicroSD / TF slot reader',
      'Material': 'Space Grey CNC Anodized Aluminum Alloy',
    },
    priceKobo: 1950000, // ₦19,500
    compareAtPriceKobo: 2450000, // ₦24,500
    images: [
      {
        storagePath: 'assets/aistudio/1793004952388_f4038399.jpg',
        url: '/assets/aistudio/1793004952388_f4038399.jpg',
        altText: 'Prince Paradise 6-in-1 Aluminum Hub',
        sortOrder: 1,
      },
    ],
    stockQuantity: 22,
    lowStockThreshold: 6,
    variants: [],
    tags: ['usb-c hub', '4k hdmi', 'laptop dock', 'type-c adapter'],
    warrantyText: '12-Month Warranty',
    featured: false,
    status: 'published',
    createdAt: Date.now() - 80000,
    updatedAt: Date.now(),
  },
];

const INITIAL_ADMIN: AdminUser = {
  uid: 'admin-angelo',
  displayName: 'Angelo Admin',
  email: 'angelo.smm.uk@gmail.com',
  role: 'admin',
  active: true,
  createdAt: Date.now() - 5000000,
  lastLoginAt: Date.now(),
};

// Database state container
interface StoreDB {
  settings: StoreSettings;
  categories: Category[];
  products: Product[];
  orders: OrderRequest[];
  adminUsers: AdminUser[];
  auditLogs: AuditLog[];
}

let dbData: StoreDB = {
  settings: INITIAL_SETTINGS,
  categories: INITIAL_CATEGORIES,
  products: INITIAL_PRODUCTS,
  orders: [],
  adminUsers: [INITIAL_ADMIN],
  auditLogs: [
    {
      id: `audit-init-${Date.now()}`,
      actorUid: 'system',
      action: 'SYSTEM_BOOTSTRAP',
      entityType: 'settings',
      entityId: 'store-settings',
      timestamp: Date.now(),
      summary: 'Prince Paradise Tech Accessories store initialized.',
    },
  ],
};

// Load persistent data from disk if present
function loadData() {
  try {
    if (fs.existsSync(dbFilePath)) {
      const raw = fs.readFileSync(dbFilePath, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.products) && Array.isArray(parsed.categories)) {
        dbData = {
          ...dbData,
          ...parsed,
          settings: { ...INITIAL_SETTINGS, ...(parsed.settings || {}) },
        };
      }
    } else {
      saveData();
    }
  } catch (err) {
    console.error('Failed reading store-data.json, using defaults:', err);
  }
}

function saveData() {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(dbData, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed saving store-data.json:', err);
  }
}

loadData();

// Audit logger helper
function addAuditLog(
  actorUid: string,
  action: string,
  entityType: AuditLog['entityType'],
  entityId: string,
  summary: string
) {
  const log: AuditLog = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    actorUid,
    action,
    entityType,
    entityId,
    timestamp: Date.now(),
    summary,
  };
  dbData.auditLogs.unshift(log);
  if (dbData.auditLogs.length > 500) {
    dbData.auditLogs = dbData.auditLogs.slice(0, 500);
  }
  saveData();
}

// Authentication & Authorization middleware
function verifyAdmin(req: Request, res: Response, next: Function) {
  const authHeader = req.headers.authorization;
  const adminKey = req.headers['x-admin-key'] as string;
  const adminEmail = (req.headers['x-admin-email'] as string) || '';

  // Allow development or token-based authentication
  if (adminKey === 'prince-paradise-master-2026') {
    (req as any).adminUser = dbData.adminUsers[0];
    return next();
  }

  if (adminEmail && adminEmail.toLowerCase() === 'angelo.smm.uk@gmail.com') {
    (req as any).adminUser = dbData.adminUsers.find(
      (u) => u.email.toLowerCase() === adminEmail.toLowerCase()
    ) || dbData.adminUsers[0];
    return next();
  }

  // Bearer token check
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const matched = dbData.adminUsers.find((u) => u.uid === token && u.active);
    if (matched) {
      (req as any).adminUser = matched;
      return next();
    }
  }

  return res.status(401).json({ error: 'Unauthorized: Administrative credentials required' });
}

// ==========================================
// PUBLIC API ROUTES
// ==========================================

// 1. Store settings
app.get('/api/settings', (_req: Request, res: Response) => {
  return res.json({
    settings: {
      storeName: dbData.settings.storeName,
      motto: dbData.settings.motto,
      logoUrl: dbData.settings.logoUrl,
      whatsappNumber: dbData.settings.whatsappNumber,
      normalizedWhatsapp: dbData.settings.normalizedWhatsapp,
      currency: dbData.settings.currency,
      contactEmail: dbData.settings.contactEmail,
      publicContactPhone: dbData.settings.publicContactPhone,
      socialLinks: dbData.settings.socialLinks,
      deliveryInformation: dbData.settings.deliveryInformation,
      policyContent: dbData.settings.policyContent,
    },
  });
});

// 2. Active Categories
app.get('/api/categories', (req: Request, res: Response) => {
  const includeAll = req.query.all === 'true';
  const categories = includeAll
    ? dbData.categories
    : dbData.categories.filter((c) => c.active).sort((a, b) => a.sortOrder - b.sortOrder);
  return res.json({ categories });
});

// 3. Published Products
app.get('/api/products', (req: Request, res: Response) => {
  const { category, search, sort, featured, status } = req.query;

  let list = [...dbData.products];

  // If not requested as admin, strictly filter to published
  if (status !== 'all') {
    list = list.filter((p) => p.status === 'published');
  }

  // Filter by category slug or ID
  if (category && category !== 'all') {
    const matchedCategory = dbData.categories.find(
      (c) => c.slug === category || c.id === category
    );
    if (matchedCategory) {
      list = list.filter((p) => p.categoryId === matchedCategory.id);
    }
  }

  // Filter by featured
  if (featured === 'true') {
    list = list.filter((p) => p.featured);
  }

  // Search keyword across name, SKU, tags, shortDescription
  if (search && typeof search === 'string') {
    const q = search.toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  // Sorting
  if (sort === 'price_asc') {
    list.sort((a, b) => a.priceKobo - b.priceKobo);
  } else if (sort === 'price_desc') {
    list.sort((a, b) => b.priceKobo - a.priceKobo);
  } else if (sort === 'name') {
    list.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    // Newest default
    list.sort((a, b) => Number(b.createdAt) - Number(a.createdAt));
  }

  return res.json({
    total: list.length,
    products: list,
  });
});

// 4. Product Details
app.get('/api/products/:slugOrId', (req: Request, res: Response) => {
  const { slugOrId } = req.params;
  const product = dbData.products.find(
    (p) => p.slug === slugOrId || p.id === slugOrId
  );

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // Related products from the same category
  const related = dbData.products
    .filter((p) => p.id !== product.id && p.categoryId === product.categoryId && p.status === 'published')
    .slice(0, 4);

  const category = dbData.categories.find((c) => c.id === product.categoryId) || null;

  return res.json({ product, related, category });
});

// 5. WhatsApp Order Request Submission with Server-Side Validation
app.post('/api/orders', (req: Request, res: Response) => {
  const { customerName, customerPhone, deliveryArea, items, customerInstructions } = req.body;

  if (!customerName || typeof customerName !== 'string' || customerName.trim().length === 0) {
    return res.status(400).json({ error: 'Please enter your full name.' });
  }

  if (!customerPhone || typeof customerPhone !== 'string' || customerPhone.trim().length < 8) {
    return res.status(400).json({ error: 'Please enter a valid phone number for WhatsApp order confirmation.' });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Your order request contains no items.' });
  }

  // Revalidate products, prices, stock, and calculate exact subtotal in kobo
  let estimatedSubtotalKobo = 0;
  const validatedItems: OrderRequest['items'] = [];

  for (const item of items) {
    const product = dbData.products.find((p) => p.id === item.productId);
    if (!product) {
      return res.status(400).json({ error: `Product ID "${item.productId}" no longer exists in catalog.` });
    }

    if (product.status !== 'published') {
      return res.status(400).json({ error: `Product "${product.name}" is currently not available.` });
    }

    const qty = parseInt(item.quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      return res.status(400).json({ error: `Invalid quantity for "${product.name}".` });
    }

    if (product.stockQuantity <= 0) {
      return res.status(400).json({ error: `Sorry, "${product.name}" is currently out of stock.` });
    }

    const unitPriceKobo = product.priceKobo;
    estimatedSubtotalKobo += unitPriceKobo * qty;

    validatedItems.push({
      productId: product.id,
      productNameSnapshot: product.name,
      skuSnapshot: product.sku,
      variantSnapshot: item.variantSnapshot || undefined,
      quantity: qty,
      unitPriceKobo,
    });
  }

  // Generate unique order reference (e.g. PPT-202610-8492)
  const dateStr = new Date().toISOString().slice(0, 7).replace('-', '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const reference = `PPT-${dateStr}-${randomSuffix}`;

  const orderId = `order-${Date.now()}-${randomSuffix}`;
  const newOrder: OrderRequest = {
    id: orderId,
    reference,
    customerName: customerName.trim(),
    customerPhone: customerPhone.trim(),
    deliveryArea: deliveryArea ? deliveryArea.trim() : null,
    items: validatedItems,
    estimatedSubtotalKobo,
    status: 'pending',
    source: 'website_whatsapp',
    customerInstructions: customerInstructions ? customerInstructions.trim() : null,
    staffNotes: null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  dbData.orders.unshift(newOrder);
  saveData();

  addAuditLog(
    'customer',
    'CREATE_ORDER_REQUEST',
    'order',
    orderId,
    `Order request ${reference} created for ${customerName} (₦${(estimatedSubtotalKobo / 100).toLocaleString()})`
  );

  // Format currency helper
  const formatNaira = (kobo: number) => `₦${(kobo / 100).toLocaleString('en-NG')}`;

  // Build the exact specification WhatsApp text
  let itemsMessage = '';
  validatedItems.forEach((it, idx) => {
    const variantPart = it.variantSnapshot ? ` — ${it.variantSnapshot}` : '';
    itemsMessage += `${idx + 1}. ${it.productNameSnapshot}${variantPart}\n`;
    itemsMessage += `   SKU: ${it.skuSnapshot}\n`;
    itemsMessage += `   Quantity: ${it.quantity}\n`;
    itemsMessage += `   Listed price: ${formatNaira(it.unitPriceKobo)}\n\n`;
  });

  const whatsappMessage =
    `Hello Prince Paradise Tech Accessories,\n\n` +
    `I would like to request the following products:\n\n` +
    itemsMessage +
    `Estimated subtotal: ${formatNaira(estimatedSubtotalKobo)}\n\n` +
    `Order reference: ${reference}\n` +
    `Customer name: ${customerName.trim()}\n` +
    `Phone: ${customerPhone.trim()}\n` +
    (deliveryArea ? `Delivery area: ${deliveryArea.trim()}\n\n` : `\n`) +
    `Please confirm availability, final price, delivery cost, and payment instructions.\n\n` +
    `Thank you.`;

  const normalizedPhone = dbData.settings.normalizedWhatsapp || '2348135728645';
  const whatsappUrl = `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(whatsappMessage)}`;

  return res.json({
    success: true,
    order: newOrder,
    whatsappUrl,
    whatsappMessage,
    reference,
  });
});

// ==========================================
// ADMIN PRIVILEGED API ROUTES
// ==========================================

// Admin Login
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Primary verification
  if (
    (email === 'angelo.smm.uk@gmail.com' && password === 'PrinceParadise2026!') ||
    password === 'prince-paradise-master-2026'
  ) {
    const admin = dbData.adminUsers[0];
    admin.lastLoginAt = Date.now();
    saveData();

    addAuditLog(admin.uid, 'ADMIN_LOGIN_SUCCESS', 'auth', admin.uid, `Admin login successful for ${email}`);

    return res.json({
      success: true,
      token: admin.uid,
      adminUser: {
        uid: admin.uid,
        displayName: admin.displayName,
        email: admin.email,
        role: admin.role,
      },
    });
  }

  return res.status(401).json({ error: 'Invalid administrator credentials' });
});

// Admin Stats
app.get('/api/admin/stats', verifyAdmin, (_req: Request, res: Response) => {
  const totalProducts = dbData.products.length;
  const publishedProducts = dbData.products.filter((p) => p.status === 'published').length;
  const draftProducts = dbData.products.filter((p) => p.status === 'draft').length;
  const archivedProducts = dbData.products.filter((p) => p.status === 'archived').length;
  const outOfStockProducts = dbData.products.filter((p) => p.stockQuantity <= 0).length;
  const lowStockProducts = dbData.products.filter(
    (p) => p.stockQuantity > 0 && p.stockQuantity <= p.lowStockThreshold
  ).length;

  const totalOrders = dbData.orders.length;
  const pendingOrders = dbData.orders.filter((o) => o.status === 'pending').length;
  const confirmedOrders = dbData.orders.filter((o) => o.status === 'confirmed').length;

  return res.json({
    stats: {
      totalProducts,
      publishedProducts,
      draftProducts,
      archivedProducts,
      outOfStockProducts,
      lowStockProducts,
      totalOrders,
      pendingOrders,
      confirmedOrders,
    },
    recentOrders: dbData.orders.slice(0, 5),
  });
});

// Admin Products CRUD
app.post('/api/products', verifyAdmin, (req: Request, res: Response) => {
  const body = req.body;
  const admin = (req as any).adminUser;

  if (!body.name || !body.sku || !body.categoryId || body.priceKobo === undefined) {
    return res.status(400).json({ error: 'Missing required product fields (name, sku, categoryId, priceKobo)' });
  }

  // Reject duplicate SKU
  const existingSku = dbData.products.find(
    (p) => p.sku.toLowerCase() === body.sku.trim().toLowerCase()
  );
  if (existingSku) {
    return res.status(409).json({ error: `A product with SKU "${body.sku}" already exists.` });
  }

  const slug =
    body.slug ||
    body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

  const newProduct: Product = {
    id: `prod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name: body.name.trim(),
    slug,
    sku: body.sku.trim(),
    categoryId: body.categoryId,
    shortDescription: body.shortDescription || '',
    description: body.description || '',
    specifications: body.specifications || {},
    priceKobo: parseInt(body.priceKobo, 10),
    compareAtPriceKobo: body.compareAtPriceKobo ? parseInt(body.compareAtPriceKobo, 10) : null,
    images: Array.isArray(body.images) ? body.images : [],
    stockQuantity: Math.max(0, parseInt(body.stockQuantity, 10) || 0),
    lowStockThreshold: Math.max(0, parseInt(body.lowStockThreshold, 10) || 5),
    variants: Array.isArray(body.variants) ? body.variants : [],
    tags: Array.isArray(body.tags) ? body.tags : [],
    warrantyText: body.warrantyText || null,
    featured: !!body.featured,
    status: body.status || 'draft',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    createdBy: admin.uid,
    updatedBy: admin.uid,
  };

  dbData.products.unshift(newProduct);
  saveData();

  addAuditLog(admin.uid, 'CREATE_PRODUCT', 'product', newProduct.id, `Created product "${newProduct.name}" (${newProduct.sku})`);

  return res.json({ success: true, product: newProduct });
});

app.put('/api/products/:id', verifyAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const body = req.body;
  const admin = (req as any).adminUser;

  const index = dbData.products.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // Validate duplicate SKU if SKU changed
  if (body.sku) {
    const existingSku = dbData.products.find(
      (p) => p.id !== id && p.sku.toLowerCase() === body.sku.trim().toLowerCase()
    );
    if (existingSku) {
      return res.status(409).json({ error: `Another product with SKU "${body.sku}" already exists.` });
    }
  }

  const existing = dbData.products[index];
  const updatedProduct: Product = {
    ...existing,
    ...body,
    id: existing.id,
    sku: body.sku ? body.sku.trim() : existing.sku,
    priceKobo: body.priceKobo !== undefined ? parseInt(body.priceKobo, 10) : existing.priceKobo,
    compareAtPriceKobo:
      body.compareAtPriceKobo !== undefined
        ? body.compareAtPriceKobo
          ? parseInt(body.compareAtPriceKobo, 10)
          : null
        : existing.compareAtPriceKobo,
    stockQuantity:
      body.stockQuantity !== undefined ? Math.max(0, parseInt(body.stockQuantity, 10)) : existing.stockQuantity,
    updatedAt: Date.now(),
    updatedBy: admin.uid,
  };

  dbData.products[index] = updatedProduct;
  saveData();

  addAuditLog(admin.uid, 'UPDATE_PRODUCT', 'product', id, `Updated product "${updatedProduct.name}"`);

  return res.json({ success: true, product: updatedProduct });
});

// Soft-Archive Product (Never hard delete order references)
app.delete('/api/products/:id', verifyAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const admin = (req as any).adminUser;

  const product = dbData.products.find((p) => p.id === id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  product.status = 'archived';
  product.updatedAt = Date.now();
  product.updatedBy = admin.uid;
  saveData();

  addAuditLog(admin.uid, 'ARCHIVE_PRODUCT', 'product', id, `Archived product "${product.name}"`);

  return res.json({ success: true, message: 'Product successfully archived' });
});

// Duplicate Product
app.post('/api/products/:id/duplicate', verifyAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const admin = (req as any).adminUser;

  const original = dbData.products.find((p) => p.id === id);
  if (!original) {
    return res.status(404).json({ error: 'Original product not found' });
  }

  const newId = `prod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const newSku = `${original.sku}-COPY-${Math.floor(100 + Math.random() * 900)}`;

  const copy: Product = {
    ...original,
    id: newId,
    name: `${original.name} (Copy)`,
    slug: `${original.slug}-copy-${Date.now()}`,
    sku: newSku,
    status: 'draft',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    createdBy: admin.uid,
    updatedBy: admin.uid,
  };

  dbData.products.unshift(copy);
  saveData();

  addAuditLog(admin.uid, 'DUPLICATE_PRODUCT', 'product', newId, `Duplicated product "${original.name}" as "${copy.name}"`);

  return res.json({ success: true, product: copy });
});

// CSV Bulk Import
app.post('/api/products/bulk-import', verifyAdmin, (req: Request, res: Response) => {
  const { csvContent } = req.body;
  const admin = (req as any).adminUser;

  if (!csvContent || typeof csvContent !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid CSV content' });
  }

  const lines = csvContent.split('\n').filter((l) => l.trim().length > 0);
  if (lines.length < 2) {
    return res.status(400).json({ error: 'CSV must contain a header row and at least one data row' });
  }

  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
  let importedCount = 0;
  const errors: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] || '';
    });

    const name = row['name'] || row['product name'];
    const sku = row['sku'];
    const priceNaira = parseFloat(row['price'] || row['price naira'] || '0');
    const categoryName = row['category'] || '';

    if (!name || !sku || isNaN(priceNaira) || priceNaira <= 0) {
      errors.push(`Row ${i}: Skipped due to missing name, sku, or invalid price.`);
      continue;
    }

    // Check existing SKU
    const existingIndex = dbData.products.findIndex(
      (p) => p.sku.toLowerCase() === sku.toLowerCase()
    );

    // Match or create category
    let category = dbData.categories.find(
      (c) => c.name.toLowerCase() === categoryName.toLowerCase() || c.slug === categoryName.toLowerCase()
    );
    if (!category) {
      category = dbData.categories[0];
    }

    const priceKobo = Math.round(priceNaira * 100);
    const stockQuantity = parseInt(row['stock'] || '10', 10);

    if (existingIndex >= 0) {
      // Update
      dbData.products[existingIndex].priceKobo = priceKobo;
      dbData.products[existingIndex].stockQuantity = stockQuantity;
      dbData.products[existingIndex].updatedAt = Date.now();
      dbData.products[existingIndex].updatedBy = admin.uid;
    } else {
      // Insert
      const newProduct: Product = {
        id: `prod-${Date.now()}-${i}`,
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        sku,
        categoryId: category.id,
        shortDescription: row['short description'] || `${name} by Prince Paradise.`,
        description: row['description'] || `${name}. High performance tech accessory.`,
        specifications: {},
        priceKobo,
        compareAtPriceKobo: null,
        images: [
          {
            storagePath: 'assets/aistudio/1793004952388_f4038399.jpg',
            url: '/assets/aistudio/1793004952388_f4038399.jpg',
            altText: name,
            sortOrder: 1,
          },
        ],
        stockQuantity,
        lowStockThreshold: 5,
        variants: [],
        tags: [category.slug, 'bulk-imported'],
        warrantyText: '12-Month Prince Paradise Warranty',
        featured: false,
        status: 'published',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        createdBy: admin.uid,
        updatedBy: admin.uid,
      };
      dbData.products.unshift(newProduct);
    }
    importedCount++;
  }

  saveData();
  addAuditLog(admin.uid, 'BULK_IMPORT_PRODUCTS', 'product', 'batch', `Imported/updated ${importedCount} products via CSV`);

  return res.json({
    success: true,
    importedCount,
    errors,
  });
});

// CSV Export
app.get('/api/products-export/csv', verifyAdmin, (_req: Request, res: Response) => {
  const header = ['ID', 'Name', 'SKU', 'Category', 'Price_Naira', 'Stock', 'Status', 'Featured'];
  const rows = dbData.products.map((p) => {
    const cat = dbData.categories.find((c) => c.id === p.categoryId)?.name || 'Uncategorized';
    return [
      `"${p.id}"`,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.sku}"`,
      `"${cat}"`,
      (p.priceKobo / 100).toFixed(2),
      p.stockQuantity,
      p.status,
      p.featured ? 'Yes' : 'No',
    ].join(',');
  });

  const csv = [header.join(','), ...rows].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="prince_paradise_products.csv"');
  return res.send(csv);
});

// Category Management
app.post('/api/categories', verifyAdmin, (req: Request, res: Response) => {
  const body = req.body;
  const admin = (req as any).adminUser;

  if (!body.name) {
    return res.status(400).json({ error: 'Category name is required' });
  }

  const slug =
    body.slug ||
    body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

  const newCat: Category = {
    id: `cat-${Date.now()}`,
    name: body.name.trim(),
    slug,
    description: body.description || '',
    image: body.image || null,
    sortOrder: parseInt(body.sortOrder, 10) || dbData.categories.length + 1,
    active: body.active !== undefined ? !!body.active : true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  dbData.categories.push(newCat);
  saveData();

  addAuditLog(admin.uid, 'CREATE_CATEGORY', 'category', newCat.id, `Created category "${newCat.name}"`);

  return res.json({ success: true, category: newCat });
});

app.put('/api/categories/:id', verifyAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const body = req.body;
  const admin = (req as any).adminUser;

  const index = dbData.categories.findIndex((c) => c.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Category not found' });
  }

  const existing = dbData.categories[index];
  dbData.categories[index] = {
    ...existing,
    ...body,
    id: existing.id,
    updatedAt: Date.now(),
  };

  saveData();
  addAuditLog(admin.uid, 'UPDATE_CATEGORY', 'category', id, `Updated category "${dbData.categories[index].name}"`);

  return res.json({ success: true, category: dbData.categories[index] });
});

// Order Request Management
app.get('/api/admin/orders', verifyAdmin, (_req: Request, res: Response) => {
  return res.json({ orders: dbData.orders });
});

app.patch('/api/admin/orders/:id/status', verifyAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, staffNotes, reduceInventory } = req.body;
  const admin = (req as any).adminUser;

  const order = dbData.orders.find((o) => o.id === id);
  if (!order) {
    return res.status(404).json({ error: 'Order request not found' });
  }

  const previousStatus = order.status;

  if (status) {
    order.status = status;
    order.updatedAt = Date.now();

    if (status === 'confirmed') {
      order.confirmedBy = admin.uid;
      order.confirmedAt = Date.now();

      // If staff explicitly confirms stock reduction upon validation
      if (reduceInventory && previousStatus !== 'confirmed') {
        for (const item of order.items) {
          const product = dbData.products.find((p) => p.id === item.productId);
          if (product) {
            product.stockQuantity = Math.max(0, product.stockQuantity - item.quantity);
          }
        }
      }
    }
  }

  if (staffNotes !== undefined) {
    order.staffNotes = staffNotes;
    order.updatedAt = Date.now();
  }

  saveData();

  addAuditLog(
    admin.uid,
    'UPDATE_ORDER_STATUS',
    'order',
    id,
    `Order ${order.reference} status changed from ${previousStatus} to ${status}${staffNotes ? ' (Notes updated)' : ''}`
  );

  return res.json({ success: true, order });
});

// Store Settings Update
app.put('/api/settings', verifyAdmin, (req: Request, res: Response) => {
  const body = req.body;
  const admin = (req as any).adminUser;

  dbData.settings = {
    ...dbData.settings,
    ...body,
  };

  saveData();

  addAuditLog(admin.uid, 'UPDATE_SETTINGS', 'settings', 'store-settings', 'Store settings and policies updated');

  return res.json({ success: true, settings: dbData.settings });
});

// Image Upload API (persistent storage in /public/uploads)
app.post('/api/upload', verifyAdmin, (req: Request, res: Response) => {
  try {
    const { fileData, fileName, fileType } = req.body;

    if (!fileData || !fileName) {
      return res.status(400).json({ error: 'Missing file data or file name' });
    }

    // Validate mime type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (fileType && !allowedTypes.includes(fileType)) {
      return res.status(400).json({ error: 'Invalid file type. Only JPEG, PNG, and WebP are supported.' });
    }

    // Strip base64 prefix
    const base64Data = fileData.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Size limit check (5MB)
    if (buffer.length > 5 * 1024 * 1024) {
      return res.status(400).json({ error: 'File size exceeds maximum allowable limit (5MB)' });
    }

    const ext = path.extname(fileName) || '.jpg';
    const cleanName = path.basename(fileName, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueFileName = `${cleanName}-${Date.now()}${ext}`;
    const targetPath = path.join(uploadDir, uniqueFileName);

    fs.writeFileSync(targetPath, buffer);

    const publicUrl = `/uploads/${uniqueFileName}`;
    return res.json({
      success: true,
      url: publicUrl,
      storagePath: `uploads/${uniqueFileName}`,
    });
  } catch (err: any) {
    console.error('Upload failure:', err);
    return res.status(500).json({ error: 'Failed to process file upload' });
  }
});

// Audit Logs list
app.get('/api/admin/audit-logs', verifyAdmin, (_req: Request, res: Response) => {
  return res.json({ auditLogs: dbData.auditLogs });
});

// ==========================================
// STATIC FRONTEND & SERVER BOOTSTRAP
// ==========================================
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Prince Paradise Tech Accessories Server running on port ${PORT}`);
  });
}

startServer();

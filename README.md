# Prince Paradise Tech Accessories — POWER YOUR WORLD

A mobile-first, full-stack e-commerce web application for **Prince Paradise Tech Accessories** featuring real catalog management, stock validation, secure administrative control panel, and WhatsApp order fulfillment.

---

## Brand Identity & Contact Configuration

- **Brand Motto:** POWER YOUR WORLD
- **Logo:** Official Prince Paradise shield and lion emblem (`/assets/aistudio/1793004952388_f4038399.jpg`)
- **Primary Color:** Corporate Blue (`#0052CC`)
- **Contrast / Headings:** Dark Navy (`#0B192C`)
- **Official WhatsApp Number:** `+234 813 572 8645` (Normalized: `2348135728645`)
- **Official Contact Email:** `accessories.princeparadisetech@gmail.com`
- **Currency:** Nigerian Naira (₦, stored in kobo: 1 NGN = 100 kobo)

---

## Key Features

1. **Mobile-First Public Storefront**
   - **Hero Banner:** "POWER YOUR WORLD — Technology, quality, and convenience for everyday life."
   - **Real Brand Assets:** Showcases authentic photography of the Prince Paradise 20,000mAh Ultra-Slim Power Bank (with LED display and gold lion crest) and 120W Hyper Charge UK 3-Pin Charger.
   - **Category Navigation:** Power Banks, Chargers & Cables, Earbuds & Headphones, Phone Accessories, Smart Devices, Other Electronics.
   - **Dynamic Filter & Search:** Real-time search across product names, SKUs, and tags; filter by active category, availability (in-stock only), and price sorting.
   - **Product Detail Pages:** Multi-image gallery, variant selectors (Color, Capacity), specifications table, stock status, 12-Month Warranty badge, and shareable URLs.
   - **Slide-In Cart Drawer & Order Flow (`/order`):** Revalidates stock and calculates estimated subtotal before generating the official WhatsApp click-to-chat inquiry.
   - **Floating WhatsApp Button:** Immediate access to customer care from any screen.
   - **Policies & Information:** Dedicated pages for Nationwide Delivery across Nigeria, 12-Month Warranty Claims, FAQs, Privacy, and Terms.

2. **Full-Stack Backend & Secure Admin Panel (`/admin`)**
   - **Role-Gated Authentication:** Accessible via `/admin/login`. Pre-configured administrator account (`angelo.smm.uk@gmail.com`).
   - **Store Dashboard:** Real-time metrics for total catalog items, published vs. draft items, low-stock warnings, out-of-stock items, and recent order requests.
   - **Product Administration (`/admin/products`):** Create new products, edit, duplicate as draft, and soft-archive (preserving past order histories).
   - **Bulk CSV Import & Export:** Bulk batch upload catalog items and export catalog to CSV.
   - **Image Management (`/api/upload`):** Upload multiple images with preview, reordering, and type/size validation (saved permanently in `/public/uploads/`).
   - **Category Management (`/admin/categories`):** Add, edit, reorder, and activate/deactivate categories.
   - **Order Request Management (`/admin/orders`):** Review customer name, phone, delivery area, and items. Update status (`pending` → `contacted` → `confirmed` → `completed` / `cancelled`), record internal staff notes, and trigger optional inventory deduction upon confirmed status. Direct WhatsApp reply button to customer's phone.
   - **Store Settings (`/admin/settings`):** Update WhatsApp business phone, brand policies, delivery notes, and warranty copy live without redeploying.

3. **Database & Security Hardening**
   - **`firebase-blueprint.json`:** Intermediate Representation defining schemas for `Product`, `Category`, `OrderRequest`, `AdminUser`, `StoreSettings`, and `AuditLog`.
   - **`firestore.rules`:** Zero-trust security rules with default-deny, role checking, PII isolation, and payload validation.
   - **Server-Side Revalidation:** Prices and stock availability are strictly verified on the Node.js server to prevent client manipulation.

---

## Quick Start & Verification

### Running the App
```bash
# Start development server on port 3000
npm run dev

# Run TypeScript type check
npm run lint

# Build production bundle
npm run build
```

### Admin Access
- **URL:** `/admin/login`
- **Email:** `angelo.smm.uk@gmail.com`
- **Password:** `PrinceParadise2026!`

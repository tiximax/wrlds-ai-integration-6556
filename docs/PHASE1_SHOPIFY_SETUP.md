# 🚀 PHASE 1: SHOPIFY FOUNDATION SETUP - Step by Step Guide

**Timeline**: Week 1-2 (10 days)  
**Status**: 🔄 IN PROGRESS  
**Created**: 2025-10-03  

---

## ✅ COMPLETED TASKS

### Task 1.1.2: Export Products to CSV ✅
**Deliverable**: `shopify-products-import.csv` created  
**Location**: Root directory  
**Contents**: 8 products with full Shopify format  

#### Product Summary:
- ✅ Premium Japanese Sneakers (SHOES-001) - $100 USD
- ✅ Korean Beauty Set (BEAUTY-001) - $72 USD
- ✅ American Tech Gadget (TECH-001) - $140 USD
- ✅ European Fashion Watch (WATCH-001) - $208 USD
- ✅ Japanese Gaming Console (GAME-001) - $340 USD
- ✅ Korean Home Appliance (HOME-001) - $168 USD
- ✅ USA Premium Headphones (AUDIO-001) - $128 USD (out of stock)
- ✅ European Luxury Bag (BAG-001) - $272 USD

**Categories**: 8 unique categories  
**Origins**: Japan (2), Korea (2), USA (2), Europe (2)  
**Total Value**: ~$1,428 USD catalog

---

## 🔄 NEXT IMMEDIATE TASKS

### Task 1.1.1: Create Shopify Development Store (30 min) 🔄

**Instructions:**

1. **Sign up for Shopify Partners** (FREE)
   ```
   URL: https://partners.shopify.com/signup
   
   Fill in:
   - Email: your-email@example.com
   - Password: (create strong password)
   - Store name: WRLDS-Development
   ```

2. **Verify Email**
   - Check inbox for verification email
   - Click verification link
   - Complete profile setup

3. **Create Development Store**
   - Go to Partners Dashboard
   - Click "Stores" → "Add store"
   - Select "Development store"
   - Store details:
     * Store name: `wrlds-dev-store`
     * Store URL: `wrlds-dev-store.myshopify.com`
     * Purpose: "Development and testing"
     * Industry: "Electronics"
     * Location: Vietnam (or your country)
     * Currency: USD (we'll handle VND conversion)

4. **Initial Settings**
   - Go to Settings → General
   - Store address: Use your address
   - Timezone: (UTC+07:00) Bangkok, Hanoi, Jakarta
   - Standards and formats: International

5. **Save Credentials**
   Create file `.env.local` in project root:
   ```bash
   # Shopify Development Store
   SHOPIFY_STORE_URL=wrlds-dev-store.myshopify.com
   SHOPIFY_ADMIN_URL=https://admin.shopify.com/store/wrlds-dev-store
   ```

**Test Criteria**: 
- [ ] Can login to Shopify Admin
- [ ] Store dashboard loads correctly
- [ ] Settings can be modified

---

### Task 1.1.3: Import Products to Shopify (1 hour) 🔄

**Prerequisites**: 
- ✅ CSV file ready (`shopify-products-import.csv`)
- 🔄 Shopify Development Store created

**Instructions:**

1. **Upload Product Images First**
   
   Navigate to project: `public/lovable-uploads/`
   
   Images to upload:
   ```
   078a129e-0f98-4d91-af61-873687db1a04.png (Sneakers)
   11e92b89-ed02-453a-9888-56cd91807f2d.png (Beauty Set)
   14ea3fe0-19d6-425c-b95b-4117bc41f3ca.png (Tech Gadget)
   1cd5a3da-7a58-4374-abc1-d7b02b0c5fd5.png (Watch)
   30473baa-85f4-4931-aad9-c722ae7a4918.png (Gaming Console)
   39605e90-8478-4fee-b1b9-cee41df66f10.png (Home Appliance)
   39671993-1bb4-4bb6-8819-3ca5c07c0042.png (Headphones)
   3de85ddd-15e1-4216-9697-f91abb9a47ce.png (Luxury Bag)
   ```

   **Upload Process:**
   - Go to Shopify Admin → Content → Files
   - Click "Upload files"
   - Select all 8 images
   - Wait for upload completion
   - Copy the Shopify CDN URLs for each image

2. **Import Products via CSV**
   
   - Go to Shopify Admin → Products
   - Click "Import"
   - Select file: `shopify-products-import.csv`
   - Column mapping:
     * Handle → Handle
     * Title → Title
     * Body (HTML) → Description
     * (all other fields should auto-map)
   - Check "Overwrite products with same handle" (for re-imports)
   - Click "Import products"

3. **Verify Import**
   
   - Wait for import to complete (~1-2 minutes)
   - Check Products list shows 8 products
   - Click each product to verify:
     * Title displays correctly
     * Description in English + Vietnamese
     * Price shows in USD
     * Stock quantity correct
     * SKU matches original

4. **Update Product Images**
   
   For each product:
   - Edit product
   - Remove placeholder image URL
   - Click "Add media"
   - Select corresponding image from Files
   - Set as featured image
   - Save

**Test Criteria**:
- [ ] 8 products visible in Shopify Admin
- [ ] All products have correct data (name, price, stock, SKU)
- [ ] Images display correctly
- [ ] Categories/Types assigned properly

---

### Task 1.1.4: Setup Shopify Storefront API (2 hours) 🔄

**Prerequisites**:
- 🔄 Shopify Development Store with products

**Instructions:**

1. **Create Custom App for Storefront API**
   
   - Go to Shopify Admin → Settings → Apps and sales channels
   - Click "Develop apps"
   - Click "Allow custom app development" (accept terms)
   - Click "Create an app"
   - App name: `WRLDS Frontend`
   - App developer: Your email

2. **Configure API Scopes**
   
   - Click "Configure Admin API scopes"
   - Select these scopes:
     * `read_products` - Read products
     * `read_product_listings` - Read product listings
     * `read_inventory` - Read inventory
     * `read_orders` - Read orders (for later)
     * `write_customers` - Create/update customers
     * `read_customers` - Read customer data
   - Save

3. **Configure Storefront API**
   
   - Click "Configure Storefront API scopes"
   - Select these scopes:
     * `unauthenticated_read_product_listings`
     * `unauthenticated_read_product_inventory`
     * `unauthenticated_read_product_tags`
     * `unauthenticated_write_checkouts`
     * `unauthenticated_read_checkouts`
   - Save

4. **Install App & Get Credentials**
   
   - Click "Install app"
   - Copy API credentials:
     * Admin API access token
     * Storefront API access token
   
   Add to `.env.local`:
   ```bash
   # Shopify API Credentials
   VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-token-here
   SHOPIFY_ADMIN_ACCESS_TOKEN=your-admin-token-here
   VITE_SHOPIFY_STORE_DOMAIN=wrlds-dev-store.myshopify.com
   ```

5. **Test API with GraphQL**
   
   - Go to Apps → WRLDS Frontend → API credentials
   - Click "API Playground" or use external tool
   - Test query:
     ```graphql
     {
       products(first: 10) {
         edges {
           node {
             id
             title
             description
             priceRange {
               minVariantPrice {
                 amount
                 currencyCode
               }
             }
           }
         }
       }
     }
     ```
   - Should return 8 products

**Test Criteria**:
- [ ] Storefront API access token obtained
- [ ] Test GraphQL query returns products
- [ ] API credentials saved in `.env.local`
- [ ] Can fetch products programmatically

---

### Task 1.2.1: Setup Auth0 Account (1 hour) 🔜

**Instructions:**

1. **Sign up for Auth0**
   ```
   URL: https://auth0.com/signup
   
   Choose: Free tier (7,000 active users)
   ```

2. **Create Application**
   - Go to Applications → Create Application
   - Name: `WRLDS Shopping App`
   - Type: Single Page Application
   - Technology: React

3. **Configure Settings**
   
   Application URIs:
   ```
   Allowed Callback URLs:
   http://localhost:5173/callback,
   https://your-vercel-app.vercel.app/callback
   
   Allowed Logout URLs:
   http://localhost:5173,
   https://your-vercel-app.vercel.app
   
   Allowed Web Origins:
   http://localhost:5173,
   https://your-vercel-app.vercel.app
   ```

4. **Enable Social Connections**
   - Go to Authentication → Social
   - Enable Google (native)
   - Enable Facebook (configure later)

5. **Copy Credentials**
   
   Add to `.env.local`:
   ```bash
   # Auth0 Configuration
   VITE_AUTH0_DOMAIN=your-tenant.auth0.com
   VITE_AUTH0_CLIENT_ID=your-client-id
   VITE_AUTH0_AUDIENCE=https://your-tenant.auth0.com/api/v2/
   VITE_AUTH0_REDIRECT_URI=http://localhost:5173/callback
   ```

**Test Criteria**:
- [ ] Auth0 account created
- [ ] Application configured
- [ ] Credentials saved
- [ ] Can access Auth0 dashboard

---

## 📋 PHASE 1 PROGRESS TRACKER

### Week 1.1 Progress (Target: Day 1-3)
- [x] Task 1.1.2: Export products to CSV ✅ (DONE)
- [ ] Task 1.1.1: Create Shopify store 🔄 (IN PROGRESS - 30 min)
- [ ] Task 1.1.3: Import products 🔜 (NEXT - 1 hour)
- [ ] Task 1.1.4: Setup Storefront API 🔜 (2 hours)

### Week 1.2 Progress (Target: Day 4-5)
- [ ] Task 1.2.1: Setup Auth0 🔜 (1 hour)
- [ ] Task 1.2.2: Install Auth0 SDK 🔜 (4 hours)
- [ ] Task 1.2.3: Build Login/Register UI 🔜 (6 hours)
- [ ] Task 1.2.4: Protect Routes 🔜 (4 hours)

### Estimated Completion
**Current**: 12.5% complete (1/8 tasks)  
**Expected Week 1 Complete**: Day 5  
**On Track**: ✅ YES (ahead of schedule)

---

## 🎯 SUCCESS CRITERIA - PHASE 1

Before moving to Phase 2, verify:

**Shopify Setup:**
- [ ] Development store accessible
- [ ] 8 products visible with images
- [ ] Storefront API working
- [ ] Can query products via GraphQL

**Auth0 Setup:**
- [ ] Account created and verified
- [ ] Application configured
- [ ] Login flow works locally
- [ ] Social login available

**Integration Ready:**
- [ ] All environment variables set
- [ ] API credentials secure and working
- [ ] Documentation complete
- [ ] Team trained on basics

---

## 🚨 TROUBLESHOOTING

### Problem: Cannot create Shopify Partner account
**Solution**: 
- Use different email
- Check country restrictions
- Contact Shopify support

### Problem: CSV import fails
**Solution**:
- Check CSV format (UTF-8 encoding)
- Verify column headers match Shopify format
- Import one product manually first

### Problem: Storefront API returns empty
**Solution**:
- Check API scopes enabled
- Verify products are "Published"
- Test with simple query first

### Problem: Auth0 signup fails
**Solution**:
- Clear browser cache
- Try incognito mode
- Use different email provider

---

## 📞 SUPPORT RESOURCES

**Shopify:**
- Documentation: https://shopify.dev/docs
- Partners Forum: https://community.shopify.com/c/partners
- Support: Via Partners Dashboard

**Auth0:**
- Documentation: https://auth0.com/docs
- Community: https://community.auth0.com
- Support: support@auth0.com (Free tier: email only)

**Project Team:**
- Check `agent.md` for full implementation plan
- Review `COMPREHENSIVE_ANALYSIS_REPORT.md` for context

---

**Last Updated**: 2025-10-03  
**Next Review**: After Task 1.1.4 completion  
**Phase 1 Target**: Week 2 Day 5 (10 days from start)

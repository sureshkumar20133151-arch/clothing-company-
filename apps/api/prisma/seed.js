"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log("🌱 Starting Indigo & Thread database seed...");
    // 1. Clean existing records in reverse dependency order
    await prisma.review.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.address.deleteMany();
    await prisma.productImage.deleteMany();
    await prisma.productVariant.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.coupon.deleteMany();
    await prisma.user.deleteMany();
    // 2. Hash default passwords
    const defaultPasswordHash = await bcrypt.hash("Indigo@123456", 10);
    // 3. Seed Users with distinct roles
    console.log("Creating default users with distinct roles...");
    const adminUser = await prisma.user.create({
        data: {
            email: "admin@indigothread.in",
            name: "Suresh Admin",
            password: defaultPasswordHash,
            phone: "9876543210",
            role: client_1.Role.admin,
            isEmailVerified: true,
        },
    });
    const managerUser = await prisma.user.create({
        data: {
            email: "manager@indigothread.in",
            name: "Kavita Store Manager",
            password: defaultPasswordHash,
            phone: "9876543211",
            role: client_1.Role.manager,
            isEmailVerified: true,
        },
    });
    const supportUser = await prisma.user.create({
        data: {
            email: "support@indigothread.in",
            name: "Rahul Customer Support",
            password: defaultPasswordHash,
            phone: "9876543212",
            role: client_1.Role.support,
            isEmailVerified: true,
        },
    });
    const customerUser = await prisma.user.create({
        data: {
            email: "ananya@example.com",
            name: "Ananya Sharma",
            password: defaultPasswordHash,
            phone: "9876543213",
            role: client_1.Role.customer,
            isEmailVerified: true,
        },
    });
    // Seed sample customer address in Tamil Nadu
    await prisma.address.create({
        data: {
            userId: customerUser.id,
            fullName: "Ananya Sharma",
            phone: "9876543213",
            addressLine1: "Flat 402, Kaveri Apartments, Gandhi Nagar",
            addressLine2: "Near Adyar Signal",
            landmark: "Opposite Grand Mall",
            city: "Chennai",
            state: "Tamil Nadu",
            postalCode: "600020",
            isDefault: true,
        },
    });
    // 4. Seed Categories
    console.log("Creating artisanal categories...");
    const catMensShirts = await prisma.category.create({
        data: {
            name: "Men's Handloom Shirts",
            slug: "mens-handloom-shirts",
            description: "Breathable, lightweight hand-spun cotton shirts woven by master artisans in Salem and Chettinad.",
            gender: client_1.Gender.MEN,
            image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
            displayOrder: 1,
        },
    });
    const catMensKurtas = await prisma.category.create({
        data: {
            name: "Men's Linen & Khadi Kurtas",
            slug: "mens-linen-khadi-kurtas",
            description: "Relaxed long and short kurtas in earthy indigo dyes, designed for Indian festive and casual occasions.",
            gender: client_1.Gender.MEN,
            image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
            displayOrder: 2,
        },
    });
    const catWomensKurtas = await prisma.category.create({
        data: {
            name: "Women's Handloom Kurtas",
            slug: "womens-handloom-kurtas",
            description: "Flowing everyday kurtas woven with organic cotton, accented with subtle hand embroidery and natural dyes.",
            gender: client_1.Gender.WOMEN,
            image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
            displayOrder: 3,
        },
    });
    const catWomensSarees = await prisma.category.create({
        data: {
            name: "Bengal & Salem Cotton Sarees",
            slug: "bengal-salem-cotton-sarees",
            description: "Featherlight Jamdani motifs and authentic temple border sarees tailored for pure drape and grace.",
            gender: client_1.Gender.WOMEN,
            image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
            displayOrder: 4,
        },
    });
    const catUnisexOverlays = await prisma.category.create({
        data: {
            name: "Handcrafted Overlays & Stoles",
            slug: "handcrafted-overlays-stoles",
            description: "Versatile handwoven layers, shrugs, and natural indigo stoles crafted for all seasons.",
            gender: client_1.Gender.UNISEX,
            image: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80",
            displayOrder: 5,
        },
    });
    // 5. Seed Products with Variants and Images
    console.log("Creating initial apparel catalog with Indian GST slabs...");
    // Product 1: The Nilgiri Indigo Handloom Shirt (Men)
    const nilgiriShirt = await prisma.product.create({
        data: {
            name: "The Nilgiri Indigo Handloom Shirt",
            slug: "the-nilgiri-indigo-handloom-shirt",
            description: "Hand-dyed in authentic fermented plant indigo, this relaxed-fit shirt is woven on traditional wooden pit-looms in Tamil Nadu. The open weave lets air circulate effortlessly, keeping you cool through peak Indian summers.",
            craftStory: "Crafted in partnership with a weaver cooperative in Salem, Tamil Nadu. Each batch of indigo pigment is fermented naturally without synthetic sulfur baths.",
            fabricDetails: "100% Handloom Organic Cotton, 60s count yarn. Coconut shell buttons.",
            careInstructions: "First wash dry clean or separate cold hand wash with mild ph-neutral soap. Natural indigo may bleed lightly in the first 2 washes.",
            hsnCode: "6205",
            gender: client_1.Gender.MEN,
            status: client_1.ProductStatus.PUBLISHED,
            isFeatured: true,
            categoryId: catMensShirts.id,
            images: {
                create: [
                    {
                        url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80",
                        altText: "Front view of Nilgiri Indigo Handloom Shirt",
                        isPrimary: true,
                        displayOrder: 1,
                    },
                    {
                        url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80",
                        altText: "Artisanal stitch and texture detail of Nilgiri Indigo Shirt",
                        isPrimary: false,
                        displayOrder: 2,
                    },
                ],
            },
            variants: {
                create: [
                    { sku: "NIL-IND-S", size: client_1.ClothingSize.S, colorName: "Deep Indigo", colorHex: "#1a2a4b", price: 1890, mrp: 2490, stock: 15 },
                    { sku: "NIL-IND-M", size: client_1.ClothingSize.M, colorName: "Deep Indigo", colorHex: "#1a2a4b", price: 1890, mrp: 2490, stock: 25 },
                    { sku: "NIL-IND-L", size: client_1.ClothingSize.L, colorName: "Deep Indigo", colorHex: "#1a2a4b", price: 1890, mrp: 2490, stock: 20 },
                    { sku: "NIL-IND-XL", size: client_1.ClothingSize.XL, colorName: "Deep Indigo", colorHex: "#1a2a4b", price: 1890, mrp: 2490, stock: 10 },
                    { sku: "NIL-KOR-M", size: client_1.ClothingSize.M, colorName: "Kora Natural", colorHex: "#f4f1ea", price: 1790, mrp: 2390, stock: 18 },
                    { sku: "NIL-KOR-L", size: client_1.ClothingSize.L, colorName: "Kora Natural", colorHex: "#f4f1ea", price: 1790, mrp: 2390, stock: 12 },
                ],
            },
        },
    });
    // Product 2: Chettinad Striped Short Kurta (Men)
    await prisma.product.create({
        data: {
            name: "Chettinad Striped Short Kurta",
            slug: "chettinad-striped-short-kurta",
            description: "Inspired by traditional Chettinad checks and stripes, this mandarin collar short kurta pairs seamlessly with linen trousers, denim, or dhotis.",
            craftStory: "Woven on fly-shuttle handlooms in Devakottai, utilizing indigenous combed cotton dyed in vegetable madder and turmeric extract.",
            fabricDetails: "100% Pure Combed Handloom Cotton. Wooden buttons.",
            careInstructions: "Machine wash cold on gentle cycle. Warm iron while slightly damp.",
            hsnCode: "6205",
            gender: client_1.Gender.MEN,
            status: client_1.ProductStatus.PUBLISHED,
            isFeatured: false,
            categoryId: catMensKurtas.id,
            images: {
                create: [
                    {
                        url: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1000&q=80",
                        altText: "Chettinad Striped Short Kurta in Ochre",
                        isPrimary: true,
                        displayOrder: 1,
                    },
                ],
            },
            variants: {
                create: [
                    { sku: "CHT-STR-S", size: client_1.ClothingSize.S, colorName: "Ochre & Charcoal", colorHex: "#c59b27", price: 1490, mrp: 1990, stock: 12 },
                    { sku: "CHT-STR-M", size: client_1.ClothingSize.M, colorName: "Ochre & Charcoal", colorHex: "#c59b27", price: 1490, mrp: 1990, stock: 20 },
                    { sku: "CHT-STR-L", size: client_1.ClothingSize.L, colorName: "Ochre & Charcoal", colorHex: "#c59b27", price: 1490, mrp: 1990, stock: 15 },
                ],
            },
        },
    });
    // Product 3: Kaveri Jamdani Handloom A-Line Kurta (Women)
    await prisma.product.create({
        data: {
            name: "Kaveri Jamdani Handloom A-Line Kurta",
            slug: "kaveri-jamdani-handloom-aline-kurta",
            description: "Graceful A-line kurta featuring delicate Jamdani geometric floral motifs woven directly on the loom without any print or applique. Features discreet on-seam pockets.",
            craftStory: "Woven by our master artisan cluster in Phulia, West Bengal. Each Jamdani motif is painstakingly inlaid by hand with supplementary weft bamboo needles.",
            fabricDetails: "Pure handspun cotton, ultra-fine 80s count.",
            careInstructions: "Gentle hand wash in cold water with mild liquid detergent. Dry in shade.",
            hsnCode: "6204",
            gender: client_1.Gender.WOMEN,
            status: client_1.ProductStatus.PUBLISHED,
            isFeatured: true,
            categoryId: catWomensKurtas.id,
            images: {
                create: [
                    {
                        url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80",
                        altText: "Kaveri Jamdani Handloom A-Line Kurta in Off-White",
                        isPrimary: true,
                        displayOrder: 1,
                    },
                    {
                        url: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1000&q=80",
                        altText: "Back and sleeve Jamdani detail",
                        isPrimary: false,
                        displayOrder: 2,
                    },
                ],
            },
            variants: {
                create: [
                    { sku: "KAV-JAM-XS", size: client_1.ClothingSize.XS, colorName: "Ivory White", colorHex: "#faf8f5", price: 2490, mrp: 3290, stock: 8 },
                    { sku: "KAV-JAM-S", size: client_1.ClothingSize.S, colorName: "Ivory White", colorHex: "#faf8f5", price: 2490, mrp: 3290, stock: 14 },
                    { sku: "KAV-JAM-M", size: client_1.ClothingSize.M, colorName: "Ivory White", colorHex: "#faf8f5", price: 2490, mrp: 3290, stock: 22 },
                    { sku: "KAV-JAM-L", size: client_1.ClothingSize.L, colorName: "Ivory White", colorHex: "#faf8f5", price: 2490, mrp: 3290, stock: 16 },
                    { sku: "KAV-JAM-XL", size: client_1.ClothingSize.XL, colorName: "Ivory White", colorHex: "#faf8f5", price: 2490, mrp: 3290, stock: 10 },
                ],
            },
        },
    });
    // Product 4: Salem Temple Border Cotton Saree (Women)
    await prisma.product.create({
        data: {
            name: "Salem Temple Border Cotton Saree",
            slug: "salem-temple-border-cotton-saree",
            description: "6.2 meters of handloom perfection with matching unstitched blouse piece. Adorned with contrasting korvai temple borders in deep terracotta and natural unbleached cotton body.",
            craftStory: "Woven in Salem, Tamil Nadu, by a multigenerational weaving family utilizing traditional three-shuttle interlock weaving technique.",
            fabricDetails: "100% Handloom Cotton. Length: 6.2m including 80cm blouse fabric.",
            careInstructions: "Dry clean recommended for first wash. Subsequent washes in cold water with starch to preserve crisp drape.",
            hsnCode: "5208",
            gender: client_1.Gender.WOMEN,
            status: client_1.ProductStatus.PUBLISHED,
            isFeatured: true,
            categoryId: catWomensSarees.id,
            images: {
                create: [
                    {
                        url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80",
                        altText: "Salem Temple Border Handloom Cotton Saree drape",
                        isPrimary: true,
                        displayOrder: 1,
                    },
                ],
            },
            variants: {
                create: [
                    { sku: "SLM-SAR-RAW", size: client_1.ClothingSize.FREE_SIZE, colorName: "Terracotta & Natural", colorHex: "#b3543b", price: 3490, mrp: 4500, stock: 10 },
                    { sku: "SLM-SAR-IND", size: client_1.ClothingSize.FREE_SIZE, colorName: "Indigo & Mustard", colorHex: "#1a2a4b", price: 3690, mrp: 4800, stock: 12 },
                ],
            },
        },
    });
    // Product 5: Hand-Spun Everyday Organic Pocket Tee (Under ₹1000 for 5% GST bracket demonstration)
    await prisma.product.create({
        data: {
            name: "Hand-Spun Organic Cotton Everyday Tee",
            slug: "handspun-organic-cotton-everyday-tee",
            description: "Ultra-soft, textured slub cotton t-shirt with a relaxed chest pocket. Priced under ₹1000 to highlight our direct-to-weaver fair pricing model.",
            craftStory: "Knit using organic solar-spun yarn from Wardha, dyed with natural tea extract and iron water.",
            fabricDetails: "100% Certified Organic Slub Cotton, 180 GSM.",
            careInstructions: "Machine wash cold with similar shades. Do not bleach.",
            hsnCode: "6109",
            gender: client_1.Gender.UNISEX,
            status: client_1.ProductStatus.PUBLISHED,
            isFeatured: false,
            categoryId: catUnisexOverlays.id,
            images: {
                create: [
                    {
                        url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80",
                        altText: "Handspun Organic Cotton Tee in Earth Sage",
                        isPrimary: true,
                        displayOrder: 1,
                    },
                ],
            },
            variants: {
                create: [
                    { sku: "TEE-SAG-S", size: client_1.ClothingSize.S, colorName: "Earth Sage", colorHex: "#8a9a86", price: 890, mrp: 1290, stock: 30 },
                    { sku: "TEE-SAG-M", size: client_1.ClothingSize.M, colorName: "Earth Sage", colorHex: "#8a9a86", price: 890, mrp: 1290, stock: 45 },
                    { sku: "TEE-SAG-L", size: client_1.ClothingSize.L, colorName: "Earth Sage", colorHex: "#8a9a86", price: 890, mrp: 1290, stock: 35 },
                    { sku: "TEE-SAG-XL", size: client_1.ClothingSize.XL, colorName: "Earth Sage", colorHex: "#8a9a86", price: 890, mrp: 1290, stock: 20 },
                ],
            },
        },
    });
    // 6. Seed Coupons
    console.log("Creating introductory coupons...");
    await prisma.coupon.create({
        data: {
            code: "WELCOME10",
            discountType: client_1.DiscountType.PERCENTAGE,
            discountValue: 10,
            minOrderAmount: 1000,
            maxDiscountAmount: 500,
            startDate: new Date(),
            endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
            usageLimit: 1000,
            isActive: true,
        },
    });
    await prisma.coupon.create({
        data: {
            code: "HANDLOOM500",
            discountType: client_1.DiscountType.FIXED,
            discountValue: 500,
            minOrderAmount: 2500,
            startDate: new Date(),
            endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
            usageLimit: 500,
            isActive: true,
        },
    });
    console.log("✅ Seed completed successfully!");
    console.log("------------------------------------------------");
    console.log("Demo credentials created:");
    console.log("👑 Admin:   admin@indigothread.in   / Indigo@123456");
    console.log("🏬 Manager: manager@indigothread.in / Indigo@123456");
    console.log("🎧 Support: support@indigothread.in / Indigo@123456");
    console.log("🛍️ Customer: ananya@example.com      / Indigo@123456");
    console.log("------------------------------------------------");
}
main()
    .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map
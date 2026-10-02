import { prisma } from "../../config/prisma";
import { ProductStatus, Gender, ClothingSize } from "@prisma/client";
import {
  ProductFilterQuery,
  ProductCreateInput,
  ProductUpdateInput,
} from "@indigo/shared";
import { RedisService } from "../../services/redis.service";

export class ProductService {
  static async listProducts(filters: ProductFilterQuery) {
    const cacheKey = `products:list:${Buffer.from(JSON.stringify(filters)).toString("base64")}`;
    const cached = await RedisService.get(cacheKey);
    if (cached) return cached;

    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {
      status: filters.status || ProductStatus.PUBLISHED,
    };

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
        { craftStory: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    if (filters.category) {
      where.category = {
        slug: filters.category,
      };
    }

    if (filters.gender) {
      where.gender = {
        in: [filters.gender as Gender, Gender.UNISEX],
      };
    }

    if (filters.size || filters.color || filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.variants = {
        some: {
          ...(filters.size ? { size: filters.size as ClothingSize } : {}),
          ...(filters.color ? { colorName: { contains: filters.color, mode: "insensitive" } } : {}),
          ...(filters.minPrice !== undefined || filters.maxPrice !== undefined
            ? {
                price: {
                  ...(filters.minPrice !== undefined ? { gte: filters.minPrice } : {}),
                  ...(filters.maxPrice !== undefined ? { lte: filters.maxPrice } : {}),
                },
              }
            : {}),
        },
      };
    }

    let orderBy: any = { createdAt: "desc" };
    if (filters.sortBy === "newest") {
      orderBy = { createdAt: "desc" };
    } else if (filters.sortBy === "name_asc") {
      orderBy = { name: "asc" };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
          images: {
            orderBy: { displayOrder: "asc" },
          },
          variants: {
            orderBy: { price: "asc" },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    // Handle price sorting in memory if requested across variants
    if (filters.sortBy === "price_asc") {
      products.sort((a, b) => (a.variants[0]?.price ?? 0) - (b.variants[0]?.price ?? 0));
    } else if (filters.sortBy === "price_desc") {
      products.sort((a, b) => (b.variants[0]?.price ?? 0) - (a.variants[0]?.price ?? 0));
    }

    const totalPages = Math.ceil(total / limit);

    const result = {
      products,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };

    await RedisService.set(cacheKey, result, 180); // 3 min TTL
    return result;
  }

  static async getProductBySlug(slug: string) {
    const cacheKey = `products:slug:${slug}`;
    const cached = await RedisService.get(cacheKey);
    if (cached) return cached;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: {
          orderBy: { displayOrder: "asc" },
        },
        variants: {
          orderBy: { price: "asc" },
        },
        reviews: {
          where: { status: "APPROVED" },
          include: {
            user: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!product) {
      throw { statusCode: 404, message: "Product not found" };
    }

    await RedisService.set(cacheKey, product, 300); // 5 min TTL
    return product;
  }

  static async getFeaturedProducts(limit = 8) {
    const cacheKey = `products:featured:${limit}`;
    const cached = await RedisService.get(cacheKey);
    if (cached) return cached;

    const products = await prisma.product.findMany({
      where: {
        isFeatured: true,
        status: ProductStatus.PUBLISHED,
      },
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { displayOrder: "asc" } },
        variants: { orderBy: { price: "asc" } },
      },
    });

    await RedisService.set(cacheKey, products, 300); // 5 min TTL
    return products;
  }

  static async getProductById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: { orderBy: { displayOrder: "asc" } },
        variants: true,
      },
    });

    if (!product) {
      throw { statusCode: 404, message: "Product not found" };
    }

    return product;
  }

  static async createProduct(input: ProductCreateInput) {
    const existing = await prisma.product.findUnique({
      where: { slug: input.slug },
    });

    if (existing) {
      throw { statusCode: 409, message: "Product slug already exists" };
    }

    const created = await prisma.product.create({
      data: {
        name: input.name,
        slug: input.slug,
        description: input.description,
        craftStory: input.craftStory,
        fabricDetails: input.fabricDetails,
        careInstructions: input.careInstructions,
        hsnCode: input.hsnCode,
        gender: input.gender as Gender,
        status: input.status as ProductStatus,
        isFeatured: input.isFeatured,
        categoryId: input.categoryId,
        images: {
          create: input.images.map((img, idx) => ({
            url: img.url,
            altText: img.altText || input.name,
            isPrimary: img.isPrimary ?? idx === 0,
            displayOrder: img.displayOrder ?? idx + 1,
          })),
        },
        variants: {
          create: input.variants.map((v) => ({
            sku: v.sku,
            size: v.size as ClothingSize,
            colorName: v.colorName,
            colorHex: v.colorHex,
            price: v.price,
            mrp: v.mrp,
            stock: v.stock,
            barcode: v.barcode,
          })),
        },
      },
      include: {
        images: true,
        variants: true,
        category: true,
      },
    });

    await RedisService.invalidatePattern("products:*");
    await RedisService.invalidatePattern("search:*");
    return created;
  }

  static async updateProduct(id: string, input: Partial<ProductUpdateInput>) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw { statusCode: 404, message: "Product not found" };
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(input.name ? { name: input.name } : {}),
        ...(input.slug ? { slug: input.slug } : {}),
        ...(input.description ? { description: input.description } : {}),
        ...(input.craftStory !== undefined ? { craftStory: input.craftStory } : {}),
        ...(input.fabricDetails !== undefined ? { fabricDetails: input.fabricDetails } : {}),
        ...(input.careInstructions !== undefined ? { careInstructions: input.careInstructions } : {}),
        ...(input.gender ? { gender: input.gender as Gender } : {}),
        ...(input.status ? { status: input.status as ProductStatus } : {}),
        ...(input.isFeatured !== undefined ? { isFeatured: input.isFeatured } : {}),
        ...(input.categoryId ? { categoryId: input.categoryId } : {}),
      },
      include: {
        images: true,
        variants: true,
        category: true,
      },
    });

    await RedisService.invalidatePattern("products:*");
    await RedisService.invalidatePattern("search:*");
    return updated;
  }

  static async deleteProduct(id: string) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw { statusCode: 404, message: "Product not found" };
    }

    await prisma.product.delete({ where: { id } });
    await RedisService.invalidatePattern("products:*");
    await RedisService.invalidatePattern("search:*");
    return true;
  }
}

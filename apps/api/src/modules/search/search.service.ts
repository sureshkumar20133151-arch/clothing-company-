import { prisma } from "../../config/prisma";
import { RedisService } from "../../services/redis.service";
import { ProductStatus, Gender, ClothingSize } from "@prisma/client";
import { SearchSuggestionDTO } from "@indigo/shared";

export interface SearchQueryOptions {
  q?: string;
  category?: string;
  gender?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  colour?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export class SearchService {
  /**
   * Live suggestions for autocomplete dropdown (up to 8 items, cached 60s in Redis)
   */
  static async getSuggestions(rawQuery: string): Promise<SearchSuggestionDTO[]> {
    const q = (rawQuery || "").trim().toLowerCase();
    if (!q) return [];

    const cacheKey = `search:suggestions:${q}`;
    const cached = await RedisService.get<SearchSuggestionDTO[]>(cacheKey);
    if (cached) return cached;

    let products: any[] = [];
    try {
      products = await prisma.product.findMany({
        where: {
          status: ProductStatus.PUBLISHED,
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { craftStory: { contains: q, mode: "insensitive" } },
            { tags: { has: q } },
            { category: { name: { contains: q, mode: "insensitive" } } },
          ],
        },
        take: 8,
        orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
        select: {
          id: true,
          name: true,
          slug: true,
          category: { select: { name: true } },
          images: {
            where: { isPrimary: true },
            take: 1,
            select: { url: true },
          },
          variants: {
            orderBy: { price: "asc" },
            take: 1,
            select: { price: true },
          },
        },
      });
    } catch (err: any) {
      if (err.name === "PrismaClientInitializationError" || err.message?.includes("Can't reach database")) {
        return [];
      }
      throw err;
    }

    const suggestions: SearchSuggestionDTO[] = products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      thumbnail: p.images[0]?.url || "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80",
      price: p.variants[0]?.price || 0,
      categoryName: p.category?.name,
    }));

    await RedisService.set(cacheKey, suggestions, 60); // 60s TTL
    return suggestions;
  }

  /**
   * Full search combining text relevance + filters + sorting + pagination
   */
  static async searchProducts(options: SearchQueryOptions) {
    const q = (options.q || "").trim();
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(options.limit) || 20));
    const skip = (page - 1) * limit;

    const cacheKey = `search:query:${Buffer.from(JSON.stringify({ ...options, page, limit })).toString("base64")}`;
    const cached = await RedisService.get(cacheKey);
    if (cached) return cached;

    const where: any = {
      status: ProductStatus.PUBLISHED,
    };

    // Text Search Condition
    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { craftStory: { contains: q, mode: "insensitive" } },
        { tags: { has: q.toLowerCase() } },
        { category: { name: { contains: q, mode: "insensitive" } } },
      ];
    }

    // Category filter
    if (options.category) {
      where.category = { slug: options.category };
    }

    // Gender filter
    if (options.gender && ["MEN", "WOMEN", "UNISEX"].includes(options.gender.toUpperCase())) {
      where.OR = [
        ...(where.OR || []),
        { gender: options.gender.toUpperCase() as Gender },
        { gender: "UNISEX" },
      ];
    }

    // Variant filters (Size, Colour, Price)
    const variantWhere: any = {};
    if (options.size) {
      variantWhere.size = options.size as ClothingSize;
    }
    if (options.colour) {
      variantWhere.colorName = { contains: options.colour, mode: "insensitive" };
    }
    if (options.minPrice !== undefined || options.maxPrice !== undefined) {
      variantWhere.price = {
        ...(options.minPrice !== undefined ? { gte: Number(options.minPrice) } : {}),
        ...(options.maxPrice !== undefined ? { lte: Number(options.maxPrice) } : {}),
      };
    }

    if (Object.keys(variantWhere).length > 0) {
      where.variants = { some: variantWhere };
    }

    // Sorting
    let orderBy: any = [{ isFeatured: "desc" }, { createdAt: "desc" }];
    if (options.sort === "price_asc") {
      orderBy = [{ variants: { _count: "asc" } }]; // Will also refine with in-memory sort
    } else if (options.sort === "newest") {
      orderBy = [{ isFeatured: "desc" }, { createdAt: "desc" }];
    } else if (options.sort === "rating") {
      orderBy = [{ averageRating: "desc" }, { reviewCount: "desc" }];
    }

    let products: any[] = [];
    let total = 0;
    try {
      const [fetchedProducts, fetchedTotal] = await Promise.all([
        prisma.product.findMany({
          where,
          skip,
          take: limit,
          orderBy,
          include: {
            category: { select: { id: true, name: true, slug: true } },
            images: { orderBy: { displayOrder: "asc" } },
            variants: { orderBy: { price: "asc" } },
          },
        }),
        prisma.product.count({ where }),
      ]);
      products = fetchedProducts;
      total = fetchedTotal;
    } catch (err: any) {
      if (err.name === "PrismaClientInitializationError" || err.message?.includes("Can't reach database")) {
        return {
          query: q,
          products: [],
          meta: {
            page,
            limit,
            total: 0,
            totalPages: 0,
          },
        };
      }
      throw err;
    }

    // Secondary relevance sort when text search query is active
    if (q) {
      const lowerQ = q.toLowerCase();
      products.sort((a, b) => {
        // Boost exact matches in title
        const aNameMatch = a.name.toLowerCase().includes(lowerQ) ? 10 : 0;
        const bNameMatch = b.name.toLowerCase().includes(lowerQ) ? 10 : 0;
        const aFeatured = a.isFeatured ? 5 : 0;
        const bFeatured = b.isFeatured ? 5 : 0;
        return (bNameMatch + bFeatured) - (aNameMatch + aFeatured);
      });
    }

    // Secondary price sort if requested
    if (options.sort === "price_asc") {
      products.sort((a, b) => (a.variants[0]?.price || 0) - (b.variants[0]?.price || 0));
    } else if (options.sort === "price_desc") {
      products.sort((a, b) => (b.variants[0]?.price || 0) - (a.variants[0]?.price || 0));
    }

    const totalPages = Math.ceil(total / limit);
    const result = {
      query: q,
      products,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };

    await RedisService.set(cacheKey, result, 180); // 3m TTL
    return result;
  }
}

import { prisma } from "../../config/prisma";
import { CategoryInput, Gender } from "@indigo/shared";

export class CategoryService {
  static async listCategories(gender?: string) {
    const where: any = { isActive: true };
    if (gender && ["MEN", "WOMEN", "UNISEX"].includes(gender.toUpperCase())) {
      where.OR = [
        { gender: gender.toUpperCase() as Gender },
        { gender: "UNISEX" },
      ];
    }

    return prisma.category.findMany({
      where,
      orderBy: { displayOrder: "asc" },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  }

  static async getBySlug(slug: string) {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        children: true,
      },
    });

    if (!category) {
      throw { statusCode: 404, message: "Category not found" };
    }

    return category;
  }

  static async createCategory(input: CategoryInput) {
    const existing = await prisma.category.findUnique({
      where: { slug: input.slug },
    });

    if (existing) {
      throw { statusCode: 409, message: "Category slug already exists" };
    }

    return prisma.category.create({
      data: {
        name: input.name,
        slug: input.slug,
        description: input.description,
        image: input.image,
        gender: input.gender as Gender,
        parentId: input.parentId,
        isActive: input.isActive,
      },
    });
  }
}

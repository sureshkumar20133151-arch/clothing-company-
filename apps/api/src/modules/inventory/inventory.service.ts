import { prisma } from "../../config/prisma";

export class InventoryService {
  static async listInventory(threshold = 10) {
    const variants = await prisma.productVariant.findMany({
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            status: true,
            category: { select: { id: true, name: true } },
            images: { where: { isPrimary: true }, take: 1 },
          },
        },
      },
      orderBy: [{ stock: "asc" }, { updatedAt: "desc" }],
    });

    const lowStockCount = variants.filter((v) => v.stock <= 5).length;
    const outOfStockCount = variants.filter((v) => v.stock === 0).length;

    return {
      variants,
      summary: {
        totalVariants: variants.length,
        lowStockCount,
        outOfStockCount,
        threshold,
      },
    };
  }

  static async updateStock(variantId: string, stock: number) {
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant) {
      throw { statusCode: 404, message: "Variant not found" };
    }

    return prisma.productVariant.update({
      where: { id: variantId },
      data: { stock: Math.max(0, stock) },
      include: { product: true },
    });
  }

  static async adjustStock(variantId: string, delta: number) {
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant) {
      throw { statusCode: 404, message: "Variant not found" };
    }

    const newStock = Math.max(0, variant.stock + delta);

    return prisma.productVariant.update({
      where: { id: variantId },
      data: { stock: newStock },
      include: { product: true },
    });
  }
}

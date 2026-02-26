import { prisma } from "../../lib/prisma";

const createCategory = async (name: string) => {
  const res = await prisma.category.create({
    data: { name: name.trim().toLowerCase() },
  });

  return res;
};

export const categoryService = {
  createCategory,
};

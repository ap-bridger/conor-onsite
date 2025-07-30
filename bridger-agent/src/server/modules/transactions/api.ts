import { prisma } from "@/lib/db";

export const transactions = async (_: any, { status }: { status: string }) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        status: status,
      },
      orderBy: {
        date: 'desc',
      },
    });
    
    return transactions;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw new Error('Failed to fetch transactions');
  }
};

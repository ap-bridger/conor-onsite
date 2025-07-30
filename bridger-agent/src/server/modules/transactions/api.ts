import { prisma } from "@/lib/db";

export const transactions = async (_: any, { status }: { status: string }) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        status: status,
      },
      orderBy: {
        date: "desc",
      },
    });

    return transactions;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw new Error("Failed to fetch transactions");
  }
};

export const updateTransactionVendor = async (
  _: any,
  { id, vendor }: { id: string; vendor: string }
) => {
  try {
    const transaction = await prisma.transaction.update({
      where: { id },
      data: { vendor },
    });

    return {
      success: true,
      message: "Vendor updated successfully",
      transaction,
    };
  } catch (error) {
    console.error("Error updating transaction vendor:", error);
    return {
      success: false,
      message: "Failed to update vendor",
      transaction: null,
    };
  }
};

export const updateTransactionCategory = async (
  _: any,
  { id, category }: { id: string; category: string }
) => {
  try {
    const transaction = await prisma.transaction.update({
      where: { id },
      data: { category },
    });

    return {
      success: true,
      message: "Category updated successfully",
      transaction,
    };
  } catch (error) {
    console.error("Error updating transaction category:", error);
    return {
      success: false,
      message: "Failed to update category",
      transaction: null,
    };
  }
};

export const updateTransactionStatus = async (
  _: any,
  { id, status }: { id: string; status: string }
) => {
  try {
    // Validate status value
    const validStatuses = [
      "NEEDS_TO_BE_SENT_TO_CLIENT",
      "APPROVED",
      "EXCLUDED",
      "AUTOCATEGORIZED",
      "SENT_TO_CLIENT",
    ];

    if (!validStatuses.includes(status)) {
      return {
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        transaction: null,
      };
    }

    const transaction = await prisma.transaction.update({
      where: { id },
      data: { status },
    });

    return {
      success: true,
      message: "Status updated successfully",
      transaction,
    };
  } catch (error) {
    console.error("Error updating transaction status:", error);
    return {
      success: false,
      message: "Failed to update status",
      transaction: null,
    };
  }
};

export const sendInfoRequest = async (_: any, { ids }: { ids: string[] }) => {
  const transactions = await prisma.transaction.findMany({
    where: {
      id: {
        in: ids,
      },
    },
  });

  for (const transaction of transactions) {
    if (transaction.status != "NEEDS_TO_BE_SENT_TO_CLIENT") {
      throw new Error(`Invalid status ${transaction.status}`);
    }
  }
  await prisma.transaction.updateMany({
    where: {
      id: {
        in: transactions.map((t) => t.id),
      },
    },
    data: {
      status: "SENT_TO_CLIENT",
    },
  });
  // Re-query because prisma does not natively support returning items from an updateMany query
  const results = await prisma.transaction.findMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
  return results;
};

// Get unique vendors from database
export const getUniqueVendors = async () => {
  try {
    const vendors = await prisma.transaction.findMany({
      select: { vendor: true },
      distinct: ['vendor'],
      orderBy: { vendor: 'asc' }
    });
    return vendors.map(v => v.vendor);
  } catch (error) {
    console.error('Error fetching unique vendors:', error);
    throw new Error('Failed to fetch unique vendors');
  }
};

// Get unique categories from database
export const getUniqueCategories = async () => {
  try {
    const categories = await prisma.transaction.findMany({
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' }
    });
    return categories.map(c => c.category);
  } catch (error) {
    console.error('Error fetching unique categories:', error);
    throw new Error('Failed to fetch unique categories');
  }
};

export const updateTransactionMemo = async (_: any, { id, memo }: { id: string; memo: string | null }) => {
  try {
    const transaction = await prisma.transaction.update({
      where: { id },
      data: { memo },
    });
    
    return {
      success: true,
      message: 'Memo updated successfully',
      transaction,
    };
  } catch (error) {
    console.error('Error updating transaction memo:', error);
    return {
      success: false,
      message: 'Failed to update memo',
      transaction: null,
    };
  }
};

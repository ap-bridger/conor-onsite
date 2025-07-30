export const transactions = async (_: any, { state }: { state: string }) => {
  return [
    {
      id: "1",
      date: "2025-01-01",
      amountCents: 1,
      status: "AUTOCATEGORIZED",
      description: "Some description",
      memo: null,
      category: "Meals",
      vendor: "Sweetgreen",
    },
  ];
};

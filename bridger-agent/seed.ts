import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing transactions
  await prisma.transaction.deleteMany();

  // Create sample transactions
  const transactions = [
    {
      date: new Date('2025-01-15'),
      description: 'Coffee at Starbucks',
      vendor: 'Starbucks',
      category: 'Food & Drink',
      amountCents: 450,
      status: 'NEEDS_TO_BE_SENT_TO_CLIENT',
      memo: 'Morning coffee run'
    },
    {
      date: new Date('2025-01-14'),
      description: 'Grocery shopping',
      vendor: 'Whole Foods',
      category: 'Groceries',
      amountCents: 12500,
      status: 'APPROVED',
      memo: 'Weekly groceries'
    },
    {
      date: new Date('2025-01-13'),
      description: 'Gas station',
      vendor: 'Shell',
      category: 'Transportation',
      amountCents: 3500,
      status: 'NEEDS_TO_BE_SENT_TO_CLIENT',
      memo: 'Fill up tank'
    },
    {
      date: new Date('2025-01-12'),
      description: 'Amazon purchase',
      vendor: 'Amazon',
      category: 'Shopping',
      amountCents: 8900,
      status: 'AUTOCATEGORIZED',
      memo: 'Books and electronics'
    },
    {
      date: new Date('2025-01-11'),
      description: 'Restaurant dinner',
      vendor: 'Local Bistro',
      category: 'Food & Drink',
      amountCents: 6500,
      status: 'EXCLUDED',
      memo: 'Date night dinner'
    },
    {
      date: new Date('2025-01-10'),
      description: 'Office supplies',
      vendor: 'Staples',
      category: 'Office',
      amountCents: 1200,
      status: 'SENT_TO_CLIENT',
      memo: 'Printer paper and pens'
    },
    {
      date: new Date('2025-01-09'),
      description: 'Uber ride',
      vendor: 'Uber',
      category: 'Transportation',
      amountCents: 2800,
      status: 'NEEDS_TO_BE_SENT_TO_CLIENT',
      memo: 'Airport pickup'
    },
    {
      date: new Date('2025-01-08'),
      description: 'Netflix subscription',
      vendor: 'Netflix',
      category: 'Entertainment',
      amountCents: 1599,
      status: 'APPROVED',
      memo: 'Monthly subscription'
    },
    {
      date: new Date('2025-01-07'),
      description: 'Gym membership',
      vendor: 'Planet Fitness',
      category: 'Health & Fitness',
      amountCents: 1000,
      status: 'AUTOCATEGORIZED',
      memo: 'Monthly membership fee'
    },
    {
      date: new Date('2025-01-06'),
      description: 'Phone bill',
      vendor: 'Verizon',
      category: 'Utilities',
      amountCents: 8500,
      status: 'SENT_TO_CLIENT',
      memo: 'Monthly phone service'
    },
    {
      date: new Date('2025-01-05'),
      description: 'Lunch at Chipotle',
      vendor: 'Chipotle',
      category: 'Food & Drink',
      amountCents: 1200,
      status: 'EXCLUDED',
      memo: 'Personal lunch expense'
    },
    {
      date: new Date('2025-01-04'),
      description: 'Office chair',
      vendor: 'IKEA',
      category: 'Office',
      amountCents: 25000,
      status: 'NEEDS_TO_BE_SENT_TO_CLIENT',
      memo: 'New ergonomic chair for home office'
    },
    {
      date: new Date('2025-01-03'),
      description: 'Spotify Premium',
      vendor: 'Spotify',
      category: 'Entertainment',
      amountCents: 999,
      status: 'APPROVED',
      memo: 'Monthly music subscription'
    },
    {
      date: new Date('2025-01-02'),
      description: 'Gas station',
      vendor: 'Exxon',
      category: 'Transportation',
      amountCents: 4200,
      status: 'AUTOCATEGORIZED',
      memo: 'Fill up tank'
    },
    {
      date: new Date('2025-01-01'),
      description: 'New Year dinner',
      vendor: 'Fancy Restaurant',
      category: 'Food & Drink',
      amountCents: 15000,
      status: 'EXCLUDED',
      memo: 'Personal celebration dinner'
    },
    {
      date: new Date('2024-12-31'),
      description: 'Amazon Web Services',
      vendor: 'AWS',
      category: 'Technology',
      amountCents: 4500,
      status: 'SENT_TO_CLIENT',
      memo: 'Cloud hosting services'
    },
    {
      date: new Date('2024-12-30'),
      description: 'Coffee shop',
      vendor: 'Blue Bottle Coffee',
      category: 'Food & Drink',
      amountCents: 650,
      status: 'NEEDS_TO_BE_SENT_TO_CLIENT',
      memo: 'Client meeting coffee'
    },
    {
      date: new Date('2024-12-29'),
      description: 'Office supplies',
      vendor: 'Office Depot',
      category: 'Office',
      amountCents: 3500,
      status: 'APPROVED',
      memo: 'Printer ink and paper'
    },
    {
      date: new Date('2024-12-28'),
      description: 'Train ticket',
      vendor: 'Amtrak',
      category: 'Transportation',
      amountCents: 8500,
      status: 'AUTOCATEGORIZED',
      memo: 'Business trip to NYC'
    },
    {
      date: new Date('2024-12-27'),
      description: 'Software license',
      vendor: 'Adobe',
      category: 'Technology',
      amountCents: 5299,
      status: 'SENT_TO_CLIENT',
      memo: 'Creative Suite subscription'
    },
    {
      date: new Date('2024-12-26'),
      description: 'Post-Christmas shopping',
      vendor: 'Target',
      category: 'Shopping',
      amountCents: 8900,
      status: 'EXCLUDED',
      memo: 'Personal shopping'
    }
  ];

  for (const transaction of transactions) {
    await prisma.transaction.create({
      data: transaction
    });
  }

  console.log('Sample transactions created successfully!');
  
  // Count total transactions
  const totalCount = await prisma.transaction.count();
  console.log(`Total transactions in database: ${totalCount}`);
  
  // Show count by status
  const statusCounts = await prisma.transaction.groupBy({
    by: ['status'],
    _count: {
      status: true
    }
  });
  
  console.log('\nTransactions by status:');
  statusCounts.forEach(({ status, _count }) => {
    console.log(`${status}: ${_count.status}`);
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
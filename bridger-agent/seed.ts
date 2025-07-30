import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing transactions
  await prisma.transaction.deleteMany();

  // Create sample transactions
  const transactions = [
    // UNCATEGORIZED transactions (15)
    {
      date: new Date('2025-01-15'),
      description: 'Mystery charge from unknown vendor',
      vendor: 'UNKNOWN_VENDOR_001',
      category: '',
      amountCents: 2500,
      status: 'UNCATEGORIZED',
      memo: 'Need to investigate this charge'
    },
    {
      date: new Date('2025-01-14'),
      description: 'Online payment - unclear purpose',
      vendor: 'PAYMENT_PROCESSOR_XYZ',
      category: '',
      amountCents: 7500,
      status: 'UNCATEGORIZED',
      memo: 'Unclear what this payment was for'
    },
    {
      date: new Date('2025-01-13'),
      description: 'Bank transfer to unknown account',
      vendor: 'BANK_TRANSFER_123',
      category: '',
      amountCents: 15000,
      status: 'UNCATEGORIZED',
      memo: 'Need to verify recipient'
    },
    {
      date: new Date('2025-01-12'),
      description: 'Subscription renewal - unclear service',
      vendor: 'SUBSCRIPTION_SERVICE',
      category: '',
      amountCents: 2999,
      status: 'UNCATEGORIZED',
      memo: 'Which service is this for?'
    },
    {
      date: new Date('2025-01-11'),
      description: 'ATM withdrawal - location unclear',
      vendor: 'ATM_WITHDRAWAL',
      category: '',
      amountCents: 5000,
      status: 'UNCATEGORIZED',
      memo: 'Need to check ATM location'
    },
    {
      date: new Date('2025-01-10'),
      description: 'Online purchase - vendor not recognized',
      vendor: 'ONLINE_STORE_456',
      category: '',
      amountCents: 8900,
      status: 'UNCATEGORIZED',
      memo: 'What was purchased?'
    },
    {
      date: new Date('2025-01-09'),
      description: 'Service charge - unclear purpose',
      vendor: 'SERVICE_PROVIDER',
      category: '',
      amountCents: 1200,
      status: 'UNCATEGORIZED',
      memo: 'Need to identify service'
    },
    {
      date: new Date('2025-01-08'),
      description: 'Payment to unknown merchant',
      vendor: 'MERCHANT_789',
      category: '',
      amountCents: 3500,
      status: 'UNCATEGORIZED',
      memo: 'Verify merchant details'
    },
    {
      date: new Date('2025-01-07'),
      description: 'Recurring charge - unclear service',
      vendor: 'RECURRING_SERVICE',
      category: '',
      amountCents: 1999,
      status: 'UNCATEGORIZED',
      memo: 'Which recurring service?'
    },
    {
      date: new Date('2025-01-06'),
      description: 'Mobile payment - vendor unclear',
      vendor: 'MOBILE_PAYMENT',
      category: '',
      amountCents: 4500,
      status: 'UNCATEGORIZED',
      memo: 'Need to identify vendor'
    },
    {
      date: new Date('2025-01-05'),
      description: 'Online transaction - purpose unclear',
      vendor: 'ONLINE_TRANSACTION',
      category: '',
      amountCents: 6800,
      status: 'UNCATEGORIZED',
      memo: 'What was this transaction for?'
    },
    {
      date: new Date('2025-01-04'),
      description: 'Service fee - unclear service',
      vendor: 'SERVICE_FEE',
      category: '',
      amountCents: 2500,
      status: 'UNCATEGORIZED',
      memo: 'Need to identify service'
    },
    {
      date: new Date('2025-01-03'),
      description: 'Payment to unknown recipient',
      vendor: 'UNKNOWN_RECIPIENT',
      category: '',
      amountCents: 12000,
      status: 'UNCATEGORIZED',
      memo: 'Verify recipient details'
    },
    {
      date: new Date('2025-01-02'),
      description: 'Charge from unrecognized vendor',
      vendor: 'UNRECOGNIZED_VENDOR',
      category: '',
      amountCents: 3900,
      status: 'UNCATEGORIZED',
      memo: 'Need to investigate vendor'
    },
    {
      date: new Date('2025-01-01'),
      description: 'Mystery transaction',
      vendor: 'MYSTERY_TRANSACTION',
      category: '',
      amountCents: 1800,
      status: 'UNCATEGORIZED',
      memo: 'Complete mystery - need investigation'
    },

    // AUTOCATEGORIZED transactions (15)
    {
      date: new Date('2025-01-15'),
      description: 'Coffee at Starbucks',
      vendor: 'Starbucks',
      category: 'Food & Drink',
      amountCents: 450,
      status: 'AUTOCATEGORIZED',
      memo: 'Morning coffee run'
    },
    {
      date: new Date('2025-01-14'),
      description: 'Amazon purchase',
      vendor: 'Amazon',
      category: 'Shopping',
      amountCents: 8900,
      status: 'AUTOCATEGORIZED',
      memo: 'Books and electronics'
    },
    {
      date: new Date('2025-01-13'),
      description: 'Gas station',
      vendor: 'Shell',
      category: 'Transportation',
      amountCents: 3500,
      status: 'AUTOCATEGORIZED',
      memo: 'Fill up tank'
    },
    {
      date: new Date('2025-01-12'),
      description: 'Gym membership',
      vendor: 'Planet Fitness',
      category: 'Health & Fitness',
      amountCents: 1000,
      status: 'AUTOCATEGORIZED',
      memo: 'Monthly membership fee'
    },
    {
      date: new Date('2025-01-11'),
      description: 'Gas station',
      vendor: 'Exxon',
      category: 'Transportation',
      amountCents: 4200,
      status: 'AUTOCATEGORIZED',
      memo: 'Fill up tank'
    },
    {
      date: new Date('2025-01-10'),
      description: 'Train ticket',
      vendor: 'Amtrak',
      category: 'Transportation',
      amountCents: 8500,
      status: 'AUTOCATEGORIZED',
      memo: 'Business trip to NYC'
    },
    {
      date: new Date('2025-01-09'),
      description: 'Uber ride',
      vendor: 'Uber',
      category: 'Transportation',
      amountCents: 2800,
      status: 'AUTOCATEGORIZED',
      memo: 'Airport pickup'
    },
    {
      date: new Date('2025-01-08'),
      description: 'Lyft ride',
      vendor: 'Lyft',
      category: 'Transportation',
      amountCents: 3200,
      status: 'AUTOCATEGORIZED',
      memo: 'Downtown meeting'
    },
    {
      date: new Date('2025-01-07'),
      description: 'Target purchase',
      vendor: 'Target',
      category: 'Shopping',
      amountCents: 6500,
      status: 'AUTOCATEGORIZED',
      memo: 'Household supplies'
    },
    {
      date: new Date('2025-01-06'),
      description: 'Walmart purchase',
      vendor: 'Walmart',
      category: 'Shopping',
      amountCents: 4500,
      status: 'AUTOCATEGORIZED',
      memo: 'Groceries and household items'
    },
    {
      date: new Date('2025-01-05'),
      description: 'McDonald\'s',
      vendor: 'McDonald\'s',
      category: 'Food & Drink',
      amountCents: 850,
      status: 'AUTOCATEGORIZED',
      memo: 'Quick lunch'
    },
    {
      date: new Date('2025-01-04'),
      description: 'Subway sandwich',
      vendor: 'Subway',
      category: 'Food & Drink',
      amountCents: 1200,
      status: 'AUTOCATEGORIZED',
      memo: 'Lunch meeting'
    },
    {
      date: new Date('2025-01-03'),
      description: 'CVS Pharmacy',
      vendor: 'CVS',
      category: 'Health & Fitness',
      amountCents: 2500,
      status: 'AUTOCATEGORIZED',
      memo: 'Prescription and over-the-counter'
    },
    {
      date: new Date('2025-01-02'),
      description: 'Walgreens',
      vendor: 'Walgreens',
      category: 'Health & Fitness',
      amountCents: 1800,
      status: 'AUTOCATEGORIZED',
      memo: 'Pharmacy items'
    },
    {
      date: new Date('2025-01-01'),
      description: 'Dunkin\' Donuts',
      vendor: 'Dunkin\' Donuts',
      category: 'Food & Drink',
      amountCents: 650,
      status: 'AUTOCATEGORIZED',
      memo: 'Coffee and donut'
    },

    // NEEDS_TO_BE_SENT_TO_CLIENT transactions (15)
    {
      date: new Date('2025-01-15'),
      description: 'Office chair',
      vendor: 'IKEA',
      category: 'Office',
      amountCents: 25000,
      status: 'NEEDS_TO_BE_SENT_TO_CLIENT',
      memo: 'New ergonomic chair for home office'
    },
    {
      date: new Date('2025-01-14'),
      description: 'Coffee shop',
      vendor: 'Blue Bottle Coffee',
      category: 'Food & Drink',
      amountCents: 650,
      status: 'NEEDS_TO_BE_SENT_TO_CLIENT',
      memo: 'Client meeting coffee'
    },
    {
      date: new Date('2025-01-13'),
      description: 'Business lunch',
      vendor: 'Local Bistro',
      category: 'Food & Drink',
      amountCents: 8500,
      status: 'NEEDS_TO_BE_SENT_TO_CLIENT',
      memo: 'Client lunch meeting'
    },
    {
      date: new Date('2025-01-12'),
      description: 'Conference registration',
      vendor: 'Tech Conference Inc',
      category: 'Professional Development',
      amountCents: 15000,
      status: 'NEEDS_TO_BE_SENT_TO_CLIENT',
      memo: 'Annual tech conference'
    },
    {
      date: new Date('2025-01-11'),
      description: 'Software license',
      vendor: 'Microsoft',
      category: 'Technology',
      amountCents: 8999,
      status: 'NEEDS_TO_BE_SENT_TO_CLIENT',
      memo: 'Office 365 business subscription'
    },
    {
      date: new Date('2025-01-10'),
      description: 'Business dinner',
      vendor: 'Steakhouse',
      category: 'Food & Drink',
      amountCents: 12000,
      status: 'NEEDS_TO_BE_SENT_TO_CLIENT',
      memo: 'Client dinner meeting'
    },
    {
      date: new Date('2025-01-09'),
      description: 'Hotel booking',
      vendor: 'Marriott',
      category: 'Travel',
      amountCents: 25000,
      status: 'NEEDS_TO_BE_SENT_TO_CLIENT',
      memo: 'Business trip accommodation'
    },
    {
      date: new Date('2025-01-08'),
      description: 'Flight booking',
      vendor: 'Delta Airlines',
      category: 'Travel',
      amountCents: 45000,
      status: 'NEEDS_TO_BE_SENT_TO_CLIENT',
      memo: 'Business trip flight'
    },
    {
      date: new Date('2025-01-07'),
      description: 'Office supplies',
      vendor: 'Staples',
      category: 'Office',
      amountCents: 3500,
      status: 'NEEDS_TO_BE_SENT_TO_CLIENT',
      memo: 'Printer ink and paper'
    },
    {
      date: new Date('2025-01-06'),
      description: 'Business lunch',
      vendor: 'Panera Bread',
      category: 'Food & Drink',
      amountCents: 2800,
      status: 'NEEDS_TO_BE_SENT_TO_CLIENT',
      memo: 'Team lunch meeting'
    },
    {
      date: new Date('2025-01-05'),
      description: 'Software subscription',
      vendor: 'Slack',
      category: 'Technology',
      amountCents: 7999,
      status: 'NEEDS_TO_BE_SENT_TO_CLIENT',
      memo: 'Team communication tool'
    },
    {
      date: new Date('2025-01-04'),
      description: 'Business dinner',
      vendor: 'Italian Restaurant',
      category: 'Food & Drink',
      amountCents: 9500,
      status: 'NEEDS_TO_BE_SENT_TO_CLIENT',
      memo: 'Client dinner'
    },
    {
      date: new Date('2025-01-03'),
      description: 'Conference ticket',
      vendor: 'Design Conference',
      category: 'Professional Development',
      amountCents: 12000,
      status: 'NEEDS_TO_BE_SENT_TO_CLIENT',
      memo: 'Annual design conference'
    },
    {
      date: new Date('2025-01-02'),
      description: 'Business lunch',
      vendor: 'Chipotle',
      category: 'Food & Drink',
      amountCents: 1800,
      status: 'NEEDS_TO_BE_SENT_TO_CLIENT',
      memo: 'Client lunch'
    },
    {
      date: new Date('2025-01-01'),
      description: 'Software license',
      vendor: 'Adobe',
      category: 'Technology',
      amountCents: 5299,
      status: 'NEEDS_TO_BE_SENT_TO_CLIENT',
      memo: 'Creative Suite subscription'
    },

    // SENT_TO_CLIENT transactions (10)
    {
      date: new Date('2025-01-15'),
      description: 'Office supplies',
      vendor: 'Staples',
      category: 'Office',
      amountCents: 1200,
      status: 'SENT_TO_CLIENT',
      memo: 'Printer paper and pens'
    },
    {
      date: new Date('2025-01-14'),
      description: 'Phone bill',
      vendor: 'Verizon',
      category: 'Utilities',
      amountCents: 8500,
      status: 'SENT_TO_CLIENT',
      memo: 'Monthly phone service'
    },
    {
      date: new Date('2025-01-13'),
      description: 'Amazon Web Services',
      vendor: 'AWS',
      category: 'Technology',
      amountCents: 4500,
      status: 'SENT_TO_CLIENT',
      memo: 'Cloud hosting services'
    },
    {
      date: new Date('2025-01-12'),
      description: 'Software license',
      vendor: 'Adobe',
      category: 'Technology',
      amountCents: 5299,
      status: 'SENT_TO_CLIENT',
      memo: 'Creative Suite subscription'
    },
    {
      date: new Date('2025-01-11'),
      description: 'Business lunch',
      vendor: 'Local Restaurant',
      category: 'Food & Drink',
      amountCents: 6500,
      status: 'SENT_TO_CLIENT',
      memo: 'Client meeting lunch'
    },
    {
      date: new Date('2025-01-10'),
      description: 'Office furniture',
      vendor: 'Office Depot',
      category: 'Office',
      amountCents: 18000,
      status: 'SENT_TO_CLIENT',
      memo: 'New desk and chair'
    },
    {
      date: new Date('2025-01-09'),
      description: 'Business dinner',
      vendor: 'Steakhouse',
      category: 'Food & Drink',
      amountCents: 15000,
      status: 'SENT_TO_CLIENT',
      memo: 'Client dinner meeting'
    },
    {
      date: new Date('2025-01-08'),
      description: 'Software subscription',
      vendor: 'Zoom',
      category: 'Technology',
      amountCents: 1499,
      status: 'SENT_TO_CLIENT',
      memo: 'Video conferencing tool'
    },
    {
      date: new Date('2025-01-07'),
      description: 'Business lunch',
      vendor: 'Panera Bread',
      category: 'Food & Drink',
      amountCents: 3200,
      status: 'SENT_TO_CLIENT',
      memo: 'Team lunch meeting'
    },
    {
      date: new Date('2025-01-06'),
      description: 'Office supplies',
      vendor: 'Office Depot',
      category: 'Office',
      amountCents: 2800,
      status: 'SENT_TO_CLIENT',
      memo: 'Printer ink and paper'
    },

    // APPROVED transactions (10)
    {
      date: new Date('2025-01-15'),
      description: 'Grocery shopping',
      vendor: 'Whole Foods',
      category: 'Groceries',
      amountCents: 12500,
      status: 'APPROVED',
      memo: 'Weekly groceries'
    },
    {
      date: new Date('2025-01-14'),
      description: 'Netflix subscription',
      vendor: 'Netflix',
      category: 'Entertainment',
      amountCents: 1599,
      status: 'APPROVED',
      memo: 'Monthly subscription'
    },
    {
      date: new Date('2025-01-13'),
      description: 'Spotify Premium',
      vendor: 'Spotify',
      category: 'Entertainment',
      amountCents: 999,
      status: 'APPROVED',
      memo: 'Monthly music subscription'
    },
    {
      date: new Date('2025-01-12'),
      description: 'Office supplies',
      vendor: 'Office Depot',
      category: 'Office',
      amountCents: 3500,
      status: 'APPROVED',
      memo: 'Printer ink and paper'
    },
    {
      date: new Date('2025-01-11'),
      description: 'Electricity bill',
      vendor: 'Power Company',
      category: 'Utilities',
      amountCents: 9500,
      status: 'APPROVED',
      memo: 'Monthly electricity'
    },
    {
      date: new Date('2025-01-10'),
      description: 'Internet bill',
      vendor: 'Comcast',
      category: 'Utilities',
      amountCents: 8500,
      status: 'APPROVED',
      memo: 'Monthly internet service'
    },
    {
      date: new Date('2025-01-09'),
      description: 'Grocery shopping',
      vendor: 'Trader Joe\'s',
      category: 'Groceries',
      amountCents: 8500,
      status: 'APPROVED',
      memo: 'Weekly groceries'
    },
    {
      date: new Date('2025-01-08'),
      description: 'Gas bill',
      vendor: 'Gas Company',
      category: 'Utilities',
      amountCents: 6500,
      status: 'APPROVED',
      memo: 'Monthly gas service'
    },
    {
      date: new Date('2025-01-07'),
      description: 'Grocery shopping',
      vendor: 'Safeway',
      category: 'Groceries',
      amountCents: 7200,
      status: 'APPROVED',
      memo: 'Weekly groceries'
    },
    {
      date: new Date('2025-01-06'),
      description: 'Water bill',
      vendor: 'Water Company',
      category: 'Utilities',
      amountCents: 4500,
      status: 'APPROVED',
      memo: 'Monthly water service'
    },

    // EXCLUDED transactions (5)
    {
      date: new Date('2025-01-15'),
      description: 'Restaurant dinner',
      vendor: 'Local Bistro',
      category: 'Food & Drink',
      amountCents: 6500,
      status: 'EXCLUDED',
      memo: 'Date night dinner'
    },
    {
      date: new Date('2025-01-14'),
      description: 'Lunch at Chipotle',
      vendor: 'Chipotle',
      category: 'Food & Drink',
      amountCents: 1200,
      status: 'EXCLUDED',
      memo: 'Personal lunch expense'
    },
    {
      date: new Date('2025-01-13'),
      description: 'New Year dinner',
      vendor: 'Fancy Restaurant',
      category: 'Food & Drink',
      amountCents: 15000,
      status: 'EXCLUDED',
      memo: 'Personal celebration dinner'
    },
    {
      date: new Date('2025-01-12'),
      description: 'Post-Christmas shopping',
      vendor: 'Target',
      category: 'Shopping',
      amountCents: 8900,
      status: 'EXCLUDED',
      memo: 'Personal shopping'
    },
    {
      date: new Date('2025-01-11'),
      description: 'Personal entertainment',
      vendor: 'Movie Theater',
      category: 'Entertainment',
      amountCents: 2500,
      status: 'EXCLUDED',
      memo: 'Personal movie night'
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
  statusCounts.forEach(({ status, _count }: { status: string; _count: { status: number } }) => {
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
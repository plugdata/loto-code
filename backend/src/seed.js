// ===== Seed Database (Prisma) =====
import bcrypt from 'bcryptjs';
import { prisma } from './db/connection.js';

async function seed() {
  console.log('Seeding database...\n');

  // ===== Clear existing data (lotto tables) =====
  await prisma.transaction.deleteMany();
  await prisma.restrictedNumber.deleteMany();
  await prisma.betType.deleteMany();
  await prisma.setting.deleteMany();

  // Clear relational tables (order matters for FK)
  await prisma.keepId.deleteMany();
  await prisma.userCoupon.deleteMany();
  await prisma.purchaseItem.deleteMany();
  await prisma.purchase.deleteMany();
  await prisma.purchaseLimit.deleteMany();
  await prisma.percentAllocation.deleteMany();
  await prisma.restrictedProduct.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.product.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();

  // ===== Users (3 roles: admin / agent(user) / customer) =====
  const hashedPassword = await bcrypt.hash('1234', 10);

  const users = await Promise.all([
    prisma.user.create({
      data: { username: 'admin01', password: hashedPassword, role: 'admin' },
    }),
    prisma.user.create({
      data: { username: 'admin02', password: hashedPassword, role: 'admin' },
    }),
    prisma.user.create({
      data: { username: 'agent01', password: hashedPassword, role: 'agent' },
    }),
    prisma.user.create({
      data: { username: 'agent02', password: hashedPassword, role: 'agent' },
    }),
    prisma.user.create({
      data: { username: 'lukmue01', password: hashedPassword, role: 'customer' },
    }),
    prisma.user.create({
      data: { username: 'lukmue02', password: hashedPassword, role: 'customer' },
    }),
    prisma.user.create({
      data: { username: 'lukmue03', password: hashedPassword, role: 'customer' },
    }),
  ]);

  console.log(`Users: ${users.length}`);

  // ===== Customers =====
  const customers = await Promise.all([
    prisma.customer.create({
      data: { name: 'คุณสมศักดิ์', phone: '081-111-1111', status: 'active', balance: 5000, percentage: 5 },
    }),
    prisma.customer.create({
      data: { name: 'คุณวิชัย', phone: '082-222-2222', status: 'active', balance: 3000, percentage: 3 },
    }),
    prisma.customer.create({
      data: { name: 'คุณประภา', phone: '083-333-3333', status: 'active', balance: 8000, percentage: 7 },
    }),
    prisma.customer.create({
      data: { name: 'คุณมานะ', phone: '084-444-4444', status: 'active', balance: 2000, percentage: 2 },
    }),
    prisma.customer.create({
      data: { name: 'คุณจินดา', phone: '085-555-5555', status: 'inactive', balance: 1000, percentage: 0 },
    }),
    prisma.customer.create({
      data: { name: 'คุณสมชาย', phone: '086-666-6666', status: 'active', balance: 6000, percentage: 4 },
    }),
    prisma.customer.create({
      data: { name: 'คุณวรรณา', phone: '087-777-7777', status: 'active', balance: 4500, percentage: 3 },
    }),
    prisma.customer.create({
      data: { name: 'คุณพิชัย', phone: '088-888-8888', status: 'active', balance: 7000, percentage: 5 },
    }),
  ]);

  console.log(`Customers: ${customers.length}`);

  // ===== Bet Types (2digit / 3digit / special) =====
  const betTypesData = [
    // 2-digit
    { key: 'Q', code: 'song_kang', label: 'สองตัวล่าง', shortcut: 'Q', category: '2digit', sortOrder: 1 },
    { key: 'W', code: 'song_bon', label: 'สองตัวบน', shortcut: 'W', category: '2digit', sortOrder: 2 },
    { key: 'E', code: 'song_bon_lang', label: 'สองตัว บน-ล่าง', shortcut: 'E', category: '2digit', sortOrder: 3 },
    { key: 'R', code: 'song_kang_x2', label: 'สองตัวล่าง x2', shortcut: 'R', category: '2digit', sortOrder: 4 },
    { key: 'T', code: 'song_bon_x2', label: 'สองตัวบน x2', shortcut: 'T', category: '2digit', sortOrder: 5 },
    { key: 'Y', code: 'lang_19pratu', label: '2ล่าง 19ประตู', shortcut: 'Y', category: '2digit', sortOrder: 6 },
    { key: 'U', code: 'bon_19pratu', label: '2บน 19ประตู', shortcut: 'U', category: '2digit', sortOrder: 7 },
    { key: 'I', code: 'wing_bon', label: 'วิ่งบน', shortcut: 'I', category: '2digit', sortOrder: 8 },
    { key: 'O', code: 'wing_lang', label: 'วิ่งล่าง', shortcut: 'O', category: '2digit', sortOrder: 9 },
    { key: 'X', code: 'bon_lang_x2', label: '2บนล่าง x2', shortcut: 'X', category: '2digit', sortOrder: 10 },
    { key: 'B', code: 'ruut_bon', label: 'รูดบน', shortcut: 'B', category: '2digit', sortOrder: 11 },
    { key: 'N', code: 'ruut_lang', label: 'รูดล่าง', shortcut: 'N', category: '2digit', sortOrder: 12 },
    // 3-digit
    { key: 'A', code: 'ek_3song', label: 'เต็ง (3ตัวตรง)', shortcut: 'A', category: '3digit', sortOrder: 13 },
    { key: 'S', code: 'tua_3song', label: 'หัว (3ตัวหน้า)', shortcut: 'S', category: '3digit', sortOrder: 14 },
    { key: 'D', code: 'tode_3', label: 'โต๊ดสาม', shortcut: 'D', category: '3digit', sortOrder: 15 },
    { key: 'F', code: 'ek_tode_3', label: 'เต็ง-โต๊ด หัว', shortcut: 'F', category: '3digit', sortOrder: 16 },
    { key: 'G', code: 'sam_tua_lang', label: 'สามตัวล่าง', shortcut: 'G', category: '3digit', sortOrder: 17 },
    { key: 'H', code: 'ek_na_lang', label: 'เต็ง หน้า-ล่าง', shortcut: 'H', category: '3digit', sortOrder: 18 },
    { key: 'J', code: 'tode_yai', label: 'โต๊ดใหญ่', shortcut: 'J', category: '3digit', sortOrder: 19 },
    { key: 'K', code: 'ek_tode_yai', label: 'เต็ง-โต๊ดใหญ่', shortcut: 'K', category: '3digit', sortOrder: 20 },
    { key: 'L', code: 'tode_lek', label: 'โต๊ดเล็ก', shortcut: 'L', category: '3digit', sortOrder: 21 },
    // special
    { key: 'Z', code: 'ek_tode_3lang', label: 'เต็ง-โต๊ด-3ล่าง', shortcut: 'Z', category: 'special', sortOrder: 22 },
    { key: 'M', code: 'klap_na_lang', label: 'กลับเลข (6กลับ)', shortcut: 'M', category: 'special', sortOrder: 23 },
  ];

  const betTypes = await prisma.betType.createMany({ data: betTypesData });
  console.log(`Bet Types: ${betTypes.count}`);

  // ===== Settings =====
  const settingsData = [
    { key: 'pay_rate_2digit', value: '95' },
    { key: 'pay_rate_3digit', value: '900' },
    { key: 'is_lottery_open', value: 'true' },
    { key: 'closing_time', value: '14:30' },
    { key: 'min_bet', value: '1' },
    { key: 'max_bet_2digit', value: '1000' },
    { key: 'max_bet_3digit', value: '500' },
    { key: 'auto_reverse', value: 'false' },
    { key: 'pay_rate_song_bon', value: '95' },
    { key: 'pay_rate_song_kang', value: '95' },
    { key: 'pay_rate_song_bon_lang', value: '95' },
    { key: 'pay_rate_ek_3song', value: '900' },
    { key: 'pay_rate_tode_3', value: '150' },
    { key: 'pay_rate_tode_yai', value: '450' },
    { key: 'pay_rate_tode_lek', value: '150' },
    { key: 'pay_rate_wing_bon', value: '3.2' },
    { key: 'pay_rate_wing_lang', value: '4.2' },
  ];

  const settings = await prisma.setting.createMany({ data: settingsData });
  console.log(`Settings: ${settings.count}`);

  // ===== Restricted Numbers (หวยอั้น) =====
  const restrictedData = [
    { number: '89', maxAmount: 200, type: '2ตัว' },
    { number: '56', maxAmount: 150, type: '2ตัว' },
    { number: '123', maxAmount: 100, type: '3ตัว' },
    { number: '77', maxAmount: 0, type: '2ตัว' },
    { number: '456', maxAmount: 50, type: '3ตัว' },
    { number: '13', maxAmount: 300, type: '2ตัว' },
    { number: '789', maxAmount: 80, type: '3ตัว' },
  ];

  const restricted = await prisma.restrictedNumber.createMany({ data: restrictedData });
  console.log(`Restricted Numbers: ${restricted.count}`);

  // ===== Sample Transactions =====
  const transactionsData = [
    { betTypeCode: 'song_bon', betTypeLabel: 'สองตัวบน', number: '45', amount: 100, customerName: 'ลูกค้าทั่วไป', userName: 'lukmue01' },
    { betTypeCode: 'song_kang', betTypeLabel: 'สองตัวล่าง', number: '78', amount: 50, customerName: 'คุณสมศักดิ์', userName: 'lukmue01' },
    { betTypeCode: 'ek_3song', betTypeLabel: 'เต็ง (3ตัวตรง)', number: '123', amount: 200, customerName: 'ลูกค้าทั่วไป', userName: 'lukmue02' },
    { betTypeCode: 'song_bon_lang', betTypeLabel: 'สองตัว บน-ล่าง', number: '56', amount: 150, customerName: 'คุณวิชัย', userName: 'admin01' },
    { betTypeCode: 'tode_3', betTypeLabel: 'โต๊ดสาม', number: '789', amount: 80, customerName: 'ลูกค้าทั่วไป', userName: 'lukmue03' },
    { betTypeCode: 'song_bon', betTypeLabel: 'สองตัวบน', number: '12', amount: 200, customerName: 'คุณประภา', userName: 'agent01' },
    { betTypeCode: 'song_kang', betTypeLabel: 'สองตัวล่าง', number: '99', amount: 300, customerName: 'คุณมานะ', userName: 'agent01' },
    { betTypeCode: 'wing_bon', betTypeLabel: 'วิ่งบน', number: '5', amount: 50, customerName: 'ลูกค้าทั่วไป', userName: 'lukmue01' },
    { betTypeCode: 'wing_lang', betTypeLabel: 'วิ่งล่าง', number: '8', amount: 60, customerName: 'คุณสมชาย', userName: 'lukmue02' },
    { betTypeCode: 'tode_yai', betTypeLabel: 'โต๊ดใหญ่', number: '456', amount: 120, customerName: 'คุณจินดา', userName: 'agent02' },
    { betTypeCode: 'song_bon', betTypeLabel: 'สองตัวบน', number: '45', amount: 250, customerName: 'คุณวรรณา', userName: 'lukmue03' },
    { betTypeCode: 'ek_3song', betTypeLabel: 'เต็ง (3ตัวตรง)', number: '888', amount: 500, customerName: 'คุณพิชัย', userName: 'agent01' },
    { betTypeCode: 'song_kang', betTypeLabel: 'สองตัวล่าง', number: '23', amount: 100, customerName: 'ลูกค้าทั่วไป', userName: 'admin01' },
    { betTypeCode: 'song_bon_lang', betTypeLabel: 'สองตัว บน-ล่าง', number: '67', amount: 180, customerName: 'คุณสมศักดิ์', userName: 'lukmue01' },
    { betTypeCode: 'tode_lek', betTypeLabel: 'โต๊ดเล็ก', number: '345', amount: 90, customerName: 'คุณประภา', userName: 'lukmue02' },
  ];

  const transactions = await prisma.transaction.createMany({ data: transactionsData });
  console.log(`Transactions: ${transactions.count}`);

  // ===== Summary =====
  const totalAmount = transactionsData.reduce((sum, t) => sum + t.amount, 0);
  console.log('\n--- Seed Summary ---');
  console.log(`Users: ${users.length} (admin:2 / agent:2 / customer:3)`);
  console.log(`Customers: ${customers.length}`);
  console.log(`Bet Types: ${betTypes.count} (2digit:12 / 3digit:9 / special:2)`);
  console.log(`Settings: ${settings.count}`);
  console.log(`Restricted: ${restricted.count}`);
  console.log(`Transactions: ${transactions.count} (total: ${totalAmount} baht)`);
  console.log('\n--- Login Credentials ---');
  console.log('admin01 / 1234  (role: admin)');
  console.log('agent01 / 1234  (role: agent)');
  console.log('lukmue01 / 1234 (role: customer)');
  console.log('\nSeed completed!');

  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error('Seed failed:', e);
  prisma.$disconnect();
  process.exit(1);
});

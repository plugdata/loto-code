// ===== Settings Service (Prisma) =====
import { prisma } from '../db/connection.js';

const parseValue = (value) => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (!isNaN(value) && value !== '') return parseFloat(value);
  return value;
};

const KEY_MAP = {
  isLotteryOpen: 'is_lottery_open',
  closingTime: 'closing_time',
  minBet: 'min_bet',
  maxBet2Digit: 'max_bet_2digit',
  maxBet3Digit: 'max_bet_3digit',
  autoReverse: 'auto_reverse',
  payRate2Digit: 'pay_rate_2digit',
  payRate3Digit: 'pay_rate_3digit',
  manualMode: 'manual_mode',
};

// Per-lottery-type key suffix
const ltSuffix = (ltId) => `__lt_${ltId}`;

// Default pay rates
const DEFAULT_PAY_RATES = {
  song_bon: 95,
  song_kang: 95,
  song_bon_lang: 95,
  ek_3song: 900,
  tua_3song: 900,
  sam_tua_lang: 900,
  tode_3: 150,
  tode_yai: 450,
  tode_lek: 150,
  wing_bon: 3.2,
  wing_lang: 4.2,
};

export const settingsService = {
  async getAll(lotteryTypeId = null) {
    const rows = await prisma.setting.findMany();
    const settings = {};
    for (const row of rows) {
      settings[row.key] = parseValue(row.value);
    }

    const restricted = await prisma.restrictedNumber.findMany({
      orderBy: { id: 'asc' },
      include: { lotteryType: { select: { name: true } } },
    });

    // Build payRates: global defaults, then overlay per-lottery-type if specified
    const payRates = {};
    for (const [rateKey, defaultVal] of Object.entries(DEFAULT_PAY_RATES)) {
      // Global value
      const globalVal = settings[`pay_rate_${rateKey}`];
      payRates[rateKey] = globalVal !== undefined ? globalVal : defaultVal;

      // Per-type override
      if (lotteryTypeId) {
        const ltVal = settings[`pay_rate_${rateKey}${ltSuffix(lotteryTypeId)}`];
        if (ltVal !== undefined) {
          payRates[rateKey] = ltVal;
        }
      }
    }

    // Build limits: global defaults, then overlay per-lottery-type
    let minBet = settings.min_bet || 1;
    let maxBet2Digit = settings.max_bet_2digit || 1000;
    let maxBet3Digit = settings.max_bet_3digit || 500;

    if (lotteryTypeId) {
      const ltMin = settings[`min_bet${ltSuffix(lotteryTypeId)}`];
      const ltMax2 = settings[`max_bet_2digit${ltSuffix(lotteryTypeId)}`];
      const ltMax3 = settings[`max_bet_3digit${ltSuffix(lotteryTypeId)}`];
      if (ltMin !== undefined) minBet = ltMin;
      if (ltMax2 !== undefined) maxBet2Digit = ltMax2;
      if (ltMax3 !== undefined) maxBet3Digit = ltMax3;
    }

    return {
      payRate2Digit: payRates.song_bon,
      payRate3Digit: payRates.ek_3song,
      isLotteryOpen: settings.is_lottery_open ?? true,
      closingTime: settings.closing_time || '14:30',
      minBet,
      maxBet2Digit,
      maxBet3Digit,
      autoReverse: settings.auto_reverse ?? false,
      manualMode: settings.manual_mode ?? false,
      payRates,
      restrictedNumbers: restricted.map((r) => ({
        id: r.id,
        number: r.number,
        maxAmount: r.maxAmount,
        type: r.type,
        lotteryTypeId: r.lotteryTypeId || null,
        lotteryTypeName: r.lotteryType?.name || null,
      })),
    };
  },

  async updateAll(body) {
    const upserts = [];
    const ltId = body.lotteryTypeId || null;
    const suffix = ltId ? ltSuffix(ltId) : '';

    for (const [key, value] of Object.entries(body)) {
      if (key === 'lotteryTypeId') continue;

      if (key === 'payRates') {
        for (const [rateKey, rateValue] of Object.entries(value)) {
          const dbKey = `pay_rate_${rateKey}${suffix}`;
          upserts.push(
            prisma.setting.upsert({
              where: { key: dbKey },
              update: { value: String(rateValue) },
              create: { key: dbKey, value: String(rateValue) },
            })
          );
        }
      } else if (ltId && (key === 'minBet' || key === 'maxBet2Digit' || key === 'maxBet3Digit')) {
        // Per-lottery-type limits
        const dbKey = `${KEY_MAP[key]}${suffix}`;
        upserts.push(
          prisma.setting.upsert({
            where: { key: dbKey },
            update: { value: String(value) },
            create: { key: dbKey, value: String(value) },
          })
        );
      } else {
        const dbKey = KEY_MAP[key] || key;
        upserts.push(
          prisma.setting.upsert({
            where: { key: dbKey },
            update: { value: String(value) },
            create: { key: dbKey, value: String(value) },
          })
        );
      }
    }

    await prisma.$transaction(upserts);
  },
};

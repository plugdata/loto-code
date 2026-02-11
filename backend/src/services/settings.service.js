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

export const settingsService = {
  async getAll() {
    const rows = await prisma.setting.findMany();
    const settings = {};
    for (const row of rows) {
      settings[row.key] = parseValue(row.value);
    }

    const restricted = await prisma.restrictedNumber.findMany({ orderBy: { id: 'asc' } });

    return {
      payRate2Digit: settings.pay_rate_2digit || 95,
      payRate3Digit: settings.pay_rate_3digit || 900,
      isLotteryOpen: settings.is_lottery_open ?? true,
      closingTime: settings.closing_time || '14:30',
      minBet: settings.min_bet || 1,
      maxBet2Digit: settings.max_bet_2digit || 1000,
      maxBet3Digit: settings.max_bet_3digit || 500,
      autoReverse: settings.auto_reverse ?? false,
      manualMode: settings.manual_mode ?? false,
      payRates: {
        song_bon: settings.pay_rate_song_bon || 95,
        song_kang: settings.pay_rate_song_kang || 95,
        song_bon_lang: settings.pay_rate_song_bon_lang || 95,
        ek_3song: settings.pay_rate_ek_3song || 900,
        tode_3: settings.pay_rate_tode_3 || 150,
        tode_yai: settings.pay_rate_tode_yai || 450,
        tode_lek: settings.pay_rate_tode_lek || 150,
        wing_bon: settings.pay_rate_wing_bon || 3.2,
        wing_lang: settings.pay_rate_wing_lang || 4.2,
      },
      restrictedNumbers: restricted.map((r) => ({
        number: r.number,
        maxAmount: r.maxAmount,
        type: r.type,
      })),
    };
  },

  async updateAll(body) {
    const upserts = [];

    for (const [key, value] of Object.entries(body)) {
      if (key === 'payRates') {
        for (const [rateKey, rateValue] of Object.entries(value)) {
          upserts.push(
            prisma.setting.upsert({
              where: { key: `pay_rate_${rateKey}` },
              update: { value: String(rateValue) },
              create: { key: `pay_rate_${rateKey}`, value: String(rateValue) },
            })
          );
        }
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

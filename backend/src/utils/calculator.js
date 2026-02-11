// ===== Calculator Utils (Factory Pattern) =====

export const createCalculator = (initialValue = 0) => {
  let value = initialValue;

  return {
    add(n) { value += n; return this; },
    subtract(n) { value -= n; return this; },
    multiply(n) { value *= n; return this; },
    divide(n) {
      if (n === 0) throw new Error('Division by zero');
      value /= n;
      return this;
    },
    percent(rate) { value = (value * rate) / 100; return this; },
    getResult() { return value; },
    reset(n = 0) { value = n; return this; },
  };
};

export const sumTotal = (items, key) =>
  items.reduce((acc, item) => acc + (item[key] || 0), 0);

export const calcPercent = (amount, rate) =>
  (amount * rate) / 100;

export const calcPayRate = (amount, rate) =>
  amount * rate;

export const calcNetAmount = (totalAmount, percentRate) =>
  totalAmount - calcPercent(totalAmount, percentRate);

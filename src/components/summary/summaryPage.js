// ─── Main Render ────────────────────────────

import { api } from '../../api/apiClient.js';
import { pageTemplate, mapTransaction } from './summaryTemplates.js';

async function fetchSummaryData() {
  const [summaryRes, txRes] = await Promise.all([
    api.summary.get(),
    api.transactions.get(),
  ]);

  const summary = summaryRes.data || { totalBills: 0, totalAmount: 0, totalCustomers: 0, topNumbers: [] };
  const transactions = (txRes.data || []).map(mapTransaction);

  return { summary, transactions };
}

export async function renderSummaryPage(container) {
  const { summary, transactions } = await fetchSummaryData();
  container.innerHTML = pageTemplate(summary, transactions);
}

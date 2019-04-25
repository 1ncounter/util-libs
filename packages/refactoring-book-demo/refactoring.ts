import {
  iInvoice,
  iStatementData,
  createStatementData
} from './createStatementData';

export function statement(invoice: iInvoice, plays: object): string {
  return renderPlainText(createStatementData(invoice, plays));
}

export function htmlState(invoice: iInvoice, plays: object): string {
  return renderHtml(createStatementData(invoice, plays));
}

function renderPlainText(data: iStatementData): string {
  let result = `Statement for ${data.customer}\n`;

  for (let perf of data.performances) {
    result += ` ${perf.play.name}: ${usd(perf.amount)} (${
      perf.audience
    } seats)\n`;
  }

  result += `Amount owed is ${usd(data.totalAmount)}\n`;
  result += `You earned ${data.totalVolumeCredits} credits\n`;

  return result;
}

function renderHtml(data: iStatementData): string {
  let result = `<h1>Statement for ${data.customer}</h1>`;
  result += `<table>\n`;
  result += `<tr><th>play</th><th>seats</th><th>cost</th>`;

  for (let perf of data.performances) {
    result += `<tr><td>${perf.play.name}</td>${perf.audience}<td></td>`;
    result += `<td>${usd(perf.amount)}</td></tr>\n`;
  }

  result += `</table>\n`;
  result += `<p>Amount owed is <em>${usd(data.totalAmount)}</em></p>\n`;
  result += `<p>You earned <em>${data.totalVolumeCredits}</em> credits</p>\n`;

  return result;
}

function usd(number: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(number / 100);
}

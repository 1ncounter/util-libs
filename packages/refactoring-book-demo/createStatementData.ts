export interface iPeformance {
  playID: string;
  play?: iPlay;
  amount?: number;
  volumeCredits?: number;
  audience: number;
}

export interface iInvoice {
  customer: string;
  performances: iPeformance[];
}

export interface iPlay {
  name: string;
  type: string;
}

export interface iStatementData {
  customer: string;
  performances: iPeformance[];
  totalAmount: number;
  totalVolumeCredits: number;
}

export function createStatementData(
  invoice: iInvoice,
  plays: object
): iStatementData {
  const result: iStatementData = Object.create({});
  result.customer = invoice.customer;
  result.performances = invoice.performances.map(enrichPerformance);
  result.totalAmount = totalAmount(result);
  result.totalVolumeCredits = totalVolumeCredits(result);
  return result;

  function enrichPerformance(performance: iPeformance): iPeformance {
    const calculator = createPerformanceCaculator(
      performance,
      playFor(performance)
    );
    const result = Object.assign({}, performance);
    result.play = calculator.play;
    result.amount = calculator.amount;
    result.volumeCredits = calculator.volumeCredits;
    return result;
  }

  function createPerformanceCaculator(performance: iPeformance, play: iPlay) {
    switch (play.type) {
      case 'tragedy':
        return new TragedyCalculator(performance, play);
      case 'comedy':
        return new ComedyCalculator(performance, play);
      default:
        throw new Error(`Unkonwn type ${play.type}`);
    }
  }

  function playFor(performance: iPeformance): iPlay {
    return plays[performance.playID];
  }

  function totalVolumeCredits(data: any): number {
    return data.performances.reduce(
      (total: number, p: any) => total + p.volumeCredits,
      0
    );
  }

  function totalAmount(data: any): number {
    return data.performances.reduce(
      (total: number, p: any) => total + p.amount,
      0
    );
  }
}

class PerformanceCalculator {
  performance: iPeformance;
  play: iPlay;

  constructor(performance: iPeformance, play: iPlay) {
    this.performance = performance;
    this.play = play;
  }

  get volumeCredits(): number {
    return Math.max(this.performance.audience - 30, 0);
  }
}

class TragedyCalculator extends PerformanceCalculator {
  constructor(performance: iPeformance, play: iPlay) {
    super(performance, play);
  }

  get amount(): number {
    let result: number = 40000;
    if (this.performance.audience > 30) {
      result += 1000 * (this.performance.audience - 30);
    }
    return result;
  }
}

class ComedyCalculator extends PerformanceCalculator {
  constructor(performance: iPeformance, play: iPlay) {
    super(performance, play);
  }

  get amount(): number {
    let result = 30000;
    if (this.performance.audience > 20) {
      result += 10000 + 500 * (this.performance.audience - 20);
    }
    return result;
  }

  get volumeCredits(): number {
    return super.volumeCredits + Math.floor(this.performance.audience / 5);
  }
}

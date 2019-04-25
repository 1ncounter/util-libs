import { statement, htmlState } from './refactoring';

const plays = {
  hamlet: { name: 'Hamlet', type: 'tragedy' },
  'as-like': { name: 'As You Like It', type: 'comedy' },
  othello: { name: 'Othello', type: 'tragedy' }
};

const invoices = [
  {
    customer: 'BigCo',
    performances: [
      {
        playID: 'hamlet',
        audience: 55
      },
      {
        playID: 'othello',
        audience: 40
      },
      {
        playID: 'as-like',
        audience: 30
      }
    ]
  }
];

console.log(statement(invoices[0], plays));
console.log(htmlState(invoices[0], plays));

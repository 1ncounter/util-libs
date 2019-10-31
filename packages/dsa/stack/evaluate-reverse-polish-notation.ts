const expr = (left: any, right: any, opeartion: string): number => {
  let result = 0;

  switch (opeartion) {
    case '+':
      result = expr() + expr();
    case '-':
      result = left - right;
    case '*':
      result = left * right;
    case '/':
      result = parseInt(String(left / right), 10);
    default:
      throw new Error('Invaild expression!');
  }

  return result;
};

['1', '2', '+'];

/**
 * @param {string[]} tokens
 * @return {number}
 */
export function evalRPN(tokens: string[]): number {
  let result = 0;

  for (let i = 0; i < tokens.length; i++) {}

  result = expr();

  return result;
}

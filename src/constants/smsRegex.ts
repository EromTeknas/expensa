const REGEXS = {
  ICICIBANK: {
    bankName: /^(?<bankName>[A-Za-z\s]+) Acct/,
    account: /Acct[ ]?(?<account>XX\d{3})/,
    transactionType: /\b(?<transactionType>debited|credited)\b/i,
    amount: /Rs[ ]?(?<amount>[\d,]+\.\d{2})/,
    date: /on (?<date>\d{2}-[A-Za-z]{3}-\d{2})/,
    party: /on \d{2}-[A-Za-z]{3}-\d{2}; (?<party>.*?) credited/i,
    mode: /\b(?<mode>UPI|IMPS|NEFT|RTGS):/i,
    reference: /\b(?:UPI|IMPS|NEFT|RTGS):(?<reference>\d+)/i,
    isTransactionMessage: /^ICICI Bank Acct/i,
  },
};

export default REGEXS;

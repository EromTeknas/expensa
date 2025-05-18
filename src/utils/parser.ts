import {TransactionType} from 'src/models/transactions';
import REGEXS from '../constants/smsRegex';

interface TransactionData {
  bankName: string | null;
  transactionType: TransactionType | null;
  amount: number | null;
  //   date: string | null;
  //   account: string | null;
  party: string | null;
}
// {
//   "bankName": "ICICI Bank",
//   "account": "XX366",
//   "transactionType": "debited",
//   "amount": 3500,
//   "date": "01-May-25",
//   "party": "HARESH ALAMCHAN",
//   "mode": "UPI",
//   "reference": "050746708215"
// }

function parseTransaction(message: string): TransactionData | null {
  // Step 1: Check if it's a transaction message
  if (!REGEXS.ICICIBANK.isTransactionMessage.test(message)) {
    return null;
  }

  // Step 2: Match each field individually
  const bankName =
    message.match(REGEXS.ICICIBANK.bankName)?.groups?.bankName?.trim() ?? null;

  const rawType = message
    .match(REGEXS.ICICIBANK.transactionType)
    ?.groups?.transactionType?.toLowerCase();

  const transactionType: TransactionType | null =
    rawType === 'credited' ? 'CREDIT' : rawType === 'debited' ? 'DEBIT' : null;

  const amountRaw =
    message.match(REGEXS.ICICIBANK.amount)?.groups?.amount?.replace(/,/g, '') ??
    null;
  const amount = amountRaw ? parseFloat(amountRaw) : null;
  const party =
    message.match(REGEXS.ICICIBANK.party)?.groups?.party?.trim() ?? null;

  // Step 3: Return structured object
  return {
    bankName,
    transactionType: transactionType ?? null,
    amount,
    party,
  };
}

export default parseTransaction;

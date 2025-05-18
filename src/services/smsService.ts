import SmsAndroid from 'react-native-get-sms-android';
import parseTransaction from '../utils/parser';
import {WMNewTransactionInput} from '../watermelon/services/transactionService';
import getHash from '../utils/hash';


// TODO
// Handle the SMS Retreiver Failure
export const getMessageSinceLastSyncDate = (
  lastSyncDate: Date,
): WMNewTransactionInput[] => {
  const filtersString = getFiltersJson(lastSyncDate);
  const listOfWpTransactions: WMNewTransactionInput[] = [];

  SmsAndroid.list(
    filtersString,
    fail => {
      console.log('Failed to Retreive Messages', fail);
    },
    (_, smsListString) => {
      const smsList = JSON.parse(smsListString);

      smsList.forEach(async (sms: any) => {
        const tran = parseTransaction(sms.body);
        if (tran) {
          const hash = await getHash(`${sms.body}${sms.date}`);
          if (hash) {
            const newTransaction: WMNewTransactionInput = {
              hash: hash,
              isSynced: false,
              bankName: tran.bankName,
              type: tran.transactionType,
              amount: tran.amount,
              transactionTime: sms.date as number,
              party: tran.party,
              description: tran.party,
              category_id: null,
              account_id: null,
            };

            listOfWpTransactions.push(newTransaction);
          } else {
            console.warn('Skipping Transaction Due to hash not generated');
          }
        }
      });
    },
  );
  return listOfWpTransactions;
};

const getFiltersJson = (lastSyncDate: Date) => {
  console.log('Inside GetFilter', lastSyncDate);
  const timestampInMs = lastSyncDate.getTime();
  console.log('TIMESTAPM', timestampInMs);
  var filter = {
    box: 'inbox', // 'inbox' (default), 'sent', 'draft', 'outbox', 'failed', 'queued', and '' for all

    /**
     *  the next 3 filters can work together, they are AND-ed
     *
     *  minDate, maxDate filters work like this:
     *    - If and only if you set a maxDate, it's like executing this SQL query:
     *    "SELECT * from messages WHERE (other filters) AND date <= maxDate"
     *    - Same for minDate but with "date >= minDate"
     */
    // minDate: new Date('2025-04-01T00:00:00Z').getTime(), // timestamp (in milliseconds since UNIX epoch)
    minDate: timestampInMs,
    //   maxDate: 1556277910456, // timestamp (in milliseconds since UNIX epoch)
    // bodyRegex: '(.*)How are you(.*)', // content regex to match

    /** the next 5 filters should NOT be used together, they are OR-ed so pick one **/
    //   read: 0, // 0 for unread SMS, 1 for SMS already read
    //   _id: 1234, // specify the msg id
    //   thread_id: 12, // specify the conversation thread_id
    //   address: '+1888------', // sender's phone number
    //   body: 'How are you', // content to match
    /** the next 2 filters can be used for pagination **/
    //   indexFrom: 0, // start from index 0
    // maxCount: 10, // count of SMS to return each time
  };
  var jsonFilter = JSON.stringify(filter);
  return jsonFilter;
};

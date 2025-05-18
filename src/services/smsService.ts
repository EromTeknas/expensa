import SmsAndroid from 'react-native-get-sms-android';
import REGEXS from '../constants/smsRegex';
import parseTransaction from '../utils/parser';
import {
  createWMTransaction,
  WMNewTransactionInput,
} from '../watermelon/services/transactionService';
import getHash from '../utils/hash';

export const getMessageSinceLastSyncDate = (lastSyncDate: Date) => {
  console.log('Inside the getMessagesSinceLastSyncDate');
  const filtersString = getFiltersJson(lastSyncDate);
  console.log('regex', REGEXS.ICICIBANK);
  SmsAndroid.list(
    filtersString,
    fail => {
      console.log('Failed to Retreive Messages', fail);
    },
    (count, smsListString) => {
      const smsList = JSON.parse(smsListString);

      smsList.forEach(async (sms: any) => {
        // console.log(sms.body);
        console.log(sms);
        const tran = parseTransaction(sms.body);
        console.log(sms.date);
        console.log(tran);
        if (tran) {
          const hash = await getHash(`${sms.body}${sms.date}`);
          if (hash) {
            const NewTransaction: WMNewTransactionInput = {
              hash: hash,
              isSynced: false,
              bankName: tran.bankName,
              type: tran.transactionType,
              amount: tran.amount,
              transactionTime: sms.date as number,
              party: tran.party,
              description: tran.party,
            };

            createWMTransaction(NewTransaction)
              .then(newTran => {
                console.log('Transaction added to local db', newTran);
              })
              .catch(err => {
                console.error('Failed to add transaction to wm db', err);
              });
          } else {
            console.warn('Skipping Transaction Due to hash not generated');
          }
        } else {
          console.error('Unable to fetch Transaction');
        }
      });
    },
  );
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

import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import DatePicker from 'react-native-date-picker';
import COLORS from '../../constants/colors';
import {FONTFAMILIES} from '../../constants/fonts';
import HapticFeedback from 'react-native-haptic-feedback';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import {formatTimeWithDate, isNow} from '../../utils/dateTimeUtilities';
dayjs.extend(utc);
dayjs.extend(timezone);

//TODO
// If we set time to 'NOW' on 11.50 PM
// If 5 min past, the label is shown Now, but the time stored in state is still 11.50
// We need to implement the provision, if the NOW is displayed, then the time picked should be current
type DateTimePickerComponentProps = {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
};

const DateTimePickerComponent = ({
  selectedDate,
  onDateChange,
}: DateTimePickerComponentProps) => {
  const [showPicker, setShowPicker] = useState(false);

  const setToNow = () => {
    const now = new Date();
    onDateChange(now); // Callback with current date
  };

  const handleLongPress = () => {
    HapticFeedback.trigger('impactHeavy'); // Trigger vibration
    setToNow();
  };

  const handleDateChange = (date: Date) => {
    const utcDate = dayjs(date).utc().toDate(); // Convert selected date to UTC
    onDateChange(utcDate); // Callback when date changes
  };

  return (
    <View>
      <View style={styles.outerContainer}>
        <Text style={styles.timeTextStyle}>
          {isNow(selectedDate) ? 'Now' : formatTimeWithDate(selectedDate)} |{' '}
        </Text>
        <TouchableOpacity
          onPress={() => setShowPicker(true)}
          onLongPress={handleLongPress}
          delayLongPress={300}>
          <Text style={styles.changeTimeButtonStyle}>Change Time</Text>
        </TouchableOpacity>

        <DatePicker
          modal
          open={showPicker}
          date={selectedDate}
          mode="datetime"
          maximumDate={new Date()}
          theme={'dark'}
          onConfirm={date => {
            handleDateChange(date);
            setShowPicker(false);
          }}
          onCancel={() => setShowPicker(false)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeTextStyle: {
    fontFamily: FONTFAMILIES.LATO.medium,
    fontSize: 14,
    color: COLORS.grey[100],
  },
  changeTimeButtonStyle: {
    fontFamily: FONTFAMILIES.LATO.regular,
    fontSize: 12,
    textDecorationLine: 'underline',
    color: COLORS.grey[100],
  },
});

export default DateTimePickerComponent;

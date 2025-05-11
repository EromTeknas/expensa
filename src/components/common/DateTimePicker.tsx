import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import DatePicker from 'react-native-date-picker';
import COLORS from '../../constants/colors';
import {FONTFAMILIES} from '../../constants/fonts';
import HapticFeedback from 'react-native-haptic-feedback';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import {formatTimeWithDate} from '../../utils/dateTimeUtilities';
dayjs.extend(utc);
dayjs.extend(timezone);

type DateTimePickerComponentProps = {
  onDateChange: (date: Date) => void;
};

const DateTimePickerComponent = ({
  onDateChange,
}: DateTimePickerComponentProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const setToNow = () => {
    const now = new Date();
    setSelectedDate(now);
    onDateChange(now); // Callback with current date
  };

  const handleLongPress = () => {
    HapticFeedback.trigger('impactHeavy'); // Trigger vibration
    setToNow();
  };

  const handleDateChange = (date: Date) => {
    const utcDate = dayjs(date).utc().toDate(); // Convert selected date to UTC
    setSelectedDate(utcDate);
    onDateChange(utcDate); // Callback when date changes
  };

  const isNow = () => {
    const now = new Date();
    return (
      selectedDate.getDate() === now.getDate() &&
      selectedDate.getMonth() === now.getMonth() &&
      selectedDate.getFullYear() === now.getFullYear() &&
      selectedDate.getHours() === now.getHours() &&
      selectedDate.getMinutes() === now.getMinutes()
    );
  };

  return (
    <View>
      <View style={styles.outerContainer}>
        <Text style={styles.timeTextStyle}>
          {isNow() ? 'Now' : formatTimeWithDate(selectedDate)} |{' '}
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

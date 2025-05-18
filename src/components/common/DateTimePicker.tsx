import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import DatePicker from 'react-native-date-picker';
import COLORS from '../../constants/colors';
import {FONTFAMILIES} from '../../constants/fonts';
import HapticFeedback from 'react-native-haptic-feedback';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import {
  formatTimeWithDate,
  getCurrentDateInUTCDate,
  isNow,
} from '../../utils/dateTimeUtilities';
dayjs.extend(utc);
dayjs.extend(timezone);

type DateTimePickerComponentProps = {
  // getSelectedDate: () => Date;
};

const DateTimePickerComponent = forwardRef<DateTimePickerComponentProps>(
  (
    _,
    // {selectedDate, onDateChange}: DateTimePickerComponentProps,
    ref,
  ) => {
    const [showPicker, setShowPicker] = useState(false);
    const [isNowSelected, setIsNowSelected] = useState(true);
    const [selectedDate, setSelectedDate] = useState(getCurrentDateInUTCDate());

    const setToNow = () => {
      const now = new Date();
      handleDateChange(now);
    };

    const handleLongPress = () => {
      HapticFeedback.trigger('impactHeavy'); // Trigger vibration
      setToNow();
    };

    const handleDateChange = (date: Date) => {
      const utcDate = dayjs(date).utc().toDate(); // Convert selected date to UTC
      if (isNow(utcDate)) {
        setIsNowSelected(true);
      } else {
        setIsNowSelected(false);
      }
      setSelectedDate(utcDate); // Callback when date changes
    };
    // Expose the method to get the actual date when submitting
    useImperativeHandle(ref, () => ({
      getSelectedDate: () => {
        const date = isNowSelected ? new Date() : selectedDate;

        return date;
      },
    }));
    return (
      <View>
        <View style={styles.outerContainer}>
          <Text style={styles.timeTextStyle}>
            {isNowSelected ? 'Now' : formatTimeWithDate(selectedDate)} |
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
  },
);

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

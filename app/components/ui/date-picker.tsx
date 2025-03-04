import {useState} from "react";
import {Text, View} from "react-native";
import CustomButton from "@/app/components/ui/custom-button";
import DateTimePicker from "react-native-modal-datetime-picker";

interface DatePickerProps {
    onChange: (date: Date) => void;
}

const DatePicker = ({
onChange,
}: DatePickerProps) => {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [dateLabel, setDateLabel] = useState('Select a date');

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    }

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    }

    const handleConfirm = (selectedDate: Date) => {
        onChange(selectedDate)
        setDateLabel(selectedDate.toLocaleString([], {dateStyle: 'short'}))
        hideDatePicker()
        console.log('A date has been picked: ', selectedDate);
    }

    return (
        <View>
            <CustomButton
                className={'h-12 rounded-lg'}
                variant='dark'
                onPress={showDatePicker}
            >
                <Text className='text-white text-2xl font-semibold'>
                    {dateLabel}
                </Text>
                <DateTimePicker
                    isVisible={isDatePickerVisible}
                    mode={"date"}
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                />
            </CustomButton>

        </View>
    )
}

export default DatePicker
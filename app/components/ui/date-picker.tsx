import {useState} from "react";
import {Text, View} from "react-native";
import CustomButton from "@/app/components/ui/custom-button";
import DateTimePicker from "react-native-modal-datetime-picker";

interface DatePickerProps {
    onChange: (date: Date) => void;
    value?: Date
    error?: boolean;
}

const DatePicker = ({ onChange, value, error }: DatePickerProps) => {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    // Always show "Select a date" until user selects something
    const dateLabel = value
        ? value.toLocaleString([], {dateStyle: 'short'})
        : 'Select a date';

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    }

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    }

    const handleConfirm = (selectedDate: Date) => {
        onChange(selectedDate)
        hideDatePicker()
    }

    return (
        <View>
            <CustomButton
                className={`h-12 rounded-lg ${error ? 'border-2 border-red-500' : ''}`}
                variant='dark'
                onPress={showDatePicker}
            >
                <Text className={`text-2xl font-semibold ${
                    value ? 'text-white' : 'text-gray-400'  // Gray text for placeholder
                }`}>
                    {dateLabel}
                </Text>
            </CustomButton>

            <DateTimePicker
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                date={new Date()} // Always default to today when picker opens
                minimumDate={new Date()} // Prevent selecting past dates
            />
        </View>
    )
}

export default DatePicker
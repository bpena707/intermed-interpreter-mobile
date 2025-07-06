import {useState} from "react";
import {Text, View} from "react-native";
import CustomButton from "@/app/components/ui/custom-button";
import DateTimePicker from "react-native-modal-datetime-picker";

interface TimePickerProps {
    onChange: (time: Date) => void;
    value?: Date;
    error?: boolean;
}

const TimePicker = ({
                        onChange,
                        value,
                        error
                    }: TimePickerProps) => {
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

    const timeLabel = value
        ? value.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
        : 'Select a time';

    const showTimePicker = () => {
        setTimePickerVisibility(true);
    }

    const hideTimePicker = () => {
        setTimePickerVisibility(false);
    }

    const handleConfirm = (selectedTime: Date) => {
        onChange(selectedTime)
        hideTimePicker()
        console.log('A time has been picked: ', selectedTime);
    }

    return (
        <View>
            <CustomButton
                className={`h-12 rounded-lg ${error ? 'border-2 border-red-500' : ''}`}
                variant='dark'
                onPress={showTimePicker}
            >
                <Text className={`text-2xl font-semibold ${
                    value ? 'text-white' : 'text-gray-400'
                }`}>
                    {timeLabel}
                </Text>
            </CustomButton>

            <DateTimePicker
                isVisible={isTimePickerVisible}
                mode="time"
                onConfirm={handleConfirm}
                onCancel={hideTimePicker}
                date={value || new Date()}
            />
        </View>
    )
}

export default TimePicker
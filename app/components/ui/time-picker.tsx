import {useState} from "react";
import {Text, View} from "react-native";
import CustomButton from "@/app/components/ui/CustomButton";
import DateTimePicker from "react-native-modal-datetime-picker";

interface TimePickerProps {
    onChange: (time: Date) => void;
}

const TimePicker = ({
    onChange,
}: TimePickerProps) => {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [timeLabel, setTimeLabel] = useState('Select a time');

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    }

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    }

    const handleConfirm = (selectedTime: Date) => {
        onChange(selectedTime)
        setTimeLabel(selectedTime.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}))
        hideDatePicker()
        console.log('A time has been picked: ', selectedTime);
    }

    return (
        <View>
            <CustomButton
                variant='dark'
                onPress={showDatePicker}
            >
                <Text className='text-white text-2xl font-semibold'>
                    {timeLabel}
                </Text>
                <DateTimePicker
                    isVisible={isDatePickerVisible}
                    mode={"time"}
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                />
            </CustomButton>

        </View>
    )
}

export default TimePicker
import {useState} from "react";
import {Text, View} from "react-native";
import CustomButton from "@/app/components/ui/CustomButton";
import DateTimePicker from "react-native-modal-datetime-picker";

interface TimePickerProps {
    value: string;
    onChange: (time: Date) => void;
}

const TimePicker = ({
    value,
    onChange,
}: TimePickerProps) => {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    }

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    }

    const handleConfirm = (selectedTime: Date) => {
        onChange(selectedTime)
    }

    return (
        <View>
            <CustomButton
                variant='dark'
                onPress={showDatePicker}
            >
                <Text className='text-white text-2xl font-semibold'>
                    Select a time
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
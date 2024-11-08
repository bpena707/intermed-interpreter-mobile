import { TouchableOpacity, View, Text } from "react-native";

interface RadioButtonProps {
    label: string
    value: string
    selectedValue: string
    onChange: (value: string) => void
}

const RadioButton = ({ label, selectedValue, onChange, value }: RadioButtonProps) => {
    const isSelected = value === selectedValue

    return (
        <TouchableOpacity
            onPress={() => onChange(value)}
            className={`flex - row items-center mb-2 `}
        >
            <View className={`h-6 w-6 border-2 rounded-full ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-500'}`} />
            <Text className='ml-2 text-gray-800'>{label}</Text>
        </TouchableOpacity>
    )
}

export default RadioButton
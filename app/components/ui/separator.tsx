import { View, Text} from "react-native";

interface SeparatorProps {
    message?: string
}

export default function Separator({ message }: SeparatorProps) {
    return (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
            <View>
                <Text style={{width: 50, textAlign: 'center'}}>{message}</Text>
            </View>
            <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
        </View>
    );
}
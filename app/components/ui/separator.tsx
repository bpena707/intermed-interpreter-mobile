import { View, Text} from "react-native";

interface SeparatorProps {
    message?: string
}

export default function Separator({ message }: SeparatorProps) {
    return (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
            <View >
                <Text style={{width: "auto", textAlign: 'center', paddingLeft: 12,paddingRight: 12, fontSize: 14}}>{message}</Text>
            </View>
            <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
        </View>
    );
}
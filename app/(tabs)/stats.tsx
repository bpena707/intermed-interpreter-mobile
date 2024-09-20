import { View, Text, StyleSheet } from 'react-native';
import CustomButton from "@/app/components/ui/CustomButton";
import { Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter
} from "@/app/components/ui/card";
import Separator from "@/app/components/ui/separator";


export default function Tab() {
    return (
        <View className={'items-center justify-center'}>

                <CustomButton variant='destructive'>
                    Button
                </CustomButton>

            <Card>
                <CardHeader>
                    <CardTitle>
                        <Text>Card Title</Text>
                    </CardTitle>
                    <CardDescription>
                       <Text>Card Description</Text>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Text>Card Content</Text>
                </CardContent>
                <CardFooter>
                    <Text>Card Footer</Text>
                </CardFooter>
            </Card>

            <Separator/>




        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

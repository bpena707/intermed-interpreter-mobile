import { View, Text, StyleSheet } from 'react-native';
import CustomButton from "@/app/components/ui/CustomButton";
import { Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter
} from "@/app/components/ui/card";


export default function Tab() {
    return (
        <View className={'items-center justify-center'}>

                <CustomButton title={"Confirm"}    />
            <CustomButton title={"Button"} bgVariant={'danger'} textVariant={'danger'}   />
            <CustomButton title={"Button"} bgVariant={'secondary'} textVariant={'secondary'}   />
            <CustomButton title={"Confirm"} bgVariant={'outline'}    />
            <CustomButton title={"Confirm"} bgVariant={'success'} textVariant={'success'}   />

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

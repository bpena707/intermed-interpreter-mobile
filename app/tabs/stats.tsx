import {View, Text, StyleSheet, Switch} from 'react-native';
import CustomButton from "@/app/components/ui/CustomButton";
import { Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter
} from "@/app/components/ui/card";
import Separator from "@/app/components/ui/separator";
import {Input} from "@/app/components/ui/Input";
import {CustomSwitch} from "@/app/components/ui/switch";
import {TextArea} from "@/app/components/ui/text-area";


export default function Tab() {
    return (
        <View className={'items-center justify-center'}>

                <CustomButton variant='destructive'>
                    <Text>Custom Button</Text>
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

            <Input>

            </Input>

            <CustomSwitch value={true} onValueChange={() => {}} />

            <TextArea />






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

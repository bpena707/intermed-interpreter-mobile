import { useUser } from "@clerk/clerk-expo";
import {useState} from "react";
import CustomButton from "@/app/components/ui/CustomButton";
import {Text, TextInput, View} from "react-native";
import * as React from "react";
import {Input} from "@/app/components/ui/Input";

interface ClerkPhoneVerificationProps {
    onContinue: () => void
}

const ClerkPhoneVerification = ({onContinue}: ClerkPhoneVerificationProps) => {
    // const {signUp} = useSignUp()
    const [phoneNumber, setPhoneNumber] = useState('')
    const [code, setCode] = useState('')
    const [pendingVerification, setPendingVerification] = useState(false)
    const {user} = useUser()

    const onSignUpPress = async () => {
        try {
            await user?.update({
                primaryPhoneNumberId: 'phone_number',
            })
            await user?.preparePhoneNumberVerification()
            setPendingVerification(true)
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2))
        }
    }

    const onPressVerify = async () => {
        try {
            const completeSignUp = await signUp?.attemptPhoneNumberVerification({
                code,
            })
            if (completeSignUp?.status === 'complete') {
                onContinue()
            } else {
                console.error(JSON.stringify(completeSignUp, null, 2))
            }
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2))
        }
    }
    return (
        <View >
            {!pendingVerification && (
                <>
                    <Input
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        placeholder='Phone Number'

                    />
                    <CustomButton className='mt-2' onPress={onSignUpPress}>
                        <Text className='text-lg text-white font-extrabold ml-4 tracking-wide'>
                            Submit
                        </Text>
                    </CustomButton>
                </>
            )}
            {pendingVerification && (
                <View>
                    <TextInput
                        value={code}
                        onChangeText={setCode}
                        placeholder='Verification Code'
                    />
                    <CustomButton onPress={onPressVerify}>
                        Verify
                    </CustomButton>
                </View>
            )}
        </View>
    )
}

export default ClerkPhoneVerification;
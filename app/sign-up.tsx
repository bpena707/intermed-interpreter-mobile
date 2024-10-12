import * as React from 'react'
import {TextInput, Button, View, SafeAreaView, Text} from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import {Link, Stack, useRouter} from 'expo-router'
import {Input} from "@/app/components/ui/Input";
import CustomButton from "@/app/components/ui/CustomButton";
import Separator from "@/app/components/ui/separator";
import {AntDesign} from "@expo/vector-icons";

export default function SignUpScreen() {
    const { isLoaded, signUp, setActive } = useSignUp()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [pendingVerification, setPendingVerification] = React.useState(false)
    const [code, setCode] = React.useState('')

    const onSignUpPress = async () => {
        if (!isLoaded) {
            return
        }

        try {
            await signUp.create({
                emailAddress,
                password,
            })

            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

            setPendingVerification(true)
        } catch (err: any) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2))
        }
    }

    const onPressVerify = async () => {
        if (!isLoaded) {
            return
        }

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code,
            })

            if (completeSignUp.status === 'complete') {
                await setActive({ session: completeSignUp.createdSessionId })
                router.replace('/onboarding')
                console.log(router)
            } else {
                console.error(JSON.stringify(completeSignUp, null, 2))
            }
        } catch (err: any) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2))
        }
    }

    return (

        <SafeAreaView className='flex flex-1 bg-slate-200'>

            {!pendingVerification && (
                <>
                    <View className={' items-center mt-10'}>
                        <Text className='text-3xl mb-5 font-semibold'>Sign Up </Text>
                        <View className=' flex flex-col'>
                            <View className=' gap-2 mb-5 '>
                                <Input
                                    inputMode={'email'}
                                    autoCapitalize="none"
                                    value={emailAddress}
                                    placeholder="Email..."
                                    onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
                                />
                                <Input
                                    value={password}
                                    placeholder="Password..."
                                    secureTextEntry={true}
                                    onChangeText={(password) => setPassword(password)}
                                    className='mb-5'
                                />
                                <CustomButton onPress={onSignUpPress}>
                                    <Text className='text-lg text-white font-extrabold ml-4 tracking-wide'>
                                        Submit
                                    </Text>
                                </CustomButton>
                            </View>
                            <View className='flex flex-col items-center mb-5 '>

                            </View>
                            <View className='mb-10'>
                                <Separator message={'or'}/>
                            </View>
                            <View className={'flex flex-col gap-y-2'}>
                                <CustomButton variant='outline' className='flex flex-row '>
                                    <AntDesign name="google" size={24} color="black" />
                                    <Text className='text-lg text-black font-bold ml-4 tracking-wide'>
                                        Google
                                    </Text>
                                </CustomButton>
                                <CustomButton variant='outline' className='flex flex-row '>
                                    <AntDesign name="apple1" size={24} color="black" />
                                    <Text className='text-lg text-black font-bold tracking-wide ml-4'>
                                        Apple
                                    </Text>
                                </CustomButton>
                            </View>
                        </View>
                        <View className='mt-10'>
                            <Link href="/">
                                <Text className='text-blue-600'>Already have an account? Sign In</Text>
                            </Link>
                        </View>
                    </View>
                </>
            )}
            {pendingVerification && (
                <>
                    <TextInput value={code} placeholder="Code..." onChangeText={(code) => setCode(code)} />
                    <Button title="Verify Email" onPress={onPressVerify} />
                </>
            )}
        </SafeAreaView>
    )
}
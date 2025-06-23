import * as React from 'react'
import {TextInput, Button, View, SafeAreaView, Text, TouchableOpacity} from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import {Link, Stack, useRouter} from 'expo-router'
import {Input} from "@/app/components/ui/input";
import CustomButton from "@/app/components/ui/custom-button";
import Separator from "@/app/components/ui/separator";
import {AntDesign, Feather} from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function SignUpScreen() {
    const { isLoaded, signUp, setActive } = useSignUp()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [pendingVerification, setPendingVerification] = React.useState(false)
    const [code, setCode] = React.useState('')
    const [showPassword, setShowPassword] = React.useState(false)

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
            Toast.show({
                type: 'error',
                text1: 'Invalid Code',
                text2: 'Please check and try again'
            })
        }
    }

    const PasswordRequirements = ({ password }: { password: string }) => {
        const requirements = [
            {
                text: "At least 8 characters",
                met: password.length >= 8
            },
            {
                text: "One uppercase letter",
                met: /[A-Z]/.test(password)
            },
            {
                text: "One special character",
                met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
            }
        ];

        return (
            <View className="mb-4">
                {requirements.map((req, index) => (
                    <View key={index} className="flex-row items-center mb-1">
                        <Feather
                            name={req.met ? "check-circle" : "circle"}
                            size={16}
                            color={req.met ? "#22c55e" : "#9ca3af"}
                        />
                        <Text
                            className={`text-xs ml-2 ${
                                req.met ? 'text-green-600' : 'text-gray-500'
                            }`}
                        >
                            {req.text}
                        </Text>
                    </View>
                ))}
            </View>
        );
    };

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
                                <View className='relative'>
                                    <Input
                                        value={password}
                                        placeholder="Password..."
                                        secureTextEntry={!showPassword}
                                        onChangeText={(password) => setPassword(password)}
                                        className='pr-12 mb-1' // Add padding-right for the icon
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowPassword(!showPassword)}
                                        className='absolute right-3 top-3'
                                    >
                                        <Ionicons
                                            name={showPassword ? "eye-off" : "eye"}
                                            size={24}
                                            color="gray"
                                        />
                                    </TouchableOpacity>
                                    <Text className="text-xs text-gray-400 text-center mb-2">
                                        Compromised passwords will be rejected.
                                    </Text>
                                    {password.length > 0 && (
                                        <PasswordRequirements password={password} />
                                    )}
                                </View>
                                <CustomButton onPress={onSignUpPress}>
                                    <Text className='text-lg text-white font-extrabold ml-4 tracking-wide'>
                                        Submit
                                    </Text>
                                </CustomButton>
                            </View>
                            <View className='flex flex-col items-center mb-5 '>

                            </View>
                            <View className='mb-10'>
                                {/*<Separator message={'or'}/>*/}
                                <Separator />
                            </View>

                            {/*<View className={'flex flex-col gap-y-2'}>*/}
                            {/*    <CustomButton variant='outline' className='flex flex-row '>*/}
                            {/*        <AntDesign name="google" size={24} color="black" />*/}
                            {/*        <Text className='text-lg text-black font-bold ml-4 tracking-wide'>*/}
                            {/*            Google*/}
                            {/*        </Text>*/}
                            {/*    </CustomButton>*/}
                            {/*    <CustomButton variant='outline' className='flex flex-row '>*/}
                            {/*        <AntDesign name="apple1" size={24} color="black" />*/}
                            {/*        <Text className='text-lg text-black font-bold tracking-wide ml-4'>*/}
                            {/*            Apple*/}
                            {/*        </Text>*/}
                            {/*    </CustomButton>*/}
                            {/*</View>*/}
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
                    <Text className="text-center text-gray-600 dark:text-gray-400 mb-2">
                        Enter the code sent to your email address then press "Verify Email"
                    </Text>
                    <Input value={code} placeholder="Code..." onChangeText={(code) => setCode(code)} />
                    <Button title="Verify Email" onPress={onPressVerify} />
                </>
            )}
        </SafeAreaView>
    )
}
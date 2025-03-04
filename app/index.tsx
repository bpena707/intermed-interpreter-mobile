import {SignedIn, SignedOut, useUser, useSignIn, useOAuth, useSignUp} from '@clerk/clerk-expo'
import {Link, router, useLocalSearchParams, useRouter} from 'expo-router'
import {Button, SafeAreaView, Text, TextInput, View} from 'react-native'
import React, {useState} from "react";
import {Input} from "@/app/components/ui/input";
import {flex} from "nativewind/dist/postcss/to-react-native/properties/flex";
import CustomButton from "@/app/components/ui/custom-button";
import Separator from "@/app/components/ui/separator";
import {AntDesign} from "@expo/vector-icons";
import 'react-native-get-random-values';
import Toast from "react-native-toast-message";


// enum Strategy {
//     Google = 'oauth_google',
//     Apple = 'oauth_apple'
// }

export default function Page() {
    const { type } = useLocalSearchParams<{ type: string }>()
    const [loading, setLoading] = useState(false)
    const [emailAddress, setEmailAddress] = useState('')
    const [password, setPassword] = useState('')
    const {signIn, setActive, isLoaded} = useSignIn()
    const {signUp, isLoaded: signUpLoaded, setActive: signupSetActive} = useSignUp()

    const onSignUpPress = async () => {
        if (!signUpLoaded) return

        setLoading(true)

        try {
            const result = await signUp.create({ emailAddress, password  })

            await signupSetActive({
                session: result.createdSessionId
            })
        }catch (e) {
            console.log(e)

        } finally {
            setLoading(false)
        }
    }

    const onSignInPress = async () => {
        if (!isLoaded) {
            return
        }

        try {
            const signInAttempt = await signIn.create({
                identifier: emailAddress,
                password,
            })

            if (signInAttempt.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId })
                router.replace('/')
            } else {
                // See https://clerk.com/docs/custom-flows/error-handling
                // for more info on error handling
                console.error(JSON.stringify(signInAttempt, null, 2))
            }
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2))
        }
    }

    // const { startOAuthFlow: appleAuth } = useOAuth({ strategy: "oauth_apple" })
    // const { startOAuthFlow: googleAuth } = useOAuth({ strategy: "oauth_google" })
    //
    // const onSelectAuth = async (strategy: Strategy) => {
    //     const selectedAuth = {
    //         [Strategy.Google]: googleAuth,
    //         [Strategy.Apple]: appleAuth,
    //     }[strategy];
    //
    //     try {
    //         const { createdSessionId, setActive } = await selectedAuth();
    //
    //         //if we get the createdSessionId the user is authenticated and set the active session using the id
    //         if (createdSessionId) {
    //             await setActive!({session: createdSessionId});
    //             router.back();
    //         }
    //     } catch (err) {
    //         console.error('Authorization Error', err);
    //     }
    // };

    return (
        <SafeAreaView className={'bg-slate-200 flex flex-1 '}>
            <View className={' items-center mt-10'}>
                <Text className='text-3xl mb-5 font-semibold'>Welcome Back! </Text>
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
                        <CustomButton onPress={() => onSignInPress()}>
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
                        <CustomButton variant='outline' className='flex flex-row ' >
                            <AntDesign name="google" size={24} color="black" />
                            <Text className='text-lg text-black font-bold ml-4 tracking-wide' >
                                Google
                            </Text>
                        </CustomButton>
                        <CustomButton variant='outline' className='flex flex-row ' >
                            <AntDesign name="apple1" size={24} color="black" />
                            <Text className='text-lg text-black font-bold tracking-wide ml-4'>
                                Apple
                            </Text>
                        </CustomButton>
                    </View>
                </View>
                <View className='mt-10'>
                    <Link href="/sign-up">
                        <Text className='text-blue-600'>Dont have an account yet? Sign Up</Text>
                    </Link>
                </View>
            </View>

        </SafeAreaView>
    )
}
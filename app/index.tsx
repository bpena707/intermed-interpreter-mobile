import {SignedIn, SignedOut, useUser, useSignIn, useOAuth} from '@clerk/clerk-expo'
import {Link, useRouter} from 'expo-router'
import {Button, SafeAreaView, Text, TextInput, View} from 'react-native'
import React, {useState} from "react";
import {Input} from "@/app/components/ui/Input";
import {flex} from "nativewind/dist/postcss/to-react-native/properties/flex";
import CustomButton from "@/app/components/ui/CustomButton";
import Separator from "@/app/components/ui/separator";
import {AntDesign} from "@expo/vector-icons";

enum Strategy {
    Google = 'oauth_google',
    Apple = 'oauth_apple'
}

export default function Page() {
    const { user } = useUser()
    const {signIn, setActive, isLoaded} = useSignIn()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = useState('')
    const [password, setPassword] = useState('')

    const onSignInPress = React.useCallback(async () => {
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
    }, [isLoaded, emailAddress, password])

    const { startOAuthFlow: appleAuth } = useOAuth({ strategy: "oauth_apple" })
    const { startOAuthFlow: googleAuth } = useOAuth({ strategy: "oauth_google" })

    const onSelectAuth = async (strategy: Strategy) => {

    }


    return (
        <SafeAreaView className={'flex flex-1'}>
            <SignedIn>
                <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
            </SignedIn>
            <SignedOut>
                <View className={'items-center mt-10'}>
                    <Text className='text-3xl mb-5'>Welcome Back! </Text>
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
                            />
                        </View>
                        <View className='flex flex-col items-center mb-5 '>

                        </View>
                        <View className='mb-5'>
                            <Separator message={'or'}/>
                        </View>
                        <View className={'flex flex-col '}>
                            <CustomButton className='flex flex-row '>
                                <AntDesign name="google" size={24} color="black" />
                                <Text className='text-lg text-black font-semibold ml-2'>
                                    Google
                                </Text>
                            </CustomButton>

                        </View>
                    </View>
                    <Link href="/sign-up">
                        <Text>Sign Up</Text>
                    </Link>
                </View>
            </SignedOut>
        </SafeAreaView>
    )
}
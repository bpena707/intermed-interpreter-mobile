import {useSignIn, useSSO, useUser} from '@clerk/clerk-expo'
import {Link, router} from 'expo-router'
import {ActivityIndicator, SafeAreaView, Text, TouchableOpacity, View} from 'react-native'
import React, {useCallback, useEffect, useState} from "react";
import {Input} from "@/app/components/ui/input";
import CustomButton from "@/app/components/ui/custom-button";
import Separator from "@/app/components/ui/separator";
import {AntDesign} from "@expo/vector-icons";
import 'react-native-get-random-values';
import Toast from "react-native-toast-message";
import * as WebBrowser from 'expo-web-browser'
import * as AuthSession from 'expo-auth-session'
import Ionicons from "@expo/vector-icons/Ionicons";

export const useWarmUpBrowser = () => {
    useEffect(() => {
        // Preloads the browser for Android devices to reduce authentication load time
        // See: https://docs.expo.dev/guides/authentication/#improving-user-experience
        void WebBrowser.warmUpAsync()
        return () => {
            // Cleanup: closes browser when component unmounts
            void WebBrowser.coolDownAsync()
        }
    }, [])
}

// Handle any pending authentication sessions
WebBrowser.maybeCompleteAuthSession()

export default function Page() {
    // const { type } = useLocalSearchParams<{ type: string }>()
    const [loading, setLoading] = useState(false)
    const [emailAddress, setEmailAddress] = useState('')
    const [password, setPassword] = useState('')
    const {signIn, setActive, isLoaded} = useSignIn()
    // const {signUp, isLoaded: signUpLoaded, setActive: signupSetActive} = useSignUp()
    const [ showPassword, setShowPassword ] = useState(false)

    //methods from clerk to preload browser and use SSO
    useWarmUpBrowser()
    const { startSSOFlow } = useSSO()

    const onPressGoogle = useCallback(async () => {
        try {
            setLoading(true)
            // Start the authentication process by calling `startSSOFlow()`
            const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
                strategy: 'oauth_google',
                // For web, defaults to current path
                // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
                // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
                redirectUrl: AuthSession.makeRedirectUri(),
            })

            // If sign in was successful, set the active session
            if (createdSessionId) {
                setActive!({ session: createdSessionId })
                // Redirect to root after successful sign in to handle statuses
                router.replace('/')
            } else {
                console.log('no session created')
                Toast.show({
                    type: 'error',
                    text1: 'Sign in incomplete',
                    text2: 'Please try again with email and password'
                })
            }
        } catch (err) {
            console.error(JSON.stringify(err, null, 2))
            Toast.show({
                type: 'error',
                text1: 'Sign in failed',
                text2: 'Please try again'
            })
        } finally {
            setLoading(false)
        }
    }, [])

    const onSignInPress = async () => {
        if (!isLoaded) {
            return
        }
        setLoading(true)

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
            if (err.errors?.[0]?.code === 'form_password_incorrect') {
                Toast.show({
                    type: 'error',
                    text1: 'Incorrect password',
                    text2: 'Please check your password and try again'
                })
            } else if (err.errors?.[0]?.code === 'user_locked') {
                Toast.show({
                    type: 'error',
                    text1: 'Account locked',
                    text2: 'Too many failed attempts. Please try again later'
                })
            }else if (err.errors?.[0]?.code === 'form_identifier_not_found') {
                Toast.show({
                    type: 'error',
                    text1: 'Account not found',
                    text2: 'No account exists with this email'
                })
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Sign in failed',
                    text2: err.errors?.[0]?.message || 'Please check your credentials'
                })
            }
        } finally {
            setLoading(false)
        }
    }

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
                            textContentType="emailAddress" //ios
                            autoComplete='email' //android
                        />
                        <View className='relative'>
                            <Input
                                value={password}
                                placeholder="Password..."
                                secureTextEntry={!showPassword}
                                onChangeText={(password) => setPassword(password)}
                                className={'mb-5'}
                                textContentType={'password'} //ios
                                autoComplete='password' //android

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
                        </View>

                        <View className='flex items-center justify-center'>
                            <TouchableOpacity
                                onPress={() => router.push('/forgot-password')}
                                className='self-end mb-3'
                            >
                                <Text className='text-blue-600 text-sm'>Forgot password?</Text>
                            </TouchableOpacity>
                        </View>

                        <CustomButton onPress={() => onSignInPress()}>
                            <Text className='text-lg text-white font-extrabold ml-4 tracking-wide'>
                                Submit
                            </Text>
                        </CustomButton>
                    </View>
                    <View className='flex flex-col items-center mb-5 '>
                    </View>
                    <View className='mb-10'>
                        <Separator message={'Or'} />
                    </View>
                    <View className={'flex flex-col gap-y-4'}>
                        <CustomButton
                            variant='outline'
                            className='flex flex-row '
                            onPress={onPressGoogle}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="black" />
                            ) : (
                                <>
                                    <AntDesign name="google" size={24} color="black" />
                                    <Text className='text-lg text-black font-bold ml-4 tracking-wide'>
                                        Google
                                    </Text>
                                </>
                            )}
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
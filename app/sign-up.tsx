import * as React from 'react'
import {TextInput, Button, View, SafeAreaView, Text, TouchableOpacity, ActivityIndicator} from 'react-native'
import {useSignUp, useSSO} from '@clerk/clerk-expo'
import {Link, Stack, useRouter} from 'expo-router'
import {Input} from "@/app/components/ui/input";
import CustomButton from "@/app/components/ui/custom-button";
import Separator from "@/app/components/ui/separator";
import {AntDesign, Feather} from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useCallback, useEffect, useRef, useState} from "react";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";

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

WebBrowser.maybeCompleteAuthSession()

export default function SignUpScreen() {
    const { isLoaded, signUp, setActive } = useSignUp()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [pendingVerification, setPendingVerification] = React.useState(false)
    const [code, setCode] = React.useState('')
    const [showPassword, setShowPassword] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [codeDigits, setCodeDigits] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef<Array<TextInput | null>>([]);
    const [isResending, setIsResending] = React.useState(false)
    const [resendTimer, setResendTimer] = React.useState(0);

    React.useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

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
            } else {
                // If there is no `createdSessionId`,
                // there are missing requirements, such as MFA
                // Use the `signIn` or `signUp` returned from `startSSOFlow`
                // to handle next steps
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

    const onSignUpPress = async () => {
        if (!isLoaded) {
            return
        }
        setLoading(true)

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
            if (err.errors?.[0]?.code === 'form_identifier_exists') {
                Toast.show({
                    type: 'error',
                    text1: 'Email already registered',
                    text2: 'Please sign in or use a different email'
                })
            } else if (err.errors?.[0]?.code === 'form_password_pwned') {
                Toast.show({
                    type: 'error',
                    text1: 'Compromised Password',
                    text2: 'This password was found in a data breach. Please choose a different one.'
                })
            } else if (err.errors?.[0]?.code === 'form_password_not_strong_enough') {
                Toast.show({
                    type: 'error',
                    text1: 'Weak Password',
                    text2: 'Password needs uppercase, lowercase, and numbers'
                })
            } else if (err.errors?.[0]?.code === 'form_password_length_too_short') {
                Toast.show({
                    type: 'error',
                    text1: 'Password Too Short',
                    text2: 'Password must be at least 8 characters'
                })
            } else if (err.errors?.[0]?.code === 'form_param_format_invalid' && err.errors?.[0]?.meta?.param_name === 'email_address') {
                Toast.show({
                    type: 'error',
                    text1: 'Invalid Email',
                    text2: 'Please enter a valid email address'
                })
            } else if (err.errors?.[0]?.code === 'form_password_same_as_email') {
                Toast.show({
                    type: 'error',
                    text1: 'Insecure Password',
                    text2: "Password can't be the same as your email"
                })
            } else if (err.errors?.[0]?.code === 'form_password_same_as_username') {
                Toast.show({
                    type: 'error',
                    text1: 'Insecure Password',
                    text2: "Password can't be the same as your username"
                })
            } else if (err.errors?.[0]?.code === 'form_param_nil' || err.errors?.[0]?.code === 'form_param_missing') {
                Toast.show({
                    type: 'error',
                    text1: 'Missing Information',
                    text2: 'Please fill in all required fields'
                })
            } else {
                // Generic error fallback
                Toast.show({
                    type: 'error',
                    text1: 'Sign up failed',
                    text2: err.errors?.[0]?.message || 'Please try again'
                })
            }
        } finally {
            setLoading(false)
        }
    }

    const onPressVerify = async () => {
        if (!isLoaded) {
            return
        }

        setLoading(true)

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
            if (err.errors?.[0]?.code === 'form_code_incorrect') {
                Toast.show({
                    type: 'error',
                    text1: 'Invalid Code',
                    text2: 'Please check the code and try again'
                })
            } else if (err.errors?.[0]?.code === 'verification_expired') {
                Toast.show({
                    type: 'error',
                    text1: 'Code Expired',
                    text2: 'Please request a new verification code'
                })
            } else if (err.errors?.[0]?.code === 'verification_failed') {
                Toast.show({
                    type: 'error',
                    text1: 'Verification Failed',
                    text2: 'Too many attempts. Please request a new code'
                })
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Verification Error',
                    text2: err.errors?.[0]?.message || 'Please try again'
                })
            }
        } finally {
            setLoading(false)
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
                                <Separator message={'Or'} />
                            </View>
                            <View className='flex flex-col gap-y-4'>
                                <CustomButton
                                    variant='outline'
                                    className='flex flex-row'
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
                <View className='flex-1 bg-slate-200 px-6'>
                    <View className='flex-1 justify-center'>
                        <View className='items-center mb-8'>
                            <View className='w-20 h-20 bg-blue-500 rounded-full items-center justify-center mb-4'>
                                <Ionicons name="mail-outline" size={40} color="white" />
                            </View>
                            <Text className='text-2xl font-bold text-gray-800'>Check your email</Text>
                        </View>

                        {/* Instructions */}
                        <View className='mb-8'>
                            <Text className='text-center text-gray-600 text-base mb-2'>
                                We sent a verification code to
                            </Text>
                            <Text className='text-center text-gray-800 font-semibold text-base'>
                                {emailAddress || 'your email address'}
                            </Text>
                        </View>

                        {/* Code Input */}
                        <View className='mb-6'>
                            <Text className='text-sm text-gray-600 mb-3 text-center'>
                                Enter verification code
                            </Text>
                            <View className='flex-row justify-center gap-2'>
                                {codeDigits.map((digit, index) => (
                                    <TextInput
                                        key={index}
                                        ref={el => inputRefs.current[index] = el}
                                        value={digit}
                                        onChangeText={(text) => {
                                            const newDigits = [...codeDigits];
                                            newDigits[index] = text;
                                            setCodeDigits(newDigits);
                                            setCode(newDigits.join(''));

                                            // Auto-advance to next input
                                            if (text && index < 5) {
                                                inputRefs.current[index + 1]?.focus();
                                            }
                                        }}
                                        onKeyPress={({ nativeEvent }) => {
                                            // Handle backspace
                                            if (nativeEvent.key === 'Backspace' && !digit && index > 0) {
                                                inputRefs.current[index - 1]?.focus();
                                            }
                                        }}
                                        maxLength={1}
                                        keyboardType="number-pad"
                                        className='w-12 h-14 bg-white rounded-lg text-center text-xl font-semibold'
                                        style={{
                                            shadowColor: '#000',
                                            shadowOffset: { width: 0, height: 1 },
                                            shadowOpacity: 0.1,
                                            shadowRadius: 2,
                                            elevation: 2,
                                        }}
                                    />
                                ))}
                            </View>
                        </View>


                        {/* Verify Button */}
                        <CustomButton
                            onPress={onPressVerify}
                            disabled={loading || code.length < 6}
                            className='mb-4'
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className='text-white text-lg font-semibold'>
                                    Verify Email
                                </Text>
                            )}
                        </CustomButton>

                        {/* Resend Option */}
                        <TouchableOpacity
                            onPress={async () => {
                                if (!isLoaded || !signUp || isResending) return;

                                setIsResending(true);

                                try {
                                    // Resend the verification code
                                    await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

                                    Toast.show({
                                        type: 'success',
                                        text1: 'Verification Code Sent!',
                                        text2: `Check ${emailAddress} for a new code`
                                    });
                                    setResendTimer(60);

                                } catch (err: any) {
                                    console.error('Resend error:', err);

                                    // Handle specific Clerk errors
                                    if (err.errors?.[0]?.code === 'verification_already_verified') {
                                        Toast.show({
                                            type: 'info',
                                            text1: 'Already Verified',
                                            text2: 'This email is already verified'
                                        });
                                    } else {
                                        Toast.show({
                                            type: 'error',
                                            text1: 'Failed to resend code',
                                            text2: err.errors?.[0]?.message || 'Please try again later'
                                        });
                                    }
                                } finally {
                                    setIsResending(false);
                                }
                            }}
                            className='py-2'
                            disabled={isResending || resendTimer > 0}
                        >
                            <Text className={`text-center text-sm ${(isResending || resendTimer > 0) ? 'text-gray-400' : 'text-blue-600'}`}>
                                {isResending ? 'Sending...' :
                                    resendTimer > 0 ? `Resend code in ${resendTimer}s` :
                                        "Didn't receive the code? Resend"}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Footer */}
                    <View className='pb-6'>
                        <TouchableOpacity
                            onPress={() => {
                                setPendingVerification(false);
                                // Clear form or navigate back
                            }}
                        >
                            <Text className='text-center text-gray-500 text-sm'>
                                ← Back to Sign Up
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </SafeAreaView>
    )
}
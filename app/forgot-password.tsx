// app/forgot-password.tsx
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    ActivityIndicator,
    Platform,
    KeyboardAvoidingView
} from 'react-native';
import { useAuth, useSignIn } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { Input } from '@/app/components/ui/input';
import CustomButton from '@/app/components/ui/custom-button';
import { Ionicons } from '@expo/vector-icons';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [successfulCreation, setSuccessfulCreation] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();
    const { isSignedIn } = useAuth();
    const { isLoaded, signIn, setActive } = useSignIn();

    useEffect(() => {
        if (isSignedIn) {
            router.replace('/tabs/home');
        }
    }, [isSignedIn]);

    if (!isLoaded) {
        return (
            <SafeAreaView className='flex-1 bg-slate-200 items-center justify-center'>
                <ActivityIndicator size="large" />
            </SafeAreaView>
        );
    }

    // Send the password reset code to the user's email
    async function create() {
        if (!email) {
            setError('Please enter your email address');
            return;
        }

        setLoading(true);
        setError('');

        await signIn
            ?.create({
                strategy: 'reset_password_email_code',
                identifier: email,
            })
            .then(() => {
                setSuccessfulCreation(true);
                setError('');
            })
            .catch((err) => {
                console.error('error', err.errors[0].longMessage);
                setError(err.errors[0].longMessage);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    // Reset the user's password
    async function reset() {
        if (!code || !password) {
            setError('Please enter both code and new password');
            return;
        }

        setLoading(true);
        setError('');

        await signIn
            ?.attemptFirstFactor({
                strategy: 'reset_password_email_code',
                code,
                password,
            })
            .then((result) => {
                if (result.status === 'complete') {
                    // Set the active session to the newly created session
                    setActive({ session: result.createdSessionId });
                    setError('');
                } else {
                    console.log(result);
                    setError('Something went wrong. Please try again.');
                }
            })
            .catch((err) => {
                console.error('error', err.errors[0].longMessage);
                setError(err.errors[0].longMessage);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <SafeAreaView className='flex-1 bg-slate-200'>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className='flex-1'
            >
            <View className='flex-1 px-6'>
                {/* Header */}
                <View className='flex-row items-center mt-4 mb-8'>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <Text className='text-xl font-semibold ml-4'>Forgot Password?</Text>
                </View>

                {!successfulCreation ? (
                    // Step 1: Request reset code
                    <View className='flex-1 justify-center'>
                        <View className='items-center mb-8'>
                            <View className='w-20 h-20 bg-blue-500 rounded-full items-center justify-center mb-4'>
                                <Ionicons name="lock-closed-outline" size={40} color="white" />
                            </View>
                            <Text className='text-2xl font-bold text-gray-800 mb-2'>
                                Reset your password
                            </Text>
                            <Text className='text-gray-600 text-center px-4'>
                                Enter your email address and we'll send you a code to reset your password
                            </Text>
                        </View>

                        <View className='mb-4'>
                            <Text className='text-sm text-gray-700 mb-2 font-medium'>
                                Email address
                            </Text>
                            <Input
                                inputMode='email'
                                autoCapitalize="none"
                                placeholder="john@doe.com"
                                value={email}
                                onChangeText={(text) => {
                                    setEmail(text);
                                    setError(''); // Clear error when typing
                                }}
                            />
                        </View>

                        {error ? (
                            <View className='bg-red-50 border border-red-200 rounded-lg p-3 mb-4'>
                                <Text className='text-red-600 text-sm'>{error}</Text>
                            </View>
                        ) : null}

                        <CustomButton
                            onPress={create}
                            disabled={loading || !email}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className='text-white text-lg font-semibold'>
                                    Send password reset code
                                </Text>
                            )}
                        </CustomButton>

                        <TouchableOpacity
                            onPress={() => router.back()}
                            className='mt-6'
                        >
                            <Text className='text-center text-blue-600'>
                                Back to Sign In
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    // Step 2: Enter code and new password
                    <View className='flex-1 justify-center'>
                        <View className='items-center mb-8'>
                            <View className='w-20 h-20 bg-green-500 rounded-full items-center justify-center mb-4'>
                                <Ionicons name="mail-open-outline" size={40} color="white" />
                            </View>
                            <Text className='text-2xl font-bold text-gray-800 mb-2'>
                                Check your email
                            </Text>
                            <Text className='text-gray-600 text-center px-4'>
                                We sent a code to {email}
                            </Text>
                        </View>

                        <View className='mb-4'>
                            <Text className='text-sm text-gray-700 mb-2 font-medium'>
                                New password
                            </Text>
                            <View className='relative'>
                                <Input
                                    value={password}
                                    placeholder="Enter your new password"
                                    secureTextEntry={!showPassword}
                                    onChangeText={(text) => {
                                        setPassword(text);
                                        setError('');
                                    }}
                                    textContentType="newPassword" // iOS - suggests strong passwords
                                    autoComplete="password-new" // Android
                                    className='pr-12'
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
                        </View>

                        <View className='mb-4'>
                            <Text className='text-sm text-gray-700 mb-2 font-medium'>
                                Reset code from email
                            </Text>
                            <Input
                                value={code}
                                placeholder="Enter 6-digit code"
                                onChangeText={(text) => {
                                    setCode(text);
                                    setError('');
                                }}
                                keyboardType="number-pad"
                                maxLength={6}
                                className='text-center text-xl tracking-widest'
                            />
                        </View>

                        {error ? (
                            <View className='bg-red-50 border border-red-200 rounded-lg p-3 mb-4'>
                                <Text className='text-red-600 text-sm'>{error}</Text>
                            </View>
                        ) : null}

                        <CustomButton
                            onPress={reset}
                            disabled={loading || !code || !password}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className='text-white text-lg font-semibold'>
                                    Reset Password
                                </Text>
                            )}
                        </CustomButton>

                        <TouchableOpacity
                            onPress={() => {
                                setSuccessfulCreation(false);
                                setCode('');
                                setPassword('');
                                setError('');
                            }}
                            className='mt-6'
                        >
                            <Text className='text-center text-blue-600'>
                                Didn't receive the code? Try again
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
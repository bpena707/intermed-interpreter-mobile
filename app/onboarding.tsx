import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator
} from "react-native";
import {useState} from "react";
import {router, Stack} from "expo-router";
import * as z from "zod"
import {useCreateInterpreter} from "@/app/features/profile/api/use-create-interpreter";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/app/components/ui/input";
import CustomButton from "@/app/components/ui/custom-button";
import Toast from "react-native-toast-message";
import {useUser} from "@clerk/clerk-expo";
import {MaterialIcons} from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";


//schema to validate onboarding form
const onBoardingSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phoneNumber: z.string(),
    // targetLanguages: z.array(z.string()),
    // isCertified: z.boolean(),
})

//type to validate onboarding form
type OnBoardingValues = z.input<typeof onBoardingSchema>

export default function onboardingScreen () {
    const mutation = useCreateInterpreter()
    const { user } = useUser()
    const [loading, setLoading] = useState(false)
    const {control, handleSubmit, formState: { errors }} = useForm<OnBoardingValues>({
        resolver: zodResolver(onBoardingSchema)
    })

    const onSubmit = (values: OnBoardingValues) => {
        mutation.mutate(values, {
            onSuccess: () => {
                Toast.show({
                    type: 'success',
                    text1: 'Profile created successfully',
                })
                router.replace('/tabs/home')
            },
            onError: (error) => {
                Toast.show({
                    type: 'error',
                    text1: 'Failed to submit info',
                    text2: error?.message || 'An error occurred'
                })
                console.error('Failed to create interpreter', error)
            },
        })
    }

    return (
        <SafeAreaView className='flex flex-1 bg-slate-400'>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className='flex-1'
            >
            <ScrollView
                className='flex-1 contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}' >
                {/*welcome screen */}
                <View className='items-center mb-4'>
                    <View className='w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full items-center justify-center mb-2 shadow-lg'>
                        <MaterialIcons name="person-add" size={48} color="white" />
                    </View>
                    <Text className='text-3xl font-bold text-gray-800 text-center mb-2'>
                        Welcome aboard! 🎉
                    </Text>
                    <Text className='text-base text-gray-600 text-center px-4'>
                        Let's set up your interpreter profile in just a few steps
                    </Text>
                </View>

                {/*input fields*/}

                <View className='space-y-4 p-2'>
                    <View>
                        <View className='flex-row items-center mb-2'>
                            <Ionicons name="person-outline" size={20} color="#6B7280" />
                            <Text className='text-sm font-medium text-gray-700 ml-2'>
                                First Name
                            </Text>
                        </View>
                        <Controller
                            control={control}
                            name={'firstName'}
                            render={({ field: { onChange, value }}) => (
                                <Input
                                    placeholder={'First Name '}
                                    value={value}
                                    onChangeText={onChange}
                                    className={errors.firstName ? 'border-red-500' : ''}
                                />
                            )}
                        />
                        {errors.firstName && <Text>{errors.firstName.message}</Text>}
                    </View>
                    <View>
                        <View className='flex-row items-center mb-2'>
                            <Ionicons name="person-outline" size={20} color="#6B7280" />
                            <Text className='text-sm font-medium text-gray-700 ml-2'>
                                Last Name
                            </Text>
                        </View>
                            <Controller
                                control={control}
                                name={'lastName'}
                                render={({ field: { onChange, value }}) => (
                                    <Input
                                        placeholder={'Last Name '}
                                        value={value}
                                        onChangeText={onChange}
                                        className={errors.lastName ? 'border-red-500' : ''}
                                    />
                                )}
                            />
                            {errors.lastName && <Text>{errors.lastName.message}</Text>}
                    </View>
                    <View className='mt-4'>
                        <View className='flex-row items-center mb-2'>
                            <Ionicons name="mail-outline" size={20} color="#6B7280" />
                            <Text className='text-sm font-medium text-gray-700 ml-2'>
                                Email Address
                            </Text>
                        </View>
                        <Controller
                            control={control}
                            name={'email'}
                            render={({ field: { onChange, value }}) => (
                                <Input
                                    placeholder={'john.doe@example.com'}
                                    value={value}
                                    keyboardType={'email-address'}
                                    onChangeText={onChange}
                                    autoCapitalize={'none'}
                                    className={errors.email ? 'border-red-500' : ''}
                                />
                            )}
                        />
                        {errors.email && <Text>{errors.email.message}</Text>}
                    </View>
                    <View className={'mt-4'}>
                        <View className='flex-row items-center mb-2'>
                            <Ionicons name="call-outline" size={20} color="#6B7280" />
                            <Text className='text-sm font-medium text-gray-700 ml-2'>
                                Phone Number
                            </Text>
                        </View>
                        <Controller
                            control={control}
                            name={'phoneNumber'}
                            render={({ field: { onChange, value }}) => (

                                <Input
                                    placeholder={'5551234567 '}
                                    value={value}
                                    onChangeText={onChange}
                                    keyboardType={'phone-pad'}
                                    className={errors.phoneNumber ? 'border-red-500' : ''}
                                />
                            )}
                        />
                        {errors.phoneNumber && <Text>{errors.phoneNumber.message}</Text>}
                    </View>
                </View>
                <View className={'mt-8 mb-4 p-2'}>
                    <CustomButton onPress={handleSubmit(onSubmit)} disabled={loading}>
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <View className='flex-row items-center justify-center'>
                                <Text className='text-lg text-white font-bold mr-2'>
                                    Complete Setup
                                </Text>
                                <Ionicons name="arrow-forward" size={20} color="white" />
                            </View>
                        )}
                    </CustomButton>
                </View>
            </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
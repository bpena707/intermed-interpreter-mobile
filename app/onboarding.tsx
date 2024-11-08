import {View, Text, SafeAreaView, TouchableOpacity, ScrollView} from "react-native";
import {useState} from "react";
import {router, Stack} from "expo-router";
import * as z from "zod"
import {useCreateInterpreter} from "@/app/features/profile/api/use-create-interpreter";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/app/components/ui/Input";
import CustomButton from "@/app/components/ui/CustomButton";
import Toast from "react-native-toast-message";

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
                router.replace('/(tabs)/home')
            },
            onError: (error) => {
                Toast.show({
                    type: 'error',
                    text1: 'Failed to submit info',
                    text2: error?.message || 'An error occurred'
                })
                console.error('Failed to create interpreter', error)
            }
        })
    }

    return (
        <SafeAreaView className='flex flex-1 bg-slate-400'>
            <ScrollView className='flex-1 m-2' >
                <Text className='text-3xl mb-5 '>
                    Happy to have you on board! Let's get started by filling out the form below.
                </Text>
                <View className='mb-5 gap-y-4'>
                    <Controller
                        control={control}
                        name={'firstName'}
                        render={({ field: { onChange, value }}) => (
                            <Input
                                placeholder={'First Name '}
                                value={value}
                                onChangeText={onChange}
                            />
                        )}
                    />
                    {errors.firstName && <Text>{errors.firstName.message}</Text>}
                    <Controller
                        control={control}
                        name={'lastName'}
                        render={({ field: { onChange, value }}) => (
                            <Input
                                placeholder={'Last Name '}
                                value={value}
                                onChangeText={onChange}
                            />
                        )}
                    />
                    {errors.lastName && <Text>{errors.lastName.message}</Text>}
                    <Controller
                        control={control}
                        name={'email'}
                        render={({ field: { onChange, value }}) => (
                            <Input
                                placeholder={'Email '}
                                value={value}
                                onChangeText={onChange}
                            />
                        )}
                    />
                    {errors.email && <Text>{errors.email.message}</Text>}
                    <Controller
                        control={control}
                        name={'phoneNumber'}
                        render={({ field: { onChange, value }}) => (
                            <Input
                                placeholder={'Phone Number '}
                                value={value}
                                onChangeText={onChange}
                            />
                        )}
                    />
                    {errors.phoneNumber && <Text>{errors.phoneNumber.message}</Text>}
                    {/*<Controller*/}
                    {/*    control={control}*/}
                    {/*    name={'targetLanguages'}*/}
                    {/*    render={({ field: { onChange, value }}) => (*/}
                    {/*        <Input*/}
                    {/*            placeholder={'Target Languages '}*/}
                    {/*            value={value}*/}
                    {/*            onChangeText={onChange}*/}
                    {/*        />*/}
                    {/*    )}*/}
                    {/*/>*/}
                    {/*{errors.targetLanguages && <Text>{errors.targetLanguages.message}</Text>}*/}
                    {/*<Controller*/}
                    {/*    control={control}*/}
                    {/*    name={'isCertified'}*/}
                    {/*    render={({ field: { onChange, value }}) => (*/}
                    {/*        */}
                    {/*    )}*/}
                    {/*/>*/}
                </View>
                <View>
                    <CustomButton onPress={handleSubmit(onSubmit)}>
                        <Text className='text-lg text-white font-extrabold ml-4 tracking-wide'>
                            Submit
                        </Text>
                    </CustomButton>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
import {View, Text, SafeAreaView, TouchableOpacity} from "react-native";
import {useState} from "react";
import {router, Stack} from "expo-router";
import CustomButton from "@/app/components/ui/CustomButton";
import {AntDesign} from "@expo/vector-icons";
import {Input} from "@/app/components/ui/Input";
import LottieView from "lottie-react-native";
import ClerkPhoneVerification from "@/app/clerk-phone-verification";

const onboardingSteps = [
    {
        image: (
            <View className='flex items-center justify-center '>
                <LottieView style={{ width:500, height:500, marginBottom:40 }} source={require('../assets/lottie/productivity.json')} autoPlay loop />
            </View>
            ),
        title: 'Step Into the Future - Your Journey Starts Here!',
        description: 'Welcome to InterMed, the essential tool for managing your interpreting appointments effortlessly. Track your schedule, update job statuses, and never miss an opportunity again—all from one app. Ready to take control of your interpreter business?',

    },
    {
        image: (
            <View className='flex items-center justify-center '>
                <LottieView style={{ width:400, height:400, marginBottom:40, marginLeft: 40 }} source={require('../assets/lottie/email.json')} autoPlay loop />
            </View>
        ),
        title: 'Lets Start with Contact Information',
        description: 'Tell us the best way to reach you. We will use this information to send you appointment reminders, updates, and more.',
        phoneInputTitle: 'Phone Number',
        phoneInput: (
            <ClerkPhoneVerification onContinue={() => {}} />
        ),

    },
    {
        title: 'Tell us about where you are located and how far you are willing to travel.',
        description: 'Choose the locations you are willing to travel to for appointments. This will help us match you with the right opportunities.',
        inputTitle: 'Location',
        input: {
            placeholder: 'Zipcode',
        },

    },
    {
        title: 'Help us understand your interpreting experience.',
        description: 'Include certifications, languages spoken and specializations ',

    },
    {
        title: 'What dates and times are you available?',
        description: 'Let us know when you are available for appointments',

    },
    {
        title: 'Do you have any preferences for appointments?',
        description: 'Are you open to on-site appointments, remote appointments, or both?',
    },
    {
        title: 'Add relevant certifications and documents',
        description: 'Upload your certifications and documents to help us verify your qualifications',
    },
    {
        title: 'Your all set!',
        description: 'You are all set to start receiving appointments. You can always update your information in the app settings',
    }
]

export default function OnBoardingScreen () {

    const [screenIndex, setScreenIndex] = useState(0)
    const data = onboardingSteps[screenIndex]

    const onContinue = () => {
        const lastScreenIndex = screenIndex === onboardingSteps.length - 1
        if (lastScreenIndex) {
            router.replace('/(tabs)/home')
        } else {
            setScreenIndex(screenIndex + 1)
        }
    }

    const onBack = () => {
        if (screenIndex > 0) {
            setScreenIndex(screenIndex - 1)
        }
    }

    return (
        <SafeAreaView className='flex flex-1 '>
            {screenIndex > 0 && (
                <TouchableOpacity onPress={onBack} className='absolute top-16 left-4 z-10'>
                    <AntDesign name="left" size={24} color="blue" />
                </TouchableOpacity>
            )}
            <View className=' flex-1 items-center justify-center mr-16'>
                {data.image && (
                    <View className='mb-6'>
                        {data.image}
                    </View>
                )}
            </View>
            <View className='px-6 mb-32'>
                <Text className='text-lg font-semibold tracking-wider text-blue-700 mb-2'>{data.title}</Text>
                <Text className='text-slate tracking-wider mb-4'>{data.description}</Text>
                <View className='flex justify-start gap-y-1'>
                    <Text className='text-lg'>{data.phoneInputTitle}</Text>
                    {data.phoneInput && (
                        <ClerkPhoneVerification onContinue={onContinue} />
                    )}
                </View>
                
            </View>
            <View className='flex flex-row justify-between items-center p-4 space-x-4 w-full '>
                <CustomButton onPress={onContinue}>
                    <Text className='text-lg text-white font-extrabold ml-4 tracking-wide'>
                        Continue
                    </Text>
                </CustomButton>
            </View>
        </SafeAreaView>
    )
}
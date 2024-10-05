import {View, Text, SafeAreaView} from "react-native";
import {useState} from "react";

const screens = [
    {
        title: 'Step Into the Future - Your Journey Starts Here!',
        description: 'Welcome to InterMed, the essential tool for managing your interpreting appointments effortlessly. Track your schedule, update job statuses, and never miss an opportunity again—all from one app. Ready to take control of your interpreter business?',

    },
    {
        title: 'Lets Start with Contact Information',
        description: 'Tell us the best way to reach you. We will use this information to send you appointment reminders, updates, and more.',

    },
    {
        title: 'Tell us about where you are located and how far you are willing to travel.',
        description: 'Choose the locations you are willing to travel to for appointments. This will help us match you with the right opportunities.',

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

    const [currentScreen, setCurrentScreen] = useState(0)
    const data = screens[currentScreen]

    return (
        <SafeAreaView className='flex flex-1 items-center justify-center'>
            <Text>{data.title}</Text>
            <Text>{data.description}</Text>
        </SafeAreaView>
    )
}
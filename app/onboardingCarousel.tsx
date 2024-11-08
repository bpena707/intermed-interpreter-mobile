// import {View, Text, SafeAreaView, TouchableOpacity} from "react-native";
// import {useState} from "react";
// import {router, Stack} from "expo-router";
// import CustomButton from "@/app/components/ui/CustomButton";
// import {AntDesign} from "@expo/vector-icons";
// import LottieView from "lottie-react-native";
// import ClerkPhoneVerification from "@/app/clerk-phone-verification";
// import GooglePlaces from "@/app/googlePlaces";
// import RadioButton from "@/app/components/ui/radio-button";
// import * as z from "zod"
// import {useCreateInterpreter} from "@/app/features/profile/api/use-create-interpreter";
//
// //schema to validate onboarding form
// const onBoardingSchema = z.object({
//     firstName: z.string(),
//     lastName: z.string(),
//     email: z.string().email(),
//     phoneNumber: z.string(),
//     targetLanguages: z.array(z.string()),
//     isCertified: z.boolean(),
// })
//
// //type to validate onboarding form
// type OnBoardingValues = z.input<typeof onBoardingSchema>
//
// const [selectedValue, setSelectedValue] = useState<string>('');
// const handleChange = (value: string) => {
//     setSelectedValue(value);
// };
//
// const onboardingSteps = [
//
//     {
//         image: (
//             <View className='flex items-center justify-center '>
//                 <LottieView style={{ width:500, height:500, marginBottom:40 }} source={require('../assets/lottie/productivity.json')} autoPlay loop />
//             </View>
//         ),
//         title: 'Step Into the Future - Your Journey Starts Here!',
//         description: 'Welcome to InterMed, the essential tool for managing your interpreting appointments effortlessly. Track your schedule, update job statuses, and never miss an opportunity again—all from one app. Ready to take control of your interpreter business?',
//
//     },
//     {
//         image: (
//             <View className='flex items-center justify-center '>
//                 <LottieView style={{ width:400, height:400, marginBottom:40, marginLeft: 40 }} source={require('../assets/lottie/email.json')} autoPlay loop />
//             </View>
//         ),
//         title: 'Lets Start with Contact Information',
//         description: 'Tell us the best way to reach you. We will use this information to send you appointment reminders, updates, and more.',
//         phoneInputTitle: 'Phone Number',
//         phoneInput: (
//             <ClerkPhoneVerification
//
//                 onContinue={() => {}}
//             />
//         ),
//
//     },
//     {
//         image: (
//             <LottieView style={{ width:400, height:400, marginBottom:40, marginLeft: 40 }} source={require('../assets/lottie/location.json')} autoPlay loop />
//         ),
//         title: 'Tell us about where you are located and how far you are willing to travel.',
//         description: 'Choose the locations you are willing to travel to for appointments. This will help us match you with the right opportunities.',
//         googleInputTitle: 'Location',
//         googleInput: (
//             <GooglePlaces />
//         )
//     },
//     {
//         image: (
//             <LottieView style={{ width:300, height:300, marginBottom:40, marginLeft: 40 }} source={require('../assets/lottie/experience.json')} autoPlay loop />
//         ),
//         title: 'Help us understand your interpreting experience.',
//         description: 'Are you Certified? Our team will evaluate your credentials at the end.',
//         credentialsInputTitle: 'Credentials',
//         credentialsButton: (selectedValue: string, handleChange: (value:string) => void) => (
//             <View className='flex flex-col items-center gap-x-2'>
//                 <RadioButton label={'Yes'} value={'yes'} selectedValue={selectedValue} onChange={handleChange} />
//             </View>
//         )
//
//     },
//     {
//         image: (
//             <LottieView style={{ width:400, height:400, marginBottom:40, marginLeft: 40 }} source={require('../assets/lottie/coin.json')} autoPlay loop />
//         ),
//         title: 'Your all set!',
//         description: 'You are all set to start receiving appointments. You can always update your information in the app settings',
//     }
// ]
//
// export default function onboardingCarousel () {
//     const [screenIndex, setScreenIndex] = useState(0)
//     const data = onboardingSteps[screenIndex]
//     const createMutation = useCreateInterpreter()
//     const [formValues, setFormValues] = useState<OnBoardingValues>({
//         firstName: '',
//         lastName: '',
//         email: '',
//         phoneNumber: '',
//         targetLanguages: [],
//         isCertified: false,
//     })
//
//     const onContinue = () => {
//         const lastScreenIndex = screenIndex === onboardingSteps.length - 1
//         if (lastScreenIndex) {
//             router.replace('/(tabs)/home')
//         } else {
//             setScreenIndex(screenIndex + 1)
//         }
//     }
//
//     const onBack = () => {
//         if (screenIndex > 0) {
//             setScreenIndex(screenIndex - 1)
//         }
//     }
//
//     const handleSubmit = (values: OnBoardingValues) => {
//         createMutation.mutate(values, {
//             onSuccess: () => {
//                 router.replace('/(tabs)/home')
//             }
//         })
//     }
//
//     return (
//         <SafeAreaView className='flex flex-1 bg-slate-400'>
//             {screenIndex > 0 && (
//                 <TouchableOpacity onPress={onBack} className='absolute top-16 left-4 z-10'>
//                     <AntDesign name="left" size={24} color="blue" />
//                 </TouchableOpacity>
//             )}
//             <View className=' flex-1 items-center justify-center mr-16'>
//                 {data.image && (
//                     <View className='mb-6'>
//                         {data.image}
//                     </View>
//                 )}
//             </View>
//             <View className='px-6 mb-32'>
//                 <Text className='text-lg font-semibold tracking-wider text-blue-700 mb-2'>{data.title}</Text>
//                 <Text className='text-slate tracking-wider mb-4'>{data.description}</Text>
//                 <View className='flex justify-start gap-y-1'>
//                     <Text className='text-lg'>{data.phoneInputTitle}</Text>
//                     {data.phoneInput && (
//                         <ClerkPhoneVerification
//                             onContinue={onContinue}
//                         />
//                     )}
//                 </View>
//                 <View className='flex justify-start gap-y-1'>
//                     <Text className='text-lg'>{data.googleInputTitle}</Text>
//                     {data.googleInput && (
//                         <View className='mb-10'>
//                             <GooglePlaces />
//                         </View>
//                     )}
//                 </View>
//                 <View>
//                     {data.credentialsInputTitle && (
//                         <View className='flex justify-start gap-y-1'>
//
//                             {data.credentialsButton && data.credentialsButton(selectedValue, handleChange)}
//                         </View>
//                     )}
//                 </View>
//             </View>
//             <View className='flex flex-row justify-between items-center p-4 space-x-4 w-full '>
//                 <CustomButton onPress={onContinue}>
//                     <Text className='text-lg text-white font-extrabold ml-4 tracking-wide'>
//                         Continue
//                     </Text>
//                 </CustomButton>
//             </View>
//         </SafeAreaView>
//     )
// }
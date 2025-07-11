import FontAwesome from '@expo/vector-icons/FontAwesome';
import {useFonts} from 'expo-font';
import {Slot, Stack, useRouter, useSegments} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {useEffect} from 'react';
import 'react-native-reanimated';
import * as SecureStore from 'expo-secure-store'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ClerkLoaded, ClerkProvider, useAuth, useUser} from "@clerk/clerk-expo";
import Toast from "react-native-toast-message";

const client = new QueryClient()

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

if (!publishableKey) {
    throw new Error(
        'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
    )
}

const tokenCache = {
    async getToken(key: string) {
        try {
            return SecureStore.getItemAsync(key);
        } catch (err) {
            return null;
        }
    },
    async saveToken(key: string, value: string) {
        try {
            return SecureStore.setItemAsync(key, value);
        } catch (err) {
            return;
        }
    },
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const InitialLayout = () => {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const router = useRouter()
    const {isLoaded, isSignedIn, userId} = useAuth()
    const { user } = useUser()
    const segments = useSegments()

    //check if the user has completed the onbaording process
    const onboardingComplete = user?.unsafeMetadata?.onboardingComplete


  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  //useEffect to check if the user is signed in and if the onboarding process is complete and route accordingly
  useEffect(() =>{
      if (!isLoaded) return
      const inAuthGroup = segments[0] === 'tabs'
      //if the user is signed in and outside of the auth area which in this case is the tabs group
      if (isSignedIn && !inAuthGroup && onboardingComplete){
          router.replace('/tabs/home')
      } else if (!onboardingComplete && isSignedIn) {
          router.replace('/onboarding')
      } else if (!isSignedIn) {
          router.replace('/')
      }
  },[isSignedIn, onboardingComplete, isLoaded])

  if (!loaded || isLoaded) {
    return <Slot />;
  }

    return (
        <Stack>
            <Stack.Screen
                name='index'
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name='onboarding'
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="tabs"
                options={{
                    headerShown: true,
                }}
            />
            <Stack.Screen
                name="appointmentAgenda"
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="appointment/[id]"
                options={{
                    title: '',
                    headerTitle: 'Appointment',
                    headerShown: true,
                    // headerLeft: () => (
                    //     <TouchableOpacity onPress={() => router.back()}>
                    //         <Ionicons name={'close-outline'} size={24} color={'black'} />
                    //     </TouchableOpacity>
                    // )
                }}

            />
            <Stack.Screen
                name="(modals)/appointmentCloseModal"
                options={{
                    headerShown: false,
                    presentation: 'transparentModal',

                }}
            />
        </Stack>
    );
}

const RootLayoutNav = () => {
    return(
        <ClerkProvider publishableKey={publishableKey!} tokenCache={tokenCache}>
            <ClerkLoaded>
                <QueryClientProvider client={client}>
                    <InitialLayout />
                    <Toast
                        position={"top"}
                        topOffset={60}
                    />
                </QueryClientProvider>
            </ClerkLoaded>
        </ClerkProvider>
    )
}

export default RootLayoutNav

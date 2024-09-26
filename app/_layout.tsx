import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import {isLoaded, useFonts} from 'expo-font';
import {Stack, useRouter, useSegments} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import {ActivityIndicator, TouchableOpacity} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as SecureStore from 'expo-secure-store'

import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ClerkProvider, useAuth} from "@clerk/clerk-expo";

const client = new QueryClient()

const tokenCache = {
    async getToken(key: string) {
        try {
            const item = await SecureStore.getItemAsync(key)
            if (item) {
                console.log(`${key} was used 🔐 \n`)
            } else {
                console.log('No values stored under key: ' + key)
            }
            return item
        } catch (error) {
            console.error('SecureStore get item error: ', error)
            await SecureStore.deleteItemAsync(key)
            return null
        }
    },
    async saveToken(key: string, value: string) {
        try {
            return SecureStore.setItemAsync(key, value)
        } catch (err) {
            return
        }
    },
}


const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!
if (!publishableKey) {
    throw new Error(
        'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
    )
}

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const InitialLayout = () => {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const router = useRouter()
    const {isLoaded, isSignedIn} = useAuth()
    const segments = useSegments()

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() =>{
      if (!isLoaded) return
      const inAuthGroup = segments[0] === '(tabs)'
      console.log('')
      //if the user is signed in and outside of the auth area which in this case is the tabs group
      if (isSignedIn && !inAuthGroup){
          router.push('/(tabs)/home')
      } else if (!isSignedIn && inAuthGroup) {
          router.replace('/')
      }
  },[isSignedIn])

  if (!loaded || isLoaded) {
    return <ActivityIndicator/>;
  }

    return (
        <Stack>
            <Stack.Screen
                name='index'
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="(tabs)"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="appointment/[id]"
                options={{
                    headerTitle: 'Appointment',
                }}

            />
            <Stack.Screen
                name="(modals)/appointmentActions"
                options={{
                    headerTitle: 'Appointment Actions',
                    presentation: 'transparentModal',
                    animation: 'fade_from_bottom',
                    headerLeft: () =>(
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons name={'close-outline'} size={24} color={'black'} />
                        </TouchableOpacity>
                    )
                }}
            />
            <Stack.Screen
                name="(modals)/searchModal"
                options={{
                    headerTitle: 'Appointment Actions',
                    presentation: 'transparentModal',
                    animation: 'fade_from_bottom',
                    headerLeft: () =>(
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons name={'close-outline'} size={24} color={'black'} />
                        </TouchableOpacity>
                    )
                }}
            />
        </Stack>
    );
}

const RootLayoutNav = () => {
    return(
        <ClerkProvider publishableKey={publishableKey!} tokenCache={tokenCache}>
            <QueryClientProvider client={client}>
                <InitialLayout />
            </QueryClientProvider>
        </ClerkProvider>
    )
}

export default RootLayoutNav

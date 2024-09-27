import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import {isLoaded, useFonts} from 'expo-font';
import {Navigator, Stack, useRouter, useSegments} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import {ActivityIndicator, TouchableOpacity} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as SecureStore from 'expo-secure-store'

import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ClerkProvider, useAuth} from "@clerk/clerk-expo";
import { Slot } from "expo-router";

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
      //if the user is signed in and outside of the auth area which in this case is the tabs group
      if (isSignedIn && !inAuthGroup){
          router.replace('/(tabs)/home')
      } else if (!isSignedIn) {
          router.replace('/')
      }
  },[isSignedIn])

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

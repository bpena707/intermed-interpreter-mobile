import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import {Stack, useRouter} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import {TouchableOpacity} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const client = new QueryClient()

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

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {

    const router = useRouter();

  return (
      <QueryClientProvider client={client}>
      <Stack>
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
      </QueryClientProvider>
  );
}

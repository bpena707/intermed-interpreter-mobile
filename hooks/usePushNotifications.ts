// hooks/usePushNotifications.ts - WITH BACKEND SAVING
import { useState, useEffect, useRef } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import {  useUpdatePushToken } from "@/app/features/profile/api/use-update-push-token";

// Set notification handler from expo documents
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

async function registerForPushNotificationsAsync() {
    console.log('🔔 STARTING PUSH NOTIFICATION REGISTRATION');
    let token;

    if (Platform.OS === 'android') {
        console.log('🤖 Setting up Android notification channel');
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    console.log('📱 Skipping device check for testing in simulator...');
    console.log('📱 Platform:', Platform.OS);
    // Skip device check entirely for testing

    console.log('🔔 Getting current notification permissions...');
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    console.log('🔔 Current permission status:', existingStatus);
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        console.log('🔔 Requesting notification permissions...');
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
        console.log('🔔 New permission status:', finalStatus);
    }

    if (finalStatus !== 'granted') {
        console.log('❌ Failed to get push token for push notification!');
        return;
    }

    console.log('✅ Notification permissions granted!');

    try {
        const projectId = Constants.expoConfig?.extra?.eas?.projectId;
        console.log('🔔 Project ID from config:', projectId);

        if (!projectId) {
            console.log('❌ EAS project ID not found in app.config.js');
            throw new Error('EAS project ID not found in app.config.js');
        }

        console.log('🔔 Calling getExpoPushTokenAsync...');
        const result = await Notifications.getExpoPushTokenAsync({ projectId });
        console.log('🔔 Raw result from getExpoPushTokenAsync:', result);

        token = result.data;
        console.log('🔔 SUCCESS! Expo Push Token:', token);
        console.log('🔔 Token length:', token ? token.length : 'undefined');
    } catch (e) {
        console.error('❌ Error getting push token:', e);
        console.error('❌ Error details:', JSON.stringify(e, null, 2));
    }

    return token;
}

export const usePushNotifications = () => {
    console.log('🔔 PUSH HOOK: Starting usePushNotifications hook');

    const { isSignedIn, isLoaded } = useAuth();
    const updatePushTokenMutation = useUpdatePushToken();

    const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
    const [notification, setNotification] = useState<Notifications.Notification | undefined>();

    const notificationListener = useRef<Notifications.Subscription>();
    const responseListener = useRef<Notifications.Subscription>();

    useEffect(() => {
        console.log('🔔 PUSH HOOK: useEffect running');
        console.log('🔔 Auth status - isLoaded:', isLoaded, 'isSignedIn:', isSignedIn);

        // Only register for push notifications when user is signed in
        if (isLoaded && isSignedIn) {
            console.log('🔔 User is signed in - registering for push notifications');

            registerForPushNotificationsAsync().then(token => {
                console.log('🔔 PUSH HOOK: Registration function completed');
                if (token) {
                    setExpoPushToken(token);
                    console.log('🔔 PUSH TOKEN READY:', token);

                    // Save token to backend
                    console.log('🔔 Saving token to backend...');
                    updatePushTokenMutation.mutate({ token });
                } else {
                    console.log('❌ No token received from registration');
                }
            }).catch(error => {
                console.log('❌ Registration failed with error:', error);
            });
        } else {
            console.log('🔔 User not signed in yet - skipping push notification registration');
        }

        console.log('🔔 Setting up notification listeners...');
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
            console.log('🔔 Notification Received:', notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log('🔔 Notification Tapped:', response);
            // Handle navigation when user taps notification
        });

        return () => {
            console.log('🔔 Cleaning up notification listeners');
            if (notificationListener.current) {
                Notifications.removeNotificationSubscription(notificationListener.current);
            }
            if (responseListener.current) {
                Notifications.removeNotificationSubscription(responseListener.current);
            }
        };
    }, [isLoaded, isSignedIn]); // Re-run when auth state changes

    return {
        expoPushToken,
        notification,
    };
};
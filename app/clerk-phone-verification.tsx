// src/components/ClerkPhoneVerification.tsx (Example path)

import { useUser } from "@clerk/clerk-expo";
import { useState } from "react";
import CustomButton from "@/app/components/ui/custom-button"; // Adjusted path assumption
import {Text, TextInput, View, Alert, ActivityIndicator} from "react-native";
import * as React from "react";
import { Input } from "@/app/components/ui/input"; // Assuming this is your custom Input
// --- Import the specific type for the phone number resource ---
import { ClerkAPIError, PhoneNumberResource } from "@clerk/types";
// ------------------------------------------------------------

interface ClerkPhoneVerificationProps {
    onContinue: () => void;
    // Optional: Add onVerificationError prop if needed
    // onVerificationError?: (error: Error) => void;
}

const ClerkPhoneVerification = ({ onContinue }: ClerkPhoneVerificationProps) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [code, setCode] = useState('');
    const [pendingVerification, setPendingVerification] = useState(false);
    // --- State to hold the phone number resource being verified ---
    const [verifyingPhoneNumber, setVerifyingPhoneNumber] = useState<PhoneNumberResource | null>(null);
    // ----------------------------------------------------------
    const [isLoading, setIsLoading] = useState(false); // Add loading state
    const { user, isLoaded } = useUser();

    // --- Step 1 & 2: Add phone number and prepare verification ---
    const onAddAndPrepare = async () => {
        if (!isLoaded || !user) return;

        setIsLoading(true);
        try {
            // Create the phone number resource for the user
            const phoneNumberResource = await user.createPhoneNumber({
                phoneNumber: phoneNumber, // Use the entered phone number
            });

            // Store this resource to use in the verification step
            setVerifyingPhoneNumber(phoneNumberResource);

            // Prepare verification (sends the code)
            await phoneNumberResource.prepareVerification();

            // Move to the code entry step
            setPendingVerification(true);

        } catch (err: any) {
            // Map Clerk errors to user-friendly messages
            const errorMessage = err.errors?.[0]?.longMessage || err.message || 'An error occurred.';
            console.error("Clerk Add/Prepare Error:", JSON.stringify(err, null, 2));
            Alert.alert("Error", errorMessage); // Show error to user
            setVerifyingPhoneNumber(null); // Clear verifying state on error
        } finally {
            setIsLoading(false);
        }
    };
    // ----------------------------------------------------------

    // --- Step 3: Attempt verification with the code ---
    const onPressVerify = async () => {
        // Ensure we have the resource we are trying to verify
        if (!verifyingPhoneNumber) {
            Alert.alert("Error", "Verification process not started correctly.");
            return;
        }

        setIsLoading(true);
        try {
            // --- Attempt verification ---
            // If this succeeds, the promise resolves. If the code is wrong, it throws.
            await verifyingPhoneNumber.attemptVerification({
                code,
            });
            // ---------------------------

            // --- Success Logic ---
            // If we reach this line, attemptVerification succeeded!
            Alert.alert("Success", "Phone number verified!");

            // reload the user data to reflect changes
            await user?.reload();
            //Set as primary if needed
            await user?.update({ primaryPhoneNumberId: verifyingPhoneNumber.id });

            onContinue(); // Call the success callback
            // -------------------

        } catch (err: any) {
            // --- Error Handling ---
            // The catch block handles failures (e.g., invalid code)
            const errorMessage = err.errors?.[0]?.longMessage || err.message || 'Invalid verification code or an error occurred.';
            console.error("Clerk Verify Error:", JSON.stringify(err, null, 2));
            Alert.alert("Error", errorMessage); // Show error to user
            // --------------------
        } finally {
            setIsLoading(false);
        }
    };
    // -------------------------------------------------

    // Initial loading state for Clerk user
    if (!isLoaded) {
        return <ActivityIndicator style={{ marginTop: 20 }} />;
    }

    return (
        // Use Tailwind classes if preferred
        <View className="w-full space-y-4 p-1">
            {!pendingVerification ? (
                <>
                    <Input // Use your custom Input
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        placeholder='Phone Number E.g. +14155552671'
                        keyboardType="phone-pad" // Set keyboard type
                        editable={!isLoading}
                        className="h-12" // Example class
                    />
                    <CustomButton
                        className='mt-2 bg-blue-500 p-3 rounded items-center' // Example classes
                        onPress={onAddAndPrepare}
                        disabled={isLoading} // Disable button while loading
                    >
                        {/* Use Text for button label */}
                        <Text className='text-lg text-white font-semibold'>
                            {isLoading ? 'Sending Code...' : 'Send Verification Code'}
                        </Text>
                    </CustomButton>
                </>
            ) : (
                <View>
                    <Text className="text-center text-gray-600 dark:text-gray-400 mb-2">
                        Enter the code sent to {phoneNumber}
                    </Text>
                    <Input // Use your custom Input
                        value={code}
                        onChangeText={setCode}
                        placeholder='Verification Code'
                        keyboardType="number-pad" // Set keyboard type
                        editable={!isLoading}
                        className="h-12 text-center tracking-[10px]" // Example classes
                        maxLength={6} // Usually 6 digits
                    />
                    <CustomButton
                        className='mt-2 bg-green-500 p-3 rounded items-center' // Example classes
                        onPress={onPressVerify}
                        disabled={isLoading || code.length !== 6} // Disable if loading or code not 6 digits
                    >
                        <Text className='text-lg text-white font-semibold'>
                            {isLoading ? 'Verifying...' : 'Verify Code'}
                        </Text>
                    </CustomButton>
                    {/* Optional: Add button to go back/resend */}
                    <CustomButton  onPress={() => { setPendingVerification(false); setVerifyingPhoneNumber(null); setCode(''); }} disabled={isLoading} />
                </View>
            )}
        </View>
    );
};

export default ClerkPhoneVerification;
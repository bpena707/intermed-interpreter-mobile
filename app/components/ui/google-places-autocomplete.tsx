// app/components/ui/google-places-autocomplete.tsx
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { View, Text, Platform } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

// Add your API key here
const GOOGLE_API_KEY = 'AIzaSyBbaNPiSQEVJQA5kyWMEGujd_vENQUHcbY';

interface AddressInputProps {
    value?: string;
    onSelectAddress: (data: {
        address: string;
        latitude?: number;
        longitude?: number;
        placeId?: string;
    }) => void;
    placeholder?: string;
    label?: string;
    description?: string;
    icon?: string;
    error?: string;
}

export function AddressAutocomplete({
    onSelectAddress,
    label,
    description,
    placeholder,
    icon,
    error,
    value
}: AddressInputProps) {
    return (
        // ⭐ CRITICAL: Fixed height container for the autocomplete to work
        <View style={{ flex: 1,  }}>
            {/* Label with icon */}
            <View className="flex-row items-center mb-2">
                <Ionicons name={(icon as any) || "location-outline"} size={20} color="#6B7280" />
                <View className={'flex flex-col '}>
                    <Text className="text-sm font-medium text-gray-700 ml-2">
                        {label || 'Address'}
                    </Text>
                    <Text className={'text-xs font-light text-gray-600'}>
                        {description || ''}
                    </Text>
                </View>


            </View>

            <GooglePlacesAutocomplete
                disableScroll={true}
                placeholder={placeholder || "Search for address..."}
                onPress={(data, details = null) => {
                    console.log('Selected:', data.description); // Debug log
                    onSelectAddress({
                        address: data.description,
                        latitude: details?.geometry?.location?.lat,
                        longitude: details?.geometry?.location?.lng,
                        placeId: data.place_id
                    });
                }}
                query={{
                    key: GOOGLE_API_KEY,
                    language: 'en',
                    components: 'country:us',
                }}
                fetchDetails={true}
                minLength={2}  // Start searching after 2 chars
                listUnderlayColor={'#f0f0f0'}
                renderDescription={row => row.description}
                textInputProps={{
                    clearButtonMode: 'while-editing',
                    placeholderTextColor: '#9CA3AF',
                }}
                //Styling affects the container and the text rendering. flex makes the container expand moving other components to bottom
                styles={{
                    container: {
                        flex: 1,
                    },
                    textInputContainer: {
                        backgroundColor: 'transparent',
                        borderTopWidth: 0,
                        borderBottomWidth: 0,
                    },
                    textInput: {
                        backgroundColor: '#FFFFFF',
                        borderRadius: 8,
                        fontSize: 16,
                        borderWidth: 1,
                        borderColor: error ? '#EF4444' : '#D1D5DB',
                        color: '#000000',
                    },
                    predefinedPlacesDescription: {
                        color: '#1faadb',
                    },
                    listView: {
                        backgroundColor: 'white',
                        borderWidth: 1,
                        borderColor: '#ddd',
                        borderRadius: 8,
                        elevation: 3,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 3,
                    },
                    separator: {
                        height: 0.5,
                        backgroundColor: '#c8c7cc',
                    },
                }}
            />
            {/* Error message */}
            {error && (
                <Text className="text-red-500 text-sm mt-1">{error}</Text>
            )}
        </View>
    );
}
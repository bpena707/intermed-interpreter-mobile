import {Text, View} from "react-native";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {useState} from "react";

const GooglePlaces = () => {
    const apiKey = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY!
    if (!apiKey) {
        throw new Error(
            'Missing Google Places API Key. Please set EXPO_PUBLIC_GOOGLE_PLACES_API_KEY in your .env',
        )
    }



    return (
        <View className='flex-1'>
        <GooglePlacesAutocomplete
            placeholder={'Search'}
            minLength={2}
            fetchDetails={true}
            onPress={(data, details = null) => {

                console.log(data, details);
            }}
            onFail={(error) => console.error(error)}
            query={{
                key: apiKey,
                language: 'en',

            }}
            styles={{
                textInputContainer: {
                    width: '100%',

                },
                textInput: {
                    height: 38,
                    color: '#5d5d5d',
                    fontSize: 16,
                },
                listView: {
                    position: 'absolute',
                    top: 40,
                    zIndex: 1,
                    maxHeight: 150,
                },
            }}
        />
        </View>
    );
}

export default GooglePlaces;
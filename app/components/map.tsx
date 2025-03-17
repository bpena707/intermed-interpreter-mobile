import {View, Text} from "react-native";
import MapView, {Marker, Region} from "react-native-maps";

interface MapProps {
    latitude: number;
    longitude: number;
    longitudeDelta?: number;
    latitudeDelta?: number;
    markerText?: string;
    height?: string | number;
}

export default function Map({
    latitude,
    longitude,
    longitudeDelta = 0.0421,
    latitudeDelta = 0.0922,
    markerText = 'Location',
    height
} : MapProps) {
    const region: Region = {
        latitude,
        longitude,
        latitudeDelta,
        longitudeDelta
    }

    return (
        <View className=''>
            <MapView
                style={{ width: '100%', height: 200 }}
                region={region}
                cameraZoomRange={{ minCenterCoordinateDistance: 600, maxCenterCoordinateDistance: 600 }}
                >
                <Marker
                    coordinate={{latitude, longitude}}
                />
            </MapView>
        </View>
    );
}
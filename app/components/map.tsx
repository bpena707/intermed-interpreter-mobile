import {View, Text} from "react-native";
import Mapbox, {MapView} from "@rnmapbox/maps";

const accessToken = 'pk.eyJ1IjoiYnBlbmE3MDciLCJhIjoiY2x6eGptYzlyMDgzcTJrcTQzMnk2OHhzaSJ9.V-Qok7ful3HvRhb2pCzm0A'
Mapbox.setAccessToken(accessToken);

export default function Map(){
    return (
        <MapView style={{ flex:1  }} />
    );
}
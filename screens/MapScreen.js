import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Platform, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { TouchableOpacity } from 'react-native-gesture-handler';

import Colors from '../constants/Colors';

const MapScreen = props => {
    const initialLocation = props.navigation.getParam('initialLocation');
    const readonly = props.navigation.getParam('readonly');


    const [selectedLocation, setSelectedLocation] = useState(initialLocation);

    const mapRegion = {
        latitude: initialLocation ? initialLocation.lat : selectedLocation ? selectedLocation.lat : 43.327725,
        longitude: initialLocation ? initialLocation.lng : selectedLocation ? selectedLocation.lng : 21.904048,
        latitudeDelta: 0.0122,
        longitudeDelta: 0.0122
    };

    const selectLocationHandler = event => {

        if (readonly) {
            return;
        }

        setSelectedLocation({
            lat: event.nativeEvent.coordinate.latitude,
            lng: event.nativeEvent.coordinate.longitude
        });
    };


    const savePickedLocationHandler = useCallback(() => {
        if (!selectedLocation) {
            Alert.alert('No location found', 'You must select location to continue',
                [{ text: 'Ok' }]
            );
            return;
        }

        props.navigation.navigate('NewPlace', { pickedLocation: selectedLocation });
    }, [selectedLocation]);

    useEffect(() => {
        props.navigation.setParams({ saveLocation: savePickedLocationHandler })
    }, [savePickedLocationHandler]);

    let markerCoordinates;

    if (selectedLocation) {
        markerCoordinates = {
            latitude: selectedLocation.lat,
            longitude: selectedLocation.lng
        };
    }

    return (
        <View>
            <MapView style={styles.map} region={mapRegion} onPress={selectLocationHandler} >
                {markerCoordinates && <Marker title='Picked location' coordinate={markerCoordinates}></Marker>}
            </MapView>
        </View>
    );
};

MapScreen.navigationOptions = navData => {
    const readonly = navData.navigation.getParam('readonly');
    const saveFn = navData.navigation.getParam('saveLocation');

    if (readonly) {
        return {};
    }

    return {
        headerRight: () => (
            <TouchableOpacity style={styles.headerButton} onPress={saveFn}>
                <Text style={styles.headerButtonText}>Save</Text>
            </TouchableOpacity>
        )
    };
};

const styles = StyleSheet.create({
    map: {
        width: '100%',
        height: '100%'
    },
    headerButton: {
        marginHorizontal: 20
    },
    headerButtonText: {
        fontSize: 16,
        color: Platform.OS === 'android' ? 'white' : Colors.primary
    }
});

export default MapScreen;

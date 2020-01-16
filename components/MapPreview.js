import React from 'react';
import { Image, StyleSheet } from 'react-native';

import ENV from '../env';
import { TouchableOpacity } from 'react-native-gesture-handler';

const MapPreview = props => {
    let imagePreviewUrl;

    if (props.location) {
    
       imagePreviewUrl = `https://image.maps.ls.hereapi.com/mia/1.6/mapview?c=${props.location.lat}%2C${props.location.lng}&z=14&apiKey=${ENV.hereMapsApiKey}`;

    }

    return (
        <TouchableOpacity onPress={props.onPress} style={{ ...styles.mapPreview, ...props.style }}>

            {props.location ? (
                <Image style={styles.mapImage} source={{ uri: imagePreviewUrl }} />
            ) : (
                    props.children
                )}

        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    mapPreview: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    mapImage: {
        width: '100%',
        height: '100%'
    }
});

export default MapPreview;

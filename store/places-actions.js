import * as FileSystem from 'expo-file-system';

import { insertPlace, fetchPlaces } from '../helpers/db';
import ENV from '../env';

export const ADD_PLACE = 'ADD_PLACE';
export const SET_PLACES = 'SET_PLACES';

export const addPlace = (title, image, location) => {
    return async dispatch => {
        const response = await fetch(
            
            `https://reverse.geocoder.ls.hereapi.com/6.2/reversegeocode.json?apiKey=${ENV.hereMapsApiKey}&mode=retrieveAddresses&prox=${location.lat},${location.lng},250`
        );

        if (!response.ok) {
            throw new Error('Something went wrong!');
        }

        const resData = await response.json();

        const address = resData.Response.View[0].Result[0].Location.Address.Label;
        
        if (!resData.Response) {
            throw new Error('Something went wrong!');
        }

        const fileName = image.split('/').pop();
        const newPath = FileSystem.documentDirectory + fileName;

        try {
            await FileSystem.moveAsync({
                from: image,
                to: newPath
            });
            const dbResult = await insertPlace(
                title,
                newPath,
                address,
                location.lat,
                location.lng
            );
            dispatch({ type: ADD_PLACE, placeData: { id: dbResult.insertId, title: title, image: newPath, address: address, coords: {
                lat: location.lat,
                lng: location.lng
            } } });
        } catch (err) {
            console.log(err);
            throw err;
        }
    };
};

export const loadPlaces = () => {
    return async dispatch => {
        try {
            const dbResult = await fetchPlaces();
            
            dispatch({ type: SET_PLACES, places: dbResult.rows._array });
        } catch (err) {
            throw err;
        }
    };
};
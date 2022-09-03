import React from 'react';
import { GoogleMap, useLoadScript, Marker, infoWindow } from '@react-google-maps/api';
import { formatRelative } from 'date-fns';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import '../styles/Map.css';

// const libraries = ["places"];
const mapContainerStyle = {
    width: '50vw',
    height: '60vh'
};
const center = {
    lat: 43.653225,
    lng: -79.383186
};



export default function Map() {
    // const { isLoaded, loadError } = useLoadScript({
    //     googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    //     libraries,
    // });

    // if(loadError) return "Error loading maps";
    // if(!isLoaded) return "Loading Maps";

    return (
        <div className='map'>
            <GoogleMap mapContainerStyle={mapContainerStyle} zoom={8} center={center}>
                <Marker position={{ lat: 43.653225, lng: -79.383186 }} />
            </GoogleMap>
        </div>
    )
}
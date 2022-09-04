import React, { useState, useReducer } from 'react';
import SearchTable from './components/SearchTable';
import './styles/App.css'
import { Input, Button } from 'antd';
import { EnvironmentTwoTone } from '@ant-design/icons';
import PlacesAutoComplete, { geocodeByAddress, getLatLng} from 'react-places-autocomplete';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

const { Search } = Input;

const libraries = ["places"];

const mapContainerStyle = {
  width: '50vw',
  height: '60vh'
};
const center = {
  lat: 43.653225,
  lng: -79.383186
};

export const ACTIONS = {
  ADD_LOCATION: 'ADD_LOCATION',
  REMOVE_LOCATION: 'REMOVE_LOCATION',
}


function reducer(state, action){

  switch (action.type) {
    case ACTIONS.ADD_LOCATION: {
      return [
        ...state, 
        newLocation(action.payload.location, action.payload.lat, action.payload.lng)
      ];
    }
    case ACTIONS.REMOVE_LOCATION: {
      return state.filter(state => state.id !== action.payload.id);
    }
    default:
      return state;   
  }
}  

function newLocation(location, lat, lng) {
  return { id: Date.now(), location: location, lat: lat, lng: lng };
}


function App() {

  const [state, dispatch] = useReducer(reducer, []);

  const [address, setAddress] = useState('');

  const [map, setMap] = useState(null);

  function userPosition() {
    navigator.geolocation.getCurrentPosition(function(position) {
      reverseGeocode(position.coords.latitude, position.coords.longitude); 
      map.panTo({lat: position.coords.latitude, lng: position.coords.longitude});     
    });
  }

  const reverseGeocode = (lat, lng) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&latlng=${lat},${lng}`;
    fetch(url)
        .then(response => response.json())
        .then(location => {
          const place = location.results[0];
          dispatch({ type: ACTIONS.ADD_LOCATION, payload: { location: place.formatted_address, lat: lat, lng: lng } });
        })
  }

  async function getPosition(value) {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    dispatch({ type: ACTIONS.ADD_LOCATION, payload: { location: value, lat: latLng.lat, lng: latLng.lng } });
    map.panTo({lat: latLng.lat, lng: latLng.lng});
    setAddress('');
  }

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  if(loadError) return "Error loading maps";
  if(!isLoaded) return "Loading Maps";

  return (
    <div className="App">
      <div className='searchbar-container'>
        <PlacesAutoComplete  onChange={setAddress} value={address} className='search-bar'>
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div>
              <Search  {...getInputProps({placeholder: "input location"})} enterButton="Search" size="large" className='search-bar' onSearch={getPosition} />
            
              <div className='dropDown-list-container'>
                {loading ? <div>...loading</div> : null}

                {suggestions.map((suggestion, index) => {
                    const style = {
                      backgroundColor: suggestion.active ? "#41b6e6" : "#fff"
                    };
                    return(
                      <div className='dropDown-list' key={index} {...getSuggestionItemProps(suggestion, {style})}>
                        {suggestion.description}
                      </div>
                    ) 
                  }
                )}
              </div>  
            </div>
          )}
        </PlacesAutoComplete>
      </div>
      <Button type="primary" className='user-position-button' onClick={userPosition}><span><EnvironmentTwoTone style={{fontSize: '30px'}}/></span> </Button>
      <SearchTable state={state} dispatch={dispatch}/>
      <div className='map'>
        <GoogleMap mapContainerStyle={mapContainerStyle} zoom={10} center={center} onLoad={map => setMap(map)}>
          {state.map((location) => (
            <Marker key={location.id} position={{lat: location.lat, lng: location.lng}} />
          ))}
        </GoogleMap>
      </div>
    </div>
  );
}

export default App;


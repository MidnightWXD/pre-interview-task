import React, { useState } from 'react';
import SearchTable from './components/SearchTable';
import './App.css'
import { Input, Button, AutoComplete } from 'antd';
import { EnvironmentTwoTone } from '@ant-design/icons';
import PlacesAutoComplete, { geocodeByAddress, getLatLng} from 'react-places-autocomplete';
import { GoogleMap, useLoadScript, Marker, infoWindow } from '@react-google-maps/api';


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

function App() {

  const ACTIONS = {
    ADD_LOCATION: 'ADD_LOCATION',
    REMOVE_LOCATION: 'REMOVE_LOCATION',
  }

  // const reducer = (state, action) => {
  //   switch (action.type) {
  //     case ACTIONS.ADD_LOCATION:
  //       const newLocationId = state.locations.length + 1;
  //       return [
  //         ...state,
  //         newState(location, latitude, longitude)
  //       ]
  //     case ACTIONS.REMOVE_LOCATION:
  //       return {
  //         ...state,
  //         location: [...state.location.filter(location => location.id !== action.payload)]
  //       }
  //     default:
  //       return state;
  //   }
  // }

  // function newState(location, latitude, longitude) {
  //   return {
  //     id: state.length + 1,
  //     location: location,
  //     latitude: latitude,
  //     longitude: longitude,
  //   }
  // }

  function userPosition() {
    navigator.geolocation.getCurrentPosition(position => {
      console.log(position);
      localStorage.setItem('userlat', position.coords.latitude);
      localStorage.setItem('userlong', position.coords.longitude);
    });
  }

  function getPosition(value) {
    console.log(value);
  }

  // function displayRelativeLocation(value) {
  //   const {  } = usePlacesAutocomplete({
  //     requestOptions: {
  //       location: { lat: () => 40.7128, lng: () => -74.0060 },
  //       radius: 200 * 1000,
  //     },
  //   });
  //   console.log(value);
  // }

  const [address, setAddress] = useState('');

  const handleSelect = async value => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    console.log(latLng);
    setAddress(value);
  };
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  if(loadError) return "Error loading maps";
  if(!isLoaded) return "Loading Maps";

  return (
    <div className="App">
      {/* <image src="https://loading.io/asset/597559" alt="google logo" /> */}
      <div className='searchbar-container'>
        <PlacesAutoComplete  onChange={setAddress} value={address} onSelect={handleSelect} className='search-bar'>
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div>
              <Search  {...getInputProps({placeholder: "input location"})} enterButton="Search" size="large" className='search-bar' onSearch={getPosition} />
            
              <div>
                {loading ? <div>...loading</div> : null}

                {suggestions.map(suggestion => {
                  return(
                    <div>
                      <AutoComplete options={suggestion}></AutoComplete>
                    </div>
                  ) 
                  }
                )}
              </div>  
            </div>
          )}
        </PlacesAutoComplete>
        <Button type="primary" className='user-position-button' onClick={userPosition}><span><EnvironmentTwoTone style={{fontSize: '25px'}}/></span> </Button>
      </div>
      <SearchTable />
      <div className='map'>
            <GoogleMap mapContainerStyle={mapContainerStyle} zoom={8} center={center}>
                <Marker position={{ lat: 43.653225, lng: -79.383186 }} />
            </GoogleMap>
      </div>
    </div>
  );
}

export default App;

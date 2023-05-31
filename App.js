import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import axios from 'axios';

import * as Location from 'expo-location';


export default function App() {
  const [finalLocationCoords, setFinalLocationCoords] = useState({latitude: 0, longitude: 0,});
  const [errorMsg, setErrorMsg] = useState(null);

let latitude1;
let longitude1;
let intervalId;

  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      startLocationUpdates();
    })();
  }, [finalLocationCoords]);

  
  const startLocationUpdates = async () => {

    const subscription = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 10 },
      (location) => {
        // console.log(location.coords.latitude, location.coords.longitude)
        latitude1 = location.coords.latitude;
        longitude1 = location.coords.longitude;
      }
    );
  };

  

const postData = async () => {
  try {
    if(finalLocationCoords.latitude !== latitude1 || finalLocationCoords.longitude !== longitude1){
      setFinalLocationCoords({latitude: latitude1, longitude: longitude1});
      // console.log(finalLocationCoords)
      const response = await axios.post('http://192.168.12.125:5000/admin/postCoordinates', finalLocationCoords) 
      console.log(response.data)   
      clear_interval()
    }
  } catch (error) {
    console.log(error.message)
  }
}

intervalId = setInterval(postData, 20000);

const clear_interval = () => {
  clearInterval(intervalId);
}
  
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.loading}>latitude : {finalLocationCoords?.latitude}</Text> 
        <Text style={styles.loading}>longitude : {finalLocationCoords?.longitude}</Text>
      </View>
      <View style={styles.refresh}>
        <Pressable style={styles.button} onPress={startLocationUpdates}>
          <Text style={{color: 'white', fontWeight: 'bold', fontSize: 16}}>Refresh</Text>
        </Pressable>
      </View>
    </>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection : 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    flex: 1,
  },
  loading: {
    fontSize: 26,
    fontWeight: 'bold',
    lineHeight: 34,
  },
  refresh: {
    display: 'flex',
    marginBottom: 140,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 52,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
    }
});


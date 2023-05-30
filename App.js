import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';

import * as Location from 'expo-location';


export default function App() {
  const [location, setLocation] = useState({latitude: 0, longitude: 0,});
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      startLocationUpdates();
    })();
  }, [location]);

  
  const startLocationUpdates = async () => {

    const subscription = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 10 },
      (location) => {
        // console.log(location.coords.latitude, location.coords.longitude)
        setLocation({latitude: location.coords.latitude, longitude: location.coords.longitude});
      }
    );
  };

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = location
  }
  
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.loading}>latitude : {text?.latitude}</Text> 
        <Text style={styles.loading}>longitude : {text?.longitude}</Text>
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


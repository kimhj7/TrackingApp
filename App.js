
import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';


const GPS_UPDATE_INTERVAL = 10000;
const SERVER_URL = 'http://221.160.135.15:8080/update';
const LocationTracker = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {

    (async () => {
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();

// Request background location permission
      if (foregroundStatus === 'granted') {
        const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
        if (backgroundStatus !== 'granted') {
          alert('Permission to access location was denied');
          return;
        }
      } else {
        alert('Permission to access location was denied');
        return;
      }

      const intervalId = setInterval(() => {
        sendLocationData();
      }, GPS_UPDATE_INTERVAL);

      return () => clearInterval(intervalId);

    })();
  }, []);

  const sendLocationData = async () => {
    const { coords } = await Location.getCurrentPositionAsync({});
    const data = {
      lat: coords.latitude,
      lng: coords.longitude
    };

    const queryString = new URLSearchParams(data).toString();  // url에 쓰기 적합한 querySting으로 return 해준다.
    const requrl = `${SERVER_URL}?${queryString}`;   // 완성된 요청 url.
    try{
      const response = await fetch(requrl,{
        method: "POST",
        body: JSON.stringify(data)
      });

      setLocation(data);
      console.log(data);
    }catch(error){
      console.log(error);
    }

  };

  return (
      <>
        {location && (
            <View style={styles.container}>
              <Text>
                Latitude: {location.lat}, Longitude: {location.lng}
              </Text>
            </View>
        )}
      </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 3
  },
});
export default LocationTracker;

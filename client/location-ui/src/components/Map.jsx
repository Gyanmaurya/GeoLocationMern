import React, {useEffect, useState} from 'react'
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';


function LocationMarker({ setAddress }) {
  const [step, setStep] = useState(1);  
  const [userLocation, setUserLocation] = useState(null);  
  const [targetLocation, setTargetLocation] = useState(null);  

  
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      
      if (step === 1) {
        setUserLocation({ latitude: lat, longitude: lng });
        setStep(2); 
      } else if (step === 2) {
        
        setTargetLocation({ latitude: lat, longitude: lng });
        setStep(1);  
      }
    },
  });

  // Once both userLocation and targetLocation are available, send to backend
  useEffect(() => {
    if (userLocation && targetLocation) {
      const payload = {
        userLocation: userLocation,
        targetLocation: targetLocation,
      };

      console.log('Sending locations:', payload);

      axios.post('http://127.0.0.1:5000/api/v1/locationByCordinates', payload)
        .then(response => {
          console.log('Data sent successfully:', response.data);
          setAddress({
            userLocation: userLocation,
            targetLocation: targetLocation,
            address: response.data,  
          });
        })
        .catch(err => {
          console.error('Error sending data to backend:', err);
        });
    }
  }, [userLocation, targetLocation]);  

  return null;  
}



function Map() {
  const [currentAddress, setCurrentAddress] = useState('');
  const [targetAddress, setTargetAddress] = useState('');
  const [result, setResult]  =useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [targetLocation, setTargetLocation] = useState(null);
  const [near, setNear] = useState([]);
  const [clickAddress, setClickAddress] = useState(null)

  



  useEffect(()=>{
    if(!currentLocation){
      navigator.geolocation.getCurrentPosition((postion)=>{
          const { latitude,longitude} = postion.coords;
          setCurrentLocation({ latitude,longitude})
      })
    }

  },[currentLocation])

  const handleAddressSubmit = async()=>{
         try {
          const dataAddress = await axios.post('http://127.0.0.1:5000/api/v1/locationByaddress',{currentAddress, targetAddress});
          console.log(dataAddress)
          setResult(dataAddress.data);
          setCurrentAddress('');
          setTargetAddress('');
         } catch (error) {
           console.log('Unable to fetch data from frontend', error)
         }
  }
  const handleNearMeSearch = async()=>{
    console.log(currentLocation)
    try {
      const dataAddress = await axios.post('http://127.0.0.1:5000/api/v1/nearBy',currentLocation);
      console.log(dataAddress)
      const finalLocation = [...near,dataAddress.data.userAddress]
      setNear(finalLocation);
     
     } catch (error) {
       console.log('Unable to fetch data from frontend', error)
     }
  }



  const handleDataMap = (data)=>{
    //  console.log(data.address.current)
       setClickAddress(data); 
  }

  return (
    <>

      <h3>Get location, distance, Price and Search Nearby Located Shop</h3>
      <div  style={{ display: 'flex', justifyContent: 'center'  }} >
           <input style={{margin:'20px', padding:'5px'}} placeholder='Current address....'   type="text" value={currentAddress} onChange={(e)=> setCurrentAddress(e.target.value)} />
           <input style={{margin:'20px', padding:'5px'}} placeholder='Distination address....' type="text" value={targetAddress} onChange={(e)=> setTargetAddress(e.target.value)} />
           <button style={{margin:'20px', padding:'10px'}} onClick={handleAddressSubmit} >Get the Price and Distance</button>
      </div>
      <div>
      <div style={{ width: '60%' }}>
          <MapContainer center={[28.5355, 77.3910]} zoom={12} style={{ height: '400px' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            <LocationMarker setAddress={handleDataMap}  />
          </MapContainer>
          
         
          <button onClick={handleNearMeSearch}>Find Nearby Locations</button>
        </div>
      
         </div>
        
         {clickAddress && (
        <div>
        <h3>Clicked Address Details:</h3>
          <p><strong>Current Address:</strong> {clickAddress.address.current}</p>
          <p><strong>Target Address:</strong> {clickAddress.address.target}</p>
          <p><strong>DistanceKm:</strong> {clickAddress.address.distanceKm}</p>
          <p><strong>Price Rs:</strong> {clickAddress.address.priceRs}</p>
          
        </div>
      )}

      {result && (
        
        <div>
          <h3><h3>Result from Input fields</h3></h3>
          <p>Distance: {result.distanceKm.toFixed(2)} km</p>
          <p>Price: ₹{result.priceRs}</p>
        </div>
        
      ) }
      {near && near.length > 0 && (
  <div>
    <h3>Nearby Locations (within 500m to 5 km)</h3>
    <ul>
      {near.map((location, index) => (
        <li key={index}>{location}</li>
      ))}
    </ul>
  </div>
      )}

    </>
  )
}

export default Map
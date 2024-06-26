import { View, Text , Image, Touchable, PermissionsAndroid, Linking, SafeAreaView, Button} from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { GestureHandlerRootView, ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import useAuth from '../../hooks/useAuth';
import { db } from '../../config/firebase';
import { ArrowLeftIcon, ArrowRightIcon } from 'react-native-heroicons/outline';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import Modal from "react-native-modal";
// import { Button } from 'react-native-paper';


 

export default function BookRideScreen({route}) {
	const navigation = useNavigation();

	

	const [driverEmail, setDriverEmail] = useState("");
	const [driverPhno, setDriverPhno] = useState("");
	const [driverName, setDriverName] = useState("");
	const [fare, setFare] = useState("");
	const [seats, setSeats] = useState("");
	const [date, setDate] = useState("");
	const [time, setTime] = useState("");

	const [passEmail, setPassEmail] = useState("");
	const [passPhno, setPassPhno] = useState("");
	const [passName, setPassName] = useState("");
	const [passId, setPassId] = useState("");

	const [isModalVisible, setModalVisible] = useState(false);

	const toggleModal = () => {
		setModalVisible(!isModalVisible);
	};


	const [content, setContent] = useState("Book Ride");
	const [style, setStyle] = useState("font-semibold text-red-500");


	const [dLat, setDLat] = useState();
	const [dLong, setDLong] = useState();
	const [pLat, setPLat] = useState();
	const [pLong, setPLong] = useState(); 


	const [s, setS] = useState("");
	const [d, setD] = useState("");


	const driverId = route.params.DriverId;
	// const s = route.params.source;
	// const d = route.params.destination;



	const user = useAuth();
	const data = user;
	console.log(data);
	const setUID = async () => {
		setPassId(data?.user?.uid);
	};

	const reloadStyle = () => {
		setTimeout(() => {
			setStyle("font-semibold text-gren-500");
		}, 5000);
	} 

	

	// setUID();

	// console.log(route.params.DriverId);


	//geolocation permission




	// const reload = () => {
		
	// }



	const onStart = async () => {



		try {
			// getLocation();

			setUID();

			// reloadStyle();
			

			// if (passId === undefined){
			// 	// reload();
			// 	setTimeout(0, ()=>{setReady("Ready!")});
			// 	setTimeout(1000, ()=>{setReady("Not Ready!")});
			// }
			

			// Driver's information
			const q1 = doc(db, "users", driverId);
			const snapShot = await getDoc(q1);
			const d = snapShot.data();

			setDriverEmail(d.email);
			setDriverName(d.username);
			setDriverPhno(d.phoneno);
			// console.log("data =>"+ d.email);


			// driver's extra info
			const q2 = doc(db, "ShareRide" , driverId);
			const snapShot2 = await getDoc(q2);
			const d2 = snapShot2.data();
			setFare(d2.fare);
			setDate(d2.date);
			setTime(d2.time);
			setSeats(d2.seats);
			setS(d2.source);
			setD(d2.destination);
			setDLat(d2.dlat);
			setDLong(d2.dlong);



		}catch(e){
			console.log("error1: "+e);
		}
	}

	// onStart();


	const [location, setLocation] = useState(null);



	// useEffect(()=>{
	// 	requestLocPermission();
	// }, []);

	// const requestLocPermission = async () => {
	// 	try {
	// 	  const granted = await PermissionsAndroid.request(
	// 		PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
	// 		{
	// 		  title: 'Location Access',
	// 		  message:'',
	// 		  buttonNeutral: 'Ask Me Later',
	// 		  buttonNegative: 'Cancel',
	// 		  buttonPositive: 'OK',
	// 		},
	// 	  );
	// 	  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
	// 		console.log('You can use the Location');
			
	// 	  } else {
	// 		console.log('Location permission denied');
	// 	  }
	// 	} catch (err) {
	// 	  console.warn(err);
	// 	}
	// };


	
	
  
	useEffect(() => {
	  
		(async () => {
		
			const result = await Location.requestForegroundPermissionsAsync();
			console.log("requesting...");
			let location = await Location.getCurrentPositionAsync({});
			console.log("got location");
			setLocation(location);	
	  })();

	}, []);





	const handlePress = async () => {


		
		try{

			
			const loc = location;
			console.log("loc " + location.coords.latitude);
			setPLat(loc.coords.latitude);
			setPLong(loc.coords.longitude);

			//passengers info
			const q3 = doc(db, "users", passId);
			const snapShot3 = await getDoc(q3);
			const d3 = snapShot3.data();

			setPassName(d3.username);
			setPassPhno(d3.phoneno);
			setPassEmail(d3.email);

			// console.log(passId+ " "+ passName+ ' '+ passEmail+ ' ' + passPhno);
			

			const bookingId = passId+driverId;
			//data for pushing in BookedRides
			const docData = {
				bookingId: bookingId,
				passengerId: passId,
				passName:passName,
				passEmail: passEmail,
				passPhone: passPhno,
				driverId: driverId,
				driverName:driverName,
				driverEmail: driverEmail,
				driverPhno: driverPhno,
				date: date,
				time: time,
				fare: fare, 
				seatsgrabbed: seats,
				source:s,
				destination: d, 
				dlat: dLat, 
				dlong: dLong, 
				plat: pLat,
				plong: pLong,

			}
			await setDoc(doc(db, "RideReq", driverId), docData);
			console.log("Req Send Sucessfully!");
			// setContent("Booked!");




		}catch(e){
			console.log("error2: "+e);
		}
	}

	


	// onStart();
	useEffect(() => {
		onStart();
		
	}, []);

	console.log(passId);



  return (

	<GestureHandlerRootView>
		
	<View className="">
	  
	<View className="fl flex-row justify-between pt-100 font-extrabold text-2x" style={{backgroundColor: "#540C97"}}>

		<SafeAreaView className="flex">

				<View className="flex-row justify-start mt-10 pb-2">

					<TouchableOpacity
						onPress={() => navigation.goBack()}
						className = "bg-yellow-400 p02 rounded-tr-2xl rounded-bl-2xl ml-4"
					>
						<ArrowLeftIcon size="30" color="black" font="bold"/>
					</TouchableOpacity>

					<Text className="ml-10 text-xl font-bold text-white">Driver's Information</Text>
				</View>
				{/* <View className="flex-row justify-between w-96 ml-4">
					<Text className="text-xl font-bold">Form: {s}</Text>
						<ArrowRightIcon size="20" color="black"/>
					<Text className="text-xl font-bold">To: {d}</Text>
				</View> */}
			</SafeAreaView>

			
		</View>
		<ScrollView >
			<View className="flex items-center justify-center">

			{/* <View style={newColoe()} >Hello</View> */}

	  <Image source={require("../img/man.jpg")}
	  style={{width:responsiveWidth(70), height:responsiveWidth(70), borderWidth: 4, borderColor: "black"}} 
	  className="rounded-full mt-10 border-s-black"

	  />

		<View className="flex flex-row justify-between mt-10 p-6 gap-8">
			<Text className="font-bold text-lg">Source: {s}</Text>
			<Text className="font-bold text-lg">Destination: {d}</Text>
		</View>

		<View className="flex-col justify-between">
			<Text className="font-semibold">Driver's Name: {driverName}</Text>
			<Text className="font-semibold">User ID: {driverId}</Text>
			<Text className="font-semibold">Email: {driverEmail}</Text>
			<Text className="font-semibold">Phone No.: {driverPhno}</Text>
			<Text className="font-semibold">Available Seats: {seats}</Text>
			<Text className="font-semibold">Date of Journey: {date}</Text>
			<Text className="font-semibold">Time of Journey: {time}</Text>
			<Text className="font-semibold">Fare per Person: {fare}Rs/-</Text>
			{/* <Text className={style}>Ready!</Text> */}
		</View>


		<TouchableOpacity  

	  	onPress={()=> {navigation.navigate("MapScreen", {longitude: {dLong}, latitude: {dLat}})}}
	  	className="w-80 h-12 bg-yellow-400 justify-center flex-row rounded-lg mt-10"
	  >
		<Text className="pt-1 font-extrabold text-2xl text-black border-blue-950">Get Location of Driver</Text>
	  </TouchableOpacity>

	  
	  

	  <TouchableOpacity  

	  	onPress={handlePress}
	  	className="w-80 h-12 bg-yellow-400 justify-center flex-row rounded-lg mt-10 mb-64"
	  >
		<Text className="pt-1 font-extrabold text-2xl text-black border-blue-950">Request Ride</Text>
	  </TouchableOpacity>



	  {/* <Modal isVisible={false} className="w-22 h-36">
        <View style={{ flex: 1 }}>
          <Text>Hello!</Text>

          <Button title="Hide modal" onPress={toggleModal} />
        </View>
      </Modal> */}
			

	  </View>	
	  </ScrollView>
	</View>
	
	</GestureHandlerRootView>
  )
}
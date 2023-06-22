import React, { useState, useEffect } from "react";
import {  useParams, Link } from "react-router-dom";
import { Map, Marker, NavigationControl, Popup, FullscreenControl, ScaleControl, GeolocateControl } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { getLocations, deleteLocation, } from "../services/location-services";
import PlaceTwoToneIcon from '@mui/icons-material/PlaceTwoTone';
import { format } from 'timeago.js';
import './Map.css';
import Register from "./Register";
import Login from "./Login";
import Geocoder from "./Geocoder/Geocoder";
import Form from './Form'
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';
import Button from '@mui/material/Button';
import { logout } from "../services/user-services";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


const userLoggedOut = (userS) => {
  toast.success(`Come back soon ${userS}!`)
}

const Mapa = () => {

	const { id } = useParams();

	const [locations, setLocations] = useState([])
	const [newLocation, setNewLocation] = useState(null) //localizaciones por crear
	const [currentUser, setCurrentUser] = useState(null)


	const [showRegister, setShowRegister] = useState(false)
	const [showLogin, setShowLogin] = useState(false)


	const [viewPort, setViewPort] = useState({
		longitude: 12.4,
		latitude: 37.8,
		zoom: 14
	});

	const [locationId, setLocationId] = useState(null); //localizaciones creadas

	const handleClick = (e) => {//al hacer click en cualquier parte del mapa
		console.log(e)
		let lat = e.lngLat.lat
		let lon = e.lngLat.lng
		setNewLocation({
			lat: lat,
			lng: lon
		})
	};

	const handleLocClick = (id, lat, lon) => { //click en la localización creada ver carta
		console.log(lat)
		console.log(lon)
		setLocationId(id)
	};


	const getLocationsFromService = async () => {
		try {
			const list = await getLocations();
			console.log(list);
			setLocations(list.data.locations);
		} catch (error) {
			console.log(error);
		}
	}


	const removeLocation = async (id) => {
		try {
			const response = await deleteLocation(id);
			console.log(response)
			const newLocationList = locations.filter((loc) => loc._id !== id);
			setLocations(newLocationList);
		} catch (error) {

		}
	}


	useEffect(() => {
		const user = localStorage.getItem('currentUser'); 
		if (user) {
			setCurrentUser(JSON.parse(user));
		}
		getLocationsFromService();
	}, [])


	const handleLogout = async () => {
		await logout();
		localStorage.removeItem('currentUser');
		userLoggedOut(currentUser)
		setCurrentUser(null);

	};

	return (

		<div>
			<div className="header">
				<div className="header_1">
					{
						currentUser ? (<button className="button-logout" onClick={handleLogout}>Log out</button>)
							: (
								<div>
									<button className="button-login"
										onClick={() => { setShowLogin(true) }}
									>Login</button>
									<button className="button-register"
										onClick={() => { setShowRegister(true) }}
									>Register</button>
								</div>
							)
					}
				</div>

			</div>


			<Map
				container={'map'}
				projection={'globe'}
				initialViewState={{ viewPort }}
				mapboxAccessToken={process.env.REACT_APP_MAPBOX}
				mapStyle="mapbox://styles/fjmir/cliqiokvn01mq01qggyw8fpk7"
				style={{ width: "100vw", height: "100vh" }}
				onDblClick={handleClick} //DOBLE CLICK
			>

				<ToastContainer
					position="bottom-left"
					theme="dark" />
				<Geocoder position="bottom-right" />
				<GeolocateControl position="top-right" />
				<FullscreenControl position="top-right" />
				<NavigationControl position="top-right" />
				<ScaleControl position="bottom-right" />

				{
					locations.map(loc => (
						<>
							<Marker
								longitude={loc.lon}
								latitude={loc.lat}
								anchor="center">

								<PlaceTwoToneIcon
									className="location"
									onClick={() => handleLocClick(loc._id, loc.lat, loc.lon)} //CLICK
									style={{ fontSize: viewPort.zoom * 2.5, color: loc.userName === currentUser ? "tomato" : "teal" }}
								/>

							</Marker>

							{
								loc._id === locationId && (
									<Popup
										longitude={loc.lon}
										latitude={loc.lat}
										closeOnClick={false}
										closeOnMove={false}
										anchor="left">
										<div className="info">
											<p className="userName">Created by: <b>{loc.userName}</b> {format(loc.createdAt)}</p>
										</div>
										<div className="card-location">
											{/* <label>_id</label>
											<h3>{loc._id}</h3> */}
											<label>Category</label>
											<h3 className="category">{loc.category}</h3>
											<label>Title</label>
											<h3 className="name">{loc.name}</h3>
											<label>Description</label>
											<h3 className="description">{loc.description}</h3>
											{/* <img src={"http://localhost:8080/img/"+ loc.image} alt={loc.name} /> */}
											<img src={`http://localhost:8080/img/${loc.image.replace("uploads\\", "")}`} alt={loc.name} />
											{console.log("loc.image:" + loc.image)}
										</div>
										{loc.userName === currentUser && ( // condicion para que el editar y eliminar aparezca solo si es el usuario que creó
											<div className="delete-edit">
												<IconButton aria-label="delete" color="primary" >
													<DeleteIcon onClick={() => removeLocation(loc._id)} className="Icon" />
												</IconButton>
												<Button variant="outlined" className="button-icon" endIcon={<EditLocationAltIcon className="Icon" />}>
													<Link to={`/home/${loc._id}`} className="link">Edit</Link>
												</Button>
											</div>
										)}
									</Popup>
								)
							}
						</>
					))}

				{
					newLocation &&
					<Popup
						longitude={newLocation.lng} //not shure sobre el nombre pero funciona 
						latitude={newLocation.lat}
						closeOnClick={false}
						closeOnMove={false}
						onClose={() => setNewLocation(null)}
						anchor="left">
						<Form
							getLocationsFromService={getLocationsFromService}
							currentUser={currentUser}
							lat={newLocation.lat}
							lon={newLocation.lng} />
					</Popup>
				}
				<div className="título">
					<h1>Scene</h1>
					<h1>Hunter</h1>
				</div>
			</Map>

			{showRegister && <Register setShowRegister={setShowRegister} />}
			{showLogin && <Login setShowLogin={setShowLogin} setCurrentUser={setCurrentUser} />}


		</div>
	);
}

export default Mapa;
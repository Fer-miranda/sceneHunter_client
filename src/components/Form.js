// import React, { useState } from "react";
// import { createLocation, updateLocation } from "../services/location-services";
// import { useParams } from "react-router-dom";
// import './Form.css';

// const Form = ({ currentUser, lat, lon, getLocationsFromService}) => {
//   const { id } = useParams();

//   const [name, setName] = useState(null);
//   const [description, setDescription] = useState(null);
//   const [category, setCategory] = useState(null);

//   const [nameError, setNameError] = useState("");
//   const [categoryError, setCategoryError] = useState("");
//   const [descriptionError, setDescriptionError] = useState("");
  
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const location = {
//       userName : currentUser,
//       name: name,
//       description: description,
//       category: category,
//       lat: lat,
//       lon: lon,
//     };
//     try {
//       const response = !id
//         ? await createLocation(location)
//         : await updateLocation(id, location);
//       // getLocationsFromService();
//       console.log(response);
//     } catch (error) {
//       console.log(error);
//       if (
//         error.response &&
//         error.response.data &&
//         error.response.data.error
//       ) {
//         const { errors } = error.response.data.error;
//         if (errors) {
//           if (errors.name) {
//             setNameError(errors.name.message);
//           }
//           if (errors.description) {
//             setDescriptionError(errors.description.message);
//           }
//           if (errors.category) {
//             setCategoryError(errors.category.message);
//           }
//         }
//       }
//     }
//   };

//   return (
//     <div className="formulario">
//       <form onSubmit={handleSubmit} className="formulario_1">
//         <label>Category</label>
//         <select onChange={(e) => setCategory(e.target.value)}>
//           <option>Select</option>
//           <option value="Movies">Movies</option>
//           <option value="Series">Series</option>
//           <option value="Music videos">Music videos</option>
//         </select>
//         {categoryError && <span>{categoryError}</span>}
//         <label>Title</label>
//         <input
//           placeholder="Enter a title"
//           onChange={(e) => setName(e.target.value)}
//         ></input>
//         {nameError && <span>{nameError}</span>}
//         <label>Description</label>
//         <textarea
//           placeholder="Say something about this place!"
//           onChange={(e) => setDescription(e.target.value)}
//         ></textarea>
//         {descriptionError && <span>{descriptionError}</span>}
//         <button className="submit-button" type="submit">
//           Hunt a scene
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Form;


import React, { useState, useEffect } from "react";
import { createLocation, updateLocation, getLocation } from "../services/location-services";
import { useParams, useNavigate } from "react-router-dom";
import './Form.css';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const sceneAddSuccess = () =>{
  toast.success("Added Scene!")
}

const sceneAddFailure = () =>{
  toast.error("Please fill all data.")
}

const userNotLoggedIn = () =>{
  toast.warning("Loggin to account to hunt scenes!")
}

const Form = ({ currentUser, lat, lon, getLocationsFromService }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const [nameError, setNameError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  const [image, setImage] = useState({});
  const [imageError, setImageError] = useState("");
	
  const [latitude, setLatitude] = useState(lat);
  const [longitude, setLongitude] = useState(lon);
  const [userName, setUserName] = useState(currentUser);


  const handleSubmit = async (e) => {
    e.preventDefault();
		
		const locationData = {
			userName: userName,
			name: name,
			description: description,
			category: category,
			lat: latitude,
			lon: longitude,
		};
		
		const formData = new FormData();
		formData.append("image", image);
		
		Object.entries(locationData).forEach(([key, value]) => {
			formData.append(key, value);
		});

    try {
      if(currentUser === null)
      {
        userNotLoggedIn()
      }
      else{
        const response = !id
				? await createLocation(formData)
				: await updateLocation(id, formData)
			navigate('/home');
			getLocationsFromService();
			sceneAddSuccess()
			console.log(response);
      }
    } catch (error) {
      console.log(error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.error
        ) {
          const { errors } = error.response.data.error;
          if (errors) {
            if (errors.name) {
              setNameError(errors.name.message);
            }
            if (errors.description) {
              setDescriptionError(errors.description.message);
            }
            if (errors.category) {
              setCategoryError(errors.category.message);
            }
            if (!image) {
              setImageError("Image is required");
              return;
            }
          }
        }
    }
  };

  useEffect(() => {
    const getLocationFromService = async () => {
      if (id) {
        try {
          const response = await getLocation(id);
          const location = response.data.location;

					console.log(location);

          setName(location.name);
          setDescription(location.description);
          setCategory(location.category);
					setLatitude(location.lat);
					setLongitude(location.lon);
					setUserName(location.userName);
        } catch (error) {
          console.log(error);
        }
      }
    };

    getLocationFromService();
  }, [id]);

  return (
    <div className="formulario">
      <form onSubmit={handleSubmit} className="formulario_1">
        <label>Category</label>
        <select onChange={(e) => setCategory(e.target.value)} value={category}>
          <option>Select</option>
          <option value="Movies">Movies</option>
          <option value="Series">Series</option>
          <option value="Music videos">Music videos</option>
        </select>
        {categoryError && <span>{categoryError}</span>}
        <label>Title</label>
        <input
          placeholder="Enter a title"
          onChange={(e) => setName(e.target.value)}
          value={name}
        ></input>
        {nameError && <span>{nameError}</span>}
        <label>Description</label>
        <textarea
          placeholder="Say something about this place!"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
        ></textarea>
        {descriptionError && <span>{descriptionError}</span>}
        <label>Image</label>
        <input type="file" onChange={(e) => setImage(e.target.files[0])}></input>
        {imageError && <span>{imageError}</span>}
        <button className="submit-button" type="submit">
          Hunt a scene
        </button>
      </form>
    </div>
  );
};

export default Form;

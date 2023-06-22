import axios from "axios";

export const getLocations = () => axios.get('http://localhost:8080/api/location');

export const getLocation = (id) => axios.get(`http://localhost:8080/api/location/${id}`);

export const createLocation = (formData) => axios.post(
  'http://localhost:8080/api/location/',
  formData,
  {
    headers: {
    'Content-Type': 'multipart/form-data',
    }
  },
);

export const updateLocation = (id, formData) => axios.put(
  `http://localhost:8080/api/location/${id}`,
  formData,
  {
    headers: {
    'Content-Type': 'multipart/form-data',
    }
  },
);


export const deleteLocation = (id) => axios.delete(`http://localhost:8080/api/location/${id}`);

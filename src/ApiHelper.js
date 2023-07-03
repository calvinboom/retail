import axios from "axios";

const BASE_API_URL = process.env.REACT_APP_BACKEND_URL;

const exportedObject = {
    loginUser
};

async function loginUser(data) {
    console.log(BASE_API_URL)
    return axios.post(`${BASE_API_URL}/api/login`, data)
      .then(res => {
        return res.data
      })
 }

export default exportedObject;

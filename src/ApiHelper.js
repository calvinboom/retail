import axios from "axios";

const BASE_API_URL = process.env.REACT_APP_BACKEND_URL;

const exportedObject = {
    loginUser,
    getItems,
    createTransaction,
    getTransactions
};

async function loginUser(payload = {}) {
    return axios.post(`${BASE_API_URL}/api/login`, payload = {})
      .then(res => {
        return res?.data
      })
}

async function getItems(data) {
  return axios.post(`${BASE_API_URL}/api/items`, data)
    .then(res => {
      return res?.data
    })
}

async function createTransaction(data) {
  return axios.post(`${BASE_API_URL}/api/transactions/create`, data)
    .then(res => {
      return res?.data
    })
}

async function getTransactions(data) {
  return axios.post(`${BASE_API_URL}/api/transactions/list`, data)
    .then(res => {
      return res?.data
    })
}

export default exportedObject;

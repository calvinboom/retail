import axios from "axios";

const BASE_API_URL = process.env.REACT_APP_BACKEND_URL;

const exportedObject = {
    loginUser,
    getItems,
    createTransaction,
    getTransactions,
    getDashboardReport,
    createItems,
    getItem,
    updateItem
};

async function loginUser(data = {}) {
    return axios.post(`${BASE_API_URL}/api/login`, data)
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

async function getItem(data) {
  return axios.post(`${BASE_API_URL}/api/items/info`, data)
    .then(res => {
      return res?.data
    })
}

async function createItems(data) {
  return axios.post(`${BASE_API_URL}/api/items/create`, data)
    .then(res => {
      return res?.data
    })
}

async function updateItem(data) {
  return axios.post(`${BASE_API_URL}/api/items/update`, data)
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

async function getDashboardReport(data) {
  return axios.post(`${BASE_API_URL}/api/transactions/report`, data)
    .then(res => {
      return res?.data
    })
}

export default exportedObject;

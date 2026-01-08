import axios from "axios";

const BASE_API_URL = process.env.REACT_APP_BACKEND_URL;

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: BASE_API_URL,
});

// Add request interceptor to include Authorization header
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle auth errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid - clear storage and redirect to login
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

const exportedObject = {
    loginUser,
    getItems,
    createTransaction,
    getTransactions,
    getDashboardReport,
    createItems,
    getItem,
    updateItem,
    getUsers,
    getUser,
    createUser,
    updateUser,
    getSellers,
    getSeller,
    createSeller,
    updateSeller,
    getCustomers,
    getCustomer,
    createCustomer,
    updateCustomer,
    createBuyingItems,
    getBuyingOrders,
    getBuyingItemsByPid,
    updateBuyingStatus
};

async function loginUser(data = {}) {
    // Login doesn't need auth token
    return axios.post(`${BASE_API_URL}/api/login`, data)
      .then(res => {
        return res?.data
      })
}

async function getItems(data) {
  return apiClient.post(`/api/items`, data)
    .then(res => {
      return res?.data
    })
}

async function getItem(data) {
  return apiClient.post(`/api/items/info`, data)
    .then(res => {
      return res?.data
    })
}

async function createItems(data) {
  return apiClient.post(`/api/items/create`, data)
    .then(res => {
      return res?.data
    })
}

async function updateItem(data) {
  return apiClient.post(`/api/items/update`, data)
    .then(res => {
      return res?.data
    })
}

async function createTransaction(data) {
  return apiClient.post(`/api/transactions/create`, data)
    .then(res => {
      return res?.data
    })
}

async function getTransactions(data) {
  return apiClient.post(`/api/transactions/list`, data)
    .then(res => {
      return res?.data
    })
}

async function getDashboardReport(data) {
  return apiClient.post(`/api/transactions/report`, data)
    .then(res => {
      return res?.data
    })
}

async function getUsers(data = {}) {
  return apiClient.get(`/api/users`)
    .then(res => {
      return res?.data
    })
}

async function getUser(data = {}) {
  return apiClient.post(`/api/user`, data)
    .then(res => {
      return res?.data
    })
}

async function createUser(data = {}) {
  return apiClient.post(`/api/create-user`, data)
    .then(res => {
      return res?.data
    })
}

async function updateUser(data = {}) {
  return apiClient.post(`/api/update-user`, data)
    .then(res => {
      return res?.data
    })
}

async function getSellers(data = {}) {
  return apiClient.get(`/api/sellers`)
    .then(res => {
      return res?.data
    })
}

async function getSeller(data = {}) {
  return apiClient.post(`/api/sellers`, data)
    .then(res => {
      return res?.data
    })
}

async function createSeller(data = {}) {
  return apiClient.post(`/api/sellers/create`, data)
    .then(res => {
      return res?.data
    })
}

async function updateSeller(data = {}) {
  return apiClient.post(`/api/sellers/update`, data)
    .then(res => {
      return res?.data
    })
}

async function getCustomers(data = {}) {
  return apiClient.get(`/api/customers`)
    .then(res => {
      return res?.data
    })
}

async function getCustomer(data = {}) {
  return apiClient.post(`/api/customers`, data)
    .then(res => {
      return res?.data
    })
}

async function createCustomer(data = {}) {
  return apiClient.post(`/api/customers/create`, data)
    .then(res => {
      return res?.data
    })
}

async function updateCustomer(data = {}) {
  return apiClient.post(`/api/customers/update`, data)
    .then(res => {
      return res?.data
    })
}

async function createBuyingItems(data = {}) {
  return apiClient.post(`/api/buyitems/create`, data)
    .then(res => {
      return res?.data
    })
}

async function getBuyingOrders(data = {}) {
  return apiClient.post(`/api/buyitems/list`, data)
    .then(res => {
      return res?.data
    })
}

async function getBuyingItemsByPid(data = {}) {
  return apiClient.post(`/api/buyitems/find-by-pid`, data)
    .then(res => {
      return res?.data
    })
}

async function updateBuyingStatus(data = {}) {
  return apiClient.post(`/api/buyitems/update-status`, data)
    .then(res => {
      return res?.data
    })
}

export default exportedObject;

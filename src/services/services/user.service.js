import axios from "axios";
import authHeader from './auth-header';

const API_URL = 'http://localhost:5000/api/';

class UserService {
    getHome() {
        return axios.get(API_URL + 'home')
    }

    getUser() {
        return axios.get(API_URL + 'user', { headers: authHeader })
    }

    getAdmin() {
        return axios.get(API_URL + 'admin', { headers: authHeader })
    }
}

export default new UserService();
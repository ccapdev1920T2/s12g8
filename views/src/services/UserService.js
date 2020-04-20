import axios from "axios";

const url = 'http://localhost:3000/api/user';

class UserService {
    static addUser(user) {
        return axios.post(`${url}/signup`, user);
    }

    static login(user) {
        return axios.post(`${url}/login`, user);
    }
}

export default UserService;
import axios from 'axios';

export const userService = {
    register: (userData: any) => {
      return axios.post('http://localhost:8080/users', userData);
    },
  };
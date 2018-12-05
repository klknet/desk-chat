import axios from 'axios';
import config from '../config/settings';

const instance = axios.create();
instance.defaults.timeout = config.timeout;
instance.defaults.baseURL = config.baseURL;

instance.interceptors.response.use(res => {
    return res;
}, err => {
    // if (err.response.data.status === 401 && err.response.data.message === 'Unauthorized') {
    //     persist.logout();
    //     window.location.reload();
    // }
    console.log(err.response.data)
});

export default instance;

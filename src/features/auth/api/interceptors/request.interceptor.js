import api from "../axios";
import { tokenStorage } from "../helpers/token-storage";

api.interceptors.request.use(

    (config) => {

        const token =
            tokenStorage.getAccessToken();

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;

        }

        return config;

    },

    (error) => Promise.reject(error)

);
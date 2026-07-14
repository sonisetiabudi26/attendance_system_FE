import axios from "axios";

import api from "../axios";

import { tokenStorage } from "../helpers/token-storage";

import {
    getRefreshing,
    setRefreshing,
    addQueue,
    processQueue,
} from "../helpers/refresh-queue";

api.interceptors.response.use(

    (response) => response,

    async (error) => {

        const originalRequest = error.config;

        if (
            error.response?.status !== 401 ||
            originalRequest._retry
        ) {

            return Promise.reject(error);

        }

        if (getRefreshing()) {

            return new Promise((resolve, reject) => {

                addQueue(resolve, reject);

            }).then((token) => {

                originalRequest.headers.Authorization =
                    `Bearer ${token}`;

                return api(originalRequest);

            });

        }

        originalRequest._retry = true;

        setRefreshing(true);

        try {

            const refreshToken =
                tokenStorage.getRefreshToken();

            const response =
                await axios.post(

                    `${import.meta.env.VITE_API_URL}/auth/refresh-token`,

                    {
                        refreshToken,
                    }

                );

            const auth =
                response.data.data;

            tokenStorage.setTokens(

                auth.accessToken,

                auth.refreshToken

            );

            processQueue(
                null,
                auth.accessToken
            );

            originalRequest.headers.Authorization =
                `Bearer ${auth.accessToken}`;

            return api(originalRequest);

        } catch (err) {

            processQueue(err);

            tokenStorage.clear();

            window.location.href = "/login";

            return Promise.reject(err);

        } finally {

            setRefreshing(false);

        }

    }

);
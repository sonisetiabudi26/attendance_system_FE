export const tokenStorage = {

    getAccessToken() {
        return localStorage.getItem("accessToken");
    },

    getRefreshToken() {
        return localStorage.getItem("refreshToken");
    },

    setTokens(accessToken, refreshToken) {

        localStorage.setItem(
            "accessToken",
            accessToken
        );

        localStorage.setItem(
            "refreshToken",
            refreshToken
        );

    },

    clear() {

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

    }

};
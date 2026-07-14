import api from "@/shared/api/axios";

export const authApi = {

    loginData(payload){
        return api.post("/auth/login",payload);
    },
    me(){
        return api.get("/employee/me");
    },
    logoutData(){
        return api.post("/auth/logout");
    },
    refreshToken(refreshToken) {
    return api.post("/auth/refresh", {
        refreshToken,
    });
}
}
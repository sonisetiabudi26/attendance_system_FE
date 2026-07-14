export function saveToken(accessToken,refreshToken){

    localStorage.setItem(
        "accessToken",
        accessToken
    );

    localStorage.setItem(
        "refreshToken",
        refreshToken
    );

}

export function clearToken(){

    localStorage.removeItem("accessToken");

    localStorage.removeItem("refreshToken");

}

export function getToken(){

    return localStorage.getItem(
        "accessToken"
    );

}
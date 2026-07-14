import { createContext,useEffect,useState } from "react";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

export const AuthContext=createContext(null);
export function AuthProvider({children}){
    const {
        data:user,
        isLoading,
        refetch,
    }=useCurrentUser();
    const [currentUser,setCurrentUser]=useState(null);
    useEffect(()=>{
        if(user){
            setCurrentUser(user);
        }
    },[user]);

    async function login(auth){
        localStorage.setItem(
            "accessToken",
            auth.accessToken
        );
        localStorage.setItem(
            "refreshToken",
            auth.refreshToken
        );
        await refetch();
    }

    async function logout(){
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setCurrentUser(null);
    }

    return(
        <AuthContext.Provider
            value={{
                user:currentUser,
                isLoading,
                isAuthenticated:!!currentUser,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );

}
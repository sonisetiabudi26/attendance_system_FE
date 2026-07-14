import {useQuery} from "@tanstack/react-query";
import {authApi} from "@/features/auth/api/auth.api";

export function useCurrentUser(){

    return useQuery({

        queryKey:["me"],

        queryFn:async()=>{

            const {data}=await authApi.me();

            return data.data;

        },

        enabled:!!localStorage.getItem("accessToken"),

        staleTime:5*60*1000,

        retry:false

    });

}
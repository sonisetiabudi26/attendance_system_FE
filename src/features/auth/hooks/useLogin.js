import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authApi } from "@/features/auth/api/auth.api";

export function useLogin() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: async (payload) => {

            const { data } = await authApi.loginData(payload);

            return data.data;

        },

        onSuccess: async (auth) => {

            localStorage.setItem(
                "accessToken",
                auth.accessToken
            );

            localStorage.setItem(
                "refreshToken",
                auth.refreshToken
            );

            await queryClient.invalidateQueries({
                queryKey: ["me"],
            });

        }

    });

}
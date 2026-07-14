import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/features/auth/api/auth.api";

export function useLogout() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: async () => {

            try {
                await authApi.logoutData();
            } catch (e) {
            }

        },

        onSuccess: () => {
console.log("logout success");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");

            queryClient.removeQueries({
                queryKey: ["me"],
            });

            queryClient.clear();

        }

    });

}
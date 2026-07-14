import { useCurrentUser } from "./useCurrentUser";

export function useRole() {

    const { data: user } = useCurrentUser();

    return {

        role: user?.role,

        isEmployee: user?.role === "EMPLOYEE",

        isHRD: user?.role === "HR",

        isAdmin: user?.role === "ADMIN",

    };

}
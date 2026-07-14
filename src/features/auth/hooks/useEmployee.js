import { useCurrentUser } from "./useCurrentUser";

export function useEmployee() {

    const { data: user } = useCurrentUser();

    return user?.employee;

}
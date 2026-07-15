import { useQuery } from "@tanstack/react-query";
import { employeeApi } from "../api/employee.api";

export function useEmployees(params) {

    return useQuery({

        queryKey: ["employees", params],

        queryFn: async () => {

            const { data } = await employeeApi.getAll(params);

            return data.data;

        },

        placeholderData: (previousData) => previousData,

        staleTime: 1000 * 60 * 5,

        retry: false,

    });

}
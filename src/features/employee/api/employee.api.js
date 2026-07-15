import api from "@/shared/api/axios";

export const employeeApi = {

    updateData(id, payload){
        return api.put(`/employee/update-employee/${id}`,payload);
    },

    getAll(params) {
        return api.get("/employee", {
            params,
        });
    },

};

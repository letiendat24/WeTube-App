import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { ENV } from "@/configs/env";

const baseQuery = fetchBaseQuery({
    baseUrl: `${ENV.apiBaseUrl}/`,
    prepareHeaders: (headers) => {
        const token = localStorage.getItem("token");
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

export default baseQuery;

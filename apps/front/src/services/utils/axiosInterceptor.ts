import { AxiosInstance } from "axios";

export default function axiosInterceptor(axios: AxiosInstance) {
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (
        originalRequest.url?.includes("/auth/refresh-token") ||
        originalRequest.url?.includes("/auth/logout")
      ) {
        return Promise.reject(error);
      }

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          await axios.post("/auth/refresh-token", null, {
            withCredentials: true,
          });
          // Relaunch original request
          return axios(originalRequest);
        } catch (refreshError) {
          await axios.post("/auth/logout", null, {
            withCredentials: true,
          });

          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    },
  );
}

import axios, { AxiosError, AxiosRequestConfig } from "axios";
import QueryString from "qs";

export interface IRequestConfig extends AxiosRequestConfig {
  _retry: boolean;
}

if (typeof window !== "undefined") {
  axios.interceptors.request.use(
    function (config) {
      const blackList = ["/todos"];
      if (blackList.every((black) => !config?.url?.includes(black)))
        return config;

      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) return Promise.reject("access_token is missing.");

      config.headers.authorization = `Bearer ${accessToken}`;
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    function (response) {
      return response;
    },
    async function (error: AxiosError) {
      const originalRequest = error.config as IRequestConfig;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) return Promise.reject(error);

        const data = QueryString.stringify({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        });

        try {
          const {
            data: { access_token, refresh_token },
          } = await axios({
            method: "POST",
            data,
            url: "/api/oauth/token",
          });
          localStorage.setItem("access_token", access_token);
          localStorage.setItem("refresh_token", refresh_token);

          originalRequest.headers.authorization = `Bearer ${
            access_token as string
          }`;

          return axios(originalRequest);
        } catch (e) {
          const newRefreshToken = localStorage.getItem("refresh_token");
          if (newRefreshToken === refreshToken) {
            window.location.href = "/oauth/login";
          } else {
            return axios(originalRequest);
          }
          return false;
        }
      }

      return Promise.reject(error);
    }
  );
}

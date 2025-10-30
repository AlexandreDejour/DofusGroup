import axios, { AxiosInstance } from "axios";

import axiosInterceptor from "./utils/axiosInterceptor";

export class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({ baseURL });
    axiosInterceptor(this.axiosInstance);
  }

  get instance() {
    return this.axiosInstance;
  }
}

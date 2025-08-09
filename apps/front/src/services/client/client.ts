import axios, { AxiosInstance } from "axios";

export class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({ baseURL });
  }

  get instance() {
    return this.axiosInstance;
  }
}

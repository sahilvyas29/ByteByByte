import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export class AxiosHelper {
    static axiosInstance = (config?: AxiosRequestConfig): AxiosInstance => {
        const requestConfig: AxiosRequestConfig = {
            timeout: 20000,
            ...config,
        };
        return axios.create(requestConfig);
    };
}

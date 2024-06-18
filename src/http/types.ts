import {
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { Logger } from "@nestjs/common";

type AxiosInterceptorCallback<T> = (config: T) => T | Promise<T>;

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  enableLogging?: boolean;
  onRequest?: AxiosInterceptorCallback<InternalAxiosRequestConfig>;
  onResponse?: AxiosInterceptorCallback<AxiosResponse>;
  onError?: AxiosInterceptorCallback<Error>;
}

export interface IHttpModuleOptions {
  serviceName?: string;
  logger?: Logger;
  config: CustomAxiosRequestConfig;
}

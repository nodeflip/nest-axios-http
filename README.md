![test workflow](https://github.com/nodeflip/nest-axios-http/actions/workflows/test.yml/badge.svg)
[![npm version](https://badge.fury.io/js/%40nodeflip%2Fnest-axios-http.svg)](https://badge.fury.io/js/%40nodeflip%2Fnest-axios-http)
[![downloads](https://img.shields.io/npm/dm/@nodeflip/nest-axios-http.svg)](https://www.npmjs.com/package/@nodeflip/nest-axios-http)

# @nodeflip/nest-axios-http

## Description

`@nodeflip/nest-axios-http` is a NestJS module that simplifies HTTP requests using Axios within NestJS applications. It provides an easy-to-use interface for making HTTP calls while integrating seamlessly with NestJS dependency injection and module system.

## Features

- **Simplified HTTP Requests:** Easily make HTTP requests with Axios using a service-oriented approach.
- **Dependency Injection:** Utilize NestJS's powerful dependency injection system to manage HTTP service instances.
- **Customization Options:** Customize Axios instance configuration, logging, request/response interceptors, and error handling.
- **Dynamic Module Configuration:** Dynamically configure HTTP services based on module options using `forRoot`, `forFeature`, and `forFeatureWithProvider` methods.

## Benefits

- **Integration with NestJS:** Seamlessly integrates with NestJS architecture, making it easy to manage HTTP services as injectable dependencies.
- **Modular Design:** Allows for dynamic module configuration, enabling multiple HTTP service instances with different configurations within a single NestJS application.
- **Logging and Interceptors:** Built-in support for custom logging and request/response interceptors, providing flexibility in handling HTTP interactions.
- **Named Services:** Supports injecting named HTTP services using `serviceName` for different configurations or service instances within the same application.

## Installation

```bash
npm install @nodeflip/nest-axios-http
```

## Usage

### Importing the Module

Import `HttpModule` into your NestJS application's module (`AppModule`, for example).

```typescript
import { Module } from '@nestjs/common';
import { HttpModule } from '@nodeflip/nest-axios-http';

@Module({
  imports: [
    HttpModule.forRoot({
      config: {
        baseURL: 'https://api.example.com',
        enableLogging: true,
        onRequest: (config) => {
          // Customize request logging or modifications
          return config;
        },
        onResponse: (response) => {
          // Customize response logging or modifications
          return response;
        },
        onError: (error) => {
          // Customize error handling or logging
          return Promise.reject(error);
        },
      },
    }),
  ],
})
export class AppModule {}
```

### Using HTTP Service

Inject `HttpService` into your NestJS components or services to make HTTP requests.

```typescript
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nodeflip/nest-axios-http';
import { AxiosResponse } from 'axios';

@Injectable()
export class MyService {
  constructor(private readonly httpService: HttpService) {}

  async fetchData(): Promise<AxiosResponse<any>> {
    return this.httpService.get('/data');
  }

  async postData(data: any): Promise<AxiosResponse<any>> {
    return this.httpService.post('/data', data);
  }
}
```

### Injecting Named HTTP Services

You can inject named HTTP services using the `serviceName` option and the `@Inject` decorator.

```typescript
import { Module } from '@nestjs/common';
import { HttpModule } from '@nodeflip/nest-axios-http';

@Module({
  imports: [
    HttpModule.forRoot({
      serviceName: 'CustomHttpService',
      config: {
        baseURL: 'https://api.example.com',
        enableLogging: true,
        onRequest: (config) => {
          // Customize request logging or modifications
          return config;
        },
        onResponse: (response) => {
          // Customize response logging or modifications
          return response;
        },
        onError: (error) => {
          // Customize error handling or logging
          return Promise.reject(error);
        },
      },
    }),
  ],
})
export class AppModule {}
```

```typescript
import { Injectable, Inject } from '@nestjs/common';
import { HttpService } from '@nodeflip/nest-axios-http';
import { AxiosResponse } from 'axios';

@Injectable()
export class AnotherService {
  constructor(
    @Inject('CustomHttpService') private readonly customHttpService: HttpService,
    @Inject(HttpService) private readonly defaultHttpService: HttpService,
  ) {}

  async fetchDataFromCustomService(): Promise<AxiosResponse<any>> {
    return this.customHttpService.get('/custom-data');
  }

  async fetchDataFromDefaultService(): Promise<AxiosResponse<any>> {
    return this.defaultHttpService.get('/default-data');
  }
}
```

### Custom Logging and Interceptors

You can customize logging and request/response interceptors by providing `logger` and `config` options during module initialization.

```typescript
import { Logger } from "@nestjs/common";
import { Module } from "@nestjs/common";
import { HttpModule } from "@nodeflip/nest-axios-http";

const customLogger = new Logger("CustomLogger");

@Module({
  imports: [
    HttpModule.forRoot({
      logger: customLogger, // Custom logger instance
      config: {
        baseURL: "https://api.example.com",
        enableLogging: true,
        onRequest: (config) => {
          // Customize request logging or modifications
          return config;
        },
        onResponse: (response) => {
          // Customize response logging or modifications
          return response;
        },
        onError: (error) => {
          // Customize error handling or logging
          return Promise.reject(error);
        },
      },
    }),
  ],
})
export class AppModule {}

```
### Configuring Multiple HTTP Services

You can configure multiple HTTP services using an array of options with forFeature.
```typescript
import { Module } from "@nestjs/common";
import { HttpModule } from "@nodeflip/nest-axios-http";

@Module({
  imports: [
    HttpModule.forFeature([
      {
        serviceName: "HTTP_SERVICE_2",
        config: {
          baseURL: "https://api.service1.com",
          enableLogging: true,
          onRequest: (config) => {
            // Optional: Customize request logging or modifications
            return config;
          },
          onResponse: (response) => {
            // Optional: Customize response logging or modifications
            return response;
          },
          onError: (error) => {
            // Optional: Customize error handling or logging
            return Promise.reject(error);
          },
        },
      },
      {
        serviceName: "HTTP_SERVICE_2",
        config: {
          baseURL: "https://api.service2.com",
          enableLogging: true,
          onRequest: (config) => {
            // Optional: Customize request logging or modifications
            return config;
          },
          onResponse: (response) => {
            // Optional: Customize response logging or modifications
            return response;
          },
          onError: (error) => {
            // Optional: Customize error handling or logging
            return Promise.reject(error);
          },
        },
      },
    ]),
  ],
})
export class AppModule {}

```

### Inject other modules and use it

```typescript

import { Module } from "@nestjs/common";
import { HttpModule } from "@nodeflip/nest-axios-http";

@Module({
  imports: [
    HttpModule.forFeatureAsync({
      logger: customLogger, // Custom logger instance
      serviceName: 'MyService', // Service name for logging
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          baseURL: configService.get('API_BASE_URL'),
          enableLogging: configService.get('ENABLE_LOGGING'),
        }
      }
    }),
  ],
})

```
## License

This package is [MIT licensed](LICENSE).

## Issues

For any issues, bugs, or feature requests, please [file an issue](https://github.com/nodeflip/nest-axios-http/issues) on GitHub.

## Repository

Find this package on [npm](https://npmjs.com/@nodeflip/nest-axios-http).

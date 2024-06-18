import { DynamicModule, Module, Provider } from "@nestjs/common";
import { HttpModule as NestHttpModule } from "@nestjs/axios";

import { HttpService } from "./http.service";
import { IHttpModuleOptions } from "./types";

/**
 * Represents a module for handling HTTP requests and responses.
 */
@Module({})
export class HttpModule {
  private static getDynamicHttpModule(option: IHttpModuleOptions) {
    const httpService = new HttpService(option);
    const providerName = option.serviceName || HttpService;
    return {
      module: HttpModule,
      providers: [
        {
          provide: providerName,
          useValue: httpService,
        },
      ],
      exports: [providerName],
    };
  }

  static forFeature(
    options: IHttpModuleOptions | IHttpModuleOptions[]
  ): DynamicModule {
    if (Array.isArray(options)) {
      const providers: Provider[] = options.map((option) => {
        const httpService = new HttpService(option);
        const providerName = option.serviceName || HttpService;
        return {
          provide: providerName,
          useValue: httpService,
        };
      });

      return {
        module: HttpModule,
        imports: [NestHttpModule],
        providers,
        exports: [...providers],
      };
    } else {
      return this.getDynamicHttpModule(options);
    }
  }

  static forRoot(config: IHttpModuleOptions): DynamicModule {
    const httpService = new HttpService(config);

    return {
      global: true,
      module: HttpModule,
      imports: [NestHttpModule],
      providers: [
        {
          provide: HttpService,
          useValue: httpService,
        },
      ],
      exports: [HttpService],
    };
  }
  static forFeatureWithProvider(options: IHttpModuleOptions): {
    module: DynamicModule;
    provider: Provider;
  } {
    const httpService = new HttpService(options);
    const providerName = options.serviceName;
    const provider = {
      provide: providerName,
      useValue: httpService,
    } as Provider;
    return {
      module: {
        module: HttpModule,
        providers: [provider],
        exports: [providerName, HttpModule],
      },
      provider,
    };
  }
}

import { Test, TestingModule } from "@nestjs/testing";
import { DynamicModule, FactoryProvider, ModuleMetadata } from "@nestjs/common";

import { HttpModule } from "../http/http.module"; // Adjust the import path as necessary
import { HttpService } from "../http/http.service";
import { IHttpModuleOptions } from "../http/types";

describe("HttpModule", () => {
  let module: TestingModule;
  let httpService: HttpService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        HttpModule.forRoot({
          config: { baseURL: "http://test.com" },
        }),
      ],
    }).compile();

    httpService = module.get<HttpService>(HttpService);
  });

  it("should be defined", () => {
    expect(httpService).toBeDefined();
  });

  it("should create HttpService with custom options", async () => {
    const options: IHttpModuleOptions = {
      serviceName: "CustomHttpService",
      config: { baseURL: "http://test.com" },
    };

    const dynamicModule = HttpModule.forFeature(options);
    const featureModule = await Test.createTestingModule({
      imports: [dynamicModule],
    }).compile();
    const customHttpService =
      featureModule.get<HttpService>("CustomHttpService");

    expect(customHttpService).toBeInstanceOf(HttpService);
  });

  it("should create multiple HttpService instances for multiple options", async () => {
    const options: IHttpModuleOptions[] = [
      {
        serviceName: "ServiceOne",
        config: { baseURL: "http://serviceone.com" },
      },
      {
        serviceName: "ServiceTwo",
        config: { baseURL: "http://servicetwo.com" },
      },
    ];

    const dynamicModule = HttpModule.forFeature(options);
    const featureModule = await Test.createTestingModule({
      imports: [dynamicModule],
    }).compile();
    const serviceOne = featureModule.get<HttpService>("ServiceOne");
    const serviceTwo = featureModule.get<HttpService>("ServiceTwo");

    expect(serviceOne).toBeInstanceOf(HttpService);
    expect(serviceTwo).toBeInstanceOf(HttpService);
  });

  it("should handle asynchronous dynamic configuration", async () => {
    const asyncConfig = {
      imports: [] as ModuleMetadata["imports"],
      inject: [] as FactoryProvider["inject"],
      useFactory: async () => ({
        config: { baseURL: "http://async-config.com" },
      }),
      serviceName: "AsyncService",
    };

    const asyncModule = HttpModule.forFeatureAsync(asyncConfig);
    const featureModule = await Test.createTestingModule({
      imports: [asyncModule],
    }).compile();
    const asyncHttpService = featureModule.get<HttpService>("AsyncService");

    expect(asyncHttpService).toBeInstanceOf(HttpService);
  });
});

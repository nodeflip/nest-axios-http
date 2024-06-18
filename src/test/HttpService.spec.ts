import axios from "axios";
import MockAdapter from "axios-mock-adapter";

import { Logger } from "@nestjs/common";

import { HttpService } from "../http/http.service";
import { IHttpModuleOptions } from "../http/types";

describe("HttpService", () => {
  let service: HttpService;
  let mockAxios: MockAdapter;
  let logService: Logger;

  const options: IHttpModuleOptions = {
    serviceName: "TestHttpService",
    logger: new Logger(),
    config: { baseURL: "http://test.com", enableLogging: false },
  };

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
    service = new HttpService(options);
  });

  afterEach(() => {
    mockAxios.reset();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should log request details when logging is enabled", async () => {
    const logSpy = jest.spyOn(options.logger, "log");
    service = new HttpService({
      ...options,
      config: { ...options.config, enableLogging: true },
    });

    mockAxios.onGet("/test").reply(200, { data: "test" });

    await service.get("/test");

    expect(logSpy).toHaveBeenCalledWith(
      "HTTP Request: GET http://test.com/test"
    );
  });

  it("should log response details when logging is enabled", async () => {
    const logSpy = jest.spyOn(service.logger, "log");
    service = new HttpService({
      ...options,
      config: { ...options.config, enableLogging: true },
    });

    mockAxios.onGet("/test").reply(200, { data: "test" });

    await service.get("/test");

    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining("HTTP Response: 200 GET http://test.com/test")
    );
  });

  it("should handle GET request", async () => {
    mockAxios.onGet("/test").reply(200, { data: "test" });

    const response = await service.get("/test");

    expect(response.data).toEqual({ data: "test" });
  });

  it("should handle POST request", async () => {
    mockAxios.onPost("/test", { data: "test" }).reply(201, { data: "created" });

    const response = await service.post("/test", { data: "test" });

    expect(response.data).toEqual({ data: "created" });
  });

  it("should handle PUT request", async () => {
    mockAxios.onPut("/test", { data: "test" }).reply(200, { data: "updated" });

    const response = await service.put("/test", { data: "test" });

    expect(response.data).toEqual({ data: "updated" });
  });

  it("should handle PATCH request", async () => {
    mockAxios
      .onPatch("/test", { data: "test" })
      .reply(200, { data: "patched" });

    const response = await service.patch("/test", { data: "test" });

    expect(response.data).toEqual({ data: "patched" });
  });

  it("should handle DELETE request", async () => {
    mockAxios.onDelete("/test").reply(200, { data: "deleted" });

    const response = await service.delete("/test");

    expect(response.data).toEqual({ data: "deleted" });
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import axiosInterceptor from "../axiosInterceptor";

describe("axiosInterceptor", () => {
  let axiosMock: any;
  let capturedOnFulfilled: Function;
  let capturedOnRejected: Function;

  beforeEach(() => {
    capturedOnFulfilled = vi.fn();
    capturedOnRejected = vi.fn();

    // axios mock is a callable with properties used by the interceptor
    const fn = (config: any) => fn.request(config);

    fn.post = vi.fn();
    fn.request = vi.fn();
    fn.interceptors = {
      response: {
        use: vi.fn((onFulfilled: Function, onRejected: Function) => {
          capturedOnFulfilled = onFulfilled;
          capturedOnRejected = onRejected;
        }),
      },
    };

    axiosMock = fn;
  });

  it("enregistre l'intercepteur (use appelé)", () => {
    axiosInterceptor(axiosMock);
    expect(axiosMock.interceptors.response.use).toHaveBeenCalled();
    expect(typeof capturedOnFulfilled).toBe("function");
    expect(typeof capturedOnRejected).toBe("function");
  });

  it("Reject error if original request target /auth/refresh-token ou /auth/logout", async () => {
    axiosInterceptor(axiosMock);

    const err = {
      config: { url: "/auth/refresh-token" },
      response: { status: 401 },
    };
    await expect(capturedOnRejected(err)).rejects.toBe(err);

    const err2 = { config: { url: "/auth/logout" }, response: { status: 401 } };
    await expect(capturedOnRejected(err2)).rejects.toBe(err2);
  });

  it("Refresh and relaunch original request in case of 401 (happy path)", async () => {
    axiosInterceptor(axiosMock);

    const originalRequest = {
      url: "/some/protected",
      _retry: undefined,
      data: "payload",
    };
    const error = { config: originalRequest, response: { status: 401 } };

    // refresh successful
    axiosMock.post.mockResolvedValueOnce({ data: "refreshed" });
    // retry original request resolves
    axiosMock.request.mockResolvedValueOnce({ data: "original-response" });

    const result = await capturedOnRejected(error);

    expect(axiosMock.post).toHaveBeenCalledWith("/auth/refresh-token", null, {
      withCredentials: true,
    });
    expect(axiosMock.request).toHaveBeenCalledWith(originalRequest);
    expect(result).toEqual({ data: "original-response" });
  });

  it("If refresh fail, call logout and reject error", async () => {
    axiosInterceptor(axiosMock);

    const originalRequest = { url: "/some/protected", _retry: undefined };
    const error = { config: originalRequest, response: { status: 401 } };

    const refreshError = new Error("refresh failed");
    // refresh fails
    axiosMock.post.mockRejectedValueOnce(refreshError);
    // ensure logout resolves (not required but realistic)
    axiosMock.post.mockResolvedValueOnce({ data: "logged out" });

    await expect(capturedOnRejected(error)).rejects.toBe(refreshError);

    // premier appel = refresh attempt, second appel = logout
    expect(axiosMock.post.mock.calls[0]).toEqual([
      "/auth/refresh-token",
      null,
      { withCredentials: true },
    ]);
    expect(axiosMock.post.mock.calls[1]).toEqual([
      "/auth/logout",
      null,
      { withCredentials: true },
    ]);
  });

  it("Don't try refresh if originalRequest._retry is truthy", async () => {
    axiosInterceptor(axiosMock);

    const originalRequest = { url: "/some/protected", _retry: true };
    const error = { config: originalRequest, response: { status: 401 } };

    await expect(capturedOnRejected(error)).rejects.toBe(error);

    expect(axiosMock.post).not.toHaveBeenCalled();
    expect(axiosMock.request).not.toHaveBeenCalled();
  });

  it("Reject error if status isn't 401", async () => {
    axiosInterceptor(axiosMock);

    const originalRequest = { url: "/some/protected" };
    const error = { config: originalRequest, response: { status: 500 } };

    await expect(capturedOnRejected(error)).rejects.toBe(error);

    expect(axiosMock.post).not.toHaveBeenCalled();
    expect(axiosMock.request).not.toHaveBeenCalled();
  });
});

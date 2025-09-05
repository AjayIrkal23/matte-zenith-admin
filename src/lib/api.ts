// src/lib/api.ts
/// <reference types="vite/client" />

import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosHeaders,
  RawAxiosRequestHeaders,
} from "axios";

/** Prefer Vite env, with optional runtime override via window.__API_BASE__ */
const runtimeBase =
  typeof window !== "undefined" && (window as any).__API_BASE__;
export const API_BASE: string =
  (runtimeBase as string) || import.meta.env.VITE_API_BASE || "/api";

export function getToken(): string | null {
  try {
    return localStorage.getItem("rt_token");
  } catch {
    return null;
  }
}

export function setToken(token?: string | null) {
  try {
    if (!token) localStorage.removeItem("rt_token");
    else localStorage.setItem("rt_token", token);
  } catch {
    /* ignore */
  }
}

type ApiOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: any;
  headers?: RawAxiosRequestHeaders | AxiosHeaders;
};

/** Axios instance */
export const http = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

/** 🔒 Inject token on EVERY request (no {} assignment issues) */
http.interceptors.request.use((config) => {
  const token = getToken();

  // Make a typed, mutable headers object
  const headers = AxiosHeaders.from(config.headers);

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Default JSON content-type if sending an object
  if (
    config.data != null &&
    typeof config.data === "object" &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  config.headers = headers;
  return config;
});

export async function api(
  path: string,
  { method = "GET", body, headers }: ApiOptions = {}
) {
  try {
    const config: AxiosRequestConfig = {
      url: path,
      method,
      data: body,
      headers, // can be RawAxiosRequestHeaders | AxiosHeaders
    };
    const res = await http.request(config);
    return res.data;
  } catch (err) {
    const e = err as AxiosError<any>;
    const status = e.response?.status;
    const statusText = e.response?.statusText ?? "Error";
    const data = e.response?.data as any;
    const message =
      data?.message ||
      data?.error ||
      (status ? `HTTP ${status} ${statusText}` : e.message);
    throw new Error(message);
  }
}

/** Optional convenience helpers */
export const apiGet = <T = any>(
  path: string,
  headers?: RawAxiosRequestHeaders | AxiosHeaders
) => api(path, { method: "GET", headers }) as Promise<T>;

export const apiPost = <T = any>(
  path: string,
  body?: any,
  headers?: RawAxiosRequestHeaders | AxiosHeaders
) => api(path, { method: "POST", body, headers }) as Promise<T>;

export const apiPatch = <T = any>(
  path: string,
  body?: any,
  headers?: RawAxiosRequestHeaders | AxiosHeaders
) => api(path, { method: "PATCH", body, headers }) as Promise<T>;

export const apiPut = <T = any>(
  path: string,
  body?: any,
  headers?: RawAxiosRequestHeaders | AxiosHeaders
) => api(path, { method: "PUT", body, headers }) as Promise<T>;

export const apiDelete = <T = any>(
  path: string,
  headers?: RawAxiosRequestHeaders | AxiosHeaders
) => api(path, { method: "DELETE", headers }) as Promise<T>;

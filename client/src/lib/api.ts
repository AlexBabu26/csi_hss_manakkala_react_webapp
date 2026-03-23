import { readAuthToken } from "./auth";

const DEFAULT_API_BASE_URL = "http://localhost:5000";

export function getApiBaseUrl() {
  const configuredBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  const baseUrl =
    configuredBaseUrl && configuredBaseUrl.length > 0
      ? configuredBaseUrl
      : DEFAULT_API_BASE_URL;

  return baseUrl.replace(/\/$/, "");
}

export function buildApiUrl(path: string) {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
}

export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = readAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return fetch(buildApiUrl(path), { ...options, headers });
}

export const AUTH_TOKEN_KEY = "auth_token";

const AUTH_TOKEN_EVENT = "auth-token-change";

export function readAuthToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

function dispatchAuthTokenChange() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(AUTH_TOKEN_EVENT));
}

export function writeAuthToken(token: string) {
  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  dispatchAuthTokenChange();
}

export function clearAuthToken() {
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  dispatchAuthTokenChange();
}

export function subscribeToAuthTokenChanges(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleChange = () => onStoreChange();

  window.addEventListener("storage", handleChange);
  window.addEventListener(AUTH_TOKEN_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(AUTH_TOKEN_EVENT, handleChange);
  };
}

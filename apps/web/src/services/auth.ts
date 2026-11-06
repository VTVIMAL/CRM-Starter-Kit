import { apiFetch } from "./api";

export type LoginPayload = {
    email: string;
    password: string;
};

export function login(payload: LoginPayload) {
  console.log('login payload sent to API =', payload)

  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getMe() {
    return apiFetch('/auth/me');
}

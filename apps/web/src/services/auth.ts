import { apiFetch } from "./api";

export type LoginPayload = {
    email: string;
    password: string;
};

export function login(payload: LoginPayload) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getMe() {
    return apiFetch('/auth/me');
}
const API_BASE_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(
    path: string,
    options: RequestInit = {},
) {
    const token = localStorage.getItem('accessToken');

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? {Authorization: `Bearer ${token}`} : {}),
            ...(options.headers ?? {}),
        },
    });

    if(!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(errorBody?.message || 'Request failed');
    }

    return response.json();
}
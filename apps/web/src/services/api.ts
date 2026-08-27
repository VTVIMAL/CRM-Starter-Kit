const API_BASE_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(path: string, options: RequestInit = {}) {
    const token = localStorage.getItem('accessToken');

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'appllication/json',
            ...(token ? {Authorization: `Bearer ${token}` } : {}),
            ...(options.headers ?? {}),
        },
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            Array.isArray(data?.message) ? data.message.join(', ') : data?.message || 'Request failed',
        );
    }

    return data;
}
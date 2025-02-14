type Body = { [key: string]: string | number | boolean };
type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export async function Request<T>(
  endpoint: string,
  method: Method = 'GET',
  body?: Body,
): Promise<T> {
  const token = localStorage.getItem("token");

  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  };

  try {
    const response = await fetch(import.meta.env.VITE_API_URL + endpoint, config);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP Error ${response.status}`);
    }

    return response.json() as Promise<T>;
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
}

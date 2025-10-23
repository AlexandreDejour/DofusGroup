import axios from "axios";

export default function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message = error.response?.data?.message || "Unknown error";

    throw {
      type: "API_ERROR",
      status,
      message,
      original: error,
    };
  }

  throw error;
}

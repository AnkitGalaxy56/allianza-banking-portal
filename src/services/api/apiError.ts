import axios from 'axios';

/** Turns anything thrown by axios / our code into a short message safe to show to the user. */
export function getErrorMessage(
  error: unknown,
  fallback = 'Something went wrong. Please try again.',
): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    if (data?.message) return data.message;
    if (error.code === 'ECONNABORTED') return 'The request timed out. Please try again.';
    if (!error.response) return 'Unable to reach the server. Check your connection.';
    if (error.response.status === 403) return 'You do not have permission to do this.';
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

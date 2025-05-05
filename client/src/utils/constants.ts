export const SERVER_API_URL = import.meta.env.VITE_SERVER_API_URL as string;
export const SERVER_URL = import.meta.env.VITE_SERVER_URL as string;

export const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

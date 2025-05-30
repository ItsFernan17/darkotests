export const backendHost =
  typeof window !== "undefined"
    ? window.location.hostname
    : process.env.BACKEND_HOST || "localhost";

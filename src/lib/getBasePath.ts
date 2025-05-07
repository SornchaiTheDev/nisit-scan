export const getBasePath = () => {
  if (typeof window !== "undefined") {
    return window.env.BASE_PATH;
  }

  return process.env.BASE_PATH || "";
};

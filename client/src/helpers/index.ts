export const isAuthenticated = () => {
  if (typeof window == "undefined") return false;

  const jwt = localStorage.getItem("twitter-token");
  // console.log(jwt);
  if (jwt) {
    if (typeof jwt === "string") {
      return true;
    }
  }
  return false;
};

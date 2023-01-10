import store from "../store";

export default function auth({ next, router }) {
  if (!store.getters.isAuthenticated) {
    return router.push({ name: "Login" });
  }

  if (store.getters.isUserVerified == false) {
    localStorage.removeItem("USERTOKEN");
    return router.go({ name: "Login" });
  }

  return next();
}
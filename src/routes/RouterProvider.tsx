
import { useRoutes } from "react-router-dom";
import { routes } from "./index";

export const RouterProvider = () => {
  const routeElement = useRoutes(routes);
  
  return routeElement;
};


import { RouteObject } from "react-router-dom";

// Pages
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";

// Route configuration object
export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Index />,
  },
  // Add any new routes above this line
  {
    path: "*",
    element: <NotFound />
  }
];

// Named routes for programmatic navigation
export const ROUTES = {
  HOME: "/"
};

// Helper to generate paths with parameters
export const generatePath = (route: string, params?: Record<string, string>): string => {
  if (!params) return route;
  
  let path = route;
  Object.entries(params).forEach(([key, value]) => {
    path = path.replace(`:${key}`, value);
  });
  
  return path;
};

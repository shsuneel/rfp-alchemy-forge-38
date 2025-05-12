
import { RouteObject } from "react-router-dom";

// Pages
import Index from "@/pages/Index";
import Estimates from "@/pages/Estimates";
import NotFound from "@/pages/NotFound";

// Route configuration object
export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/estimates",
    element: <Estimates />,
  },
  // Add any new routes above this line
  {
    path: "*",
    element: <NotFound />
  }
];

// Named routes for programmatic navigation
export const ROUTES = {
  HOME: "/",
  ESTIMATES: "/estimates",
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

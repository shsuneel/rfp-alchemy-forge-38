
import { RouteObject } from "react-router-dom";

// Pages
import Index from "@/pages/Index"; // This will be for the /forge route
import HomePage from "@/pages/HomePage"; // New homepage
import NotFound from "@/pages/NotFound";

// Route configuration object
export const routes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />, // New homepage is the default
  },
  {
    path: "/forge", // Existing app moved here
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
  HOME: "/",
  FORGE: "/forge", // Added new route name
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


import { useCallback } from "react";
import { useNavigate, NavigateOptions } from "react-router-dom";
import { ROUTES, generatePath } from "@/routes";

export const useNavigation = () => {
  const navigate = useNavigate();

  const navigateTo = useCallback((
    route: string,
    params?: Record<string, string>,
    options?: NavigateOptions
  ) => {
    const path = generatePath(route, params);
    navigate(path, {
      ...options,
      // This prevents the screen from scrolling to top on navigation
      // which can contribute to the flickering effect
      preventScrollReset: options?.preventScrollReset ?? true
    });
  }, [navigate]);

  // Route-specific navigation functions
  const goToHome = useCallback((options?: NavigateOptions) => {
    navigateTo(ROUTES.HOME, undefined, options);
  }, [navigateTo]);

  const goToEstimates = useCallback((options?: NavigateOptions) => {
    navigateTo(ROUTES.ESTIMATES, undefined, options);
  }, [navigateTo]);

  return {
    navigateTo,
    goToHome,
    goToEstimates,
    // Add more specific navigation functions for new routes here
  };
};

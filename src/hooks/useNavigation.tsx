
import { useCallback } from "react";
import { useNavigate, NavigateOptions } from "react-router-dom";
import { ROUTES, generatePath } from "@/routes";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { setCurrentTab } from "@/store/navigationSlice";

export const useNavigation = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentTab } = useAppSelector(state => state.navigation);

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
      preventScrollReset: options?.preventScrollReset ?? true,
      // Pass the current tab from Redux in the state to maintain it across navigations
      state: {
        ...(options?.state || {}),
        tab: (options?.state as any)?.tab || currentTab
      }
    });
  }, [navigate, currentTab]);

  // Route-specific navigation functions
  const goToHome = useCallback((tab?: string, options?: NavigateOptions) => {
    if (tab) {
      dispatch(setCurrentTab(tab));
    }
    navigateTo(ROUTES.HOME, undefined, options);
  }, [navigateTo, dispatch]);

  return {
    navigateTo,
    goToHome
  };
};

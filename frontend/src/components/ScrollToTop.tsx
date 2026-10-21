import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component satisfies Critical Requirement 6:
 * Enforces immediate, direct reset of scroll position on route changes
 * without any animated vertical lag or scrolling past unrelated sections.
 */
export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Instantly reset scroll to top with no smooth-scroll delay
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto',
    });
  }, [pathname]);

  return null;
};

import { useCallback } from 'react';

export function useViewTransition() {
  const navigateWithTransition = useCallback((to: string, movieId?: string) => {
    // Check if view transitions are supported
    if (!document.startViewTransition) {
      // Fallback for browsers that don't support view transitions
      window.location.href = to;
      return;
    }

    // Start view transition
    const transition = document.startViewTransition(() => {
      // Navigate to the new page
      window.location.href = to;
    });

    // Optional: Add transition event listeners
    transition.finished.then(() => {
      console.log('View transition completed');
    });

    transition.ready.then(() => {
      console.log('View transition ready');
    });

    transition.updateCallbackDone.then(() => {
      console.log('View transition update callback done');
    });
  }, []);

  return { navigateWithTransition };
}

export const stickyNavigationScript = `
  function initStickyNav() {
    // Define paths where sticky navigation should be disabled
    const disabledPaths = [
      '/providers/register'
      // Add more paths as needed
    ];

    // Check if current path matches any disabled paths
    const currentPath = window.location.pathname;
    const shouldDisableSticky = disabledPaths.some(path => currentPath.startsWith(path));
    
    const header = document.getElementById('main-navigation');
    const cashbackBanner = document.querySelector('[data-cashback-banner]');
    
    if (!header || shouldDisableSticky) return;

    let lastScrollY = window.scrollY;
    let ticking = false;
    const SCROLL_THRESHOLD = 100;
    const SCROLL_DELTA_THRESHOLD = 10;
    const ANIMATION_DURATION = 300;
    
    // Initial setup
    header.style.position = 'fixed';
    header.style.top = '0';
    header.style.left = '0';
    header.style.right = '0';
    header.style.width = '100%';
    header.style.zIndex = '1000';
    header.style.transition = 'transform 300ms ease-in-out, background-color 300ms ease-in-out, backdrop-filter 300ms ease-in-out';
    
    // Helper function to update header state
    const updateHeaderState = (translateY, bgClass, borderClass, blurClass) => {
      header.style.transform = \`translateY(\${translateY})\`;
      
      // Remove all possible states first
      header.classList.remove(
        'bg-background-base/95',
        'bg-background-base/20',
        'border-stroke-25',
        'border-transparent',
        'backdrop-blur',
        'backdrop-blur-md'
      );
      
      // Add new states
      header.classList.add(bgClass, borderClass, blurClass);
    };

    const updateHeader = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = Math.abs(currentScrollY - lastScrollY);
      
      // Ignore small scroll changes
      if (scrollDelta < SCROLL_DELTA_THRESHOLD) {
        ticking = false;
        return;
      }

      // At top of page
      if (currentScrollY < SCROLL_THRESHOLD) {
        updateHeaderState(
          '0',
          'bg-background-base/20',
          'border-transparent',
          'backdrop-blur-md'
        );
        
        if (cashbackBanner) {
          cashbackBanner.classList.remove('hidden');
        }
      } 
      // Scrolling down
      else if (currentScrollY > lastScrollY) {
        updateHeaderState(
          '-100%',
          'bg-background-base/95',
          'border-stroke-25',
          'backdrop-blur'
        );
        
        if (cashbackBanner) {
          setTimeout(() => {
            cashbackBanner.classList.add('hidden');
          }, ANIMATION_DURATION);
        }
      } 
      // Scrolling up
      else {
        updateHeaderState(
          '0',
          'bg-background-base/20',
          'border-stroke-25',
          'backdrop-blur-md'
        );
        
        if (cashbackBanner) {
          cashbackBanner.classList.add('hidden');
        }
      }

      lastScrollY = Math.max(0, currentScrollY);
      ticking = false;
    };

    // Throttled scroll handler
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateHeader();
        });
        ticking = true;
      }
    };

    // Event listeners
    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Initial state
    requestAnimationFrame(updateHeader);
  }

  // Initialize on page load and route changes
  function init() {
    initStickyNav();
  }

  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('load', init);
  }

  // Handle Next.js route changes
  document.addEventListener('DOMContentLoaded', init);

  // Additional listener for Next.js client-side navigation
  window.addEventListener('popstate', init);
`;

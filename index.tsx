import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import HomePage from './pages/index';
import PericiasPage from './pages/pericias';

const App: React.FC = () => {
    const [path, setPath] = useState(window.location.pathname);

    useEffect(() => {
        const onLocationChange = () => {
            setPath(window.location.pathname);
        };

        const handleLinkClick = (e: MouseEvent) => {
            // Ignore clicks with modifier keys or non-primary mouse button
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
                return;
            }
            
            const target = e.target as HTMLElement;
            const anchor = target.closest('a');

            if (!anchor) {
                return;
            }
            
            const href = anchor.getAttribute('href');
            if (!href) {
                return;
            }

            // Let browser handle external links and new tabs
            if (anchor.origin !== window.location.origin || anchor.target === '_blank') {
                return;
            }
            
            // Let browser handle on-page anchor links for smooth scrolling
            if (href.startsWith('#')) {
                return;
            }

            // If we've reached this point, it's an internal link we should handle.
            e.preventDefault();

            // Only navigate if the destination is different from the current page.
            if (window.location.href !== anchor.href) {
                window.history.pushState({}, '', href);
                onLocationChange();
            }
        };

        // Listen for browser back/forward buttons
        window.addEventListener('popstate', onLocationChange);
        // Listen for all clicks to handle navigation
        document.addEventListener('click', handleLinkClick);

        return () => {
            window.removeEventListener('popstate', onLocationChange);
            document.removeEventListener('click', handleLinkClick);
        };
    }, []);

    switch (path) {
        case '/pericias':
            return <PericiasPage />;
        case '/':
        default:
            return <HomePage />;
    }
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
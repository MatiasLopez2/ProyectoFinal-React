import { useEffect } from 'react';
import { useLocation } from 'react-router';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Pequeño delay para asegurar que el DOM esté actualizado
    setTimeout(() => {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      window.scrollTo(0, 0);
    }, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const BreadcrumbNav = ({ customBreadcrumbs = null }) => {
  const location = useLocation();
  
  // If custom breadcrumbs are provided, use them
  if (customBreadcrumbs) {
    return (
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link 
          to="/" 
          className="flex items-center hover:text-green-600 transition-colors"
        >
          <Home className="w-4 h-4" />
        </Link>
        {customBreadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            {crumb.href ? (
              <Link 
                to={crumb.href}
                className="hover:text-green-600 transition-colors"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="text-gray-900 font-medium">{crumb.label}</span>
            )}
          </React.Fragment>
        ))}
      </nav>
    );
  }

  // Auto-generate breadcrumbs from current path
  const pathnames = location.pathname.split('/').filter(x => x);
  
  // Don't show breadcrumbs on home page
  if (pathnames.length === 0) {
    return null;
  }

  // Route name mappings for better display
  const routeNames = {
    'products': 'Products',
    'product': 'Product',
    'cart': 'Shopping Cart',
    'checkout': 'Checkout',
    'profile': 'Profile',
    'orders': 'Orders',
    'wishlist': 'Wishlist',
    'care-guides': 'Care Guides',
    'contact': 'Contact',
    'about': 'About',
    'admin': 'Admin',
    'dashboard': 'Dashboard',
    'users': 'Users',
    'categories': 'Categories',
    'sync': 'Sync',
    'settings': 'Settings'
  };

  const generateBreadcrumbs = () => {
    const breadcrumbs = [];
    let currentPath = '';

    pathnames.forEach((pathname, index) => {
      currentPath += `/${pathname}`;
      const isLast = index === pathnames.length - 1;
      
      // Get display name for the route
      let displayName = routeNames[pathname] || pathname;
      
      // Capitalize first letter if not in routeNames
      if (!routeNames[pathname]) {
        displayName = pathname.charAt(0).toUpperCase() + pathname.slice(1);
      }

      // Handle dynamic routes (like product IDs)
      if (pathname.match(/^[0-9]+$/)) {
        displayName = `Item ${pathname}`;
      }

      breadcrumbs.push({
        label: displayName,
        href: isLast ? null : currentPath,
        isLast
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      <Link 
        to="/" 
        className="flex items-center hover:text-green-600 transition-colors"
        title="Home"
      >
        <Home className="w-4 h-4" />
      </Link>
      
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          {crumb.href ? (
            <Link 
              to={crumb.href}
              className="hover:text-green-600 transition-colors"
            >
              {crumb.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{crumb.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default BreadcrumbNav;
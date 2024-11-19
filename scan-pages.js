const fs = require('fs');
const path = require('path');

function getAllPages(directory = './app', baseRoute = '') {
  let routes = [];
  
  // Read directory contents
  const items = fs.readdirSync(directory);
  
  for (const item of items) {
    const fullPath = path.join(directory, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Skip special Next.js directories
      if (['api', '_app', '_document', 'public', 'node_modules'].includes(item)) {
        continue;
      }
      
      // Handle dynamic routes
      let currentRoute = item;
      if (item.startsWith('[') && item.endsWith(']')) {
        currentRoute = ':' + item.slice(1, -1);
      }
      
      // Recursively scan subdirectories
      const childRoutes = getAllPages(
        fullPath,
        path.join(baseRoute, currentRoute)
      );
      routes = routes.concat(childRoutes);
      
    } else if (stat.isFile()) {
      // Check for page files
      const ext = path.extname(item);
      const name = path.basename(item, ext);
      
      if (
        ['.js', '.jsx', '.ts', '.tsx'].includes(ext) &&
        ['page', 'index'].includes(name)
      ) {
        let route = baseRoute;
        if (name !== 'index') {
          route = path.join(baseRoute, name);
        }
        
        // Clean up the route format
        route = route.replace(/\\/g, '/');
        if (!route.startsWith('/')) {
          route = '/' + route;
        }
        
        routes.push(route);
      }
    }
  }
  
  return routes.sort();
}

try {
  const pages = getAllPages();
  console.log('Available pages in your Next.js application:');
  pages.forEach(route => console.log(route));
} catch (error) {
  console.error('Error scanning pages:', error);
}
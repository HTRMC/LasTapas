import { readdir, stat } from 'fs/promises';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASE_URL = 'http://localhost:3000';

async function getAllPages(directory = './app', baseRoute = '') {
  let routes = [];
  
  try {
    const items = await readdir(directory);
    
    for (const item of items) {
      const fullPath = join(directory, item);
      const stats = await stat(fullPath);
      
      if (stats.isDirectory()) {
        if (['api', '_app', '_document', 'public', 'node_modules'].includes(item)) {
          continue;
        }
        
        let currentRoute = item;
        if (item.startsWith('[') && item.endsWith(']')) {
          currentRoute = ':' + item.slice(1, -1);
        }
        
        const childRoutes = await getAllPages(
          fullPath,
          join(baseRoute, currentRoute)
        );
        routes = routes.concat(childRoutes);
        
      } else if (stats.isFile()) {
        const ext = extname(item);
        const name = basename(item, ext);
        
        if (
          ['.js', '.jsx', '.ts', '.tsx'].includes(ext) &&
          ['page', 'index'].includes(name)
        ) {
          let route = baseRoute;
          if (name !== 'index') {
            route = join(baseRoute, name);
          }
          
          route = route.replace(/\\/g, '/');
          if (!route.startsWith('/')) {
            route = '/' + route;
          }
          
          // Format route with localhost URL
          const fullUrl = `${BASE_URL}${route}`;
          routes.push(fullUrl);
        }
      }
    }
    
    return routes.sort();
  } catch (error) {
    console.error(`Error scanning directory ${directory}:`, error);
    throw error;
  }
}

try {
  const pages = await getAllPages();
  console.log('Available pages in your Next.js application:');
  pages.forEach(route => console.log(route));
} catch (error) {
  console.error('Error scanning pages:', error);
}
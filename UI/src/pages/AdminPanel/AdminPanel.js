// import React, { useEffect, useState } from 'react';
// import { Admin, Resource, fetchUtils } from 'react-admin';
// import simpleRestProvider from 'ra-data-simple-rest';
// import ProductList from './ProductList';
// import EditProduct from './EditProduct';
// import CreateProduct from './CreateProduct';
// import CategoryList from './Category/CategoryList';
// import CategoryEdit from './Category/CategoryEdit';
// import CategoryCreate from './Category/CategoryCreate';
// import { useNavigate } from 'react-router-dom';

// // Base URL for the backend
// const API_URL = 'http://localhost:8080';

// // Custom httpClient to include JWT token in requests
// const httpClient = (url, options = {}) => {
//   const token = localStorage.getItem('authToken');
//   if (!options.headers) options.headers = new Headers();
  
//   if (token) {
//     options.headers.set('Authorization', `Bearer ${token}`);
//   }

//   // Modify URL if it's for categories to use '/auth/categories'
//   if (url.includes('/categories')) {
//     url = `${API_URL}/auth/categories`;  // Redirect requests for categories to '/auth/categories'
//   }

//   return fetchUtils.fetchJson(url, options);
// };

// // Data provider for react-admin with the custom httpClient
// const dataProvider = simpleRestProvider(API_URL, httpClient);

// export const AdminPanel = () => {
//   const [isAdmin, setIsAdmin] = useState(null); // Use `null` for initial loading state
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkAdminRole = async () => {
//       const token = localStorage.getItem('authToken');
      
//       // If no token is found, redirect immediately to login
//       if (!token) {
//         console.log('No token found, redirecting to login.');
//         setLoading(false);
//         navigate('/v1/login');
//         return;
//       }

//       // If token exists, try to fetch the user profile
//       try {
//         console.log('Checking user role...');
//         const response = await fetch(`${API_URL}/auth/profile`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error('Failed to fetch user profile');
//         }

//         const userData = await response.json();
//         console.log('User profile fetched:', userData);

//         // Check if the user has the 'ADMIN' role
//         if (userData?.role === 'ADMIN' || userData?.role === 'admin') {
//           console.log('User is an admin, granting access');
//           setIsAdmin(true);
//         } else {
//           console.log('User is not an admin, redirecting...');
//           setIsAdmin(false);
//           navigate('/'); // Redirect to home or another page
//         }
//       } catch (error) {
//         console.error('Error checking user role:', error);
//         setIsAdmin(false); // If error occurs, assume no admin rights
//         navigate('/v1/login'); // Redirect to login
//       } finally {
//         setLoading(false); // Stop loading once done
//       }
//     };

//     checkAdminRole();
//   }, [navigate]);

//   // Show a loading spinner while checking the token and role
//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   // If user is not an admin, show access denied
//   if (isAdmin === false) {
//     return <div>Access denied. You do not have the required permissions.</div>;
//   }

//   // Render the admin panel once the user is validated
//   return (
//     <Admin dataProvider={dataProvider} basename="/admin">
//       <Resource name="products" list={ProductList} edit={EditProduct} create={CreateProduct} />
//       <Resource name="categories" list={CategoryList} edit={CategoryEdit} create={CategoryCreate} />
//     </Admin>
//   );
// };

import React, { useEffect, useState } from 'react';
import { Admin, Resource, fetchUtils } from 'react-admin';
import ProductList from './ProductList';
import EditProduct from './EditProduct';
import CreateProduct from './CreateProduct';
import CategoryList from './Category/CategoryList';
import CategoryEdit from './Category/CategoryEdit';
import CategoryCreate from './Category/CategoryCreate';
import { useNavigate } from 'react-router-dom';
import { dataProvider } from './dataProvider'; // Import custom data provider


// Base URL for the backend
const API_URL = 'http://localhost:8080';

// Custom httpClient to include JWT token in requests
const httpClient = (url, options = {}) => {
  const token = localStorage.getItem('authToken');
  if (!options.headers) options.headers = new Headers();

  if (token) {
    options.headers.set('Authorization', `Bearer ${token}`);
  }

  return fetchUtils.fetchJson(url, options);
};

// Admin Panel component
export const AdminPanel = () => {
  const [isAdmin, setIsAdmin] = useState(null); // Use null to reflect loading state properly
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminRole = async () => {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        console.log('No token found, redirecting to login.');
        setLoading(false);
        navigate('/v1/login');
        return;
      }

      try {
        console.log('Checking user role...');
        const response = await fetch(`${API_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const userData = await response.json();
        console.log('User profile fetched:', userData);

        if (userData?.role === 'ADMIN' || userData?.role === 'admin') {
          console.log('User is an admin, granting access');
          setIsAdmin(true);
        } else {
          console.log('User is not an admin, redirecting...');
          setIsAdmin(false);
          navigate('/');
        }
      } catch (error) {
        console.error('Error checking user role:', error);
        setIsAdmin(false);
        navigate('/v1/login');
      } finally {
        setLoading(false);
      }
    };

    checkAdminRole();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (isAdmin === false) {
    return <div>Access denied. You do not have the required permissions.</div>;
  }

  return (
    <Admin dataProvider={dataProvider(API_URL, httpClient)} basename="/admin">
      <Resource name="products" list={ProductList} edit={EditProduct} create={CreateProduct} />
      <Resource name="categories" list={CategoryList} edit={CategoryEdit} create={CategoryCreate} />
    </Admin>
  );
};

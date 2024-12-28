import { fetchUtils } from 'react-admin';

// Custom data provider function
const customDataProvider = (apiUrl, httpClient) => {
  return {
    // Fetch the list of resources (e.g., categories, products)
    getList: async (resource, params) => {
      const url = `${apiUrl}/auth/${resource}`;
      
      try {
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch ${resource}: ${response.statusText || response.status}`);
        }
    
        const data = await response.json();
        console.log("Fetched data for resource:", resource, data); // Log data for debugging
        
        return {
          data: data,
          total: data.length, 
        };
      } catch (error) {
        console.error("Error fetching data:", error);
        throw new Error(`Error fetching ${resource}: ${error.message}`);
      }
    },
    
    
    
    
    
    
    getMany: (resource, params) => {
      if (resource === 'categories') {
        const ids = params.ids;
        return fetch(`/auth/categories?ids=${ids.join(',')}`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to fetch categories');
            }
            return response.json(); 
          })
          .then(data => ({
            data: data.categories, 
          }))
          .catch(error => {
            console.error('Error fetching categories:', error);
            return { data: [] };
          });
      }
    },

    // Fetch a single resource
    getOne: async (resource, params) => {
      const { id } = params;
      const response = await httpClient(`${apiUrl}/auth/${resource}/${id}`);
      return { data: response.json };
    },

    // Create a new resource (handling image upload for product)
// Create a new category (modify this to match category creation logic)
      create: async (resource, params) => {
        if (resource === 'categories') {
          const { data } = params;

          // Prepare the payload for the new category
          const categoryData = {
            name: data.name,
            description: data.description,  // Include if applicable
          };

          // Send the request to the backend to create the category
          const response = await fetch(`${apiUrl}/auth/categories`, {
            method: 'POST',
            body: JSON.stringify(categoryData),
            headers: {
              'Content-Type': 'application/json',
            },
          });

          // Handle response and errors
          if (!response.ok) {
            throw new Error(`Failed to create category: ${response.statusText}`);
          }

          const responseData = await response.json();
          return { data: responseData };  // Return the newly created category
        }

        // Default behavior for other resources (e.g., products)
        const { data } = params;
        const formData = new FormData();
        
        formData.append('name', data.name);
        formData.append('price', data.price);
        formData.append('categoryId', data.categoryId);
        formData.append('description', data.description);
        formData.append('size', data.size);

        if (data.imageFile && data.imageFile.rawFile) {
          formData.append('imageFile', data.imageFile.rawFile);
        }

        const response = await fetch(`${apiUrl}/auth/${resource}`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to create ${resource}`);
        }

        const responseData = await response.json();
        return { data: responseData };
      },

    
    

    // Update an existing resource
    update: async (resource, params) => {
      const { id, data } = params;
    
      try {
        const response = await httpClient(`${apiUrl}/auth/${resource}/${id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
          headers: new Headers({ 'Content-Type': 'application/json' }),
        });
    
        // Check if the response is okay
        if (!response.ok) {
          throw new Error(`Failed to update ${resource} with ID ${id}`);
        }
    
        // Parse the response JSON correctly
        const responseData = await response.json();
        
        return { data: responseData }; // Return the updated data
      } catch (error) {
        console.error("Error updating resource:", error);
        throw new Error(`Error updating ${resource}: ${error.message}`);
      }
    },
    

    // Delete a resource
    delete: async (resource, params) => {
      const { id } = params;

      await httpClient(`${apiUrl}/auth/${resource}/${id}`, {
        method: 'DELETE',
      });

      return { data: {} };
    },
  };
};

// Export the custom data provider
export const dataProvider = customDataProvider;

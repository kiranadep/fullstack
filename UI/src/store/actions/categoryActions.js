import axios from 'axios';

export const fetchCategoriesFromBackend = () => {
  return (dispatch) => {
    axios
      .get('/auth/categories') // Fetch categories from the backend
      .then((response) => {
        dispatch({
          type: 'SET_CATEGORIES',
          payload: response.data, // Assuming response contains an array of categories with id and name
        });
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  };
};

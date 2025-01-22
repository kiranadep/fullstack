import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import { Navigate } from "react-router-dom";

const ProductListPage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Fetch categories from backend
  useEffect(() => {


    axios.get("http://localhost:8080/auth/categories", {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
        "Content-Type": "application/json"
      }
    })
    
    .then((res) => {
      setCategories(res.data);
    })
    .catch((err) => {
      console.error("Error fetching categories:", err);
      console.log("Request headers:", err.config.headers); // Log headers to check if Authorization is included
    });
  
  }, []);
  
  useEffect(() => {
    setLoading(true);
  
    const fetchProducts = async () => {
      try {
        let url = "http://localhost:8080/auth/products";
        if (selectedCategories.length > 0) {
          url = `http://localhost:8080/auth/products?category=${selectedCategories.join(",")}`;
        }
  
        const res = await axios.get(url, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("authToken")}` // Add token here
          }
        });
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, [selectedCategories]);
  const token = localStorage.getItem("authToken");
  if (!token) {
    // Handle missing token, e.g., redirect to login
    return <Navigate to="/v1/login" />;
  }
    

  // Toggle selection of individual categories
  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prevSelected) => {
      if (prevSelected.includes(categoryId)) {
        return prevSelected.filter((id) => id !== categoryId); // Unselect category
      } else {
        return [...prevSelected, categoryId]; // Select category
      }
    });
  };

  // Handle "select all" functionality
  const handleSelectAll = () => {
    if (selectedCategories.length === categories.length) {
      setSelectedCategories([]); // Deselect all if all are selected
    } else {
      setSelectedCategories(categories.map((category) => category.id)); // Select all categories
    }
  };

  // Get category name by categoryId
  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  if (loading) {
    return <p>Loading products...</p>;
  }

  return (
    <div className="m-6 flex">
      <div className="w-[25%] p-[15px] border rounded-lg mr-6 h-[600px] overflow-y-auto">
        {/* Filter Section */}
        <div className="flex justify-between">
          <p className="text-[18px] text-gray-600">Filter</p>
        </div>
        <div>
          {/* Categories */}
          <p className="text-[18px] text-black">Categories</p>
          <div>
            {/* "All" Checkbox to show all products */}
            <label>
              <input
                type="checkbox"
                checked={selectedCategories.length === categories.length}
                onChange={handleSelectAll}
                className="text-lg mt-6"
              />
              <span className="ml-3 text-lg">All Categories</span>
            </label>
          </div>
          <hr />
          <div>
            {/* List of Category checkboxes */}
            {categories.length > 0 ? (
              categories.map((category) => (
                <div key={category.id} className="mt-2">
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => handleCategoryChange(category.id)}
                      className="text-lg"
                    />
                    <span className="ml-3 text-lg">{category.name}</span>
                  </label>
                </div>
              ))
            ) : (
              <p>No categories available</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex-grow">
        <h1 className="text-3xl font-bold mb-6">Products</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                imagePath={product.imagePath}
                categoryName={getCategoryName(product.categoryId)} // Pass the category name here
              />
            ))
          ) : (
            <p>No products available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;

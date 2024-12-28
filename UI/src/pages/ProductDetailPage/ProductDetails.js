import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addItemToCartAction } from '../../store/actions/cartAction';
import { isTokenValid } from '../../utils/jwt-helper';
import styles from './ProductDetails.module.css'; // Importing CSS module
import { selectUserInfo } from "../../store/features/user";

const ProductDetails = () => {
  const { id } = useParams(); // Using the product id from the URL
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector(selectUserInfo); // Use selector at the top level

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(''); // State to track selected size
  const [quantity, setQuantity] = useState(1); // State to track selected quantity
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // To handle loading state

  // Fetch the product details from an API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true); // Start loading
        const response = await fetch(`http://localhost:8080/auth/products/${id}`); // Replace with your API endpoint
        if (!response.ok) throw new Error('Failed to fetch product details');
        const data = await response.json();
        setProduct(data); // Set the fetched product details
      } catch (err) {
        setError('Error fetching product details');
      } finally {
        setLoading(false); // Stop loading once data is fetched or error occurs
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) {
      setError('Product not available');
      return;
    }
  
    if (!selectedSize) {
      setError('Please select a size before adding to cart');
      return;
    }
    // Log the current token and userInfo to debug
    console.log('Token:', localStorage.getItem('authToken'));
    console.log('User Info:', userInfo);
  
    // Check if user is logged in
    if (!isTokenValid() || !userInfo?.id) {
      setError('You must be logged in to add items to the cart');
      navigate('/v1/login');
      return;
    }
  
    try {
      const payload = {
        productId: product.id,
        size: selectedSize, // Send size along with productId and quantity
        quantity: quantity,
      };
      console.log('Sending payload:', payload);
      const response = await fetch(`http://localhost:8080/auth/cart/${userInfo?.id}/add?productId=${payload.productId}&size=${payload.size}&quantity=${payload.quantity}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Include auth token if required
        },
        body: JSON.stringify(payload),
      });
  
      const responseData = await response.json();
      console.log('API Response:', responseData);
  
      if (!response.ok) {
        console.error('Failed to add to cart:', responseData);
        throw new Error('Failed to add to cart');
      }
  
      // Dispatch to Redux store (if needed)
      dispatch(
        addItemToCartAction({
          
          productId: product.id,
          size: selectedSize,
          quantity: quantity,
        })
      );
  
      setError(''); 
      alert('Product successfully added to cart!');
    } catch (error) {
      console.error('Error adding product to cart:', error.message);
      setError('Error adding product to cart');
    }
  };
  
  

  // Handle quantity change
  const handleQuantityChange = (e) => {
    const value = Math.max(1, parseInt(e.target.value)); // Ensure quantity is at least 1
    setQuantity(value);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!product) {
    return <p>No product found</p>;
  }

  // Constructing the correct image URL
  const imageUrl = `http://localhost:8080/upload_imges/${product.imagePath.split('/').pop()}`;

  return (
    <div className={styles.productDetailsContainer}>
      <div className={styles.productHeader}>
        <div className="flex justify-center items-center h-[400px] w-[400px]">
          {/* Using the constructed image URL */}
          <img
            className="object-cover h-full w-full rounded-lg"
            src={imageUrl} // Make sure this path is correct
            alt={product.name}
          />
        </div>
        <div className={styles.productInfo}>
          <h1>{product.name}</h1>
          <p>₹{product.price}</p>
          <div className={styles.sizeSelector}>
            <label htmlFor="size">Select Size:</label>
            <select
              id="size"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className={styles.sizeDropdown}
            >
              <option value="">-- Select --</option>
              {product.size.split(',').map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.quantitySelector}>
            <label htmlFor="quantity">Quantity:</label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={handleQuantityChange}
              min="1"
              className={styles.quantityInput}
            />
          </div>
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.addToCart}>
        <button className={styles.addToCartButton} onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>

      <div className={styles.productDescription}>
        <h2>Description</h2>
        <p>{product.description}</p>
      </div>
    </div>
  );
};

export default ProductDetails;

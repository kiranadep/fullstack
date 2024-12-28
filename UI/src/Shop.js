import React, { useEffect } from 'react';
import HeroSection from './components/HeroSection/HeroSection';
import NewArrivals from './components/Sections/NewArrivals';
import Category from './components/Sections/Categories/Category';
import content from './data/content.json';
import Footer from './components/Footer/Footer';
import { useDispatch } from 'react-redux';
import { fetchCategories } from './store/features/categorySlice'; // Correct import for fetchCategories
import { setLoading } from './store/features/common';

const Shop = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(true)); // Set loading to true while fetching categories

    // Fetch categories and dispatch them to the Redux store
    dispatch(fetchCategories())
      .then(() => {
        dispatch(setLoading(false)); // Set loading to false after fetching is done
      })
      .catch((err) => {
        console.error('Error fetching categories:', err);
        dispatch(setLoading(false)); // Set loading to false in case of error
      });
  }, [dispatch]);

  return (
    <>
      <HeroSection />
      <NewArrivals />
      {content?.pages?.shop?.sections &&
        content?.pages?.shop?.sections?.map((item, index) => (
          <Category key={item?.title + index} {...item} />
        ))}
      <Footer content={content?.footer} />
    </>
  );
};

export default Shop;

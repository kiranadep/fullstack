import React, { useCallback, useState } from 'react';
import GoogleSignIn from '../../components/Buttons/GoogleSignIn';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../store/features/common';
import { loginAPI } from '../../api/authentication';
import { saveToken } from '../../utils/jwt-helper';

const Login = () => {
  const [values, setValues] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = useCallback((e) => {
    e.preventDefault();
    setError(''); // Reset error message
    dispatch(setLoading(true)); // Show loading state
  
    loginAPI(values)
      .then(res => {
        console.log('Login response:', res); // Log the response for debugging
        if (res?.jwt) { // Check for 'jwt' field in the response
          saveToken(res.jwt); // Save the token in localStorage
          console.log('Navigating to dashboard or home...');
          navigate('/'); // Redirect to homepage or desired page
        } else {
          setError('Something went wrong!'); // If jwt is not found
        }
      })
      .catch(err => {
        console.error('Login error:', err); // Log the error for debugging
        setError('Invalid Credentials!'); // Set error message for UI
      })
      .finally(() => {
        dispatch(setLoading(false)); // Hide loading spinner
      });
  }, [dispatch, navigate, values]);

  // Handle form input changes
  const handleOnChange = useCallback((e) => {
    e.persist();
    setValues(values => ({
      ...values,
      [e.target.name]: e.target.value, // Dynamically update input fields
    }));
  }, []);

  return (
    <div className='px-8 w-full lg:w-[70%]'>

      <p className='text-3xl font-bold pb-4 pt-4'>Sign In</p>
      <GoogleSignIn />
      <p className='text-gray-500 items-center text-center w-full py-2'>OR</p>

      <div className='pt-4'>
        <form onSubmit={onSubmit}>
          <input
            type="email"
            name='email'
            value={values?.email}
            onChange={handleOnChange}
            placeholder='Email address'
            className='h-[48px] w-full border p-2 border-gray-400'
            required
          />
          <input
            type="password"
            name='password'
            value={values?.password}
            onChange={handleOnChange}
            placeholder='Password'
            className='h-[48px] mt-8 w-full border p-2 border-gray-400'
            required
            autoComplete='new-password'
          />
          <Link className='text-right w-full float-right underline pt-2 text-gray-500 hover:text-black'>Forgot Password?</Link>
          <button className='border w-full rounded-lg h-[48px] mb-4 bg-black text-white mt-4 hover:opacity-80'>
            Sign In
          </button>
        </form>
      </div>
      {error && <p className='text-lg text-red-700'>{error}</p>}
      <Link to={"/v1/register"} className='underline text-gray-500 hover:text-black'>
        Don’t have an account? Sign up
      </Link>
    </div>
  );
}

export default Login;

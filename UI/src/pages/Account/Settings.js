import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { handleLogout } from '../../store/actions/cartAction';

const Settings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onLogOut = useCallback(() => {
    dispatch(handleLogout());
    navigate('/');
  }, [dispatch, navigate]);

  return (
    <div>
      <button
        onClick={onLogOut}
        className='w-[150px] items-center h-[48px] bg-black border rounded-lg mt-2 text-white hover:bg-gray-800'
      >
        Logout
      </button>
    </div>
  );
};

export default Settings;

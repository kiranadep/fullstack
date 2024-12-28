import React from 'react';
import { useSelector } from 'react-redux';
import { countCartItems } from '../../store/features/cart';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Wishlist } from '../common/Wishlist';
import { AccountIcon } from '../common/AccountIcon';
import { CartIcon } from '../common/CartIcon';
import './Navigation.css';

const Navigation = ({ variant = 'default' }) => {
  const cartLength = useSelector(countCartItems);
  const navigate = useNavigate();

  return (
    <nav className="flex items-center py-6 px-16 justify-between gap-20 custom-nav">
      <div className="flex items-center gap-6">
        <a className="text-3xl text-black font-bold gap-8" href="/">
          ShopEase
        </a>
      </div>

      {variant === 'default' && (
        <div className="flex flex-wrap items-center gap-10">
          <ul className="flex gap-14 text-gray-600 hover:text-black">
            <li>
              <NavLink to="/" activeClassName="active-link">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/men" activeClassName="active-link">
                Shop
              </NavLink>
            </li>
          </ul>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4">
        {variant === 'default' && (
          <ul className="flex gap-8">
            <li>
              <button>
                <Wishlist />
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/account-details/profile')}>
                <AccountIcon />
              </button>
            </li>
            <li>
              <Link to="/cart-items" className="flex flex-wrap">
                <CartIcon />
                {cartLength > 0 && (
                  <div className="absolute ml-6 inline-flex items-center justify-center h-6 w-6 bg-black text-white rounded-full border-2 text-xs border-white">
                    {cartLength}
                  </div>
                )}
              </Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navigation;

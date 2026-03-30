import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaHeart, FaRegHeart, FaSearch, FaShoppingBag, FaUser, FaTimes } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/images/new-logo.png';

const PeterEnglandHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const accountInitial = useMemo(() => {
    return (user?.name || user?.email || '').trim().charAt(0).toUpperCase();
  }, [user]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const collections = [
    { name: 'Checked Collection', slug: 'checked-collection' },
    { name: 'Office Collection', slug: 'office-collection' },
    { name: 'Party Wear Collection', slug: 'party-wear-collection' },
    { name: 'Casual Collection', slug: 'casual-collection' },
    { name: 'New Collection', slug: 'new-collection' },
    { name: 'Winter Collection', slug: 'winter-collection' },
    { name: 'Summer Collection', slug: 'summer-collection' },
    { name: 'Polos', slug: 'polos' },
    { name: 'Denim', slug: 'denim' },
    { name: 'Trousers', slug: 'trousers' },
    { name: 'Formal Pants', slug: 'formal-pants' },
    { name: 'Shirts', slug: 'shirts' },
    { name: 'All Products', slug: 'shop' }
  ];

  return (
    <>
      {/* Peter England Style Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#1a1a1a] border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            
            {/* Left: Hamburger Menu */}
            <div className="flex items-center">
              <button
                type="button"
                onClick={toggleMobileMenu}
                className="p-2 text-white hover:text-[#B8972E] transition-colors duration-200"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
            </div>

            {/* Center: Logo */}
            <div className="flex items-center justify-center">
              <Link to="/" className="flex items-center gap-2">
                <img 
                  src={logo} 
                  alt="Black Locust" 
                  className="h-8 lg:h-10 w-auto"
                  style={{ filter: 'brightness(0) saturate(100%) invert(81%) sepia(34%) saturate(582%) hue-rotate(354deg) brightness(93%) contrast(89%);' }}
                />
                <span 
                  className="hidden lg:block text-lg lg:text-xl font-bold tracking-wider"
                  style={{ fontFamily: 'Cormorant Garamond, serif', color: '#B8972E' }}
                >
                  BLACK LOCUST
                </span>
              </Link>
            </div>

            {/* Right: Search, Profile, Cart */}
            <div className="flex items-center gap-3 lg:gap-4">
              {/* Search */}
              <button
                type="button"
                onClick={() => navigate('/search')}
                className="p-2 text-white hover:text-[#B8972E] transition-colors duration-200"
                aria-label="Search"
              >
                <FaSearch size={20} />
              </button>

              {/* Profile */}
              <button
                type="button"
                onClick={() => navigate(isAuthenticated ? '/profile' : '/login')}
                className="p-2 text-white hover:text-[#B8972E] transition-colors duration-200"
                aria-label="Profile"
              >
                {isAuthenticated ? (
                  <span 
                    className="text-sm font-semibold border border-white rounded-full w-8 h-8 flex items-center justify-center"
                    style={{ borderColor: '#B8972E', color: '#B8972E' }}
                  >
                    {accountInitial}
                  </span>
                ) : (
                  <FaUser size={20} />
                )}
              </button>

              {/* Cart */}
              <button
                type="button"
                onClick={() => navigate('/cart')}
                className="relative p-2 text-white hover:text-[#B8972E] transition-colors duration-200"
                aria-label="Cart"
              >
                <FaShoppingBag size={20} />
                {totalItems > 0 && (
                  <span 
                    className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-bold"
                    style={{ backgroundColor: '#B8972E', color: '#1a1a1a' }}
                  >
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50"
            onClick={toggleMobileMenu}
          />
          
          {/* Menu Panel */}
          <div className="fixed left-0 top-0 h-full w-80 bg-[#1a1a1a] shadow-xl overflow-y-auto">
            <div className="p-4">
              {/* Menu Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 
                  className="text-xl font-bold"
                  style={{ fontFamily: 'Cormorant Garamond, serif', color: '#B8972E' }}
                >
                  COLLECTIONS
                </h3>
                <button
                  type="button"
                  onClick={toggleMobileMenu}
                  className="p-2 text-white hover:text-[#B8972E] transition-colors duration-200"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              {/* Collections List */}
              <nav className="space-y-2">
                {collections.map((collection) => (
                  <Link
                    key={collection.slug}
                    to={collection.slug === 'shop' ? '/shop' : `/collection/${collection.slug}`}
                    onClick={toggleMobileMenu}
                    className="block px-4 py-3 text-white hover:bg-gray-800 hover:text-[#B8972E] transition-all duration-200 rounded-md"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    {collection.name}
                  </Link>
                ))}
              </nav>

              {/* User Actions */}
              <div className="mt-8 pt-8 border-t border-gray-700">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <Link
                      to="/profile"
                      onClick={toggleMobileMenu}
                      className="block px-4 py-3 text-white hover:bg-gray-800 hover:text-[#B8972E] transition-all duration-200 rounded-md"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/orders"
                      onClick={toggleMobileMenu}
                      className="block px-4 py-3 text-white hover:bg-gray-800 hover:text-[#B8972E] transition-all duration-200 rounded-md"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                      My Orders
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        handleLogout();
                        toggleMobileMenu();
                      }}
                      className="w-full px-4 py-3 text-white hover:bg-gray-800 hover:text-[#B8972E] transition-all duration-200 rounded-md text-left"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link
                      to="/login"
                      onClick={toggleMobileMenu}
                      className="block px-4 py-3 text-white hover:bg-gray-800 hover:text-[#B8972E] transition-all duration-200 rounded-md"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={toggleMobileMenu}
                      className="block px-4 py-3 text-white hover:bg-gray-800 hover:text-[#B8972E] transition-all duration-200 rounded-md"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Top Navigation Bar */}
      <div className="hidden lg:block border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-3">
            <nav className="flex items-center space-x-8">
              <Link
                to="/shop"
                className="text-sm text-white hover:text-[#B8972E] transition-colors duration-200 uppercase tracking-wider"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                All Products
              </Link>
              <span className="text-gray-600">|</span>
              <Link
                to="/new-arrivals"
                className="text-sm text-white hover:text-[#B8972E] transition-colors duration-200 uppercase tracking-wider"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                New Arrivals
              </Link>
              <span className="text-gray-600">|</span>
              <Link
                to="/shop"
                className="text-sm text-white hover:text-[#B8972E] transition-colors duration-200 uppercase tracking-wider"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                Best Sellers
              </Link>
              <span className="text-gray-600">|</span>
              <Link
                to="/shop"
                className="text-sm text-white hover:text-[#B8972E] transition-colors duration-200 uppercase tracking-wider"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                Sale
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Add padding to body to account for fixed header */}
      <div className="h-16 lg:h-20"></div>
    </>
  );
};

export default PeterEnglandHeader;

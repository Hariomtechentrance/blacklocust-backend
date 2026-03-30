import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaEye } from 'react-icons/fa';
import { useWishlist } from '../../context/WishlistContext';

const PeterEnglandProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Quick view functionality can be implemented later
    console.log('Quick view:', product.name);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getDiscountPercentage = () => {
    if (product.discountedPrice && product.discountedPrice < product.price) {
      return Math.round(((product.price - product.discountedPrice) / product.price) * 100);
    }
    return 0;
  };

  const discountPercentage = getDiscountPercentage();
  const isInWishlistItem = isInWishlist(product._id);

  return (
    <div 
      className="group relative bg-[#1a1a1a] overflow-hidden transition-all duration-300 hover:shadow-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Images */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-900">
        {/* Main Image */}
        <img
          src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=360&h=450&fit=crop'}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isHovered && product.images?.[1] ? 'opacity-0' : 'opacity-100'
          }`}
        />
        
        {/* Hover Image (Second Image) */}
        {product.images?.[1] && (
          <img
            src={product.images[1].url}
            alt={`${product.name} - Alternate view`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Hover Overlay Actions */}
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex flex-col gap-3">
            {/* Quick View */}
            <button
              type="button"
              onClick={handleQuickView}
              className="flex items-center justify-center w-12 h-12 bg-white text-[#1a1a1a] rounded-full hover:bg-[#B8972E] hover:text-white transition-all duration-300 transform hover:scale-110"
              aria-label="Quick view"
            >
              <FaEye size={18} />
            </button>
            
            {/* Wishlist */}
            <button
              type="button"
              onClick={handleWishlistToggle}
              className="flex items-center justify-center w-12 h-12 bg-white text-[#1a1a1a] rounded-full hover:bg-[#B8972E] hover:text-white transition-all duration-300 transform hover:scale-110"
              aria-label={isInWishlistItem ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              {isInWishlistItem ? <FaHeart size={18} /> : <FaRegHeart size={18} />}
            </button>
          </div>
        </div>

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded-md text-xs font-semibold">
            {discountPercentage}% OFF
          </div>
        )}

        {/* New Arrival Badge */}
        {product.isNewArrival && (
          <div className="absolute top-3 right-3 bg-[#B8972E] text-white px-2 py-1 rounded-md text-xs font-semibold">
            NEW
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Product Name */}
        <Link to={`/product/${product._id}`}>
          <h3 
            className="text-white font-medium text-sm lg:text-base mb-2 line-clamp-2 hover:text-[#B8972E] transition-colors duration-200"
            style={{ fontFamily: 'Roboto, sans-serif' }}
          >
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center gap-2 mb-2">
          {product.discountedPrice && product.discountedPrice < product.price ? (
            <>
              <span 
                className="text-white font-semibold"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                {formatPrice(product.discountedPrice)}
              </span>
              <span 
                className="text-gray-500 line-through text-sm"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span 
              className="text-white font-semibold"
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Colors */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1 mb-2">
            {product.colors.slice(0, 4).map((color, index) => (
              <div
                key={index}
                className="w-4 h-4 rounded-full border border-gray-600"
                title={color}
                style={{
                  backgroundColor: color.toLowerCase().includes('blue') ? '#3B82F6' :
                                 color.toLowerCase().includes('red') ? '#EF4444' :
                                 color.toLowerCase().includes('green') ? '#10B981' :
                                 color.toLowerCase().includes('black') ? '#000000' :
                                 color.toLowerCase().includes('white') ? '#FFFFFF' :
                                 color.toLowerCase().includes('yellow') ? '#F59E0B' :
                                 color.toLowerCase().includes('brown') ? '#92400E' :
                                 color.toLowerCase().includes('grey') || color.toLowerCase().includes('gray') ? '#6B7280' :
                                 '#6B7280'
                }}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-gray-400">+{product.colors.length - 4}</span>
            )}
          </div>
        )}

        {/* Available Sizes */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="flex items-center gap-1">
            {product.sizes.slice(0, 3).map((size, index) => (
              <span
                key={index}
                className="text-xs text-gray-400 border border-gray-700 px-1 py-0.5 rounded"
              >
                {size.size}
              </span>
            ))}
            {product.sizes.length > 3 && (
              <span className="text-xs text-gray-400">+{product.sizes.length - 3}</span>
            )}
          </div>
        )}
      </div>

      {/* Hover Add to Cart Button */}
      <div className={`absolute bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-gray-800 p-4 transition-transform duration-300 ${
        isHovered ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <button
          type="button"
          className="w-full bg-[#B8972E] text-white py-3 px-4 font-semibold uppercase tracking-wider text-sm hover:bg-[#8B7500] transition-all duration-300"
          style={{ fontFamily: 'Roboto, sans-serif' }}
        >
          ADD TO CART
        </button>
      </div>
    </div>
  );
};

export default PeterEnglandProductCard;

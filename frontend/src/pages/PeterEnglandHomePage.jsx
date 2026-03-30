import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PeterEnglandHero from '../components/Hero/PeterEnglandHero';
import PeterEnglandProductCard from '../components/Product/PeterEnglandProductCard';
import PeterEnglandHeader from '../components/Header/PeterEnglandHeader';
import PeterEnglandFooter from '../components/Footer/PeterEnglandFooter';
import api from '../api/axios';

const PeterEnglandHomePage = () => {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      const data = response.data;

      if (data.success) {
        const allProducts = data.products || [];
        setProducts(allProducts);
        
        // Get featured products (first 8 products)
        setFeaturedProducts(allProducts.slice(0, 8));
        
        // Get new arrivals (products marked as new arrivals)
        const newArrivalsList = allProducts.filter(product => product.isNewArrival);
        setNewArrivals(newArrivalsList.slice(0, 8));
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    {
      name: 'OFFICE COLLECTION',
      slug: 'office-collection',
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&h=300&fit=crop',
      description: 'Professional shirts perfect for workplace'
    },
    {
      name: 'CHECKED COLLECTION',
      slug: 'checked-collection',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
      description: 'Stylish checked patterns for modern casual wear'
    },
    {
      name: 'PARTY WEAR',
      slug: 'party-wear-collection',
      image: 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=300&h=300&fit=crop',
      description: 'Elegant shirts designed for special occasions'
    },
    {
      name: 'CASUAL WEAR',
      slug: 'casual-collection',
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&h=300&fit=crop',
      description: 'Comfortable everyday wear for relaxed style'
    }
  ];

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <PeterEnglandHeader />
      
      {/* Hero Section */}
      <PeterEnglandHero />

      {/* Categories Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 
              className="text-3xl lg:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              SHOP BY COLLECTION
            </h2>
            <p 
              className="text-gray-300 text-lg"
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              Discover our curated collections for every occasion
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.slug}
                to={`/collection/${category.slug}`}
                className="group relative overflow-hidden rounded-lg transition-all duration-300 hover:shadow-xl"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 
                      className="text-white font-bold text-lg mb-2"
                      style={{ fontFamily: 'Cormorant Garamond, serif' }}
                    >
                      {category.name}
                    </h3>
                    <p 
                      className="text-gray-300 text-sm"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                      {category.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 lg:py-24 bg-gray-900/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 
              className="text-3xl lg:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              FEATURED PRODUCTS
            </h2>
            <p 
              className="text-gray-300 text-lg"
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              Handpicked favorites from our collection
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-[4/5] bg-gray-800 rounded-lg mb-4" />
                  <div className="h-4 bg-gray-800 rounded mb-2" />
                  <div className="h-4 bg-gray-800 rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <PeterEnglandProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/shop"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#B8972E] text-white font-semibold uppercase tracking-wider text-sm hover:bg-[#8B7500] transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-xl"
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              VIEW ALL PRODUCTS
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      {newArrivals.length > 0 && (
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <h2 
                className="text-3xl lg:text-4xl font-bold text-white mb-4"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                NEW ARRIVALS
              </h2>
              <p 
                className="text-gray-300 text-lg"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                Fresh styles just added to our collection
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map((product) => (
                <PeterEnglandProductCard key={product._id} product={product} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                to="/new-arrivals"
                className="inline-flex items-center gap-3 px-8 py-4 border border-[#B8972E] text-[#B8972E] font-semibold uppercase tracking-wider text-sm hover:bg-[#B8972E] hover:text-white transition-all duration-300"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                EXPLORE NEW ARRIVALS
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Brand Story Section */}
      <section className="py-16 lg:py-24 bg-gray-900/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop"
                alt="Black Locust Brand Story"
                className="rounded-lg shadow-2xl"
              />
            </div>
            <div className="space-y-6">
              <h2 
                className="text-3xl lg:text-4xl font-bold text-white"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                THE BLACK LOCUST STORY
              </h2>
              <p 
                className="text-gray-300 leading-relaxed text-lg"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                Black Locust represents the perfect blend of traditional craftsmanship and contemporary design. 
                Founded on the principles of quality, elegance, and sophistication, we bring you premium 
                fashion that stands the test of time.
              </p>
              <p 
                className="text-gray-300 leading-relaxed text-lg"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                Each piece in our collection is carefully crafted using the finest materials and attention 
                to detail, ensuring that you not only look your best but feel confident in every occasion.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#B8972E] text-white font-semibold uppercase tracking-wider text-sm hover:bg-[#8B7500] transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-xl"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                LEARN MORE ABOUT US
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-[#B8972E] rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 
                className="text-xl font-bold text-white"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                FREE SHIPPING
              </h3>
              <p 
                className="text-gray-300"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                On orders above ₹999
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-[#B8972E] rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 
                className="text-xl font-bold text-white"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                30-DAY RETURNS
              </h3>
              <p 
                className="text-gray-300"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                Easy returns and exchanges
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-[#B8972E] rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 
                className="text-xl font-bold text-white"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                QUALITY ASSURED
              </h3>
              <p 
                className="text-gray-300"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                Premium materials guaranteed
              </p>
            </div>
          </div>
        </div>
      </section>

      <PeterEnglandFooter />
    </div>
  );
};

export default PeterEnglandHomePage;

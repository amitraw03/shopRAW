import React, { useEffect, useState } from 'react'
import { useProductStore } from '../stores/useProductStore';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { motion } from 'framer-motion';
import { SearchIcon } from '@heroicons/react/solid';

const CategoryPage = () => {
    const { fetchProductsByCategory, products } = useProductStore();
    // for managing search functionality
    const [searchText, setSearchText] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);

    const { category } = useParams(); // to get the category from the url

    useEffect(() => {
        fetchProductsByCategory(category);
    }, [fetchProductsByCategory, category]);

    useEffect(() => {
        setFilteredProducts(products);
    }, [products]);

    const handleSearch = () => {
        const searchResults = products.filter(
            (product) => product.name.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredProducts(searchResults);
    };

    return (
        <div className='min-h-screen'>
            <div className='relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
                <motion.h1
                    className="text-center text-4xl sm:text-5xl font-bold mb-8 font-serif"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text">
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                    </span>
                </motion.h1>

                <div className="search w-full max-w-md mx-auto mb-8 relative group">
                    <input 
                        className="w-full h-12 px-4 pr-10 rounded-full bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all duration-300 ease-in-out transform group-hover:scale-105 group-hover:shadow-lg"
                        type="text"
                        placeholder="Search products..."
                        value={searchText}
                        onChange={(e) => {
                            setSearchText(e.target.value);
                            handleSearch(); // Search as you type
                        }}
                    />
                    <button 
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-500 transition-colors"
                        onClick={handleSearch}
                    >
                        <SearchIcon className="h-6 w-6" />
                    </button>
                </div>

                <motion.div
                    className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    {filteredProducts?.length === 0 && (
                        <h2 className='text-3xl font-semibold text-gray-300 text-center col-span-full'>
                            No products found
                        </h2>
                    )}

                    {filteredProducts?.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </motion.div>
            </div>
        </div>
    );
}

export default CategoryPage
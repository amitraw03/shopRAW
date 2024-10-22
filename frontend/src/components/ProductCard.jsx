import React, { useState, useEffect } from 'react';
import toast from "react-hot-toast";
import { ShoppingCart, Heart } from "lucide-react";
import { useUserStore } from '../stores/useUserStore';
import { useCartStore } from '../stores/useCartStore';
import { useFavoriteStore } from '../stores/useFavoriteStore';

const ProductCard = ({product}) => {
    const {user} = useUserStore();
    const {addToCart} = useCartStore();
    const { favorites, isFavorite, addToFavorites, removeFromFavorites } = useFavoriteStore();
    
    // Use local state to track favorite status
    const [isProductFavorite, setIsProductFavorite] = useState(false);

    // Update local state when component mounts or favorites change
    useEffect(() => {
        setIsProductFavorite(isFavorite(product._id));
    }, [product._id, favorites]);

    const handleAddToCart = () => {
        if (!user) {
            toast.error("Please login to add product to cart", {id: "login"});
            return;
        } else {
            addToCart(product);
        }
    };

    const handleFavoriteClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!user) {
            toast.error("Please login to add to favorites", {id: "login"});
            return;
        }
        
        if (isProductFavorite) {
            removeFromFavorites(product._id);
            setIsProductFavorite(false);
            toast.success("Removed from favorites");
        } else {
            addToFavorites(product);
            setIsProductFavorite(true);
            toast.success("Added to favorites");
        }
    };

    return (
        <div className='flex w-full relative flex-col overflow-hidden rounded-lg border border-gray-700 bg-gray-900 bg-opacity-60 backdrop-blur-md shadow-lg'>
            <div className='relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl'>
                <img className='object-cover w-full' src={product.image} alt='product image' />
                <div className='absolute inset-0 bg-black bg-opacity-20' />
                <button
                    type="button"
                    className='absolute top-2 right-2 p-2 rounded-full bg-gray-900 bg-opacity-50 hover:bg-opacity-70 transition-all duration-200'
                    onClick={handleFavoriteClick}
                >
                    <Heart
                        size={20}
                        className={`${isProductFavorite ? 'fill-pink-500 text-pink-500' : 'text-white'} transition-colors duration-200`}
                    />
                </button>
            </div>

            <div className='mt-4 px-5 pb-5'>
                <h5 className='text-xl font-semibold tracking-tight text-white'>{product.name}</h5>
                <div className='mt-2 mb-5 flex items-center justify-between'>
                    <p>
                        <span className='text-3xl font-bold text-emerald-400'>${product.price}</span>
                    </p>
                </div>
                <button
                    className='w-full flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300'
                    onClick={handleAddToCart}
                >
                    <ShoppingCart size={22} className='mr-2' />
                    Add to cart
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
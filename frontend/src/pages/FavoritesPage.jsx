import React from 'react';
import { useFavoriteStore } from '../stores/useFavoriteStore';
import ProductCard from '../components/ProductCard';

const FavoritesPage = () => {
    const { favorites } = useFavoriteStore();

    return (
        <div className="container mx-auto px-4 pt-20 mb-20">
            {favorites.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                    <p>No favorites added yet..</p>
                </div>
            ) : (
                <>
                <h1 className="text-3xl font-bold text-white mb-8 font-serif inline-block border-b-4 border-emerald-400">My Favorites</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {favorites.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
                </>
            )}
        </div>
    );
};

export default FavoritesPage;
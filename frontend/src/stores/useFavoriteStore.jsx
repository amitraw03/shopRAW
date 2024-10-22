import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useFavoriteStore = create(
  persist(
    (set, get) => ({
      favorites: [], // Store full products
      addToFavorites: (product) => {
        const currentFavorites = get().favorites;
        const exists = currentFavorites.some(fav => fav._id === product._id);
        if (!exists) {
          set({ favorites: [...currentFavorites, product] });
        }
      },
      removeFromFavorites: (productId) => {
        set((state) => ({
          favorites: state.favorites.filter(product => product._id !== productId)
        }));
      },
      isFavorite: (productId) => {
        return get().favorites.some(product => product._id === productId);
      }
    }),
    {
      name: 'favorites-storage'
    }
  )
);
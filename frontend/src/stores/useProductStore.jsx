import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set, get) => ({
    products: [],
    loading: false,
    
    setProducts: (products) => set({ products }),
    
	// adding a product in the products model in D.B
	createProduct: async (productData) => {
        set({ loading: true });
        try {
          const res = await axios.post("/products", productData);
          set((state) => {
            const currentProducts = Array.isArray(state.products) ? state.products : [];
            return {
              products: [...currentProducts, res.data], // why not res.data.prodcuts becoz we didn't send it as object format
              loading: false,
            };
          });
          toast.success('Product created successfully!');
        } catch (error) {
          console.error("Error creating product:", error);
          toast.error(error.response?.data?.error || error.message || 'An error occurred while creating the product');
          set({ loading: false });
        }
      },
    
    //fetch all products from Backend to display it in ProductList component
	fetchAllProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/products");
			console.log(response.data);
			set({ products: response.data, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			toast.error(error.response?.data?.error|| "Failed to fetch products");
		}
	},

	//fetching the products by category which user clicked
	fetchProductsByCategory: async (category) => {
		set({ loading: true });
		try {
			const response = await axios.get(`/products/category/${category}`);
			
			set({ products: response.data.products, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			toast.error(error.response.data.error || "Failed to fetch products");
		}
	},

    //delete product on clicking trash
	deleteProduct: async (productId) => {
		set({ loading: true });
		try {
			const response = await axios.delete(`/products/${productId}`);
      
			if (response.status === 200) {
			  set((state) => ({
				products: state.products.filter((product) => product._id !== productId),
				loading: false,
			  }));
			  toast.success(response.data.message || 'Product deleted successfully');
			} 
			else {
			  throw new Error('Unexpected response status');
			}
		} 
		catch (error) {
			set({ loading: false });
			toast.error(error.response.data.error || "Failed to delete product");
		}
	},
    
    //toggle featured product on clicking star
	toggleFeaturedProduct: async (productId) => {
		set({ loading: true });
		try {
			const response = await axios.patch(`/products/${productId}`);
			// this will update the isFeatured prop of the product
			set((prevProducts) => ({
				products: prevProducts.products.map((product) =>
					product._id === productId ? { ...product, isFeatured: response.data.isFeatured } : product
				),
				loading: false,
			}));
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.error || "Failed to update product");
		}
	},

	fetchFeaturedProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/products/featured");
			set({ products: response.data, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			console.log("Error fetching featured products:", error);
		}
	},

}),

)

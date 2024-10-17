import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useCartStore = create((set, get) => ({
	cart: [],
	coupon: null,
	total: 0,
	subtotal: 0,
	isCouponApplied: false,

	// coupon all functionalities
	getMyCoupon: async () => {
		try {
			const response = await axios.get("/coupons");
			console.log("error to noi hai", response.data);

			set({ coupon: response.data });
		} catch (error) {
			console.error("Error fetching coupon:", error);
		}
	},


	applyCoupon: async (code) => {
		try {
			const response = await axios.post("/coupons/validate", { code });
			// console.log(response.data);  
			set({ coupon: response.data, isCouponApplied: true });
			get().calculateTotals();
			toast.success("Coupon applied successfully");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to apply coupon");
		}
	},
	removeCoupon: () => {
		set({ coupon: null, isCouponApplied: false });
		get().calculateTotals();
		toast.success("Coupon removed");
	},

	// to get the products data from backend for cart Page
	getCartItems: async () => {
		try {
			const response = await axios.get("/cart");
			set({ cart: response.data });
			get().calculateTotals();  // usuing ustilits functns on all the state vars of store
		}
		catch (error) {
			set({ cart: [] });
			toast.error(error.response.data.message || "An error occurred");
		}
	},

	clearCart: async () => {
		try {
			// Clear cart in the backend too so that it will not fetch the old getCartItems
			await axios.delete("/cart");
			// Clear cart in the frontend state
			set({ cart: [], coupon: null, total: 0, subtotal: 0 });
		} catch (error) {
			console.error("Error clearing cart:", error);
			toast.error("Failed to clear cart");
		}
	},

	//function for handling cart functionalities
	addToCart: async (product) => {
		try {
			await axios.post("/cart", { productId: product._id });
			toast.success("Product added to cart");

			set((prevState) => {
				const existingItem = prevState.cart.find((item) => item._id === product._id);
				const newCart = existingItem
					? prevState.cart.map((item) =>
						item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
					)
					: [...prevState.cart, { ...product, quantity: 1 }];
				return { cart: newCart };
			});
			get().calculateTotals();
		} catch (error) {
			toast.error(error.response.data.message || "An error occurred");
		}
	},

	// function for removing product from cart
	removeFromCart: async (productId) => {
		await axios.delete(`/cart`, { data: { productId } });
		set((prevState) => ({ cart: prevState.cart.filter((item) => item._id !== productId) }));
		get().calculateTotals();
	},

	// functn to update qty in cart
	updateQuantity: async (productId, quantity) => {
		if (quantity === 0) {
			get().removeFromCart(productId);
			return;
		}

		await axios.put(`/cart/${productId}`, { quantity });
		set((prevState) => ({
			cart: prevState.cart.map((item) => (item._id === productId ? { ...item, quantity } : item)),
		}));
		get().calculateTotals();
	},

	// utility functn for cart UI updation & total and subtotal amnt calculation
	calculateTotals: () => {
		const { cart, coupon, isCouponApplied } = get();
		const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
		let total = subtotal;

		if (coupon && isCouponApplied) {
			const discount = subtotal * (coupon.discountPercentage / 100);
			total = subtotal - discount;
		}

		set({ subtotal, total });

		// Check if subtotal is over $100 and generate coupon if needed
		if (subtotal >= 100 && !get().coupon) {
			get().generateCoupon();
		}
		else if (subtotal < 100 && (subtotal > 97 || subtotal > 98) && get().coupon) {
			get().removeCoupon();
		}
	},

	generateCoupon: async () => {
		try {
			const response = await axios.post("/coupons/generate");
			set({ coupon: response.data });
			toast.success("You've earned a coupon for spending over $100!");
		} catch (error) {
			console.error("Error generating coupon:", error);
		}
	},
}));
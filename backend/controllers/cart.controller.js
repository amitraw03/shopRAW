import { Product } from "../models/product.model.js";

export const getCartProducts = async (req, res) => {
    try {
        //find all products whose id is present in cart
        const products = await Product.find({ _id: { $in: req.user.cartItems } });

        //add quantity for each product
            const cartItems = products.map((product) => {
            const item = req.user.cartItems.find((cartItem) => cartItem.id === product.id);
            return {...product.toJSON(), quantity: item ? item.quantity : 0};
        })

        res.status(200).json(cartItems);
    } catch (error) {
        console.log('Error in getCartProducts controller', error.message);
        res.status(500).json({ message: 'Server Error', error: error.message });
    } 
};


export const addToCart = async (req, res) => {
    try {
        const { productId} = req.body;
        const user = req.user;
        
        //checking product we want to add is already in cart or not
        const existingItem = user.cartItems.find((item) => item.id === productId);
        if(existingItem){
            existingItem.quantity += 1;
        }else{
            user.cartItems.push(productId);
        }
        await user.save();
        res.json(user.cartItems);
    } catch (error) {
        console.log('Error in addToCart controller', error.message);
        res.status(500).json({ message: 'Server Error', error: error.message });
        
    }
};


export const removeAllFromCart = async (req, res) => {
    try {
        const {productId} = req.body;
        const user = req.user;

        if(!productId){
            user.cartItems = [];
        }else{
            //updating user cart by removing items whose id matched with productId we want to dlete
            user.cartItems = user.cartItems.filter((item) => item.id !== productId);
        }
        await user.save();
        res.json(user.cartItems);
        
    } catch (error) {
        console.log('Error in removeAllFromCart controller', error.message);
        res.status(500).json({ message: 'Server Error', error: error.message });
        
    } 
};


export const updateCartProductQuantity = async (req, res) => {
    try {
        const {id: productId} = req.params; // destructuring id into productId
        const { quantity } = req.body; // its coming from frontend in braces
        const user = req.user;
        // checking if product is already in cart
        const existingItem = user.cartItems.find((item) => item.id === productId);

        if(existingItem){
            // this below if() will execute when qty becomes 0 after deleting an item from cart
            if(quantity===0){
                // just filter-out from the cart
                user.cartItems = user.cartItems.filter((item) => item.id !== productId);
                await user.save();
                return res.json(user.cartItems);
            }
            existingItem.quantity = quantity;  // qty will be updated
            await user.save();
            
            

            res.json(user.cartItems);
        }
        else{
            res.status(404).json({message: 'Product not found in cart'});
        }
        
    } catch (error) {
        console.log('Error in updateCartProductQuantity controller', error.message);
        res.status(500).json({ message: 'Server Error', error: error.message });
        
    }
};


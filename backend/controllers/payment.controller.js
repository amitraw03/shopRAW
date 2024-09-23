import { stripe } from "../lib/stripe.js";
import { Coupon } from "../models/coupon.model.js";


export const createCheckoutSession = async (req, res) => {
     try {
        const {products, couponCode} = req.body;

        if(!Array.isArray(products) || products.length < 1){
            return res.status(400).json({message: 'Cart is empty'});
        }

        let totalAmount=0;
        const lineItems = products.map((product) => {
            const amount = Math.round(product.price * 100); // why *100 {stripe wants u to send in the format of cents}
            totalAmount+= amount * product.quantity;

            return {
                price_data: {   
                    currency: 'usd',
                    product_data: {
                        name: product.name,
                        images: [product.image],
                    },
                    unit_amount: amount,
                },
                quantity: product.quantity || 1, 
            };   
        });

        // Apply coupon code
        let coupon = null;
        if(couponCode){
            coupon = await Coupon.findOne({code: couponCode, userId: req.user._id, isActive: true});
            if(coupon){
                totalAmount = totalAmount - Math.round((totalAmount * coupon.discountPercentage) / 100);
            }
        }

       // Create Stripe checkout session
       const session = await stripe.checkout.sessions.create({
           payment_method_types: ['card'],
           line_items: lineItems,
           mode: 'payment',
           success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
           cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
           discounts : coupon ? [{

               coupon: await createStripeCoupon(coupon.discountPercentage),

           }] : [],
           metadata : {
               userId : req.user._id.toString(),
               couponCode : couponCode || 'none',
               products : JSON.stringify(
                   products.map((p) => ({
                       id: p._id,
                       quantity: p.quantity,
                       price: p.price,
                   }))
               ),
           },


       }); 

       if(totalAmount >= 20000){
          await createNewCoupon(req.user._id);
       }
       res.status(200).json({id: session.id, totalAmount: totalAmount/100});

     } catch (error) {
        console.log('Error in createCheckoutSession controller', error.message);
        res.status(500).json({ message: 'Server Error', error: error.message });
        
     }
};

// utility function for creating Stripe coupon
async function createStripeCoupon(discountPercentage){
    const coupon = await stripe.coupons.create({
        percent_off: discountPercentage,
        duration: 'once',
    });
    return coupon.id;
};

// utility function for creating new coupon if price > 20000
async function createNewCoupon(userId){
      await Coupon.findOneAndDelete({userId});

      const newCoupon = new Coupon({
		code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
		discountPercentage: 10,
		expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
		userId: userId,
	});

    await newCoupon.save();

    return newCoupon;
}


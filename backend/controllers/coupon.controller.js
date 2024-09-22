import { Coupon } from "../models/coupon.model.js"


export const getCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findOne({ _id: req.user._id, isActive: true });

        res.status(200).json(coupon || null);
        
    } catch (error) {
        console.log('Error in getCoupon controller', error.message);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// validate coupon code and apply discount accordingly
export const validateCoupon = async (req, res) => {
    try {
       const {code} = req.body;
       const coupon = await Coupon.findOne({ code: code, userId: req.user._id, isActive: true });

       if(!coupon) {
           return res.status(404).json({ message: 'Invalid coupon code' });
       }
       if(coupon.expirationDate < Date.now()) {
          coupon.isActive = false;
          await coupon.save();
          return res.status(404).json({ message: 'Coupon expired' });
       }

       res.status(200).json({
          message: 'Coupon applied successfully',
          code: coupon.code,
          discount: coupon.discountPercentage,
       });
       
    } catch (error) {
        console.log('Error in validateCoupon controller', error.message);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}
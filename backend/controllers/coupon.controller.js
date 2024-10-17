import { Coupon } from "../models/coupon.model.js"


export const getCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findOne({ userId: req.user._id, isActive: true });

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
          discountPercentage: coupon.discountPercentage,
       });
       
    } catch (error) {
        console.log('Error in validateCoupon controller', error.message);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}

export const generateCoupon = async (req, res) => {
    try {
      const userId = req.user._id;
  
      // Delete any existing coupon for this user
      await Coupon.findOneAndDelete({ userId });
  
      const newCoupon = new Coupon({
        code: "ENJOY" + Math.random().toString(36).substring(2, 8).toUpperCase(),
        discountPercentage: 10,
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        userId: userId,
      });
  
      const savedCoupon = await newCoupon.save();
      
      res.status(200).json(savedCoupon);
    } catch (error) {
      console.error("Error generating coupon:", error);
      res.status(500).json({ message: "Error generating coupon", error: error.message });
    }
  };
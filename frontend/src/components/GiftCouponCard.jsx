import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useCartStore } from "../stores/useCartStore";

const GiftCouponCard = () => {
  const [userInputCode, setUserInputCode] = useState("");
  const { coupon, isCouponApplied, applyCoupon, getMyCoupon, removeCoupon, subtotal } = useCartStore();

  useEffect(() => {
    getMyCoupon();
  }, [getMyCoupon]);

  useEffect(() => {
    if (coupon) setUserInputCode(coupon.code);
  }, [coupon]);

  const handleApplyCoupon = () => {
    if (!userInputCode) return;
    applyCoupon(userInputCode);
  };

  const handleRemoveCoupon = async () => {
    await removeCoupon();
    setUserInputCode("");
  };

  return (
    <motion.div className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6">
      <p className="text-xl font-semibold text-emerald-400">Coupon</p>

      {!isCouponApplied && (
        <>
          <p className="text-sm text-gray-300">Do you have a voucher or gift card?</p>
          <div className="flex space-x-2">
            <input
              type="text"
              className="w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-sm text-white placeholder-gray-400"
              placeholder="Enter code"
              value={subtotal < 100 ? "" : userInputCode}
              onChange={(e) => setUserInputCode(e.target.value)}
              required
            />
            <motion.button
              className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleApplyCoupon}
            >
              Apply Code
            </motion.button>
          </div>
        </>
      )}

      {isCouponApplied && coupon && (
        <motion.div
          className="rounded-lg border border-emerald-600 bg-emerald-900 p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-lg font-semibold text-emerald-400">Applied Coupon</p>
          <p className="text-white">
            {coupon.code} - {coupon.discountPercentage}% off
          </p>
          <motion.button
            className="mt-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRemoveCoupon}
          >
            Remove Coupon
          </motion.button>
        </motion.div>
      )}

      {coupon && !isCouponApplied && subtotal >= 100 && (
        <motion.div
          className="rounded-lg border border-yellow-600 bg-yellow-900 p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-lg font-semibold text-yellow-400">Your Available Coupon:</p>
          <p className="text-white">
            {coupon.code} - {coupon.discountPercentage}% off
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default GiftCouponCard;
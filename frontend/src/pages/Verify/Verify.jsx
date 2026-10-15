
import React, { useContext, useEffect, useRef } from "react";
import "./Verify.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { url, token, setCartItems } = useContext(StoreContext);
  const verificationStarted = useRef(false);

  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const paymentId = searchParams.get("razorpay_payment_id");
  const razorpayOrderId = searchParams.get("razorpay_order_id");
  const signature = searchParams.get("razorpay_signature");

  useEffect(() => {
    if (verificationStarted.current) return;
    verificationStarted.current = true;

    const verifyPayment = async () => {
      // A cancelled or failed payment should not clear the cart.
      if (success !== "true") {
        toast.error("Payment failed or cancelled. Your cart is preserved.");
        navigate("/cart", { replace: true });
        return;
      }

      if (!orderId || !paymentId || !razorpayOrderId || !signature) {
        toast.error("Payment details are incomplete. Please check your order.");
        navigate("/cart", { replace: true });
        return;
      }

      try {
        const response = await axios.post(
          url + "/api/order/verify",
          {
            success,
            orderId,
            razorpay_payment_id: paymentId,
            razorpay_order_id: razorpayOrderId,
            razorpay_signature: signature,
          },
          {
            headers: token ? { token } : {},
          }
        );

        if (response.data.success) {
          // Clear the frontend cart only after backend verification succeeds.
          setCartItems({});
          toast.success("Order placed successfully!");
          navigate("/myorders", { replace: true });
        } else {
          toast.error(
            response.data.message ||
              "Payment could not be verified. Your cart is preserved."
          );
          navigate("/cart", { replace: true });
        }
      } catch (error) {
        console.error("Payment verification error:", error);

        toast.error(
          "Verification could not be completed. Please check your order status."
        );
        navigate("/cart", { replace: true });
      }
    };

    verifyPayment();
  }, [
    success,
    orderId,
    paymentId,
    razorpayOrderId,
    signature,
    url,
    token,
    setCartItems,
    navigate,
  ]);

  return (
    <div className="verify">
      <div className="spinner"></div>
    </div>
  );
};

export default Verify;

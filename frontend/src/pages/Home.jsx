import axios from "axios";
const Home = () => {
  const handlePayment = async () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZTE5ZDgyMmQwYWNkN2VkOGE5Mjg3NyIsInVzZXJuYW1lIjoidGVzdF9zZWxsZXJfYW1hbiIsImVtYWlsIjoicGFsYW1hbjkzNzdAZ21haWwuY29tIiwicm9sZSI6InNlbGxlciIsImlhdCI6MTc1OTYxNjM4NywiZXhwIjoxNzU5NzAyNzg3fQ.3E4SwyqzDKdpGmdkUO2qc9jc3x35_QRdy6bzZqQarVQ";

    try {
      // Step 1: Create order on backend
      const { data: order } = await axios.post(
        "http://localhost:3004/api/payments/create/68daff63959f17b623663c4f",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Step 2: Razorpay options
      const options = {
        key: import.meta.RAZORPAY_KEY_ID, // from .env (frontend can use only key_id)
        amount: 2000,
        currency: "INR",
        name: "My Company",
        description: "Test Transaction",
        order_id: "68daff63959f17b623663c4f",
        handler: async function (response) {
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
            response;
          try {
            await axios.post("http://localhost:3004/api/payments/verify", {
              razorpayOrderId: razorpay_order_id,
              razorpayPaymentId: razorpay_payment_id,
              signature: razorpay_signature,
            });
            alert("Payment successful!");
          } catch (err) {
            alert("Payment verification failed!");
          }
        },
        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <button
        onClick={handlePayment}
        style={{
          padding: "10px 20px",
          background: "#3399cc",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
        }}
      >
        Pay Now
      </button>
    </div>
  );
};

export default Home;




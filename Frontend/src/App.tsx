import { useEffect, useState } from "react";

declare global {
  interface Window {
    Square: any; // New SDK uses `Square` object
  }
}

const App = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState(0);
  const [card, setCard] = useState<any>(null); // Store card instance

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sandbox.web.squarecdn.com/v1/square.js";
    script.async = true;
    script.onload = initializeSquarePaymentForm; // Initialize after load
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initializeSquarePaymentForm = async () => {
    if (!window.Square) {
      console.error("Square SDK not loaded!");
      return;
    }

    // Step 1: Initialize Square Payments
    const payments = window.Square.payments(
      "sandbox-sq0idb-AZoEdS9k4xgkVQKfpZatqg", // APPLICATION_ID
      "LWT5PS5KSYDT6" // Add Sandbox LOCATION_ID here
    );

    // Step 2: Create Card Component
    try {
      const card = await payments.card();
      await card.attach("#card-container"); // Attach to a container div
      setCard(card); // Save card instance
    } catch (error) {
      console.error("Card setup failed:", error);
    }
  };

  const handlePayment = async () => {
    if (!card) return;

    try {
      // Step 3: Generate Nonce
      const result = await card.tokenize();
      if (result.status === "OK") {
        console.log("Nonce:", result.token);
        // Send to backend
        const response = await fetch("http://localhost:3000/create-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sourceId: result.token,
            amount,
            name,
            email,
          }),
        });
        console.log("Payment Success:", await response.json());
      }
    } catch (error) {
      console.error("Payment Error:", error);
    }
  };

  return (
    <div>
      <h2>Square Payment Form</h2>
      <div>
        {/* User Details */}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Amount"
        />
        {/* Square Card Container */}
        <div id="card-container"></div> {/* Changed from multiple divs */}
        <button onClick={handlePayment}>Pay</button>
      </div>
    </div>
  );
};

export default App;

// import { useEffect, useState } from "react";

// declare global {
//   interface Window {
//     SqPaymentForm: any;
//   }
// }

// const SquarePayment = () => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");

//   useEffect(() => {
//     // Load the Square Payment Form script dynamically
//     const script = document.createElement("script");
//     script.src = "https://sandbox.web.squarecdn.com/v1/square.js"; // Use the correct Square environment URL
//     script.async = true;
//     script.onload = () => initializeSquarePaymentForm();
//     document.body.appendChild(script);

//     return () => {
//       document.body.removeChild(script);
//     };
//   }, []);

//   const initializeSquarePaymentForm = () => {
//     if (!window.SqPaymentForm) {
//       console.error("Square Payment Form library not loaded!");
//       return;
//     }

//     const paymentForm = new window.SqPaymentForm({
//       applicationId: "sandbox-sq0idb-XXXXXXXXXXXXX", // Replace with your Sandbox Application ID
//       inputClass: "sq-input",
//       autoBuild: false,
//       cardNumber: {
//         elementId: "sq-card-number",
//         placeholder: "Card Number",
//       },
//       cvv: {
//         elementId: "sq-cvv",
//         placeholder: "CVV",
//       },
//       expirationDate: {
//         elementId: "sq-expiration-date",
//         placeholder: "MM/YY",
//       },
//       postalCode: {
//         elementId: "sq-postal-code",
//         placeholder: "Postal Code",
//       },
//       callbacks: {
//         cardNonceResponseReceived: function (
//           errors: any,
//           nonce: any,
//           cardData: any
//         ) {
//           if (errors) {
//             console.error("Encountered errors:", errors);
//             return;
//           }

//           console.log("Nonce received:", nonce);
//           // Send nonce to your backend for payment processing
//           handlePayment(nonce);
//         },
//       },
//     });

//     paymentForm.build();
//   };

//   const handlePayment = async (nonce: any) => {
//     try {
//       const response = await fetch("http://localhost:3001/create-payment", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           sourceId: nonce,
//           amount: 1000, // Amount in cents (e.g., $10.00 = 1000 cents)
//           name,
//           email,
//         }),
//       });

//       const data = await response.json();
//       console.log("Payment Success:", data);
//     } catch (error) {
//       console.error("Payment Error:", error);
//     }
//   };

//   const requestCardNonce = () => {
//     const paymentForm = window.SqPaymentForm.getInstance();
//     if (paymentForm) {
//       paymentForm.requestCardNonce();
//     }
//   };

//   return (
//     <div>
//       <h2>Square Payment Form</h2>
//       <div id="form-container">
//         {/* Additional Input Fields */}
//         <div>
//           <label htmlFor="name">Full Name</label>
//           <input
//             type="text"
//             id="name"
//             placeholder="Enter your full name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//           />
//         </div>
//         <div>
//           <label htmlFor="email">Email</label>
//           <input
//             type="email"
//             id="email"
//             placeholder="Enter your email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </div>

//         {/* Square Payment Form Fields */}
//         <div id="sq-card-number"></div>
//         <div id="sq-expiration-date"></div>
//         <div id="sq-cvv"></div>
//         <div id="sq-postal-code"></div>
//       </div>

//       <button onClick={requestCardNonce}>Pay</button>
//     </div>
//   );
// };

// export default SquarePayment;

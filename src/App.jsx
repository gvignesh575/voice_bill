import "regenerator-runtime/runtime";
import "./App.css";

import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useEffect, useState } from "react";

const App = () => {
  const [items, setItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true, language: "en-US" }); // Set language to English (United States)
  const { transcript, browserSupportsSpeechRecognition, resetTranscript } =
    useSpeechRecognition();

  useEffect(() => {
    calculateTotalPrice();
  }, [items]);

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  const parseTranscript = () => {
    if (!transcript) {
      return;
    }
    // Regular expression to match English language input
    const newItemRegex = /([a-zA-Z\s]+)\s(\d+)\srupees\s(\w+)/g;
    let match;
    const newItems = [];
    while ((match = newItemRegex.exec(transcript)) !== null) {
      const itemName = match[1].trim();
      const price = parseInt(match[2]);
      let quantity;
      if (match[3] === 'to' || isNaN(match[3])) { // Handle "to" or if it's not a number
        quantity = 2;
      } else {
        quantity = parseInt(match[3]);
      }
      const totalPriceForItem = price * quantity;
      newItems.push({ itemName, price, quantity, totalPriceForItem });
    }
    setItems(newItems);
  };

  // Function to handle complete recording
  const handleCompleteRecording = () => {
    SpeechRecognition.stopListening();
    parseTranscript();
    resetTranscript(); // Reset transcript after processing
  };

  // Function to calculate total price
  const calculateTotalPrice = () => {
    let total = 0;
    items.forEach((item) => {
      total += item.totalPriceForItem;
    });
    setTotalPrice(total);
  };

  // Function to handle printing
  const handlePrint = () => {
    // Implement printing logic here
  };

  return (
    <>
      <div>
        <div>{transcript}</div>
        <div>
          <button onClick={startListening}>Start Listening</button>
          <button onClick={handleCompleteRecording}>Stop Listening</button>
        </div>
        <button onClick={handlePrint}>Print</button>
        <table>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Price</th>
              <th>No of Items</th>
              <th>Total Price</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>{item.itemName}</td>
                <td>{item.price}</td>
                <td>{item.quantity}</td>
                <td>{item.totalPriceForItem}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3">Total</td>
              <td>{totalPrice}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
};

export default App;





// import React, { useState, useEffect } from 'react';
// import { useSpeechRecognition } from 'react-speech-recognition';

// function App() {
//   const [items, setItems] = useState([]);
//   const [totalPrice, setTotalPrice] = useState(0);
//   const [transcript, setTranscript] = useState('');

//   // Hook for speech recognition
//   const { resetTranscript, startListening, listening } = useSpeechRecognition({
//     onResult: (result) => {
//       const newTranscript = result[0].transcript;
//       setTranscript(newTranscript);
//     }
//   });

//   // Function to parse the transcript and update items state
//   const parseTranscript = () => {
//     const newItemRegex = /([a-zA-Z\s]+)\s(\d+)\srupees\s(\d+)/g;
//     let match;
//     const newItems = [];
//     while ((match = newItemRegex.exec(transcript)) !== null) {
//       const itemName = match[1].trim();
//       const price = parseInt(match[2]);
//       const quantity = parseInt(match[3]);
//       const totalPriceForItem = price * quantity;
//       newItems.push({ itemName, price, quantity, totalPriceForItem });
//     }
//     setItems(newItems);
//   };

//   // Function to handle complete recording
//   const handleCompleteRecording = () => {
//     parseTranscript();
//     resetTranscript(); // Reset transcript after processing
//   };

//   // Function to handle start recording
//   const handleStartRecording = () => {
//     startListening();
//   };

//   // Function to calculate total price
//   const calculateTotalPrice = () => {
//     let total = 0;
//     items.forEach(item => {
//       total += item.totalPriceForItem;
//     });
//     setTotalPrice(total);
//   };

//   // Update total price whenever items state changes
//   useEffect(() => {
//     calculateTotalPrice();
//   }, [items]);

//   // Function to handle printing
//   const handlePrint = () => {
//     // Implement printing logic here
//   };

//   return (
//     <div>
//       <button onClick={handleStartRecording} disabled={listening}>Start Recording</button>
//       <button onClick={handleCompleteRecording}>Complete</button>
//       <button onClick={handlePrint}>Print</button>
//       <table>
//         <thead>
//           <tr>
//             <th>Item Name</th>
//             <th>Price</th>
//             <th>No of Items</th>
//             <th>Total Price</th>
//           </tr>
//         </thead>
//         <tbody>
//           {items.map((item, index) => (
//             <tr key={index}>
//               <td>{item.itemName}</td>
//               <td>{item.price}</td>
//               <td>{item.quantity}</td>
//               <td>{item.totalPriceForItem}</td>
//             </tr>
//           ))}
//         </tbody>
//         <tfoot>
//           <tr>
//             <td colSpan="3">Total</td>
//             <td>{totalPrice}</td>
//           </tr>
//         </tfoot>
//       </table>
//     </div>
//   );
// }

// export default App;

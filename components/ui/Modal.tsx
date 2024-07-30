import React, { useState } from 'react';
import SimpleQRCode from './QrCode';
import { toast } from 'react-toastify'; // Import toast for notifications

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export default function Modal({ isOpen, onClose, onSubmit }: ModalProps) {
  const [showQRCode, setShowQRCode] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<string>('pending');
  const [loading, setLoading] = useState<boolean>(false); // New state for loading

  const handleSubmit = () => {
    setShowQRCode(true);
    onSubmit();
  };

  const handleCloseQRCode = () => {
    setShowQRCode(false);
    setPaymentStatus('pending');
    setLoading(false); // Reset loading state
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      {paymentStatus  === 'pending'  && (
        <div className="bg-white p-4 rounded shadow-lg">
        {!showQRCode ? (
          <>
            <h2 className="text-xl mb-4">Buy Credits</h2>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border p-2 mb-4 w-full"
              placeholder="Enter USDC amount"
            />
            <button onClick={handleSubmit} className="bg-blue-500 text-white p-2 rounded">Submit</button>
            <button onClick={onClose} className="bg-gray-500 text-white p-2 rounded ml-2">Cancel</button>
          </>
        ) : (
          <div className="flex flex-col items-center">
            
              <SimpleQRCode input={amount} setPaymentStatus={setPaymentStatus} setLoading={setLoading} loading={false} paymentStatus={''} />
            {/* <p className="mt-4">Payment Status: {paymentStatus}</p>
            <button onClick={handleCloseQRCode} className="bg-gray-500 text-white p-2 rounded mt-4">Close</button> */}
          </div>
        )}
      </div>
      )}
    </div>
  );
}

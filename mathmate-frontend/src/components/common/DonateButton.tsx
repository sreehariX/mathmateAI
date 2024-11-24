import React, { useState } from 'react';
import { Heart, DollarSign, X } from 'lucide-react';

export const DonateButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openPaymentWindow = () => setIsOpen(true);
  const closePaymentWindow = () => setIsOpen(false);

  return (
    <>
      <button
        onClick={openPaymentWindow}
        className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
      >
        <Heart className="w-4 h-4" />
        
        <span className="font-medium">Donate</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-[95%] max-w-4xl mx-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-semibold">Support MathMate</h2>
              <button
                onClick={closePaymentWindow}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <iframe
                src="https://rzp.io/rzp/ru2JUYS"
                className="w-full h-[600px] md:h-[700px]"
                frameBorder="0"
                title="Payment"
                allow="payment"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
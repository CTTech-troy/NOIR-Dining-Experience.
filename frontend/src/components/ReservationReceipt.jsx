import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, AlertCircle, CreditCard, Send, DollarSign } from "lucide-react";
import { logger } from "../utils/logger";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

export default function ReservationReceipt({ reservation, onClose, onPaymentComplete }) {
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [email, setEmail] = useState(reservation?.email || "");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    holderName: ""
  });
  const [copiedField, setCopiedField] = useState(null);

  if (!reservation) return null;

  // Calculate total amount (example: base $50 + $15 per person)
  const baseAmount = 50;
  const perPersonAmount = 15;
  const totalAmount = baseAmount + perPersonAmount * reservation.numGuests;

  // Handle copy to clipboard
  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Handle card input
  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cardNumber") {
      formattedValue = value.replace(/\s/g, "").replace(/(\d{4})/g, "$1 ").trim();
    }

    setCardDetails(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  // Process card payment
  const handleCardPayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      logger.log("💳 Processing card payment...");

      // Update reservation with email before payment
      if (email && email !== reservation.email) {
        reservation.email = email;
      }

      const response = await fetch(`${BACKEND_URL}/payment/process-card`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reservationId: reservation.id,
          email: email,
          cardDetails: {
            cardNumber: cardDetails.cardNumber.replace(/\s/g, ""),
            expiryMonth: cardDetails.expiryMonth,
            expiryYear: cardDetails.expiryYear,
            cvv: cardDetails.cvv,
            holderName: cardDetails.holderName
          },
          amount: totalAmount,
          currency: "USD"
        })
      });

      const data = await response.json();

      if (data.success) {
        logger.log("✅ Payment successful!");
        setPaymentStatus({
          success: true,
          message: `✅ Payment successful! Transaction ID: ${data.transactionId}`,
          paymentId: data.paymentId
        });
        setTimeout(() => {
          onPaymentComplete({ method: "card", paymentId: data.paymentId });
        }, 2000);
      } else {
        setPaymentStatus({
          success: false,
          message: data.error || "Payment failed"
        });
      }
    } catch (error) {
      logger.error("❌ Card payment error:", error);
      setPaymentStatus({
        success: false,
        message: "Failed to process payment. Please try again."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle bank transfer confirmation
  const handleBankTransfer = async () => {
    setIsProcessing(true);

    try {
      logger.log("🏦 Recording bank transfer payment...");

      const response = await fetch(`${BACKEND_URL}/payment/confirm-offline`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reservationId: reservation.id,
          method: "bank_transfer",
          notes: "Payment pending verification"
        })
      });

      const data = await response.json();

      if (data.success) {
        logger.log("✅ Bank transfer recorded!");
        setPaymentStatus({
          success: true,
          message: data.message,
          paymentId: data.paymentId
        });
        setTimeout(() => {
          onPaymentComplete({ method: "bank_transfer", paymentId: data.paymentId });
        }, 2000);
      } else {
        setPaymentStatus({
          success: false,
          message: data.error || "Failed to record payment"
        });
      }
    } catch (error) {
      logger.error("❌ Bank transfer error:", error);
      setPaymentStatus({
        success: false,
        message: "Failed to record payment. Please try again."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle CashApp confirmation
  const handleCashApp = async () => {
    setIsProcessing(true);

    try {
      logger.log("💰 Recording CashApp payment...");

      const response = await fetch(`${BACKEND_URL}/payment/confirm-offline`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reservationId: reservation.id,
          method: "cashapp",
          notes: "Payment pending verification"
        })
      });

      const data = await response.json();

      if (data.success) {
        logger.log("✅ CashApp recorded!");
        setPaymentStatus({
          success: true,
          message: data.message,
          paymentId: data.paymentId
        });
        setTimeout(() => {
          onPaymentComplete({ method: "cashapp", paymentId: data.paymentId });
        }, 2000);
      } else {
        setPaymentStatus({
          success: false,
          message: data.error || "Failed to record payment"
        });
      }
    } catch (error) {
      logger.error("❌ CashApp error:", error);
      setPaymentStatus({
        success: false,
        message: "Failed to record payment. Please try again."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-2 sm:p-4"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-dark-200 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gold-400/30"
      >
        {/* Header */}
        <div className="sticky top-0 bg-dark-300 border-b border-gold-400/30 px-4 sm:px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gold-400">
            📋 Reservation Receipt & Payment
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Email Input Section */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.05 }}
            className="border border-gold-400/20 rounded-lg p-4 bg-dark-300/50"
          >
            <h3 className="text-lg font-bold text-gold-400 mb-4">📧 Email Confirmation</h3>
            <p className="text-sm text-gray-400 mb-3">Enter your email to receive a detailed confirmation with all reservation details:</p>
            <input
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-dark-300 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500 focus:border-gold-400 outline-none transition"
            />
          </motion.section>

          {/* Reservation Details */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="border border-gold-400/20 rounded-lg p-4 bg-dark-300/50"
          >
            <h3 className="text-lg font-bold text-gold-400 mb-4">📝 Reservation Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DetailRow label="Reservation ID" value={reservation.id} />
              <DetailRow label="Guest Name" value={reservation.customerName} />
              <DetailRow label="Number of Guests" value={reservation.numGuests} />
              <DetailRow label="Date" value={reservation.date} />
              <DetailRow label="Time" value={reservation.time} />
              <DetailRow label="Table Number" value={`Table ${reservation.tableId}`} />
              <DetailRow label="Table Location" value={reservation.tableLocation} />
              <DetailRow label="Status" value={reservation.status.toUpperCase()} />
            </div>
          </motion.section>

          {/* Price Breakdown */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="border border-gold-400/20 rounded-lg p-4 bg-dark-300/50"
          >
            <h3 className="text-lg font-bold text-gold-400 mb-4">💰 Price Breakdown</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-300">
                <span>Reservation Fee</span>
                <span>${baseAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Per Guest ({reservation.numGuests} × $15)</span>
                <span>${(perPersonAmount * reservation.numGuests).toFixed(2)}</span>
              </div>
              <div className="border-t border-gold-400/20 pt-2 flex justify-between text-lg font-bold text-gold-400">
                <span>Total Amount Due</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </motion.section>

          {/* Payment Status Message */}
          <AnimatePresence>
            {paymentStatus && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-4 rounded-lg border flex gap-3 ${
                  paymentStatus.success
                    ? "bg-green-500/20 border-green-500/50 text-green-200"
                    : "bg-red-500/20 border-red-500/50 text-red-200"
                }`}
              >
                {paymentStatus.success ? (
                  <Check size={20} className="flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-semibold">{paymentStatus.message}</p>
                  {paymentStatus.paymentId && (
                    <p className="text-sm opacity-75 mt-1">Payment ID: {paymentStatus.paymentId}</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Payment Method Selection */}
          {!paymentStatus?.success && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="border border-gold-400/20 rounded-lg p-4 bg-dark-300/50"
            >
              <h3 className="text-lg font-bold text-gold-400 mb-4">💳 Payment Method</h3>
              <div className="space-y-3">
                {/* Card Payment */}
                <button
                  onClick={() => setPaymentMethod("card")}
                  className={`w-full p-3 rounded-lg border-2 transition text-left ${
                    paymentMethod === "card"
                      ? "border-gold-400 bg-gold-400/10"
                      : "border-gray-600 hover:border-gold-400/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="text-gold-400" size={20} />
                    <div>
                      <p className="font-semibold text-white">💳 Credit/Debit Card</p>
                      <p className="text-sm text-gray-400">Instant payment processing</p>
                    </div>
                  </div>
                </button>

                {/* CashApp Payment */}
                <button
                  onClick={() => setPaymentMethod("cashapp")}
                  className={`w-full p-3 rounded-lg border-2 transition text-left ${
                    paymentMethod === "cashapp"
                      ? "border-gold-400 bg-gold-400/10"
                      : "border-gray-600 hover:border-gold-400/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <DollarSign className="text-green-400" size={20} />
                    <div>
                      <p className="font-semibold text-white">💰 CashApp</p>
                      <p className="text-sm text-gray-400">Send to our CashApp tag</p>
                    </div>
                  </div>
                </button>

                {/* Bank Transfer Payment */}
                <button
                  onClick={() => setPaymentMethod("bank_transfer")}
                  className={`w-full p-3 rounded-lg border-2 transition text-left ${
                    paymentMethod === "bank_transfer"
                      ? "border-gold-400 bg-gold-400/10"
                      : "border-gray-600 hover:border-gold-400/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Send className="text-blue-400" size={20} />
                    <div>
                      <p className="font-semibold text-white">🏦 Bank Transfer</p>
                      <p className="text-sm text-gray-400">1-3 business days</p>
                    </div>
                  </div>
                </button>
              </div>
            </motion.section>
          )}

          {/* Payment Method Details */}
          <AnimatePresence>
            {paymentMethod === "card" && !paymentStatus?.success && (
              <motion.form
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                onSubmit={handleCardPayment}
                className="border border-gold-400/20 rounded-lg p-4 bg-dark-300/50 space-y-4"
              >
                <h3 className="text-lg font-bold text-gold-400 mb-4">💳 Card Details</h3>

                {/* Card Number */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardDetails.cardNumber}
                    onChange={handleCardInputChange}
                    maxLength="19"
                    required
                    className="w-full bg-dark-300 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500 focus:border-gold-400 outline-none transition"
                  />
                  <p className="text-xs text-gray-500 mt-1">Demo: Use any 16-digit number</p>
                </div>

                {/* Expiry and CVV */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Month</label>
                    <select
                      name="expiryMonth"
                      value={cardDetails.expiryMonth}
                      onChange={handleCardInputChange}
                      required
                      className="w-full bg-dark-300 border border-gray-600 rounded px-2 py-2 text-white focus:border-gold-400 outline-none transition"
                    >
                      <option value="">MM</option>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                          {String(i + 1).padStart(2, "0")}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Year</label>
                    <select
                      name="expiryYear"
                      value={cardDetails.expiryYear}
                      onChange={handleCardInputChange}
                      required
                      className="w-full bg-dark-300 border border-gray-600 rounded px-2 py-2 text-white focus:border-gold-400 outline-none transition"
                    >
                      <option value="">YY</option>
                      {Array.from({ length: 10 }, (_, i) => {
                        const year = new Date().getFullYear() + i;
                        return (
                          <option key={year} value={String(year).slice(-2)}>
                            {String(year).slice(-2)}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      placeholder="123"
                      value={cardDetails.cvv}
                      onChange={handleCardInputChange}
                      maxLength="4"
                      required
                      className="w-full bg-dark-300 border border-gray-600 rounded px-2 py-2 text-white placeholder-gray-500 focus:border-gold-400 outline-none transition"
                    />
                  </div>
                </div>

                {/* Holder Name */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Cardholder Name</label>
                  <input
                    type="text"
                    name="holderName"
                    placeholder="John Doe"
                    value={cardDetails.holderName}
                    onChange={handleCardInputChange}
                    required
                    className="w-full bg-dark-300 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500 focus:border-gold-400 outline-none transition"
                  />
                </div>

                {/* Amount Display */}
                <div className="bg-dark-400/50 rounded p-3 border border-gold-400/20">
                  <p className="text-sm text-gray-400">Amount to be charged</p>
                  <p className="text-2xl font-bold text-gold-400">${totalAmount.toFixed(2)}</p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-gold-400 hover:bg-gold-500 disabled:bg-gray-600 text-dark-100 font-bold py-3 rounded-lg transition"
                >
                  {isProcessing ? "Processing..." : `Pay $${totalAmount.toFixed(2)}`}
                </button>
              </motion.form>
            )}

            {paymentMethod === "cashapp" && !paymentStatus?.success && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="border border-gold-400/20 rounded-lg p-4 bg-dark-300/50 space-y-4"
              >
                <h3 className="text-lg font-bold text-gold-400 mb-4">💰 CashApp Instructions</h3>

                <div className="bg-dark-400/50 rounded p-4 border border-gold-400/20 space-y-3">
                  <div>
                    <p className="text-sm text-gray-400 mb-2">CashApp Tag:</p>
                    <div className="flex items-center gap-2">
                      <code className="bg-dark-300 px-3 py-2 rounded text-gold-400 font-mono flex-1">
                        $noir-restaurant
                      </code>
                      <button
                        onClick={() => copyToClipboard("$noir-restaurant", "cashapp")}
                        className="bg-gold-400/20 hover:bg-gold-400/30 p-2 rounded transition"
                      >
                        {copiedField === "cashapp" ? (
                          <Check size={18} className="text-green-400" />
                        ) : (
                          <Copy size={18} className="text-gold-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400 mb-2">Amount to Send:</p>
                    <p className="text-2xl font-bold text-gold-400">${totalAmount.toFixed(2)}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400 mb-2">In the message, include:</p>
                    <code className="bg-dark-300 px-3 py-2 rounded text-gold-400 font-mono block">
                      {reservation.id}
                    </code>
                  </div>

                  <div className="bg-blue-500/20 border border-blue-500/50 rounded p-3 text-sm text-blue-200">
                    ℹ️ Payment confirmation will be instant
                  </div>
                </div>

                <button
                  onClick={handleCashApp}
                  disabled={isProcessing}
                  className="w-full bg-gold-400 hover:bg-gold-500 disabled:bg-gray-600 text-dark-100 font-bold py-3 rounded-lg transition"
                >
                  {isProcessing ? "Recording..." : "Confirm Payment Sent"}
                </button>
              </motion.div>
            )}

            {paymentMethod === "bank_transfer" && !paymentStatus?.success && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="border border-gold-400/20 rounded-lg p-4 bg-dark-300/50 space-y-4"
              >
                <h3 className="text-lg font-bold text-gold-400 mb-4">🏦 Bank Transfer Details</h3>

                <div className="space-y-3 bg-dark-400/50 rounded p-4">
                  <DetailRowCopyable
                    label="Account Name"
                    value="NOIR Fine Dining Restaurant"
                    field="account_name"
                  />
                  <DetailRowCopyable
                    label="Account Number"
                    value="1234567890"
                    field="account_number"
                  />
                  <DetailRowCopyable
                    label="Routing Number"
                    value="021000021"
                    field="routing_number"
                  />
                  <DetailRowCopyable
                    label="Bank Name"
                    value="International Bank"
                    field="bank_name"
                  />
                  <DetailRowCopyable
                    label="SWIFT Code"
                    value="IBUSUSBB"
                    field="swift"
                  />

                  <div className="border-t border-gold-400/20 pt-3">
                    <p className="text-sm text-gray-400 mb-2">Amount:</p>
                    <p className="text-2xl font-bold text-gold-400">${totalAmount.toFixed(2)}</p>
                  </div>

                  <div className="border-t border-gold-400/20 pt-3">
                    <p className="text-sm text-gray-400 mb-2">Reference/Memo (Important):</p>
                    <code className="bg-dark-300 px-3 py-2 rounded text-gold-400 font-mono block">
                      {reservation.id}
                    </code>
                  </div>
                </div>

                <div className="bg-orange-500/20 border border-orange-500/50 rounded p-3 text-sm text-orange-200">
                  ⏱️ Transfer verification usually takes 1-3 business days
                </div>

                <button
                  onClick={handleBankTransfer}
                  disabled={isProcessing}
                  className="w-full bg-gold-400 hover:bg-gold-500 disabled:bg-gray-600 text-dark-100 font-bold py-3 rounded-lg transition"
                >
                  {isProcessing ? "Recording..." : "Confirm Payment Initiated"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pay at Venue Option */}
          {!paymentStatus?.success && !paymentMethod && (
            <div className="border border-gray-600 rounded-lg p-4 bg-dark-300/50">
              <p className="text-sm text-gray-400">
                💡 You can also pay when you arrive at the venue. Just mention your reservation ID: <span className="text-gold-400 font-mono">{reservation.id}</span>
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// Helper component for detail rows
function DetailRow({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-400 mb-1">{label}</p>
      <p className="text-white font-semibold">{value}</p>
    </div>
  );
}

// Helper component for copyable detail rows
function DetailRowCopyable({ label, value, field }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-400 mb-1">{label}</p>
        <p className="text-white font-mono text-sm">{value}</p>
      </div>
      <button
        onClick={handleCopy}
        className="text-gray-400 hover:text-gold-400 transition p-2"
      >
        {copied ? (
          <Check size={18} className="text-green-400" />
        ) : (
          <Copy size={18} />
        )}
      </button>
    </div>
  );
}

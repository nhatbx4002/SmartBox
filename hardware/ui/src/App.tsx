import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomeScreen from "./components/HomeScreen";
import InputPhoneScreen from "./components/InputPhoneScreen";
import SizeSelectScreen from "./components/SizeSelectScreen";
import InputOTPScreen from "./components/InputOTPScreen";
import SupportScreen from "./components/SupportScreen";
import RentScreen from "./components/RentScreen";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route path="/" element={<HomeScreen />} />

        {/* Deposit: phone → size select → OTP */}
        <Route path="/deposit" element={<InputPhoneScreen type="deposit" />} />
        <Route path="/size" element={<SizeSelectScreen />} />

        {/* Pickup: phone → OTP */}
        <Route path="/pickup" element={<InputPhoneScreen type="pickup" />} />

        {/* Shared OTP verify (type = deposit | pickup | rent) */}
        <Route path="/otp/:type" element={<InputOTPScreen />} />

        {/* Rent long-term */}
        <Route path="/rent" element={<RentScreen />} />

        {/* Support / FAQ */}
        <Route path="/support" element={<SupportScreen />} />

        {/* Fallback → home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

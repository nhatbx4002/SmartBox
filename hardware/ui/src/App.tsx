import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomeScreen from "./components/HomeScreen";
import InputOTPScreen from "./components/InputOTPScreen";
import SupportScreen from "./components/SupportScreen";
import RentScreen from "./components/RentScreen";
import RentPhoneScreen from "./components/RentPhoneScreen";
import PaymentScreen from "./components/PaymentScreen";
import RentSuccessScreen from "./components/RentSuccessScreen";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />

        {/* Gửi / Nhận hàng */}
        <Route path="/otp/:type" element={<InputOTPScreen />} />

        {/* Rent flow */}
        <Route path="/rent" element={<RentScreen />} />
        <Route path="/rent-phone" element={<RentPhoneScreen />} />
        <Route path="/payment" element={<PaymentScreen />} />
        <Route path="/rent-locker" element={<RentSuccessScreen />} />

        {/* Support */}
        <Route path="/support" element={<SupportScreen />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

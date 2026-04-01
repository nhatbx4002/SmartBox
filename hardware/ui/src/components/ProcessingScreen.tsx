import { useEffect, useState } from "react";
import KioskLayout from "./KioskLayout";
import "./ProcessingScreen.css";

interface Props {
  message?: string;
  sub?: string;
  nextPath?: string;
  type?: "deposit" | "pickup" | "rent";
  step?: number;
  totalSteps?: number;
}

export default function ProcessingScreen({
  message = "ĐANG XỬ LÝ...",
  sub = "Vui lòng chờ trong giây lát",
  type = "deposit",
  step = 1,
  totalSteps = 3,
}: Props) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + Math.random() * 12 + 4;
      });
    }, 180);
    return () => clearInterval(interval);
  }, []);

  const icons: Record<string, string> = {
    deposit: "📥",
    pickup: "📤",
    rent: "🔒",
  };

  return (
    <KioskLayout>
      <div className="proc-root">
        <div className="proc-card">
          <div className="proc-icon-wrap">
            <span className="proc-icon">{icons[type]}</span>
          </div>

          <div className="proc-spinner" />

          <div className="proc-msg">{message}</div>
          <div className="proc-sub">{sub}</div>

          {/* Progress bar */}
          <div className="proc-progress-track">
            <div
              className="proc-progress-fill"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="proc-pct">{Math.round(Math.min(progress, 100))}%</div>

          {/* Steps */}
          <div className="proc-steps">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`proc-step ${i < step ? "done" : i === step ? "active" : ""}`}
              >
                {i < step ? "✓" : i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
    </KioskLayout>
  );
}

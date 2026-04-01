export type LockerSize = "small" | "medium" | "large" | "xlarge";
export type LockerStatus = "available" | "occupied" | "reserved" | "maintenance" | "error";

export interface Locker {
  id: string;
  name: string;
  size: LockerSize;
  status: LockerStatus;
  occupantPhone?: string;
  depositTime?: Date;
  expiryTime?: Date;
  packageId?: string;
}

export interface LockerConfig {
  rows: number;
  cols: number;
  lockers: Locker[];
  availableSmall: number;
  availableMedium: number;
  availableLarge: number;
  availableXlarge: number;
  totalOccupied: number;
  totalAvailable: number;
  revenueToday: number;
  deliveriesToday: number;
}

export interface Transaction {
  id: string;
  type: "deposit" | "pickup";
  phone: string;
  lockerId: string;
  size: LockerSize;
  time: Date;
  status: "success" | "failed" | "cancelled";
}

export interface ScreenFlow {
  type:
    | "home"
    | "deposit"
    | "deposit-phone"
    | "deposit-size"
    | "deposit-otp"
    | "deposit-confirm"
    | "pickup"
    | "pickup-phone"
    | "pickup-otp"
    | "pickup-confirm"
    | "admin"
    | "settings";
  title: string;
  subtitle?: string;
}

export const LOCKER_SIZE_LABELS: Record<LockerSize, string> = {
  small: "Nhỏ (20x30x40cm)",
  medium: "Vừa (30x40x50cm)",
  large: "Lớn (40x50x60cm)",
  xlarge: "Rất lớn (50x60x80cm)",
};

export const LOCKER_SIZE_PRICES: Record<LockerSize, number> = {
  small: 5000,
  medium: 10000,
  large: 15000,
  xlarge: 20000,
};

export const LOCKER_SIZE_COLORS: Record<LockerSize, string> = {
  small: "#3B82F6",
  medium: "#8B5CF6",
  large: "#F59E0B",
  xlarge: "#EF4444",
};

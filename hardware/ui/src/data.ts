import type { Locker, Transaction } from "./types";

export const generateLockers = (): Locker[] => {
  const sizes: Locker["size"][] = [
    "small", "small", "small", "small",
    "medium", "medium", "medium",
    "large", "large",
    "xlarge",
  ];

  const statuses: Locker["status"][] = [
    "available", "available", "available", "available", "available",
    "occupied", "occupied", "occupied", "occupied",
    "reserved",
    "maintenance",
    "error",
  ];

  return Array.from({ length: 12 }, (_, i) => {
    const status = i < 5 ? "available" : statuses[i % statuses.length];
    const isOccupied = status === "occupied";

    return {
      id: `L${String(i + 1).padStart(2, "0")}`,
      name: `Tủ ${i + 1}`,
      size: sizes[i % sizes.length],
      status,
      occupantPhone: isOccupied ? `090${String(Math.floor(Math.random() * 9000000 + 1000000))}` : undefined,
      depositTime: isOccupied ? new Date(Date.now() - Math.random() * 36000000) : undefined,
      expiryTime: isOccupied ? new Date(Date.now() + Math.random() * 86400000) : undefined,
      packageId: isOccupied ? `PKG${String(Math.floor(Math.random() * 9000 + 1000))}` : undefined,
    };
  });
};

export const mockTransactions: Transaction[] = [
  {
    id: "TX001",
    type: "deposit",
    phone: "0901234567",
    lockerId: "L01",
    size: "medium",
    time: new Date(Date.now() - 3600000),
    status: "success",
  },
  {
    id: "TX002",
    type: "pickup",
    phone: "0902345678",
    lockerId: "L05",
    size: "large",
    time: new Date(Date.now() - 7200000),
    status: "success",
  },
  {
    id: "TX003",
    type: "deposit",
    phone: "0903456789",
    lockerId: "L03",
    size: "small",
    time: new Date(Date.now() - 10800000),
    status: "success",
  },
  {
    id: "TX004",
    type: "deposit",
    phone: "0904567890",
    lockerId: "L08",
    size: "xlarge",
    time: new Date(Date.now() - 14400000),
    status: "failed",
  },
];

export const getStats = (lockers: Locker[]) => ({
  total: lockers.length,
  available: lockers.filter((l) => l.status === "available").length,
  occupied: lockers.filter((l) => l.status === "occupied").length,
  reserved: lockers.filter((l) => l.status === "reserved").length,
  maintenance: lockers.filter((l) => l.status === "maintenance").length,
  error: lockers.filter((l) => l.status === "error").length,
  revenueToday: 85000,
  deliveriesToday: 12,
  pickupsToday: 8,
});

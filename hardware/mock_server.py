#!/usr/bin/env python3
"""
mock_server.py — Fake SmartBox backend for local testing

Run:
    pip install flask flask-cors
    python mock_server.py

Base URL: http://localhost:5000/api
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import random
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

# ── In-memory store ──────────────────────────────────────
rentals_db = {}   # rentalId -> rental data
lockers    = {
    "A1": {"size": "SMALL",  "status": "CLOSED", "rentalId": None},
}


# ── Helpers ───────────────────────────────────────────────
def gen_pin():
    return str(random.randint(100000, 999999))

def find_available(size):
    for lid, info in lockers.items():
        if info["size"] == size and info["rentalId"] is None:
            return lid
    return None


# ─────────────────────────────────────────────────────────
# OTP — verify pin
# ─────────────────────────────────────────────────────────
@app.route("/api/auth/verify-pin", methods=["POST"])
def verify_pin():
    data = request.get_json() or {}
    pin  = str(data.get("pin", "")).strip()
    flow = data.get("type", "receive")   # "send" | "receive"

    print(f"[MOCK] verify-pin  pin={pin}  type={flow}")

    # Demo: any 6-digit pin works
    if len(pin) != 6 or not pin.isdigit():
        return jsonify({"authorized": False, "error": "Mã không hợp lệ"}), 401

    compartment = find_available("SMALL") or "A1"

    return jsonify({
        "authorized":    True,
        "compartmentId": compartment,
        "openCount":     0,
    })


# ─────────────────────────────────────────────────────────
# Lockers — check availability
# ─────────────────────────────────────────────────────────
@app.route("/api/lockers/available", methods=["GET"])
def lockers_available():
    size = request.args.get("size", "SMALL")
    print(f"[MOCK] lockers/available  size={size}")

    available = [lid for lid, info in lockers.items()
                 if info["size"] == size and info["rentalId"] is None]

    return jsonify({
        "available":   len(available) > 0,
        "compartments": available,
    })


# ─────────────────────────────────────────────────────────
# Rentals — create rental
# ─────────────────────────────────────────────────────────
@app.route("/api/rentals", methods=["POST"])
def create_rental():
    data = request.get_json() or {}
    phone  = data.get("phone", "")
    size   = data.get("size", "SMALL")
    plan   = data.get("plan", "on_demand")
    print(f"[MOCK] create-rental  phone={phone}  size={size}  plan={plan}")

    compartment = find_available(size)
    if not compartment:
        return jsonify({"error": "Không có tủ trống"}), 409

    # Plan durations
    durations = {
        "on_demand": timedelta(days=7),
        "multi":     timedelta(days=30),
        "monthly":   timedelta(days=30),
    }
    expires = datetime.utcnow() + durations.get(plan, timedelta(days=7))

    rental_id = f"rental_{random.randint(1000, 9999)}"
    pin       = gen_pin()

    rental = {
        "rentalId":     rental_id,
        "pin":          pin,
        "compartmentId": compartment,
        "size":         size,
        "plan":         plan,
        "phone":        phone,
        "expiresAt":    expires.isoformat() + "Z",
        "status":       "ACTIVE",
    }
    rentals_db[rental_id] = rental

    # Occupy locker
    lockers[compartment]["rentalId"] = rental_id

    return jsonify(rental), 201


# ─────────────────────────────────────────────────────────
# Lockers — open / close
# ─────────────────────────────────────────────────────────
@app.route("/api/lockers/<compartment_id>/open", methods=["POST"])
def open_locker(compartment_id):
    print(f"[MOCK] open-locker  compartment={compartment_id}")
    if compartment_id not in lockers:
        return jsonify({"error": "Không tìm thấy tủ"}), 404
    lockers[compartment_id]["status"] = "OPENED"
    return jsonify({"status": "OPENED"})


@app.route("/api/lockers/<compartment_id>/close", methods=["POST"])
def close_locker(compartment_id):
    print(f"[MOCK] close-locker  compartment={compartment_id}")
    if compartment_id not in lockers:
        return jsonify({"error": "Không tìm thấy tủ"}), 404
    lockers[compartment_id]["status"] = "CLOSED"
    return jsonify({"status": "CLOSED"})


# ─────────────────────────────────────────────────────────
# Lockers — status
# ─────────────────────────────────────────────────────────
@app.route("/api/lockers/<compartment_id>/status", methods=["GET"])
def locker_status(compartment_id):
    if compartment_id not in lockers:
        return jsonify({"error": "Không tìm thấy tủ"}), 404
    info = lockers[compartment_id]
    return jsonify({
        "status":   info["status"],
        "rentalId": info["rentalId"],
        "lastOpened": datetime.utcnow().isoformat() + "Z",
    })


# ─────────────────────────────────────────────────────────
# Rentals — get by pin
# ─────────────────────────────────────────────────────────
@app.route("/api/rentals/by-pin/<pin>", methods=["GET"])
def get_rental_by_pin(pin):
    for rental in rentals_db.values():
        if rental["pin"] == pin:
            return jsonify(rental)
    return jsonify({"error": "Không tìm thấy"}), 404


# ─────────────────────────────────────────────────────────
# Health check
# ─────────────────────────────────────────────────────────
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "time": datetime.utcnow().isoformat()})


# ─────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("=" * 50)
    print(" SmartBox Mock Server")
    print(" http://localhost:5000/api")
    print("=" * 50)
    app.run(host="0.0.0.0", port=5000, debug=True)

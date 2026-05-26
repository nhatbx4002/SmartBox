# SmartBox Provisioning Flow — Pi Discovery (Bottom-Up)

## 1. Cabinet First Boot: Pi Quét & Tự Khai Báo

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                         RASPBERRY PI (Fresh Install)                          │
│                                                                              │
│  HARDWARE CONNECTIONS (physical wiring):                                     │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                                                                       │ │
│  │   MCP23017 #1 (addr 0x20 = 32)          MCP23017 #2 (addr 0x21 = 33) │ │
│  │   ┌──[pin  0]── door sensor 1 ──────────┐  ┌──[pin  0]── lock 1    │ │
│  │   ├──[pin  1]── door sensor 2 ──────────┤  ├──[pin  1]── lock 2    │ │
│  │   ├──[pin  2]── door sensor 3 ──────────┤  ├──[pin  2]── lock 3    │ │
│  │   ├── ...                                │  ├── ...                 │ │
│  │   └──[pin  7]── door sensor 8 ──────────┘  └──[pin  7]── lock 8    │ │
│  │                                                                       │ │
│  │   Bus: I2C-1 (SDA=pin 3, SCL=pin 5 on GPIO header)                  │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  config.yaml (chỉ cần mấy cái này):                                        │
│    provision_key:    "xxx"        ← shared provisioning key                │
│    provision_secret: "yyy"        ← shared provisioning secret             │
│    location_id:       "uuid-1"    ← location tủ sẽ được lắp                │
│    cabinet_name:      "Tủ A - Tầng 1"                                     │
│    # KHÔNG cần biết trước pin nào nối ngăn nào                            │
└────────────────────────────────────┬─────────────────────────────────────────┘
                                     │
                                     │ 🔍 PI DISCOVERY (automatic)
                                     ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│  gpio_controller.py — tự quét phần cứng khi boot                           │
│                                                                              │
│  def discover_hardware():                                                    │
│      """Quét I2C bus và tự động nhận diện phần cứng"""                      │
│                                                                              │
│      1. SCAN I2C BUS                                                         │
│         ┌─────────────────────────────────────────────────────────────┐      │
│         │ import smbus2                                                │      │
│         │ bus = smbus2.SMBus(1)                                        │      │
│         │                                                             │      │
│         │ # Thử các địa chỉ MCP23017 phổ biến (0x20–0x27)             │      │
│         │ found_mcp_devices = []                                      │      │
│         │ for addr in range(0x20, 0x28):                              │      │
│         │     try:                                                     │      │
│         │         bus.read_byte(addr)  # quick test                   │      │
│         │         found_mcp_devices.append(addr)                       │      │
│         │     except:                                                  │      │
│         │         pass                                                  │      │
│         │                                                             │      │
│         │ # Kết quả: [32, 33]  (0x20, 0x21)                          │      │
│         └─────────────────────────────────────────────────────────────┘      │
│                                                                              │
│      2. AUTO-DETECT LOCK vs SENSOR (dựa trên pin mode)                      │
│         ┌─────────────────────────────────────────────────────────────┐      │
│         │ Vấn đề: Làm sao biết pin nào là lock, pin nào là sensor?    │      │
│         │                                                             │      │
│         │ Thu heuristic:                                              │      │
│         │   • Pin outputs (lock): set HIGH, đo dòng, relay click     │      │
│         │   • Pin inputs  (sensor): đọc GPIO input, detect NC/NO    │      │
│         │   • Hoặc: user cấu hình thủ công trong config.yaml          │      │
│         │     (vì đi dây thực tế cần người biết)                     │      │
│         │   • Hoặc: convention cố định → MCP #1 = SENSOR, #2 = LOCK  │      │
│         │                                                             │      │
│         │ Recommended approach (hybrid):                               │      │
│         │   config.yaml:                                              │      │
│         │     mcp_devices:                                             │      │
│         │       - bus: 1, address: 32, type: SENSOR, name: "MCP-SENSOR"│   │
│         │       - bus: 1, address: 33, type: LOCK,   name: "MCP-LOCK"  │   │
│         │   compartment_layout:                                        │      │
│         │     rows: 4                                                  │      │
│         │     cols: 6                                                  │      │
│         │     # Pin mapping: [lock_pin, sensor_pin] per compartment     │   │
│         │     # convention: col0→pin0, col1→pin1... hoặc explicit     │   │
│         │     pin_mapping: SEQUENTIAL  # or EXPLICIT: [[0,0],[1,1],...]│  │
│         │                                                             │      │
│         │ → Pi tự quét MCP, tự build compartment list dựa trên       │   │
│         │   mcp_devices + compartment_layout config                   │   │
│         └─────────────────────────────────────────────────────────────┘      │
│                                                                              │
│      3. BUILD COMPARTMENT LIST (từ config.yaml layout)                      │
│         ┌─────────────────────────────────────────────────────────────┐      │
│         │ compartment_layout: { rows: 4, cols: 6, sizes: [...] }    │      │
│         │ pin_mapping: SEQUENTIAL                                    │      │
│         │                                                             │      │
│         │ compartments = []                                           │      │
│         │ idx = 0                                                     │      │
│         │ for row in range(rows):                                     │      │
│         │   for col in range(cols):                                  │      │
│         │     name = f"{chr(65+row)}{col+1}"  # "A1", "A2", ... "D6"│      │
│         │     size = sizes[row][col]   # SMALL or LARGE             │      │
│         │     compartments.append({                                   │      │
│         │       "name": name,                                         │      │
│         │       "size": size,                                         │      │
│         │       "mcp23017PinLock": idx,        # lock MCP pin index   │      │
│         │       "mcp23017PinSensor": idx,      # sensor MCP pin index  │      │
│         │       "lockMcpDeviceAddress": 33,    # fixed LOCK MCP addr  │      │
│         │       "sensorMcpDeviceAddress": 32,  # fixed SENSOR MCP addr│      │
│         │     })                                                       │      │
│         │     idx += 1                                                │      │
│         │                                                             │      │
│         │ # 4 rows × 6 cols = 24 compartments                        │      │
│         │ # Pin 0-23 trên mỗi MCP                                    │      │
│         └─────────────────────────────────────────────────────────────┘      │
│                                                                              │
│      4. BUILD DISCOVERY PAYLOAD                                              │
│         ┌─────────────────────────────────────────────────────────────┐      │
│         │ {                                                           │      │
│         │   "provisionKey":    "xxx",                                 │      │
│         │   "provisionSecret":  "yyy",                                │      │
│         │   "hardwareSerial":   "RPI-ABC123",  # from /proc/cpuinfo │      │
│         │   "locationId":       "uuid-1",                             │      │
│         │   "cabinetName":      "Tủ A - Tầng 1",                      │      │
│         │   "discoveredMcpDevices": [                                 │      │
│         │     { "bus": 1, "address": 32, "type": "SENSOR", "name": "MCP-SENSOR", │
│         │       "pinsUsed": 24, "pinRange": "0-23" },                │      │
│         │     { "bus": 1, "address": 33, "type": "LOCK",   "name": "MCP-LOCK",   │
│         │       "pinsUsed": 24, "pinRange": "0-23" }                │      │
│         │   ],                                                         │      │
│         │   "compartments": [                                          │      │
│         │     { "name": "A1", "size": "SMALL",                        │      │
│         │       "mcp23017PinLock": 0,  "mcp23017PinSensor": 0,      │      │
│         │       "lockMcpDeviceAddress": 33,                           │      │
│         │       "sensorMcpDeviceAddress": 32 },                       │      │
│         │     { "name": "A2", "size": "SMALL",                        │      │
│         │       "mcp23017PinLock": 1,  "mcp23017PinSensor": 1,       │      │
│         │       "lockMcpDeviceAddress": 33,                           │      │
│         │       "sensorMcpDeviceAddress": 32 },                       │      │
│         │     ...  // total 24 compartments                           │      │
│         │   ],                                                         │      │
│         │   "totalCompartments": 24,                                  │      │
│         │   "firmwareVersion": "1.2.0",                                │      │
│         │   "piModel": "Raspberry Pi 3 Model B+"                      │      │
│         │ }                                                           │      │
│         └─────────────────────────────────────────────────────────────┘      │
└────────────────────────────────────┬─────────────────────────────────────────┘
                                     │
                                     │ POST /api/provisioning/discover
                                     ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                              BACKEND                                          │
│                                                                              │
│  5. VALIDATE + CREATE                                                        │
│     ┌────────────────────────────────────────────────────────────────────┐    │
│     │ 5a. Verify provisionKey + provisionSecret                         │    │
│     │     ❌ 401 → abort                                                │    │
│     │     ✅ continue                                                    │    │
│     │                                                                     │    │
│     │ 5b. Check strategy                                                 │    │
│     │     ALLOW_NEW:                                                     │    │
│     │       • hardwareSerial chưa tồn tại → CREATE NEW                  │    │
│     │       • hardwareSerial đã tồn tại → UPDATE + re-provision        │    │
│     │     CHECK_EXISTING:                                                 │    │
│     │       • cabinet với hardwareSerial + PENDING tồn tại → PROVISION  │    │
│     │       • không tìm thấy → 403                                      │    │
│     │                                                                     │    │
│     │ 5c. Prisma transaction:                                            │    │
│     │     ┌──────────────────────────────────────────────────────────┐  │    │
│     │     │ Cabinet.upsert({                                          │  │    │
│     │     │   where: { hardwareSerial },                             │  │    │
│     │     │   create: {                                              │  │    │
│     │     │     name, locationId, hardwareSerial,                  │  │    │
│     │     │     status: ACTIVE, provisionState: PROVISIONED         │  │    │
│     │     │   },                                                      │  │    │
│     │     │   update: { name, provisionState: PROVISIONED }         │  │    │
│     │     │ })                                                        │  │    │
│     │     │                                                           │  │    │
│     │     │ McpDevice.createMany({ ...discoveredMcpDevices })       │  │    │
│     │     │                                                           │  │    │
│     │     │ Compartment.createMany({ ...compartments })              │  │    │
│     │     │   → Map: lockMcpDeviceAddress → McpDevice.id              │  │    │
│     │     │   → Map: sensorMcpDeviceAddress → McpDevice.id            │  │    │
│     │     │                                                           │  │    │
│     │     │ ProvisioningLog.create({ action: "DISCOVERED", ... })   │  │    │
│     │     └──────────────────────────────────────────────────────────┘  │    │
│     │                                                                     │    │
│     │ 5d. Send webhook (nếu có)                                          │    │
│     │                                                                     │    │
│     │ 5e. Return:                                                        │    │
│     │     {                                                               │    │
│     │       cabinetId: "uuid-abc",                                      │    │
│     │       jwtToken: "eyJ...",                                          │    │
│     │       mqttConfig: { broker, username, password },                  │    │
│     │       confirmedCompartments: [...],   // với DB IDs thật         │    │
│     │       configVersion: 1                                             │    │
│     │     }                                                              │    │
│     └────────────────────────────────────────────────────────────────────┘    │
└────────────────────────────────────────┬─────────────────────────────────────┘
                                         │
                                         │ 200 { cabinetId, jwtToken, compartments_with_DB_ids }
                                         ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                              RASPBERRY PI (back)                              │
│                                                                              │
│  6. PERSIST CONFIG                                                           │
│     ┌────────────────────────────────────────────────────────────────────┐    │
│     │ config.yaml:                                                        │    │
│     │   cabinet_id:    "uuid-abc"      ← từ response                    │    │
│     │   jwt_token:     "eyJ..."        ← từ response                    │    │
│     │   mqtt_username: "cab-abc"        ← từ mqttConfig                 │    │
│     │   mqtt_password: "mqtt-pass"    ← từ mqttConfig                 │    │
│     │   config_version: 1              ← từ response                    │    │
│     │   # XÓA: provision_key, provision_secret  ← không cần nữa          │    │
│     └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  7. INIT GPIO + MQTT                                                         │
│     ┌────────────────────────────────────────────────────────────────────┐    │
│     │ # Pin map giờ có DB IDs thật (dùng confirmedCompartments)         │    │
│     │ pin_target_map = {                                                  │    │
│     │   "A1": { "db_id": "uuid-comp-A1", "bus": 1, "addr": 33, "pin": 0 },│  │
│     │   "A2": { "db_id": "uuid-comp-A2", "bus": 1, "addr": 33, "pin": 1 },│  │
│     │   ...                                                               │    │
│     │ }                                                                   │    │
│     │                                                                       │    │
│     │ # Init I2C + set pin directions                                    │    │
│     │ for addr, mcp_type in discovered_mcp_devices:                        │    │
│     │     bus.write_byte_data(addr, 0x00, 0x00)  # IODIRA = outputs (LOCK)│    │
│     │     bus.write_byte_data(addr, 0x01, 0xFF)  # IODIRB = inputs (SENS) │    │
│     │                                                                       │    │
│     │ mqtt_client.connect(username, password)                              │    │
│     │ mqtt_client.subscribe("smartbox/{cabinetId}/lock/+/unlock")          │    │
│     │ mqtt_client.subscribe("smartbox/{cabinetId}/config/reload")          │    │
│     │ mqtt_client.publish_heartbeat()                                      │    │
│     └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ✅ PROVISIONING COMPLETE — Normal operation begins                          │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Add Compartment — Pi tự detect pin mới & báo backend

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     ADD NEW COMPARTMENT (hardware-level)                     │
│                                                                             │
│  Admin muốn thêm 1 ngăn mới vào tủ đang chạy.                              │
│  Wiring mới:                                                               │
│    Lock pin mới:  MCP #2 (addr 33) pin 24                                  │
│    Sensor pin mới: MCP #1 (addr 32) pin 24                                │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ BƯỚC 1: Admin đi dây vật lý, cập nhật config.yaml trên Pi           │   │
│  │                                                                          │   │
│  │ config.yaml thêm:                                                       │   │
│  │   new_compartments:                                                     │   │
│  │     - name: "E1"                                                        │   │
│  │       size: SMALL                                                       │   │
│  │       mcp23017PinLock: 24                                               │   │
│  │       mcp23017PinSensor: 24                                             │   │
│  │       lockMcpDeviceAddress: 33                                          │   │
│  │       sensorMcpDeviceAddress: 32                                       │   │
│  │                                                                          │   │
│  │ HOẶC: Pi tự quét pin mới trên bus I2C (detect pin 24 available)        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                              │                                               │
│                              │ trigger hot-reload                           │
│                              ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ BƯỚC 2: Pi gửi discovery mới cho ngăn vừa thêm                       │   │
│  │                                                                          │   │
│  │ POST /api/provisioning/discover-compartments                           │   │
│  │ {                                                                       │   │
│  │   cabinetId: "uuid-abc",      ← từ config.yaml                        │   │
│  │   jwtToken: "eyJ...",         ← từ config.yaml                        │   │
│  │   newCompartments: [                                                     │   │
│  │     {                                                                   │   │
│  │       name: "E1",                                                        │   │
│  │       size: "SMALL",                                                     │   │
│  │       mcp23017PinLock: 24,                                              │   │
│  │       mcp23017PinSensor: 24,                                            │   │
│  │       lockMcpDeviceAddress: 33,                                         │   │
│  │       sensorMcpDeviceAddress: 32                                        │   │
│  │     }                                                                   │   │
│  │   ]                                                                      │   │
│  │ }                                                                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                              │                                               │
│                              ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ BACKEND: Validate + create compartment                                 │   │
│  │   • Verify cabinetId + JWT                                            │   │
│  │   • Check pin not already used by another compartment                 │   │
│  │   • Prisma create Compartment                                         │   │
│  │   • Increment Cabinet.configVersion                                    │   │
│  │   • Publish MQTT: smartbox/{cabinetId}/config/reload {version: 2}    │   │
│  │   • Webhook (optional)                                                │   │
│  │   • Return: { compartment with DB id, configVersion }                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                              │                                               │
│                              ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ PI receives: adds E1 to pin_target_map, init pin 24 on MCP           │   │
│  │ Pi now ready for new compartment ✓                                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Re-provisioning (Tủ bị lỗi, cần re-register)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        RE-PROVISIONING (Recovery)                            │
│                                                                             │
│  Tủ đang chạy → bị mất config.yaml → gọi lại /discover                     │
│  Tủ đang chạy → hardware thay đổi → gọi /discover để sync                  │
│                                                                             │
│  POST /api/provisioning/discover                                            │
│  {                                                                          │
│    provisionKey + provisionSecret  (hoặc jwtToken nếu còn)                  │
│    hardwareSerial: "RPI-ABC123"                                             │
│    // ... same discovery payload ...                                        │
│  }                                                                          │
│                                                                             │
│  Backend: upsert Cabinet (update)                                           │
│           diff compartments[] với DB hiện tại:                              │
│             • compartment mới trong payload → CREATE                        │
│             • compartment có trong DB nhưng không trong payload → DELETE   │
│             • compartment khác pin trong payload → UPDATE pin mapping       │
│             → Trả về diff report + new configVersion                        │
│                                                                             │
│  Pi receives: sync pin_target_map theo diff                                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. config.yaml — Minimal vs Full

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  MODE 1: PROVISIONING (first boot — chưa có cabinet_id)                     │
│  config.yaml                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ # === PROVISIONING MODE (sẽ bị xóa sau khi register thành công) ===  │   │
│  │ provision_key:    "sk-box-2024-prod"                                 │   │
│  │ provision_secret: "pss-xxx-yyy-zzz"                                  │   │
│  │                                                                              │   │
│  │ # === CABINET INFO ===                                                  │   │
│  │ location_id:   "uuid-location-1"                                       │   │
│  │ cabinet_name: "Tủ A - Tầng 1"                                         │   │
│  │                                                                              │   │
│  │ # === HARDWARE CONFIG (do người đi dây biết) ===                       │   │
│  │ mcp_devices:                                                            │   │
│  │   - bus: 1, address: 32, type: SENSOR, name: "MCP-SENSOR"             │   │
│  │   - bus: 1, address: 33, type: LOCK,   name: "MCP-LOCK"               │   │
│  │                                                                              │   │
│  │ compartment_layout:                                                     │   │
│  │   rows: 4                                                               │   │
│  │   cols: 6                                                               │   │
│  │   sizes: [                                                              │   │
│  │     [SMALL, SMALL, SMALL, SMALL, SMALL, SMALL],  # row A                │   │
│  │     [SMALL, SMALL, SMALL, SMALL, SMALL, SMALL],  # row B                │   │
│  │     [LARGE, LARGE, LARGE, LARGE, LARGE, LARGE],  # row C                │   │
│  │     [LARGE, LARGE, LARGE, LARGE, LARGE, LARGE],  # row D                │   │
│  │   ]                                                                     │   │
│  │                                                                              │   │
│  │ # === API & MQTT ===                                                     │   │
│  │ api_base_url:  "http://backend:3001"                                    │   │
│  │ mqtt_broker:   "mqtt://broker:1883"                                    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  MODE 2: NORMAL (sau khi register thành công — config.yaml đã update)        │
│  config.yaml                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ # === AFTER PROVISIONING (provision fields removed) ===                │   │
│  │ cabinet_id:    "uuid-cabinet-abc"  ← từ backend response            │   │
│  │ jwt_token:     "eyJ..."           ← từ backend response            │   │
│  │ mqtt_username: "cabinet-abc"       ← từ backend response            │   │
│  │ mqtt_password: "mqtt-pass"        ← từ backend response            │   │
│  │ config_version: 1                   ← từ backend response          │   │
│  │                                                                              │   │
│  │ # (các trường khác giữ nguyên: location_id, mcp_devices, ...)        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. API Endpoints (revised)

```
PI → BACKEND (no auth / provisionKey):

  POST /api/provisioning/discover
    Body: { provisionKey, provisionSecret, hardwareSerial, locationId,
            cabinetName, discoveredMcpDevices[], compartments[] }
    → Creates/updates Cabinet + McpDevice + Compartment
    → Returns: { cabinetId, jwtToken, mqttConfig, confirmedCompartments[], configVersion }

  POST /api/provisioning/discover-compartments
    Body: { cabinetId, jwtToken, newCompartments[] }
    → Adds new compartments to existing cabinet
    → Returns: { compartment with DB id, configVersion }

  GET /api/provisioning/config/:cabinetId
    Header: Authorization: Bearer <jwtToken>
    → Returns current config (for polling / hot-reload fallback)
    → Used if MQTT topic config/reload fails

PI → BACKEND (with jwtToken from config.yaml):

  POST /api/provisioning/sync
    Body: { hardwareSerial, compartments[], configVersion }
    → Syncs current Pi state with DB
    → Returns diff: { added[], removed[], updated[], newConfigVersion }


ADMIN (JWT admin auth):

  POST /api/admin/provisioning/discover-for-cabinet/:id
    → Admin manually triggers Pi to re-discover (via MQTT command)
    → Pi sends /discover → backend syncs
```

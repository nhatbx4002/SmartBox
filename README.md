# OmniBox

Hệ thống tủ đồ tại điểm công cộng  — đồ án tốt nghiệp HUST (20225897 - Bùi Xuân Nhất).

Quản lý tủ đồ từ xa qua ứng dụng di động và web dashboard, sử dụng Raspberry Pi làm gateway điều khiển, giao tiếp qua MQTT.

## Kiến trúc

| Thành phần | Công nghệ                               |
|---|-----------------------------------------|
| Backend | Node.js, TypeScript, Prisma, PostgreSQL |
| Web Dashboard | React                                   |
| Android App | ReactNative                             |
| Raspberry Pi | Python                                  |
| Message Broker | Mosquitto (MQTT)                        |
| Deployment | Docker Compose                          |

## Tài liệu

- [Báo cáo đồ án tốt nghiệp](docs/BuiXuanNhat_20225897_DATN.pdf)
- [Slide thuyết trình](docs/20225897_BuiXuanNhat_20252.pdf)

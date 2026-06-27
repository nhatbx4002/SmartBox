import {
  CabinetStatus,
  CompartmentAvailability,
  CompartmentSize,
  DoorStatus,
  LockStatus,
  LockerAction,
  RentalStatus,
  Prisma
} from '../generated/prisma';
import { BadRequestError, NotFoundError } from '../lib/errors';
import { publishMqtt } from '../lib/mqtt';
import { emitCabinetStatus, emitCompartmentStatus } from '../lib/socket';
import { prisma } from '../lib/prisma';
import { unlockCompartment } from './locker.service';

export const CABINET_CONFIGURABLE_STATUSES: CabinetStatus[] = [
  CabinetStatus.CONFIGURING,
  CabinetStatus.ACTIVE,
];

export async function listCabinets() {
  return prisma.cabinet.findMany({
    include: { location: true, mcpDevices: true, compartments: { include: { realtimeStatus: true } } },
    orderBy: { createdAt: 'asc' },
  });
}

export async function getCabinet(id: string) {
  const cabinet = await prisma.cabinet.findUnique({
    where: { id },
    include: { location: true, mcpDevices: true, compartments: { include: { realtimeStatus: true } } },
  });
  if (!cabinet) throw NotFoundError('Cabinet not found');
  return cabinet;
}

async function getCabinetBasicOrThrow(id: string) {
  const cabinet = await prisma.cabinet.findUnique({ where: { id } });
  if (!cabinet) throw NotFoundError('Cabinet not found');
  return cabinet;
}

/**
 * Hàm: createCabinetFromPairing
 *
 * Dùng để:
 * - Tạo cabinet mới sau khi admin duyệt phiên ghép nối thiết bị tủ.
 * - Tạo kèm các thiết bị MCP23017 mà kiosk đã tự phát hiện được trong quá trình pairing.
 *
 * Params:
 * - tx: Prisma transaction client, dùng để chạy chung trong một transaction với luồng pairing.
 * - input: dữ liệu dùng để tạo cabinet từ phiên pairing.
 * - input.locationId: id của vị trí mà tủ sẽ thuộc về.
 * - input.name: tên của tủ mới.
 * - input.hardwareSerial: mã serial phần cứng của thiết bị tủ.
 * - input.discoveredDevices: danh sách MCP23017 mà thiết bị tủ phát hiện được, gồm bus, address và name.
 *
 * Hoạt động:
 * - Tạo một cabinet mới trong database.
 * - Gán trạng thái ban đầu là CONFIGURING để biểu thị tủ đang chờ cấu hình ngăn/pin.
 * - Khởi tạo configVersion = 1 cho cấu hình đầu tiên của tủ.
 * - Nếu có discoveredDevices thì tạo nhiều bản ghi mcpDevice tương ứng và liên kết chúng với cabinet vừa tạo.
 * - Trả về cabinet vừa được tạo.
 */
export async function createCabinetFromPairing(
    tx: Prisma.TransactionClient,
    input: {
      locationId: string;
      name: string;
      hardwareSerial: string;
      discoveredDevices: Array<{ bus: number; address: number; name?: string }>;
    },
) {
  const cabinet = await tx.cabinet.create({
    data: {
      locationId: input.locationId,
      name: input.name,
      hardwareSerial: input.hardwareSerial,
      status: CabinetStatus.CONFIGURING,
      configVersion: 1,
    },
  });

  if (input.discoveredDevices.length > 0) {
    await tx.mcpDevice.createMany({
      data: input.discoveredDevices.map((device) => ({
        cabinetId: cabinet.id,
        bus: device.bus,
        address: device.address,
        name: device.name,
      })),
    });
  }

  return cabinet;
}

/**
 * Hàm: updateCabinet
 *
 * Dùng để:
 * - Cập nhật thông tin của một tủ theo id.
 *
 * Params:
 * - id: id của tủ cần cập nhật.
 * - input: dữ liệu muốn cập nhật cho cabinet.
 * - input.locationId: id vị trí mới của tủ nếu cần đổi vị trí.
 * - input.name: tên mới của tủ.
 * - input.status: trạng thái mới của tủ.
 * - input.hardwareSerial: mã serial phần cứng mới.
 * - input.notes: ghi chú mới cho tủ.
 *
 * Hoạt động:
 * - Lấy thông tin cabinet hiện tại theo id.
 * - Nếu input có truyền status mới và status đó khác status hiện tại thì kiểm tra chuyển trạng thái có hợp lệ không.
 * - Nếu chuyển trạng thái không hợp lệ thì validateCabinetStatusTransition sẽ throw lỗi.
 * - Nếu hợp lệ thì cập nhật cabinet trong database bằng dữ liệu input.
 * - Trả về cabinet sau khi cập nhật.
 */
export async function updateCabinet(
  id: string,
  input: Partial<{ locationId: string; name: string; status: CabinetStatus; hardwareSerial: string; notes: string }>,
) {
  const current = await getCabinet(id);
  if (input.status !== undefined && input.status !== current.status) {
    validateCabinetStatusTransition(current.status, input.status);
  }
  return prisma.cabinet.update({ where: { id }, data: input });
}

export async function deleteCabinet(id: string) {
  await getCabinet(id);
  return prisma.cabinet.delete({ where: { id } });
}

/**
 * Hàm: updateCompartmentStatus
 *
 * Dùng để:
 * - Cập nhật trạng thái thực tế của một ngăn tủ.
 * - Thường dùng khi thiết bị tủ gửi trạng thái khóa/cửa về backend.
 *
 * Params:
 * - compartmentId: id của ngăn cần cập nhật trạng thái.
 * - lockStatus: trạng thái khóa hiện tại của ngăn.
 * - doorStatus: trạng thái cửa hiện tại của ngăn.
 *
 * Hoạt động:
 * - Tìm compartment trong database theo compartmentId.
 * - Nếu không tìm thấy compartment thì throw NotFoundError.
 * - Upsert bản ghi compartmentStatus:
 *   - Nếu đã có status của compartment thì cập nhật lockStatus, doorStatus và lastUpdatedAt.
 *   - Nếu chưa có thì tạo mới status cho compartment.
 * - Emit trạng thái mới qua Socket.io để admin dashboard cập nhật realtime.
 * - Trả về status sau khi cập nhật.
 */
export async function updateCompartmentStatus(
  compartmentId: string,
  lockStatus: LockStatus,
  doorStatus: DoorStatus,
) {
  const compartment = await prisma.compartment.findUnique({ where: { id: compartmentId } });
  if (!compartment) throw NotFoundError('Compartment not found');

  const status = await prisma.compartmentStatus.upsert({
    where: { compartmentId },
    update: { lockStatus, doorStatus, lastUpdatedAt: new Date() },
    create: { compartmentId, lockStatus, doorStatus },
  });

  emitCompartmentStatus(compartment.cabinetId, compartment.id, status);
  return status;
}

/**
 * Hàm: updateHeartbeat
 *
 * Dùng để:
 * - Cập nhật heartbeat của thiết bị tủ.
 * - Xác nhận tủ vẫn đang online và hoạt động.
 * - Tự chuyển một số trạng thái chờ/ngoại tuyến sang ACTIVE khi nhận được heartbeat.
 *
 * Params:
 * - cabinetId: id của tủ gửi heartbeat về backend.
 *
 * Hoạt động:
 * - Chạy trong transaction để đảm bảo cập nhật heartbeat và ghi log đi cùng nhau.
 * - Tìm cabinet trong database theo cabinetId.
 * - Nếu không tìm thấy cabinet thì throw NotFoundError.
 * - Kiểm tra trạng thái hiện tại của tủ có thuộc nhóm được phép tự chuyển sang ACTIVE hay không.
 * - Cập nhật lastHeartbeatAt bằng thời gian hiện tại.
 * - Nếu tủ đang ở OFFLINE hoặc INACTIVE thì cập nhật status thành ACTIVE.
 * - Ghi log HEARTBEAT vào lockerLog.
 * - Sau khi transaction thành công, emit trạng thái cabinet qua Socket.io cho admin dashboard.
 * - Trả về cabinet sau khi cập nhật.
 */
export async function updateHeartbeat(cabinetId: string) {
  const { cabinet, promoted } = await prisma.$transaction(async (tx) => {
    const current = await tx.cabinet.findUnique({ where: { id: cabinetId } });
    if (!current) throw NotFoundError('Cabinet not found');

    const shouldPromoteToActive = current.status === CabinetStatus.OFFLINE || current.status === CabinetStatus.INACTIVE;

    const updated = await tx.cabinet.update({
      where: { id: cabinetId },
      data: {
        lastHeartbeatAt: new Date(),
        ...(shouldPromoteToActive ? { status: CabinetStatus.ACTIVE } : {}),
      },
    });
    await tx.lockerLog.create({
      data: { cabinetId, action: LockerAction.HEARTBEAT, success: true },
    });
    return { cabinet: updated, promoted: shouldPromoteToActive };
  });

  emitCabinetStatus(cabinetId, { status: cabinet.status, lastHeartbeatAt: cabinet.lastHeartbeatAt });
  if (promoted) {
    // Status flip alone doesn't bump configVersion, but the kiosk only learns
    // about status changes via this MQTT push — without it cabinet_status
    // stays stale locally even though MQTT/heartbeat are healthy.
    await publishCabinetConfigReload(cabinetId);
  }
  return cabinet;
}

/**
 * Hàm: getCabinetConfigSnapshot
 *
 * Dùng để:
 * - Lấy snapshot cấu hình hiện tại của một tủ.
 * - Dùng để gửi cấu hình mới nhất xuống thiết bị tủ/kiosk.
 *
 * Params:
 * - cabinetId: id của tủ cần lấy snapshot cấu hình.
 *
 * Hoạt động:
 * - Tìm cabinet trong database theo cabinetId.
 * - Include danh sách mcpDevices và sắp xếp theo bus, address tăng dần.
 * - Include danh sách compartments, kèm thông tin thiết bị MCP điều khiển khóa, thiết bị MCP cảm biến và realtimeStatus.
 * - Sắp xếp compartments theo tên ngăn tăng dần.
 * - Nếu không tìm thấy cabinet thì throw NotFoundError.
 * - Trả về object snapshot gồm cabinetId, status, configVersion, mcpDevices và compartments.
 * - Với mỗi compartment, nếu chưa gán lockMcpDeviceId thì mcp23017PinLock được trả về null.
 * - Với mỗi compartment, nếu chưa gán sensorMcpDeviceId thì mcp23017PinSensor được trả về null.
 */
export async function getCabinetConfigSnapshot(cabinetId: string) {
  const cabinet = await prisma.cabinet.findUnique({
    where: { id: cabinetId },
    include: {
      mcpDevices: { orderBy: [{ bus: 'asc' }, { address: 'asc' }] },
      compartments: {
        include: { lockMcpDevice: true, sensorMcpDevice: true, realtimeStatus: true },
        orderBy: { name: 'asc' },
      },
    },
  });
  if (!cabinet) throw NotFoundError('Cabinet not found');

  return {
    cabinetId: cabinet.id,
    status: cabinet.status,
    configVersion: cabinet.configVersion,
    mcpDevices: cabinet.mcpDevices,
    compartments: cabinet.compartments.map((compartment) => ({
      ...compartment,
      mcp23017PinLock: compartment.lockMcpDeviceId ? compartment.mcp23017PinLock : null,
      mcp23017PinSensor: compartment.sensorMcpDeviceId ? compartment.mcp23017PinSensor : null,
    })),
  };
}

export async function publishCabinetConfigReload(cabinetId: string) {
  const config = await getCabinetConfigSnapshot(cabinetId);
  publishMqtt(`smartbox/${cabinetId}/config/reload`, config);
  return config;
}

/**
 * Hàm: activateCabinet
 *
 * Dùng để:
 * - Kích hoạt một tủ sau khi đã hoàn tất cấu hình.
 * - Chuyển cabinet từ trạng thái CONFIGURING sang ACTIVE.
 *
 * Params:
 * - cabinetId: id của tủ cần kích hoạt.
 *
 * Hoạt động:
 * - Tìm cabinet trong database theo cabinetId.
 * - Include danh sách compartments để kiểm tra tủ đã có ngăn hay chưa.
 * - Nếu không tìm thấy cabinet thì throw NotFoundError.
 * - Nếu cabinet không ở trạng thái CONFIGURING thì throw BadRequestError.
 * - Nếu cabinet chưa có ngăn nào thì throw BadRequestError.
 * - Nếu hợp lệ thì cập nhật trạng thái cabinet thành ACTIVE.
 * - Publish lại cấu hình cabinet xuống thiết bị tủ qua MQTT.
 * - Emit trạng thái cabinet mới qua Socket.io cho admin dashboard.
 * - Trả về cabinet sau khi kích hoạt.
 */
export async function activateCabinet(cabinetId: string) {
  const current = await prisma.cabinet.findUnique({
    where: { id: cabinetId },
    include: { compartments: true },
  });
  if (!current) throw NotFoundError('Cabinet not found');
  if (current.status !== CabinetStatus.CONFIGURING) {
    throw BadRequestError('Cabinet status is not CONFIGURING');
  }
  if (current.compartments.length < 1) {
    throw BadRequestError('Tủ phải có ít nhất một ngăn');
  }

  const cabinet = await prisma.cabinet.update({
    where: { id: cabinetId },
    data: { status: CabinetStatus.ACTIVE },
  });

  await publishCabinetConfigReload(cabinetId);
  emitCabinetStatus(cabinetId, { status: cabinet.status });
  return cabinet;
}

/**
 * Hàm: deactivateCabinet
 *
 * Dùng để:
 * - Ngừng kích hoạt một tủ đang hoạt động.
 * - Chuyển cabinet từ trạng thái ACTIVE sang INACTIVE.
 *
 * Params:
 * - cabinetId: id của tủ cần ngừng kích hoạt.
 *
 * Hoạt động:
 * - Lấy thông tin cơ bản của cabinet theo cabinetId.
 * - Nếu không tìm thấy cabinet thì getCabinetBasicOrThrow sẽ throw NotFoundError.
 * - Kiểm tra cabinet hiện tại có đang ở trạng thái ACTIVE hay không.
 * - Nếu cabinet không phải ACTIVE thì throw BadRequestError.
 * - Đếm số rental đang ACTIVE thuộc các ngăn của cabinet này.
 * - Nếu vẫn còn rental đang hoạt động thì không cho deactivate và throw BadRequestError.
 * - Nếu hợp lệ thì cập nhật trạng thái cabinet thành INACTIVE.
 * - Publish lại cấu hình cabinet xuống thiết bị tủ qua MQTT.
 * - Emit trạng thái cabinet mới qua Socket.io cho admin dashboard.
 * - Trả về cabinet sau khi deactivate.
 */
export async function deactivateCabinet(cabinetId: string) {
  const current = await getCabinetBasicOrThrow(cabinetId);
  if (current.status !== CabinetStatus.ACTIVE) {
    throw BadRequestError('Cabinet status is not ACTIVE');
  }

  const activeRentals = await prisma.rental.count({
    where: {
      status: RentalStatus.ACTIVE,
      compartment: { cabinetId },
    },
  });
  if (activeRentals > 0) {
    throw BadRequestError('Cabinet has active rentals');
  }

  const cabinet = await prisma.cabinet.update({
    where: { id: cabinetId },
    data: { status: CabinetStatus.INACTIVE },
  });

  await publishCabinetConfigReload(cabinetId);
  emitCabinetStatus(cabinetId, { status: cabinet.status });
  return cabinet;
}

/**
 * Hàm: testOpenCompartment
 *
 * Dùng để:
 * - Mở thử một ngăn tủ từ trang quản trị.
 * - Dùng khi admin muốn kiểm tra cấu hình relay/khóa của một ngăn.
 *
 * Params:
 * - cabinetId: id của tủ chứa ngăn cần mở thử.
 * - compartmentId: id của ngăn cần mở thử.
 *
 * Hoạt động:
 * - Lấy thông tin cơ bản của cabinet theo cabinetId.
 * - Nếu không tìm thấy cabinet thì getCabinetBasicOrThrow sẽ throw NotFoundError.
 * - Kiểm tra cabinet có đang ở trạng thái cho phép cấu hình/test mở ngăn hay không.
 * - Nếu cabinet không ở trạng thái CONFIGURING hoặc ACTIVE thì throw BadRequestError.
 * - Tìm compartment theo compartmentId và cabinetId để đảm bảo ngăn thuộc đúng tủ.
 * - Nếu không tìm thấy compartment thì throw NotFoundError.
 * - Gọi unlockCompartment để gửi lệnh mở khóa ngăn.
 * - Trả về kết quả test mở ngăn gồm ok, cabinetId, compartmentId và compartmentName.
 */
export async function testOpenCompartment(cabinetId: string, compartmentId: string) {
  const cabinet = await getCabinetBasicOrThrow(cabinetId);
  if (!CABINET_CONFIGURABLE_STATUSES.includes(cabinet.status)) {
    throw BadRequestError('Cabinet status must be CONFIGURING or ACTIVE');
  }

  const compartment = await prisma.compartment.findFirst({
    where: { id: compartmentId, cabinetId },
  });
  if (!compartment) throw NotFoundError('Compartment not found');

  await unlockCompartment(cabinetId, compartmentId);
  return { ok: true, cabinetId, compartmentId, compartmentName: compartment.name };
}

/**
 * Biến: validCabinetStatusTransitions
 *
 * Dùng để:
 * - Định nghĩa các trạng thái cabinet được phép chuyển đổi.
 * - Dùng như bảng luật để kiểm soát vòng đời của một tủ.
 *
 * Hoạt động:
 * - Mỗi key là trạng thái hiện tại của cabinet.
 * - Mỗi value là danh sách các trạng thái mà cabinet được phép chuyển sang.
 * - Ví dụ: cabinet ở CONFIGURING chỉ được chuyển sang ACTIVE hoặc INACTIVE.
 * - Bảng này được validateCabinetStatusTransition sử dụng trước khi cập nhật status của cabinet.
 */
const validCabinetStatusTransitions: Record<CabinetStatus, CabinetStatus[]> = {
  [CabinetStatus.ACTIVE]: [CabinetStatus.INACTIVE, CabinetStatus.OFFLINE],
  [CabinetStatus.INACTIVE]: [
    CabinetStatus.ACTIVE,
    CabinetStatus.CONFIGURING,
  ],
  [CabinetStatus.OFFLINE]: [CabinetStatus.ACTIVE],
  [CabinetStatus.CONFIGURING]: [CabinetStatus.ACTIVE, CabinetStatus.INACTIVE],
};
function validateCabinetStatusTransition(from: CabinetStatus, to: CabinetStatus) {
  if (!validCabinetStatusTransitions[from]?.includes(to)) {
    throw BadRequestError(`Invalid cabinet status transition: ${from} -> ${to}`);
  }
}

/**
 * Hàm: getAvailableCompartments
 *
 * Dùng để:
 * - Lấy danh sách các ngăn còn trống và có thể cho thuê.
 * - Có thể lọc thêm theo kích thước ngăn nếu truyền size.
 *
 * Params:
 * - size: kích thước ngăn muốn lọc, có thể không truyền.
 *
 * Hoạt động:
 * - Tìm các compartment có status là AVAILABLE.
 * - Nếu có truyền size thì chỉ lấy các ngăn đúng kích thước đó.
 * - Chỉ lấy các ngăn thuộc cabinet đang ở trạng thái ACTIVE.
 * - Include thêm cabinet và location để biết ngăn thuộc tủ nào, vị trí nào.
 * - Include thêm realtimeStatus để biết trạng thái thực tế hiện tại của ngăn.
 * - Sắp xếp kết quả theo cabinetId tăng dần, sau đó theo tên ngăn tăng dần.
 * - Trả về danh sách ngăn còn khả dụng.
 */
export async function getAvailableCompartments(size?: CompartmentSize) {
  return prisma.compartment.findMany({
    where: {
      status: CompartmentAvailability.AVAILABLE,
      ...(size ? { size } : {}),
      cabinet: { status: CabinetStatus.ACTIVE },
    },
    include: { cabinet: { include: { location: true } }, realtimeStatus: true },
    orderBy: [{ cabinetId: 'asc' }, { name: 'asc' }],
  });
}

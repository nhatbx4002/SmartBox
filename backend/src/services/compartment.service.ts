import {
  CompartmentAvailability,
  CompartmentSize,
  Prisma,
} from '../generated/prisma';
import { BadRequestError, ForbiddenError, NotFoundError } from '../lib/errors';
import { prisma } from '../lib/prisma';
import { emitCompartmentStatus } from '../lib/socket';
import { CABINET_CONFIGURABLE_STATUSES, publishCabinetConfigReload } from './cabinet.service';

export type CompartmentInput = {
  name: string;
  size: CompartmentSize;
  lockMcpDeviceId?: string | null;
  sensorMcpDeviceId?: string | null;
  mcp23017PinLock: number;
  mcp23017PinSensor?: number | null;
  status?: CompartmentAvailability;
};

/**Functions**/
/**
 * Tạo một ngăn tủ mới trong cabinet.
 *
 * @param cabinetId - ID của cabinet mà ngăn mới sẽ thuộc về.
 * @param input - Dữ liệu cấu hình ngăn, gồm tên, kích thước, MCP device, pin lock/sensor và trạng thái ban đầu.
 * @returns Compartment vừa được tạo kèm configVersion mới của cabinet.
 *
 * Cách hoạt động:
 * - Kiểm tra cabinet có tồn tại và đang ở trạng thái cho phép cấu hình.
 * - Validate dữ liệu ngăn, bao gồm tên trùng, MCP device hợp lệ và xung đột pin phần cứng.
 * - Tạo compartment và tăng configVersion trong cùng một transaction để tránh lệch dữ liệu cấu hình.
 * - Sau khi transaction thành công, publish MQTT để kiosk reload config và emit Socket.io cho dashboard.
 */
export async function createCompartment(cabinetId: string, input: CompartmentInput) {
  await assertCabinetConfigurable(cabinetId);
  await validateCompartmentConflicts(cabinetId, input);

  const { compartment, configVersion } = await prisma.$transaction(async (tx) => {
    const compartment = await tx.compartment.create({
      data: {
        cabinetId,
        name: input.name,
        size: input.size,
        lockMcpDeviceId: input.lockMcpDeviceId,
        sensorMcpDeviceId: input.sensorMcpDeviceId,
        mcp23017PinLock: input.mcp23017PinLock,
        mcp23017PinSensor: input.mcp23017PinSensor ?? 0,
        status: input.status ?? CompartmentAvailability.AVAILABLE,
      },
      include: { realtimeStatus: true, lockMcpDevice: true, sensorMcpDevice: true },
    });
    const configVersion = await bumpConfigVersion(tx, cabinetId);
    return { compartment, configVersion };
  });

  await publishCabinetConfigReload(cabinetId);
  emitCompartmentStatus(cabinetId, compartment.id, compartment);
  return { compartment, configVersion };
}

/**
 * Cập nhật thông tin cấu hình của một ngăn tủ.
 *
 * @param id - ID của compartment cần cập nhật.
 * @param input - Dữ liệu cần cập nhật, có thể chỉ gồm một phần thông tin của compartment.
 * @returns Compartment sau khi cập nhật kèm configVersion mới của cabinet.
 *
 * Cách hoạt động:
 * - Tìm compartment hiện tại theo ID và kiểm tra cabinet chứa nó có được phép cấu hình.
 * - Gộp dữ liệu hiện tại với dữ liệu mới để tạo trạng thái cuối cùng sau cập nhật.
 * - Validate trạng thái sau cập nhật, gồm tên trùng, MCP device hợp lệ và xung đột pin phần cứng.
 * - Cập nhật compartment và tăng configVersion trong cùng một transaction.
 * - Sau khi transaction thành công, publish MQTT để kiosk reload config và emit Socket.io cho dashboard.
 **/
export async function updateCompartment(id: string, input: Partial<CompartmentInput>) {
  const current = await prisma.compartment.findUnique({ where: { id } });
  if (!current) throw NotFoundError('Compartment not found');
  await assertCabinetConfigurable(current.cabinetId);

  const merged = { ...current, ...input };
  await validateCompartmentConflicts(current.cabinetId, merged, id);

  const data: Prisma.CompartmentUncheckedUpdateInput = {
    name: merged.name,
    size: merged.size,
    lockMcpDeviceId: merged.lockMcpDeviceId,
    sensorMcpDeviceId: merged.sensorMcpDeviceId,
    mcp23017PinLock: merged.mcp23017PinLock,
    mcp23017PinSensor: merged.mcp23017PinSensor ?? 0,
    status: merged.status,
  };

  const { compartment, configVersion } = await prisma.$transaction(async (tx) => {
    const compartment = await tx.compartment.update({
      where: { id },
      data,
      include: { realtimeStatus: true, lockMcpDevice: true, sensorMcpDevice: true },
    });
    const configVersion = await bumpConfigVersion(tx, current.cabinetId);
    return { compartment, configVersion };
  });

  await publishCabinetConfigReload(current.cabinetId);
  emitCompartmentStatus(current.cabinetId, compartment.id, compartment);
  return { compartment, configVersion };
}

/**
 * Xoá một ngăn tủ khỏi cabinet.
 *
 * @param id - ID của compartment cần xoá.
 * @returns Compartment đã xoá kèm configVersion mới của cabinet.
 *
 * Cách hoạt động:
 * - Tìm compartment theo ID, nếu không tồn tại thì báo lỗi.
 * - Chặn xoá nếu compartment đang ở trạng thái OCCUPIED để tránh mất dữ liệu thuê tủ đang hoạt động.
 * - Kiểm tra cabinet chứa compartment có đang cho phép cấu hình không.
 * - Xoá compartment và tăng configVersion trong cùng một transaction.
 * - Sau khi transaction thành công, publish MQTT để kiosk reload lại cấu hình mới.
 **/
export async function deleteCompartment(id: string) {
  const current = await prisma.compartment.findUnique({ where: { id } });
  if (!current) throw NotFoundError('Compartment not found');
  if (current.status === CompartmentAvailability.OCCUPIED) {
    throw ForbiddenError('Cannot delete occupied compartment');
  }
  await assertCabinetConfigurable(current.cabinetId);

  const { compartment, configVersion } = await prisma.$transaction(async (tx) => {
    const compartment = await tx.compartment.delete({ where: { id } });
    const configVersion = await bumpConfigVersion(tx, current.cabinetId);
    return { compartment, configVersion };
  });

  await publishCabinetConfigReload(current.cabinetId);
  return { compartment, configVersion };
}

/**
 * Kiểm tra cabinet có tồn tại và có được phép chỉnh sửa cấu hình hay không.
 *
 * @param cabinetId - ID của cabinet cần kiểm tra.
 * @returns Thông tin cabinet nếu cabinet tồn tại và đang ở trạng thái cho phép cấu hình.
 *
 * Cách hoạt động:
 * - Tìm cabinet theo ID trong database.
 * - Nếu không tìm thấy cabinet thì báo lỗi NotFound.
 * - Nếu trạng thái cabinet không nằm trong danh sách được phép cấu hình thì báo lỗi BadRequest.
 * - Trả về cabinet để các hàm khác có thể tiếp tục xử lý.
 */



/**Helpers**/
async function assertCabinetConfigurable(cabinetId: string) {
  const cabinet = await prisma.cabinet.findUnique({ where: { id: cabinetId } });
  if (!cabinet) throw NotFoundError('Cabinet not found');
  if (!CABINET_CONFIGURABLE_STATUSES.includes(cabinet.status)) {
    throw BadRequestError('Cabinet status must be CONFIGURING or ACTIVE');
  }
  return cabinet;
}

/**
 * Validate các ràng buộc cấu hình của một compartment trong cùng cabinet.
 *
 * @param cabinetId - ID của cabinet chứa compartment cần kiểm tra.
 * @param input - Dữ liệu cấu hình compartment cần validate.
 * @param excludeId - ID compartment hiện tại cần bỏ qua khi kiểm tra trùng lặp, dùng cho trường hợp update.
 *
 * Cách hoạt động:
 * - Kiểm tra pin lock nằm trong khoảng hợp lệ và bắt buộc phải có lock MCP device.
 * - Kiểm tra lock MCP device thuộc đúng cabinet.
 * - Nếu có sensor MCP device thì yêu cầu sensor pin, validate pin sensor và kiểm tra sensor MCP device thuộc cabinet.
 * - Chặn trường hợp lock và sensor của cùng một compartment dùng chung MCP device và cùng một pin vật lý.
 * - Kiểm tra tên compartment không bị trùng trong cùng cabinet.
 * - Kiểm tra xung đột pin phần cứng theo cả hai chiều lock/sensor giữa các compartment khác nhau.
 */
async function validateCompartmentConflicts(cabinetId: string, input: CompartmentInput, excludeId?: string) {
  validatePin(input.mcp23017PinLock, 'Lock pin');
  if (!input.lockMcpDeviceId) {
    throw BadRequestError('Lock MCP device is required');
  }
  await assertMcpDeviceBelongsToCabinet(cabinetId, input.lockMcpDeviceId, 'Lock MCP device');

  const hasSensor = Boolean(input.sensorMcpDeviceId);
  if (hasSensor) {
    if (input.mcp23017PinSensor === null || input.mcp23017PinSensor === undefined) {
      throw BadRequestError('Sensor pin is required when sensor MCP device is set');
    }
    validatePin(input.mcp23017PinSensor, 'Sensor pin');
    await assertMcpDeviceBelongsToCabinet(cabinetId, input.sensorMcpDeviceId!, 'Sensor MCP device');
  }

  if (hasSensor && input.lockMcpDeviceId === input.sensorMcpDeviceId && input.mcp23017PinLock === input.mcp23017PinSensor) {
    throw BadRequestError('Lock and sensor cannot share the same MCP device pin');
  }

  const notSelf = excludeId ? { not: excludeId } : undefined;
  const nameConflict = await prisma.compartment.findFirst({
    where: {
      cabinetId,
      name: input.name,
      ...(notSelf ? { id: notSelf } : {}),
    },
  });
  if (nameConflict) throw BadRequestError('Compartment name already exists');

  const orConditions: Prisma.CompartmentWhereInput[] = [
    { lockMcpDeviceId: input.lockMcpDeviceId, mcp23017PinLock: input.mcp23017PinLock },
    { sensorMcpDeviceId: input.lockMcpDeviceId, mcp23017PinSensor: input.mcp23017PinLock },
  ];
  if (hasSensor) {
    orConditions.push(
      { sensorMcpDeviceId: input.sensorMcpDeviceId!, mcp23017PinSensor: input.mcp23017PinSensor! },
      { lockMcpDeviceId: input.sensorMcpDeviceId!, mcp23017PinLock: input.mcp23017PinSensor! },
    );
  }

  const pinConflict = await prisma.compartment.findFirst({
    where: {
      cabinetId,
      OR: orConditions,
      ...(notSelf ? { id: notSelf } : {}),
    },
  });
  if (pinConflict) throw BadRequestError('Pin already in use');
}

/**
 * Kiểm tra một MCP pin có nằm trong khoảng hợp lệ hay không.
 *
 * @param pin - Số thứ tự pin MCP cần kiểm tra.
 * @param label - Tên hiển thị của loại pin, dùng để tạo thông báo lỗi rõ nghĩa.
 *
 * Cách hoạt động:
 * - Kiểm tra pin phải là số nguyên.
 * - Kiểm tra pin nằm trong khoảng 0 đến 15, tương ứng 16 chân GPIO của MCP23017.
 * - Nếu không hợp lệ thì báo lỗi BadRequest.
 */
function validatePin(pin: number, label: string) {
  if (!Number.isInteger(pin) || pin < 0 || pin > 15) {
    throw BadRequestError(`${label} must be between 0 and 15`);
  }
}

/**
 * Kiểm tra MCP device có thuộc đúng cabinet hay không.
 *
 * @param cabinetId - ID của cabinet cần đối chiếu.
 * @param mcpDeviceId - ID của MCP device cần kiểm tra.
 * @param label - Tên hiển thị của MCP device, dùng để tạo thông báo lỗi rõ nghĩa.
 *
 * Cách hoạt động:
 * - Tìm MCP device theo id và cabinetId trong database.
 * - Nếu không tìm thấy nghĩa là MCP device không tồn tại hoặc không thuộc cabinet này.
 * - Khi không hợp lệ, báo lỗi BadRequest để chặn cấu hình nhầm thiết bị phần cứng.
 */
async function assertMcpDeviceBelongsToCabinet(cabinetId: string, mcpDeviceId: string, label: string) {
  const device = await prisma.mcpDevice.findFirst({
    where: { id: mcpDeviceId, cabinetId },
  });
  if (!device) {
    throw BadRequestError(`${label} does not belong to cabinet`);
  }
}

/**
 * Tăng phiên bản cấu hình của cabinet sau khi cấu hình compartment thay đổi.
 *
 * @param tx - Prisma transaction client đang được dùng trong transaction hiện tại.
 * @param cabinetId - ID của cabinet cần tăng configVersion.
 * @returns Giá trị configVersion mới sau khi tăng.
 *
 * Cách hoạt động:
 * - Cập nhật cabinet theo ID và tăng configVersion thêm 1.
 * - Chạy bằng transaction client để việc tăng version đi cùng transaction với create/update/delete compartment.
 * - Trả về configVersion mới để API có thể phản hồi cho client.
 */
async function bumpConfigVersion(tx: Prisma.TransactionClient, cabinetId: string): Promise<number> {
  const cabinet = await tx.cabinet.update({
    where: { id: cabinetId },
    data: { configVersion: { increment: 1 } },
  });
  return cabinet.configVersion;
}

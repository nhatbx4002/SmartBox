import {PayOS} from '@payos/node';

let payos: PayOS | null = null;

export type CreatePayosPaymentParams = {
    orderCode: number;
    amount: number;
    description: string;
    returnUrl: string;
    cancelUrl: string;
    expiredAt: number;
};

/**
 * Lấy biến môi trường bắt buộc.
 *
 * Dùng thay cho process.env.X! để nếu thiếu config,
 * backend báo lỗi rõ ràng ngay khi khởi tạo PayOS.
 */
function getRequiredEnv(key: string): string {
    const value = process.env[key];

    if (!value) {
        throw new Error(`${key} is required`);
    }

    return value;
}

/**
 * Lấy PayOS SDK client.
 *
 * Hàm này dùng singleton để toàn bộ backend chỉ khởi tạo PayOS SDK một lần.
 * Service bên ngoài không nên import trực tiếp PayOS SDK,
 * mà nên gọi qua các wrapper function trong file này.
 */
function getPayos(): PayOS {
    if (!payos) {
        payos = new PayOS({
            clientId: getRequiredEnv('PAYOS_CLIENT_ID'),
            apiKey: getRequiredEnv('PAYOS_API_KEY'),
            checksumKey: getRequiredEnv('PAYOS_CHECKSUM_KEY'),
        });
    }

    return payos;
}

/**
 * Tạo payment link PayOS.
 *
 * Dùng khi backend tạo payment cho một rental.
 *
 * Lưu ý:
 * - orderCode phải unique.
 * - description của PayOS thường nên ngắn, với project bạn đang dùng Rental.code là hợp lý.
 * - expiredAt là Unix timestamp tính bằng giây.
 */
export async function createPayosPayment(params: CreatePayosPaymentParams) {
    return getPayos().paymentRequests.create({
        orderCode: params.orderCode,
        amount: params.amount,
        description: params.description,
        returnUrl: params.returnUrl,
        cancelUrl: params.cancelUrl,
        expiredAt: params.expiredAt,
    });
}

/**
 * Huỷ payment link PayOS.
 *
 * Dùng khi payment PENDING bị hết hạn hoặc rental bị huỷ.
 *
 * paymentLinkId là id/link id PayOS trả về khi tạo payment.
 */
export async function cancelPayosPayment(paymentLinkId: string, reason: string) {
    return getPayos().paymentRequests.cancel(paymentLinkId, reason);
}

/**
 * Xác minh webhook PayOS.
 *
 * Hàm này chỉ kiểm tra chữ ký/checksum webhook có hợp lệ không.
 * Sau khi verify thành công, payment.service vẫn phải tự xử lý nghiệp vụ:
 * - tìm payment bằng orderCode
 * - kiểm tra trạng thái hiện tại
 * - update payment PAID
 * - activate rental
 * - publish MQTT mở tủ nếu cần
 */
export function verifyPayosWebhook(body: unknown) {
    return getPayos().webhooks.verify(body as any);
}
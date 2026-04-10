import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { VNPay, ignoreLogger, ProductCode, VnpLocale, ReturnQueryFromVNPay } from 'vnpay'

@Injectable()
export class PaymentService {
  private vnpay: VNPay

  constructor(private config: ConfigService) {
    this.vnpay = new VNPay({
      tmnCode: this.config.get<string>('VNPAY_TMN_CODE'),
      secureSecret: this.config.get<string>('VNPAY_HASH_SECRET'),
      vnpayHost: this.config.get<string>('VNPAY_HOST'),
      loggerFn: ignoreLogger
    })
  }

  createPaymentUrl(orderCode: string, amount: number, ipAddr: string): string {
    return this.vnpay.buildPaymentUrl({
      vnp_Amount: amount,
      vnp_IpAddr: ipAddr,
      vnp_TxnRef: orderCode,
      vnp_OrderInfo: `Payment for order ${orderCode}`,
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: this.config.get<string>('VNPAY_RETURN_URL'),
      vnp_Locale: VnpLocale.VN
    })
  }

  verifyReturn(query: Record<string, string>) {
    return this.vnpay.verifyReturnUrl(query as unknown as ReturnQueryFromVNPay)
  }

  verifyIpn(query: Record<string, string>) {
    return this.vnpay.verifyIpnCall(query as unknown as ReturnQueryFromVNPay)
  }
}

import { Controller, Post, Get, Body, Query, Req, Res } from '@nestjs/common'
import { Request, Response } from 'express'
import { PaymentService } from './payment.service'
import { CreatePaymentDto } from 'domains/payment/dtos/create-payment.dto'
import { Public } from 'core'

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create')
  createPayment(@Body() body: CreatePaymentDto, @Req() req: Request) {
    const ipAddr =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      req.socket.remoteAddress ||
      '127.0.0.1'

    const paymentUrl = this.paymentService.createPaymentUrl(body.orderCode, body.amount, ipAddr)

    return { paymentUrl }
  }

  @Public()
  @Get('vnpay-return')
  async handleReturn(@Query() query: Record<string, string>, @Res() res: Response) {
    const verify = this.paymentService.verifyReturn(query)

    if (verify.isVerified && verify.isSuccess) {
      // TODO: update order status in your DB
      return res.redirect(`/success?orderCode=${query.vnp_TxnRef}`)
    }

    return res.redirect(`/failed?orderCode=${query.vnp_TxnRef}`)
  }

  @Public()
  @Get('vnpay-ipn')
  async handleIpn(@Query() query: Record<string, string>) {
    const verify = this.paymentService.verifyIpn(query)

    if (!verify.isVerified) {
      return { RspCode: '97', Message: 'Invalid signature' }
    }

    if (!verify.isSuccess) {
      return { RspCode: '00', Message: 'Confirm Success' } // still ack to VNPay
    }

    // TODO: update order status in your DB here
    // e.g. await this.orderService.markAsPaid(query.vnp_TxnRef)

    return { RspCode: '00', Message: 'Confirm Success' }
  }
}

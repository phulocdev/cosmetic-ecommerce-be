import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text
} from '@react-email/components'
import * as React from 'react'

interface OrderConfirmationEmailProps {
  customerName: string
  orderCode: string
  totalAmount: number
}

export const OrderConfirmationEmail = ({
  customerName,
  orderCode,
  totalAmount
}: OrderConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Xác nhận đơn hàng #{orderCode}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Cảm ơn bạn đã đặt hàng! 🎉</Heading>
        <Text style={text}>
          Xin chào {customerName},
        </Text>
        <Text style={text}>
          Đơn hàng của bạn đã được tiếp nhận thành công. Chúng tôi sẽ xử lý đơn hàng trong thời gian sớm nhất.
        </Text>
        <Hr style={hr} />
        <Section style={orderSection}>
          <Text style={label}>Mã đơn hàng:</Text>
          <Text style={orderCodeStyle}>{orderCode}</Text>
          <Text style={label}>Tổng thanh toán:</Text>
          <Text style={totalStyle}>
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}
          </Text>
        </Section>
        <Hr style={hr} />
        <Text style={text}>
          Bạn có thể theo dõi trạng thái đơn hàng trong phần "Đơn hàng" trên tài khoản của bạn.
        </Text>
        <Text style={footer}>
          Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default OrderConfirmationEmail

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif'
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px'
}

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0 20px',
  padding: '0',
  textAlign: 'center' as const
}

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  textAlign: 'center' as const
}

const hr = {
  borderColor: '#ddd',
  margin: '20px 0'
}

const orderSection = {
  textAlign: 'center' as const,
  padding: '0 20px'
}

const label = {
  color: '#8898aa',
  fontSize: '12px',
  textTransform: 'uppercase' as const,
  marginBottom: '4px',
  textAlign: 'center' as const
}

const orderCodeStyle = {
  color: '#333',
  fontSize: '20px',
  fontWeight: 'bold',
  marginTop: '4px',
  marginBottom: '16px',
  textAlign: 'center' as const
}

const totalStyle = {
  color: '#e11d48',
  fontSize: '22px',
  fontWeight: 'bold',
  marginTop: '4px',
  textAlign: 'center' as const
}

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center' as const,
  marginTop: '32px'
}

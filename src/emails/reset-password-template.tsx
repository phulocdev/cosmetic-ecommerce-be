import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Font
} from '@react-email/components'
import * as React from 'react'

interface ResetPasswordTemplateProps {
  name: string
  resetToken: string
  clientBaseUrl: string
}

export const ResetPasswordTemplate = ({
  name = 'Nguyễn Văn A',
  resetToken = 'sample-token-123',
  clientBaseUrl = 'https://example.com'
}: ResetPasswordTemplateProps) => {
  const resetUrl = `${clientBaseUrl}/reset-password?token=${resetToken}`
  const expiryHours = 1

  return (
    <Html lang='vi' dir='ltr'>
      <Head>
        <Font
          fontFamily='Be Vietnam Pro'
          fallbackFontFamily='Arial'
          webFont={{
            url: 'https://fonts.gstatic.com/s/bevietnampro/v11/QdVPSTAyLFyeg_IDWvOJmVES_HToIl8yNom9kg.woff2',
            format: 'woff2'
          }}
          fontWeight={400}
          fontStyle='normal'
        />
        <Font
          fontFamily='Be Vietnam Pro'
          fallbackFontFamily='Arial'
          webFont={{
            url: 'https://fonts.gstatic.com/s/bevietnampro/v11/QdVNSTAyLFyeg_IDWvOJmVES_HToIl8yNo63.woff2',
            format: 'woff2'
          }}
          fontWeight={600}
          fontStyle='normal'
        />
        <Font
          fontFamily='Be Vietnam Pro'
          fallbackFontFamily='Arial'
          webFont={{
            url: 'https://fonts.gstatic.com/s/bevietnampro/v11/QdVNSTAyLFyeg_IDWvOJmVES_HToIl8yNo63.woff2',
            format: 'woff2'
          }}
          fontWeight={700}
          fontStyle='normal'
        />
      </Head>

      <Preview>
        Đặt lại mật khẩu của bạn — liên kết có hiệu lực trong {`${expiryHours}`} giờ
      </Preview>

      <Body style={bodyStyle}>
        {/* Outer wrapper */}
        <Container style={outerContainerStyle}>
          {/* ── Header bar ── */}
          <Section style={headerStyle}>
            <Row>
              <Column>
                <Text style={logoTextStyle}>● YourBrand</Text>
              </Column>
            </Row>
          </Section>

          {/* ── Hero accent line ── */}
          <Section style={accentBarStyle} />

          {/* ── Main card ── */}
          <Section style={cardStyle}>
            {/* Icon */}
            <Row>
              <Column align='center'>
                <Section style={iconWrapperStyle}>
                  <Text style={iconStyle}>🔐</Text>
                </Section>
              </Column>
            </Row>

            {/* Heading */}
            <Row>
              <Column>
                <Heading style={headingStyle}>Đặt lại mật khẩu</Heading>
                <Text style={subHeadingStyle}>
                  Xin chào <strong>{name}</strong>,
                </Text>
                <Text style={bodyTextStyle}>
                  Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Nhấn vào
                  nút bên dưới để tạo mật khẩu mới. Liên kết này chỉ có hiệu lực trong{' '}
                  <strong>{expiryHours} giờ</strong>.
                </Text>
              </Column>
            </Row>

            {/* CTA Button */}
            <Row>
              <Column align='center'>
                <Button style={buttonStyle} href={resetUrl}>
                  Đặt lại mật khẩu ngay
                </Button>
              </Column>
            </Row>

            {/* Divider */}
            <Row>
              <Column>
                <Hr style={hrStyle} />
              </Column>
            </Row>

            {/* Fallback link */}
            <Row>
              <Column>
                <Text style={fallbackLabelStyle}>
                  Nút không hoạt động? Sao chép và dán liên kết sau vào trình duyệt:
                </Text>
                <Text style={fallbackLinkStyle}>
                  <Link href={resetUrl} style={linkStyle}>
                    {resetUrl}
                  </Link>
                </Text>
              </Column>
            </Row>

            {/* Warning box */}
            <Row>
              <Column>
                <Section style={warningBoxStyle}>
                  <Row>
                    <Column width={28}>
                      <Text style={warningIconStyle}>⚠️</Text>
                    </Column>
                    <Column>
                      <Text style={warningTextStyle}>
                        Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này. Tài khoản
                        của bạn vẫn an toàn.
                      </Text>
                    </Column>
                  </Row>
                </Section>
              </Column>
            </Row>
          </Section>

          {/* ── Security tips card ── */}
          <Section style={tipsCardStyle}>
            <Text style={tipsTitleStyle}>Mẹo bảo mật tài khoản</Text>
            <Row>
              <Column style={tipItemStyle}>
                <Text style={tipEmojiStyle}>🔑</Text>
                <Text style={tipTextStyle}>Dùng mật khẩu dài ≥ 12 ký tự</Text>
              </Column>
              <Column style={tipItemStyle}>
                <Text style={tipEmojiStyle}>🔄</Text>
                <Text style={tipTextStyle}>Không dùng lại mật khẩu cũ</Text>
              </Column>
              <Column style={tipItemStyle}>
                <Text style={tipEmojiStyle}>🛡️</Text>
                <Text style={tipTextStyle}>Bật xác thực hai yếu tố</Text>
              </Column>
            </Row>
          </Section>

          {/* ── Footer ── */}
          <Section style={footerStyle}>
            <Text style={footerTextStyle}>
              Email này được gửi từ{' '}
              <Link href={clientBaseUrl} style={footerLinkStyle}>
                YourBrand
              </Link>
              . Nếu bạn có thắc mắc, hãy liên hệ{' '}
              <Link href='mailto:support@yourbrand.vn' style={footerLinkStyle}>
                support@yourbrand.vn
              </Link>
              .
            </Text>
            <Text style={footerTextStyle}>
              © {new Date().getFullYear()} YourBrand. Bảo lưu mọi quyền.
            </Text>
            <Row>
              <Column align='center'>
                <Link href={`${clientBaseUrl}/unsubscribe`} style={unsubscribeLinkStyle}>
                  Huỷ đăng ký nhận email
                </Link>
                {' · '}
                <Link href={`${clientBaseUrl}/privacy`} style={unsubscribeLinkStyle}>
                  Chính sách bảo mật
                </Link>
              </Column>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default ResetPasswordTemplate

// ─── Styles ────────────────────────────────────────────────────────────────────

const bodyStyle: React.CSSProperties = {
  backgroundColor: '#F0F2F5',
  fontFamily: "'Be Vietnam Pro', Arial, sans-serif",
  margin: 0,
  padding: '32px 0'
}

const outerContainerStyle: React.CSSProperties = {
  maxWidth: '580px',
  margin: '0 auto'
}

// Header
const headerStyle: React.CSSProperties = {
  backgroundColor: '#0A0A0A',
  borderRadius: '12px 12px 0 0',
  padding: '20px 32px'
}

const logoTextStyle: React.CSSProperties = {
  color: '#FFFFFF',
  fontSize: '18px',
  fontWeight: 700,
  letterSpacing: '-0.3px',
  margin: 0
}

// Accent bar — thin gradient stripe
const accentBarStyle: React.CSSProperties = {
  background: 'linear-gradient(90deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)',
  height: '4px'
}

// Main card
const cardStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  padding: '40px 40px 32px'
}

const iconWrapperStyle: React.CSSProperties = {
  backgroundColor: '#F5F3FF',
  borderRadius: '50%',
  width: '64px',
  height: '64px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 24px'
}

const iconStyle: React.CSSProperties = {
  fontSize: '28px',
  margin: 0,
  textAlign: 'center',
  lineHeight: '64px'
}

const headingStyle: React.CSSProperties = {
  color: '#0A0A0A',
  fontSize: '26px',
  fontWeight: 700,
  letterSpacing: '-0.5px',
  lineHeight: '1.2',
  margin: '0 0 12px',
  textAlign: 'center'
}

const subHeadingStyle: React.CSSProperties = {
  color: '#374151',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 8px'
}

const bodyTextStyle: React.CSSProperties = {
  color: '#6B7280',
  fontSize: '15px',
  lineHeight: '1.7',
  margin: '0 0 28px'
}

const buttonStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
  borderRadius: '10px',
  color: '#FFFFFF',
  display: 'inline-block',
  fontSize: '15px',
  fontWeight: 600,
  letterSpacing: '0.2px',
  padding: '14px 36px',
  textDecoration: 'none',
  margin: '0 0 28px',
  boxShadow: '0 4px 15px rgba(99,102,241,0.35)'
}

const hrStyle: React.CSSProperties = {
  borderColor: '#E5E7EB',
  borderTopWidth: '1px',
  margin: '0 0 20px'
}

const fallbackLabelStyle: React.CSSProperties = {
  color: '#9CA3AF',
  fontSize: '12px',
  margin: '0 0 4px'
}

const fallbackLinkStyle: React.CSSProperties = {
  fontSize: '12px',
  margin: '0 0 24px',
  wordBreak: 'break-all'
}

const linkStyle: React.CSSProperties = {
  color: '#6366F1',
  textDecoration: 'underline'
}

// Warning box
const warningBoxStyle: React.CSSProperties = {
  backgroundColor: '#FFFBEB',
  border: '1px solid #FDE68A',
  borderRadius: '8px',
  padding: '14px 16px'
}

const warningIconStyle: React.CSSProperties = {
  fontSize: '16px',
  margin: 0,
  lineHeight: '1.5'
}

const warningTextStyle: React.CSSProperties = {
  color: '#92400E',
  fontSize: '13px',
  lineHeight: '1.6',
  margin: 0
}

// Tips card
const tipsCardStyle: React.CSSProperties = {
  backgroundColor: '#FAFAFA',
  border: '1px solid #E5E7EB',
  padding: '24px 32px'
}

const tipsTitleStyle: React.CSSProperties = {
  color: '#374151',
  fontSize: '13px',
  fontWeight: 600,
  letterSpacing: '0.8px',
  textTransform: 'uppercase',
  margin: '0 0 16px'
}

const tipItemStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '0 8px'
}

const tipEmojiStyle: React.CSSProperties = {
  fontSize: '22px',
  margin: '0 0 4px',
  textAlign: 'center'
}

const tipTextStyle: React.CSSProperties = {
  color: '#6B7280',
  fontSize: '12px',
  lineHeight: '1.5',
  margin: 0,
  textAlign: 'center'
}

// Footer
const footerStyle: React.CSSProperties = {
  backgroundColor: '#0A0A0A',
  borderRadius: '0 0 12px 12px',
  padding: '24px 32px'
}

const footerTextStyle: React.CSSProperties = {
  color: '#6B7280',
  fontSize: '12px',
  lineHeight: '1.7',
  margin: '0 0 4px',
  textAlign: 'center'
}

const footerLinkStyle: React.CSSProperties = {
  color: '#9CA3AF',
  textDecoration: 'underline'
}

const unsubscribeLinkStyle: React.CSSProperties = {
  color: '#4B5563',
  fontSize: '11px',
  textDecoration: 'underline'
}

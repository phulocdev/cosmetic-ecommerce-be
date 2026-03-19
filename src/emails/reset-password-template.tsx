import React from 'react'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text
} from '@react-email/components'

interface ResetPasswordTemplateProps {
  name: string
  resetToken: string
  clientBaseUrl: string
}

export default function ResetPasswordTemplate({ name, resetToken, clientBaseUrl }: ResetPasswordTemplateProps) {
  const resetLink = `${clientBaseUrl}/reset-password?token=${resetToken}`

  return (
    <Html>
      <Head />
      <Preview>Reset your password</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo Section */}
          <Section style={logoSection}>
            <Img src={`${clientBaseUrl}/logo.png`} width='48' height='48' alt='Logo' style={logo} />
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={heading}>Reset your password</Heading>

            <Text style={greeting}>Hi {name},</Text>

            <Text style={paragraph}>
              We received a request to reset the password for your account. If you didn't make this request, you can
              safely ignore this email.
            </Text>

            <Text style={paragraph}>
              To reset your password, click the button below. This link will expire in <strong>1 hour</strong> for
              security reasons.
            </Text>

            {/* CTA Button */}
            <Section style={buttonSection}>
              <Button style={button} href={resetLink}>
                Reset Password
              </Button>
            </Section>

            <Text style={paragraph}>Or copy and paste this URL into your browser:</Text>

            <Text style={linkText}>
              <Link href={resetLink} style={link}>
                {resetLink}
              </Link>
            </Text>

            <Hr style={divider} />

            {/* Security Notice */}
            <Section style={securitySection}>
              <Text style={securityHeading}>🔒 Security Tips</Text>
              <Text style={securityText}>
                • Never share your password with anyone
                <br />
                • Use a strong, unique password
                <br />• Enable two-factor authentication if available
              </Text>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              If you didn't request a password reset, please ignore this email or{' '}
              <Link href={`${clientBaseUrl}/support`} style={footerLink}>
                contact support
              </Link>{' '}
              if you have concerns.
            </Text>

            <Hr style={footerDivider} />

            <Text style={footerCopyright}>© {new Date().getFullYear()} Your Company. All rights reserved.</Text>

            <Text style={footerAddress}>123 Business Street, Suite 100, City, State 12345</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main: React.CSSProperties = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif'
}

const container: React.CSSProperties = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  maxWidth: '600px',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)'
}

const logoSection: React.CSSProperties = {
  backgroundColor: '#0f172a',
  padding: '32px 40px',
  textAlign: 'center' as const
}

const logo: React.CSSProperties = {
  margin: '0 auto',
  borderRadius: '8px'
}

const content: React.CSSProperties = {
  padding: '40px'
}

const heading: React.CSSProperties = {
  color: '#0f172a',
  fontSize: '28px',
  fontWeight: '700',
  lineHeight: '1.3',
  margin: '0 0 24px',
  textAlign: 'center' as const
}

const greeting: React.CSSProperties = {
  color: '#0f172a',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 16px',
  fontWeight: '600'
}

const paragraph: React.CSSProperties = {
  color: '#475569',
  fontSize: '15px',
  lineHeight: '1.7',
  margin: '0 0 16px'
}

const buttonSection: React.CSSProperties = {
  textAlign: 'center' as const,
  margin: '32px 0'
}

const button: React.CSSProperties = {
  backgroundColor: '#0f172a',
  borderRadius: '8px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: '600',
  padding: '14px 32px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  transition: 'background-color 0.2s ease'
}

const linkText: React.CSSProperties = {
  backgroundColor: '#f1f5f9',
  borderRadius: '6px',
  color: '#64748b',
  fontSize: '13px',
  lineHeight: '1.5',
  margin: '0 0 24px',
  padding: '12px 16px',
  wordBreak: 'break-all' as const
}

const link: React.CSSProperties = {
  color: '#3b82f6',
  textDecoration: 'none'
}

const divider: React.CSSProperties = {
  borderColor: '#e2e8f0',
  borderStyle: 'solid',
  borderWidth: '1px 0 0',
  margin: '24px 0'
}

const securitySection: React.CSSProperties = {
  backgroundColor: '#f8fafc',
  borderRadius: '8px',
  padding: '20px',
  margin: '0 0 8px'
}

const securityHeading: React.CSSProperties = {
  color: '#0f172a',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 8px'
}

const securityText: React.CSSProperties = {
  color: '#64748b',
  fontSize: '13px',
  lineHeight: '1.8',
  margin: '0'
}

const footer: React.CSSProperties = {
  backgroundColor: '#f8fafc',
  padding: '24px 40px',
  textAlign: 'center' as const
}

const footerText: React.CSSProperties = {
  color: '#64748b',
  fontSize: '13px',
  lineHeight: '1.6',
  margin: '0 0 16px'
}

const footerLink: React.CSSProperties = {
  color: '#3b82f6',
  textDecoration: 'underline'
}

const footerDivider: React.CSSProperties = {
  borderColor: '#e2e8f0',
  borderStyle: 'solid',
  borderWidth: '1px 0 0',
  margin: '16px 0'
}

const footerCopyright: React.CSSProperties = {
  color: '#94a3b8',
  fontSize: '12px',
  margin: '0 0 4px'
}

const footerAddress: React.CSSProperties = {
  color: '#94a3b8',
  fontSize: '11px',
  margin: '0'
}

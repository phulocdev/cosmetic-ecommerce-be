// emails/welcome.tsx
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text
} from '@react-email/components'
import * as React from 'react'

interface WelcomeEmailProps {
  name: string
  confirmationUrl: string
}

export const WelcomeEmail = ({ name, confirmationUrl }: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to our platform, {name}!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Welcome, {name}! 👋</Heading>
        <Text style={text}>Thanks for signing up! We're excited to have you on board.</Text>
        <Section style={buttonContainer}>
          <Button style={button} href={confirmationUrl}>
            Confirm Your Email
          </Button>
        </Section>
        <Text style={footer}>If you didn't create this account, you can safely ignore this email.</Text>
      </Container>
    </Body>
  </Html>
)

export default WelcomeEmail

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
  margin: '40px 0',
  padding: '0',
  textAlign: 'center' as const
}

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  textAlign: 'center' as const
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0'
}

const button = {
  backgroundColor: '#5469d4',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px'
}

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center' as const,
  marginTop: '32px'
}

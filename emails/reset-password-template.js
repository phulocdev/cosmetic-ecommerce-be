"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const components_1 = require("@react-email/components");
function ResetPasswordTemplate({ name, resetToken, clientBaseUrl }) {
    const resetLink = `${clientBaseUrl}/reset-password?token=${resetToken}`;
    return (react_1.default.createElement(components_1.Html, null,
        react_1.default.createElement(components_1.Head, null),
        react_1.default.createElement(components_1.Preview, null, "Reset your password"),
        react_1.default.createElement(components_1.Body, { style: main },
            react_1.default.createElement(components_1.Container, { style: container },
                react_1.default.createElement(components_1.Section, { style: logoSection },
                    react_1.default.createElement(components_1.Img, { src: `${clientBaseUrl}/logo.png`, width: '48', height: '48', alt: 'Logo', style: logo })),
                react_1.default.createElement(components_1.Section, { style: content },
                    react_1.default.createElement(components_1.Heading, { style: heading }, "Reset your password"),
                    react_1.default.createElement(components_1.Text, { style: greeting },
                        "Hi ",
                        name,
                        ","),
                    react_1.default.createElement(components_1.Text, { style: paragraph }, "We received a request to reset the password for your account. If you didn't make this request, you can safely ignore this email."),
                    react_1.default.createElement(components_1.Text, { style: paragraph },
                        "To reset your password, click the button below. This link will expire in ",
                        react_1.default.createElement("strong", null, "1 hour"),
                        " for security reasons."),
                    react_1.default.createElement(components_1.Section, { style: buttonSection },
                        react_1.default.createElement(components_1.Button, { style: button, href: resetLink }, "Reset Password")),
                    react_1.default.createElement(components_1.Text, { style: paragraph }, "Or copy and paste this URL into your browser:"),
                    react_1.default.createElement(components_1.Text, { style: linkText },
                        react_1.default.createElement(components_1.Link, { href: resetLink, style: link }, resetLink)),
                    react_1.default.createElement(components_1.Hr, { style: divider }),
                    react_1.default.createElement(components_1.Section, { style: securitySection },
                        react_1.default.createElement(components_1.Text, { style: securityHeading }, "\uD83D\uDD12 Security Tips"),
                        react_1.default.createElement(components_1.Text, { style: securityText },
                            "\u2022 Never share your password with anyone",
                            react_1.default.createElement("br", null),
                            "\u2022 Use a strong, unique password",
                            react_1.default.createElement("br", null),
                            "\u2022 Enable two-factor authentication if available"))),
                react_1.default.createElement(components_1.Section, { style: footer },
                    react_1.default.createElement(components_1.Text, { style: footerText },
                        "If you didn't request a password reset, please ignore this email or",
                        ' ',
                        react_1.default.createElement(components_1.Link, { href: `${clientBaseUrl}/support`, style: footerLink }, "contact support"),
                        ' ',
                        "if you have concerns."),
                    react_1.default.createElement(components_1.Hr, { style: footerDivider }),
                    react_1.default.createElement(components_1.Text, { style: footerCopyright },
                        "\u00A9 ",
                        new Date().getFullYear(),
                        " Your Company. All rights reserved."),
                    react_1.default.createElement(components_1.Text, { style: footerAddress }, "123 Business Street, Suite 100, City, State 12345"))))));
}
exports.default = ResetPasswordTemplate;
const main = {
    backgroundColor: '#f6f9fc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif'
};
const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    maxWidth: '600px',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)'
};
const logoSection = {
    backgroundColor: '#0f172a',
    padding: '32px 40px',
    textAlign: 'center'
};
const logo = {
    margin: '0 auto',
    borderRadius: '8px'
};
const content = {
    padding: '40px'
};
const heading = {
    color: '#0f172a',
    fontSize: '28px',
    fontWeight: '700',
    lineHeight: '1.3',
    margin: '0 0 24px',
    textAlign: 'center'
};
const greeting = {
    color: '#0f172a',
    fontSize: '16px',
    lineHeight: '1.6',
    margin: '0 0 16px',
    fontWeight: '600'
};
const paragraph = {
    color: '#475569',
    fontSize: '15px',
    lineHeight: '1.7',
    margin: '0 0 16px'
};
const buttonSection = {
    textAlign: 'center',
    margin: '32px 0'
};
const button = {
    backgroundColor: '#0f172a',
    borderRadius: '8px',
    color: '#ffffff',
    display: 'inline-block',
    fontSize: '16px',
    fontWeight: '600',
    padding: '14px 32px',
    textDecoration: 'none',
    textAlign: 'center',
    transition: 'background-color 0.2s ease'
};
const linkText = {
    backgroundColor: '#f1f5f9',
    borderRadius: '6px',
    color: '#64748b',
    fontSize: '13px',
    lineHeight: '1.5',
    margin: '0 0 24px',
    padding: '12px 16px',
    wordBreak: 'break-all'
};
const link = {
    color: '#3b82f6',
    textDecoration: 'none'
};
const divider = {
    borderColor: '#e2e8f0',
    borderStyle: 'solid',
    borderWidth: '1px 0 0',
    margin: '24px 0'
};
const securitySection = {
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    padding: '20px',
    margin: '0 0 8px'
};
const securityHeading = {
    color: '#0f172a',
    fontSize: '14px',
    fontWeight: '600',
    margin: '0 0 8px'
};
const securityText = {
    color: '#64748b',
    fontSize: '13px',
    lineHeight: '1.8',
    margin: '0'
};
const footer = {
    backgroundColor: '#f8fafc',
    padding: '24px 40px',
    textAlign: 'center'
};
const footerText = {
    color: '#64748b',
    fontSize: '13px',
    lineHeight: '1.6',
    margin: '0 0 16px'
};
const footerLink = {
    color: '#3b82f6',
    textDecoration: 'underline'
};
const footerDivider = {
    borderColor: '#e2e8f0',
    borderStyle: 'solid',
    borderWidth: '1px 0 0',
    margin: '16px 0'
};
const footerCopyright = {
    color: '#94a3b8',
    fontSize: '12px',
    margin: '0 0 4px'
};
const footerAddress = {
    color: '#94a3b8',
    fontSize: '11px',
    margin: '0'
};
//# sourceMappingURL=reset-password-template.js.map
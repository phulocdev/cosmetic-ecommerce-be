import React from 'react';
interface ResetPasswordTemplateProps {
    name: string;
    resetToken: string;
    clientBaseUrl: string;
}
export default function ResetPasswordTemplate({ name, resetToken, clientBaseUrl }: ResetPasswordTemplateProps): React.JSX.Element;
export {};

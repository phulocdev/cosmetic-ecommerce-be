"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const mailer_1 = require("@nestjs-modules/mailer");
const render_1 = require("@react-email/render");
const config_1 = require("@nestjs/config");
const welcome_1 = __importDefault(require("../../emails/welcome"));
const reset_password_template_1 = __importDefault(require("../../emails/reset-password-template"));
let EmailService = class EmailService {
    mailerService;
    configService;
    constructor(mailerService, configService) {
        this.mailerService = mailerService;
        this.configService = configService;
    }
    async renderWelcomeEmail(name, confirmationUrl) {
        return (0, render_1.render)((0, welcome_1.default)({ name, confirmationUrl }), {
            pretty: this.configService.get('NODE_ENV') !== 'production'
        });
    }
    async renderPasswordResetEmail(name, resetToken) {
        return (0, render_1.render)((0, reset_password_template_1.default)({
            name,
            resetToken,
            clientBaseUrl: this.configService.get('CLIENT_BASE_URL')
        }), {
            pretty: this.configService.get('NODE_ENV') !== 'production'
        });
    }
    async sendPasswordResetEmail(email, resetToken) {
        await this.mailerService
            .sendMail({
            to: email,
            subject: 'Password Reset Request',
            html: await this.renderPasswordResetEmail(email, resetToken)
        })
            .catch((err) => {
            console.error('Error sending password reset email:', err);
            throw err;
        });
    }
    async sendWelcomeEmail(email, name) {
        await this.mailerService
            .sendMail({
            to: email,
            subject: 'Welcome to Our App',
            html: await this.renderWelcomeEmail(name, 'http://facebook.com/phamphulocc')
        })
            .catch((err) => {
            console.error('Error sending welcome email:', err);
            throw err;
        });
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mailer_1.MailerService,
        config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map
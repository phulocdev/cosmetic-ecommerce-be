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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const email_service_1 = require("./email.service");
let EmailProcessor = class EmailProcessor {
    emailService;
    constructor(emailService) {
        this.emailService = emailService;
    }
    async handleWelcomeEmail(job) {
        const { email, name } = job.data;
        await this.emailService.sendWelcomeEmail(email, name);
    }
    async handlePasswordResetEmail(job) {
        const { email, resetToken } = job.data;
        await this.emailService.sendPasswordResetEmail(email, resetToken);
    }
    async onFailed(job, error) {
        console.error(`Job ${job.id} failed with error: ${error.message}`);
    }
};
exports.EmailProcessor = EmailProcessor;
__decorate([
    (0, bull_1.Process)('welcome'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmailProcessor.prototype, "handleWelcomeEmail", null);
__decorate([
    (0, bull_1.Process)('password-reset'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmailProcessor.prototype, "handlePasswordResetEmail", null);
__decorate([
    (0, bull_1.OnQueueFailed)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Error]),
    __metadata("design:returntype", Promise)
], EmailProcessor.prototype, "onFailed", null);
exports.EmailProcessor = EmailProcessor = __decorate([
    (0, bull_1.Processor)('email'),
    __metadata("design:paramtypes", [email_service_1.EmailService])
], EmailProcessor);
//# sourceMappingURL=email.processor.js.map
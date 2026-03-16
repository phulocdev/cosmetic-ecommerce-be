"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TempFileCleanupService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TempFileCleanupService = void 0;
const common_1 = require("@nestjs/common");
const config_service_1 = require("@nestjs/config/dist/config.service");
const schedule_1 = require("@nestjs/schedule");
const upload_constants_1 = require("./upload.constants");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let TempFileCleanupService = TempFileCleanupService_1 = class TempFileCleanupService {
    configService;
    logger = new common_1.Logger(TempFileCleanupService_1.name);
    constructor(configService) {
        this.configService = configService;
    }
    async sweepOrphanedTempFiles() {
        this.logger.log('Running orphaned temp file sweep...');
        if (!fs.existsSync(upload_constants_1.TEMP_UPLOAD_DIR)) {
            this.logger.debug(`Temp dir does not exist yet: ${upload_constants_1.TEMP_UPLOAD_DIR}`);
            return;
        }
        let entries;
        try {
            entries = fs.readdirSync(upload_constants_1.TEMP_UPLOAD_DIR, { withFileTypes: true });
        }
        catch (err) {
            this.logger.error(`Failed to read temp dir: ${err.message}`);
            return;
        }
        const now = Date.now();
        let deleted = 0;
        let failed = 0;
        for (const entry of entries) {
            if (!entry.isFile())
                continue;
            const filePath = path.join(upload_constants_1.TEMP_UPLOAD_DIR, entry.name);
            try {
                const stat = fs.statSync(filePath);
                const ageMs = now - stat.mtimeMs;
                if (ageMs >= upload_constants_1.TEMP_FILE_MAX_AGE_MS) {
                    fs.unlinkSync(filePath);
                    deleted++;
                    this.logger.debug(`Deleted orphaned temp file: ${entry.name} ` +
                        `(age: ${(ageMs / 1000 / 60).toFixed(1)} min)`);
                }
            }
            catch (err) {
                failed++;
                this.logger.warn(`Could not process temp file ${entry.name}: ${err.message}`);
            }
        }
        this.logger.log(`Sweep complete — deleted: ${deleted}, failed: ${failed}, ` +
            `skipped: ${entries.filter((e) => e.isFile()).length - deleted - failed}`);
    }
};
exports.TempFileCleanupService = TempFileCleanupService;
__decorate([
    (0, schedule_1.Cron)(upload_constants_1.CLEANUP_CRON_EXPRESSION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TempFileCleanupService.prototype, "sweepOrphanedTempFiles", null);
exports.TempFileCleanupService = TempFileCleanupService = TempFileCleanupService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_service_1.ConfigService])
], TempFileCleanupService);
//# sourceMappingURL=file-cleanup.service.js.map
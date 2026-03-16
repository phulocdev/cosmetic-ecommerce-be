"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildUtcDateRange = buildUtcDateRange;
const date_fns_tz_1 = require("date-fns-tz");
const common_1 = require("@nestjs/common");
function buildUtcDateRange(startDate, endDate, timezone = 'UTC') {
    if (!startDate && !endDate)
        return undefined;
    if (!startDate || !endDate) {
        throw new common_1.BadRequestException('Both startDate and endDate must be provided together');
    }
    try {
        const start = (0, date_fns_tz_1.fromZonedTime)(`${startDate}T00:00:00`, timezone);
        const end = (0, date_fns_tz_1.fromZonedTime)(`${endDate}T23:59:59.999`, timezone);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new Error();
        }
        if (start > end) {
            throw new common_1.BadRequestException('startDate must be before or equal to endDate');
        }
        return { from: start, to: end };
    }
    catch (e) {
        if (e instanceof common_1.BadRequestException)
            throw e;
        throw new common_1.BadRequestException('Invalid date or timezone. Use YYYY-MM-DD and a valid IANA timezone');
    }
}
//# sourceMappingURL=date.util.js.map
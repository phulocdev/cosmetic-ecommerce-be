"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeIp = normalizeIp;
function normalizeIp(ip) {
    if (ip === '::1')
        return '127.0.0.1';
    if (ip.startsWith('::ffff:'))
        return ip.replace('::ffff:', '');
    return ip;
}
//# sourceMappingURL=network.util.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateProductCode = generateProductCode;
exports.generateVariantSku = generateVariantSku;
exports.slugifyString = slugifyString;
function generateProductCode(productName) {
    const clean = productName
        .toUpperCase()
        .replace(/[^A-Z0-9 ]/g, '')
        .split(/\s+/)
        .filter(Boolean);
    const prefix = clean
        .slice(0, 2)
        .map((word) => word.slice(0, 2))
        .join('');
    let hash = 0;
    for (let i = 0; i < productName.length; i++) {
        hash = (hash << 5) - hash + productName.charCodeAt(i);
        hash |= 0;
    }
    const unique = Math.abs(hash).toString(36).substring(0, 4).toUpperCase();
    return `${prefix}-${unique}`;
}
function generateVariantSku(productCode, attributeValues) {
    const sorted = [...attributeValues].sort((a, b) => a.attributeValueId.localeCompare(b.attributeValueId));
    const attributePart = sorted
        .map((attr) => attr.value
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .slice(0, 3))
        .join('-');
    return `${productCode}-${attributePart}`;
}
function slugifyString(str) {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}
//# sourceMappingURL=business.util.js.map
export interface UtcDateRange {
    from: Date;
    to: Date;
}
export declare function buildUtcDateRange(startDate?: string, endDate?: string, timezone?: string): UtcDateRange | undefined;

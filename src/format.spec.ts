import { FormatUtils } from './format';

describe('FormatUtils.numberWithCommas', () => {
    it('adds commas to the integer portion', () => {
        expect(FormatUtils.numberWithCommas(1234567)).toBe('1,234,567');
    });

    it('does not add commas after decimal points', () => {
        expect(FormatUtils.numberWithCommas('622916.3870740607')).toBe('622,916.3870740607');
    });

    it('preserves existing behavior for non-numeric values', () => {
        expect(FormatUtils.numberWithCommas('not-a-number')).toBe('not-a-number');
    });

    it('handles small decimal values like 0.0X correctly', () => {
        expect(FormatUtils.numberWithCommas(0.01)).toBe('0.01');
        expect(FormatUtils.numberWithCommas(0.001)).toBe('0.001');
        expect(FormatUtils.numberWithCommas(0.0001)).toBe('0.0001');
        expect(FormatUtils.numberWithCommas('0.0001')).toBe('0.0001');
    });
});

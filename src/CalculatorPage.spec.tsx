import React from 'react';
import ReactDOMClient from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import CalculatorPage, { readCalculatorQueryParams, sanitizeNumericValue } from './CalculatorPage';

function setInputValue(container: HTMLElement, id: string, value: string) {
    const input = container.querySelector(`#${id}`) as HTMLInputElement;
    const valueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;

    valueSetter.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
}

describe('sanitizeNumericValue', () => {
    it('accepts numeric values', () => {
        expect(sanitizeNumericValue('90')).toEqual('90');
        expect(sanitizeNumericValue(' 0.25 ')).toEqual('0.25');
        expect(sanitizeNumericValue('-1')).toEqual('-1');
        expect(sanitizeNumericValue('1e3')).toEqual('1e3');
    });

    it('rejects anything that is not a plain number', () => {
        expect(sanitizeNumericValue(null)).toBeNull();
        expect(sanitizeNumericValue('')).toBeNull();
        expect(sanitizeNumericValue('90abc')).toBeNull();
        expect(sanitizeNumericValue('Infinity')).toBeNull();
        expect(sanitizeNumericValue('1,000')).toBeNull();
        expect(sanitizeNumericValue('<script>alert(1)</script>')).toBeNull();
        expect(sanitizeNumericValue('javascript:alert(1)')).toBeNull();
        expect(sanitizeNumericValue('1e999')).toBeNull();
    });
});

describe('readCalculatorQueryParams', () => {
    it('only returns numeric parameters', () => {
        const values = readCalculatorQueryParams('?confidenceInterval=95&impactMin=1000&impactMax="><img src=x onerror=alert(1)>');

        expect(values).toEqual({
            confidenceInterval: '95',
            impactMin: '1000'
        });
    });
});

describe('CalculatorPage', () => {
    let container: HTMLElement;
    let root: ReactDOMClient.Root;

    async function renderPage(search: string = '') {
        window.history.replaceState(null, '', `/calculator${search}`);

        container = document.createElement('div');
        document.body.appendChild(container);
        root = ReactDOMClient.createRoot(container);

        await act(async () => {
            root.render(<CalculatorPage />);
        });
    }

    afterEach(async () => {
        await act(async () => {
            root.unmount();
        });
        document.body.removeChild(container);
        window.history.replaceState(null, '', '/');
    });

    it('defaults the confidence interval to 90', async () => {
        await renderPage();

        expect((container.querySelector('#confidenceInterval') as HTMLInputElement).value).toEqual('90');
    });

    it('shows validation errors when the inputs are invalid', async () => {
        await renderPage();

        await act(async () => {
            (container.querySelector('#calculateButton') as HTMLElement).click();
        });

        expect(container.textContent).toContain('Impact range values must be positive numbers.');
        expect(container.textContent).not.toContain('Expected Loss');
    });

    it('shows the expected loss and a loss exceedance curve for valid inputs', async () => {
        await renderPage();

        await act(async () => {
            setInputValue(container, 'impactMin', '1000');
            setInputValue(container, 'impactMax', '10000');
            setInputValue(container, 'likelihoodMin', '0.1');
            setInputValue(container, 'likelihoodExpected', '0.2');
            setInputValue(container, 'likelihoodMax', '0.6');
        });

        await act(async () => {
            (container.querySelector('#calculateButton') as HTMLElement).click();
        });

        expect(container.textContent).toContain('Expected Loss');
        expect(container.querySelector('svg[aria-label="Loss exceedance curve"]')).not.toBeNull();
        expect(container.querySelectorAll('svg[aria-label="Loss exceedance curve"] polyline').length).toEqual(1);

        const expectedLoss = Number(container.querySelector('#expectedLoss').textContent.replace(/[$,]/g, ''));

        expect(expectedLoss).toBeGreaterThan(0);
        expect(expectedLoss).toBeLessThan(10000);
    });

    it('writes the inputs to the URL as they change', async () => {
        await renderPage();

        await act(async () => {
            setInputValue(container, 'impactMin', '1000');
            setInputValue(container, 'impactMax', '10000');
        });

        const params = new URLSearchParams(window.location.search);

        expect(params.get('confidenceInterval')).toEqual('90');
        expect(params.get('impactMin')).toEqual('1000');
        expect(params.get('impactMax')).toEqual('10000');
        expect(params.get('likelihoodMin')).toBeNull();
    });

    it('removes a parameter from the URL when its input is cleared', async () => {
        await renderPage('?impactMin=1000');

        await act(async () => {
            setInputValue(container, 'impactMin', '');
        });

        expect(new URLSearchParams(window.location.search).get('impactMin')).toBeNull();
    });

    it('prefers valid query parameters over the defaults and reproduces the result', async () => {
        await renderPage('?confidenceInterval=80&impactMin=1000&impactMax=10000&likelihoodMin=0.1&likelihoodExpected=0.2&likelihoodMax=0.6');

        expect((container.querySelector('#confidenceInterval') as HTMLInputElement).value).toEqual('80');
        expect((container.querySelector('#impactMin') as HTMLInputElement).value).toEqual('1000');
        expect((container.querySelector('#likelihoodExpected') as HTMLInputElement).value).toEqual('0.2');

        expect(container.textContent).toContain('Expected Loss');
        expect(container.querySelector('svg[aria-label="Loss exceedance curve"]')).not.toBeNull();
    });

    it('ignores non numeric query parameters', async () => {
        await renderPage('?confidenceInterval=%3Cscript%3Ealert(1)%3C%2Fscript%3E&impactMin=notanumber');

        expect((container.querySelector('#confidenceInterval') as HTMLInputElement).value).toEqual('90');
        expect((container.querySelector('#impactMin') as HTMLInputElement).value).toEqual('');
        expect(container.textContent).not.toContain('alert(1)');
        expect(container.textContent).not.toContain('Expected Loss');
    });

    it('keeps unrelated query parameters intact', async () => {
        await renderPage('?theme=dark');

        await act(async () => {
            setInputValue(container, 'impactMin', '1000');
        });

        expect(new URLSearchParams(window.location.search).get('theme')).toEqual('dark');
    });
});

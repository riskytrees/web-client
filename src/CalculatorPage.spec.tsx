import React from 'react';
import ReactDOMClient from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import CalculatorPage from './CalculatorPage';

function setInputValue(container: HTMLElement, id: string, value: string) {
    const input = container.querySelector(`#${id}`) as HTMLInputElement;
    const valueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;

    valueSetter.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
}

describe('CalculatorPage', () => {
    let container: HTMLElement;
    let root: ReactDOMClient.Root;

    beforeEach(async () => {
        container = document.createElement('div');
        document.body.appendChild(container);
        root = ReactDOMClient.createRoot(container);

        await act(async () => {
            root.render(<CalculatorPage />);
        });
    });

    afterEach(async () => {
        await act(async () => {
            root.unmount();
        });
        document.body.removeChild(container);
    });

    it('defaults the confidence interval to 90', () => {
        expect((container.querySelector('#confidenceInterval') as HTMLInputElement).value).toEqual('90');
    });

    it('shows validation errors when the inputs are invalid', async () => {
        await act(async () => {
            (container.querySelector('#calculateButton') as HTMLElement).click();
        });

        expect(container.textContent).toContain('Impact range values must be positive numbers.');
        expect(container.textContent).not.toContain('Expected Loss');
    });

    it('shows the expected loss and a loss exceedance curve for valid inputs', async () => {
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
});

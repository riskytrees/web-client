import React from 'react';
import ReactDOMClient from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import AnalysisPane from './AnalysisPane';

describe('AnalysisPane', () => {
    it('renders the risk attack value using the computed risk without extra scaling', async () => {
        const container = document.createElement('div');
        document.body.appendChild(container);

        const root = ReactDOMClient.createRoot(container);
        const riskEngine = {
            computeRiskForNode: jest.fn().mockReturnValue({
                computed: {
                    risk: 100000,
                    likelihoodOfSuccess: 0.25
                },
                interface: {
                    primary: 'risk'
                }
            }),
            getMostImpactfulConditions: jest.fn().mockReturnValue({}),
            getDominatingAttackPath: jest.fn().mockReturnValue([{
                name: 'Attack step',
                contribution: {
                    computed: {
                        risk: 100000
                    },
                    interface: {
                        primary: 'risk'
                    }
                }
            }])
        };

        await act(async () => {
            root.render(<AnalysisPane rootNodeId="root" riskEngine={riskEngine as any} selectedModel="model" />);
        });

        expect(container.textContent).toContain('$100,000');
        expect(container.textContent).not.toContain('$10,000,000');
        expect(container.textContent).toContain('Top Attack Path');
        expect(container.textContent).toContain('Attack step');

        await act(async () => {
            root.unmount();
        });
        document.body.removeChild(container);
    });
});

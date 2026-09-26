import { RiskCalculator } from './RiskCalculator';
import { expect } from '@jest/globals';

it('Computes the z-score for a confidence interval', () => {
    expect(RiskCalculator.zScoreForConfidenceInterval(90)).toBeCloseTo(1.6449, 3);
    expect(RiskCalculator.zScoreForConfidenceInterval(95)).toBeCloseTo(1.9600, 3);
    expect(RiskCalculator.zScoreForConfidenceInterval(0)).toBeNaN();
    expect(RiskCalculator.zScoreForConfidenceInterval(100)).toBeNaN();
});

it('Builds a lognormal distribution whose confidence interval matches the impact range', () => {
    const parameters = RiskCalculator.logNormalParametersForRange(1000, 10000, 90);

    expect(parameters.mu).toBeCloseTo((Math.log(1000) + Math.log(10000)) / 2, 6);

    const lowerBound = Math.exp(parameters.mu - (1.6449 * parameters.sigma));
    const upperBound = Math.exp(parameters.mu + (1.6449 * parameters.sigma));

    expect(lowerBound).toBeCloseTo(1000, 0);
    expect(upperBound).toBeCloseTo(10000, 0);
});

it('Samples a lognormal distribution within the expected confidence interval', () => {
    const parameters = RiskCalculator.logNormalParametersForRange(1000, 10000, 90);
    let insideRange = 0;

    for (let i = 0; i < 10000; i++) {
        const sample = RiskCalculator.sampleLogNormal(parameters);

        expect(sample).toBeGreaterThan(0);

        if (sample >= 1000 && sample <= 10000) {
            insideRange++;
        }
    }

    expect(insideRange / 10000).toBeGreaterThan(0.85);
    expect(insideRange / 10000).toBeLessThan(0.95);
});

it('Samples a PERT distribution inside its bounds and around its expected value', () => {
    const parameters = { min: 0.1, expected: 0.2, max: 0.6 };
    const samples: number[] = [];

    for (let i = 0; i < 10000; i++) {
        const sample = RiskCalculator.samplePert(parameters);

        expect(sample).toBeGreaterThanOrEqual(parameters.min);
        expect(sample).toBeLessThanOrEqual(parameters.max);

        samples.push(sample);
    }

    const mean = samples.reduce((total, value) => total + value, 0) / samples.length;
    const expectedMean = (parameters.min + (4 * parameters.expected) + parameters.max) / 6;

    expect(mean).toBeCloseTo(expectedMean, 1);
});

it('Builds a monotonically decreasing loss exceedance curve', () => {
    const curve = RiskCalculator.buildLossExceedanceCurve([1, 2, 3, 4], 4);

    expect(curve.length).toEqual(4);
    expect(curve[0]).toEqual({ loss: 1, probability: 1 });
    expect(curve[curve.length - 1].loss).toEqual(4);
    expect(curve[curve.length - 1].probability).toEqual(0.25);

    for (let i = 1; i < curve.length; i++) {
        expect(curve[i].loss).toBeGreaterThan(curve[i - 1].loss);
        expect(curve[i].probability).toBeLessThanOrEqual(curve[i - 1].probability);
    }
});

it('Runs a Monte Carlo simulation and reports the expected loss', () => {
    const result = RiskCalculator.runSimulation({
        confidenceInterval: 90,
        impactMin: 1000,
        impactMax: 10000,
        likelihoodMin: 0.1,
        likelihoodExpected: 0.2,
        likelihoodMax: 0.6
    });

    expect(result.riskValues.length).toEqual(10000);
    expect(result.lossExceedanceCurve.length).toEqual(100);

    const meanOfValues = result.riskValues.reduce((total, value) => total + value, 0) / result.riskValues.length;
    expect(result.expectedLoss).toBeCloseTo(meanOfValues, 6);

    // Mean of the lognormal impact times the mean of the PERT likelihood.
    const impactParameters = RiskCalculator.logNormalParametersForRange(1000, 10000, 90);
    const expectedImpact = Math.exp(impactParameters.mu + ((impactParameters.sigma * impactParameters.sigma) / 2));
    const expectedLikelihood = (0.1 + (4 * 0.2) + 0.6) / 6;

    expect(result.expectedLoss).toBeGreaterThan(expectedImpact * expectedLikelihood * 0.8);
    expect(result.expectedLoss).toBeLessThan(expectedImpact * expectedLikelihood * 1.2);
});

it('Reports validation errors for invalid inputs', () => {
    const errors = RiskCalculator.validateInputs({
        confidenceInterval: 120,
        impactMin: -1,
        impactMax: 10000,
        likelihoodMin: 0.5,
        likelihoodExpected: 0.2,
        likelihoodMax: 0.6
    });

    expect(errors.length).toEqual(3);

    expect(RiskCalculator.validateInputs({
        confidenceInterval: 90,
        impactMin: 1000,
        impactMax: 10000,
        likelihoodMin: 0.1,
        likelihoodExpected: 0.2,
        likelihoodMax: 0.6
    })).toEqual([]);
});

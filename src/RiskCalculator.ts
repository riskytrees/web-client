export interface LogNormalParameters {
    mu: number;
    sigma: number;
}

export interface PertParameters {
    min: number;
    expected: number;
    max: number;
}

export interface RiskCalculatorInputs {
    confidenceInterval: number;
    impactMin: number;
    impactMax: number;
    likelihoodMin: number;
    likelihoodExpected: number;
    likelihoodMax: number;
}

export interface LossExceedancePoint {
    loss: number;
    probability: number;
}

export interface RiskSimulationResult {
    riskValues: number[];
    expectedLoss: number;
    lossExceedanceCurve: LossExceedancePoint[];
}

type RandomSource = () => number;

export class RiskCalculator {
    static DEFAULT_ITERATIONS = 10000;
    static DEFAULT_CURVE_POINTS = 100;

    /**
     * Returns a value in the open interval (0, 1), which keeps the log based
     * transforms below well defined.
     */
    private static nextRandom(random: RandomSource): number {
        let value = random();

        while (value <= 0 || value >= 1) {
            value = value <= 0 ? Number.EPSILON : random();
        }

        return value;
    }

    /**
     * Inverse of the standard normal cumulative distribution function using
     * Acklam's rational approximation.
     */
    static inverseStandardNormalCdf(probability: number): number {
        if (probability <= 0 || probability >= 1) {
            return NaN;
        }

        const a = [-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00];
        const b = [-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 6.680131188771972e+01, -1.328068155288572e+01];
        const c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00];
        const d = [7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00];

        const lowerBreakpoint = 0.02425;
        const upperBreakpoint = 1 - lowerBreakpoint;

        if (probability < lowerBreakpoint) {
            const q = Math.sqrt(-2 * Math.log(probability));
            return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
                ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
        }

        if (probability > upperBreakpoint) {
            const q = Math.sqrt(-2 * Math.log(1 - probability));
            return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
                ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
        }

        const q = probability - 0.5;
        const r = q * q;
        return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
            (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
    }

    /**
     * Two tailed z-score for a confidence interval expressed as a percentage,
     * e.g. 90 returns ~1.645.
     */
    static zScoreForConfidenceInterval(confidenceInterval: number): number {
        if (!(confidenceInterval > 0) || confidenceInterval >= 100) {
            return NaN;
        }

        return RiskCalculator.inverseStandardNormalCdf((1 + (confidenceInterval / 100)) / 2);
    }

    /**
     * Builds a lognormal distribution whose confidence interval spans the
     * provided impact range. The bounds are sorted so either ordering works.
     */
    static logNormalParametersForRange(lowerBound: number, upperBound: number, confidenceInterval: number): LogNormalParameters {
        const a = Math.min(lowerBound, upperBound);
        const b = Math.max(lowerBound, upperBound);

        if (!(a > 0) || !(b > 0)) {
            return { mu: NaN, sigma: NaN };
        }

        const zScore = RiskCalculator.zScoreForConfidenceInterval(confidenceInterval);
        const mu = (Math.log(a) + Math.log(b)) / 2;
        // The range covers both tails of the distribution, so the full width of
        // the interval is 2 * z standard deviations.
        const sigma = (Math.log(b) - Math.log(a)) / (2 * zScore);

        return { mu, sigma };
    }

    static sampleLogNormal(parameters: LogNormalParameters, random: RandomSource = Math.random): number {
        if (!(parameters.sigma > 0)) {
            return Math.exp(parameters.mu);
        }

        // Box-Muller transform
        const u1 = RiskCalculator.nextRandom(random);
        const u2 = RiskCalculator.nextRandom(random);
        const standardNormal = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);

        return Math.exp(parameters.mu + (parameters.sigma * standardNormal));
    }

    /**
     * Marsaglia and Tsang's method for sampling a gamma distribution with the
     * provided shape and a scale of 1.
     */
    private static sampleGamma(shape: number, random: RandomSource): number {
        if (shape < 1) {
            const boost = Math.pow(RiskCalculator.nextRandom(random), 1 / shape);
            return RiskCalculator.sampleGamma(shape + 1, random) * boost;
        }

        const d = shape - (1 / 3);
        const c = 1 / Math.sqrt(9 * d);

        // eslint-disable-next-line no-constant-condition
        while (true) {
            const u1 = RiskCalculator.nextRandom(random);
            const u2 = RiskCalculator.nextRandom(random);
            const standardNormal = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
            const v = Math.pow(1 + (c * standardNormal), 3);

            if (v <= 0) {
                continue;
            }

            const uniform = RiskCalculator.nextRandom(random);

            if (Math.log(uniform) < (0.5 * standardNormal * standardNormal) + d - (d * v) + (d * Math.log(v))) {
                return d * v;
            }
        }
    }

    private static sampleBeta(alpha: number, beta: number, random: RandomSource): number {
        const x = RiskCalculator.sampleGamma(alpha, random);
        const y = RiskCalculator.sampleGamma(beta, random);

        if (x + y === 0) {
            return 0;
        }

        return x / (x + y);
    }

    /**
     * Samples a PERT distribution defined by a minimum, an expected (most
     * likely) value and a maximum.
     */
    static samplePert(parameters: PertParameters, random: RandomSource = Math.random): number {
        const { min, expected, max } = parameters;
        const range = max - min;

        if (!(range > 0)) {
            return min;
        }

        const alpha = 1 + (4 * (expected - min) / range);
        const beta = 1 + (4 * (max - expected) / range);

        return min + (RiskCalculator.sampleBeta(alpha, beta, random) * range);
    }

    static validateInputs(inputs: RiskCalculatorInputs): string[] {
        const errors: string[] = [];

        if (!(inputs.confidenceInterval > 0) || inputs.confidenceInterval >= 100) {
            errors.push("Confidence interval must be greater than 0 and less than 100.");
        }

        if (!(inputs.impactMin > 0) || !(inputs.impactMax > 0)) {
            errors.push("Impact range values must be positive numbers.");
        } else if (inputs.impactMin === inputs.impactMax) {
            errors.push("Impact range values must be different from each other.");
        }

        const likelihoods = [inputs.likelihoodMin, inputs.likelihoodExpected, inputs.likelihoodMax];

        if (likelihoods.some(value => !(value > 0) || value > 1)) {
            errors.push("Likelihood values must be greater than 0 and no greater than 1.");
        } else if (!(inputs.likelihoodMin <= inputs.likelihoodExpected && inputs.likelihoodExpected <= inputs.likelihoodMax)) {
            errors.push("Likelihood values must be ordered as min <= expected <= max.");
        }

        return errors;
    }

    /**
     * Builds a loss exceedance curve: for each loss level, the probability that
     * the simulated loss is at least that large.
     */
    static buildLossExceedanceCurve(riskValues: number[], points: number = RiskCalculator.DEFAULT_CURVE_POINTS): LossExceedancePoint[] {
        if (riskValues.length === 0 || points < 2) {
            return [];
        }

        const sorted = [...riskValues].sort((left, right) => left - right);
        const minimum = sorted[0];
        const maximum = sorted[sorted.length - 1];
        const step = (maximum - minimum) / (points - 1);
        const curve: LossExceedancePoint[] = [];
        // Both the losses and the sorted values increase, so a single cursor can
        // track how many values are below the current loss level.
        let cursor = 0;

        for (let index = 0; index < points; index++) {
            const loss = step > 0 ? minimum + (step * index) : minimum;

            while (cursor < sorted.length && sorted[cursor] < loss) {
                cursor++;
            }

            curve.push({
                loss,
                probability: (sorted.length - cursor) / sorted.length
            });
        }

        return curve;
    }

    /**
     * Runs a Monte Carlo simulation multiplying a sampled impact by a sampled
     * likelihood of occurrence to get a risk value for each iteration.
     */
    static runSimulation(
        inputs: RiskCalculatorInputs,
        iterations: number = RiskCalculator.DEFAULT_ITERATIONS,
        random: RandomSource = Math.random
    ): RiskSimulationResult {
        const impactParameters = RiskCalculator.logNormalParametersForRange(inputs.impactMin, inputs.impactMax, inputs.confidenceInterval);
        const likelihoodParameters: PertParameters = {
            min: inputs.likelihoodMin,
            expected: inputs.likelihoodExpected,
            max: inputs.likelihoodMax
        };

        const riskValues: number[] = [];

        for (let iteration = 0; iteration < iterations; iteration++) {
            const impact = RiskCalculator.sampleLogNormal(impactParameters, random);
            const likelihood = RiskCalculator.samplePert(likelihoodParameters, random);

            riskValues.push(impact * likelihood);
        }

        const expectedLoss = riskValues.reduce((total, value) => total + value, 0) / (riskValues.length || 1);

        return {
            riskValues,
            expectedLoss,
            lossExceedanceCurve: RiskCalculator.buildLossExceedanceCurve(riskValues)
        };
    }
}

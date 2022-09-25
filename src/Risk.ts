import TreeData from './interfaces/TreeData';

export interface NodeRiskResult {
    computed: Record<string, Record<string, any>>;
    interface: Record<string, any>
}

export class RiskyRisk {
    constructor(private treeData: TreeData ) {
    }

    // Returns an object of computed values:
    // {
    //   "computed": {...},
    //   "interface": { "primary": "keyNameInComputed" }
    // }
    //
    computeRiskForNode(nodeId: string, riskModel: string) {
        let result = {};

        // For now, add empty attributes for the appropriate model.
        if (riskModel === 'b9ff54e0-37cf-41d4-80ea-f3a9b1e3af74') {
            // Attacker likelihood
            return this.computeAttackerLikelihood(nodeId);
        } else if (riskModel === 'f1644cb9-b2a5-4abb-813f-98d0277e42f2') {
            // Risk of Attack
            const relevantProperties = ['likelihoodOfSuccess', 'impactToDefender']
        } else if (riskModel === 'bf4397f7-93ae-4502-a4a2-397f40f5cc49') {
            // EVITA
            const relevantProperties = ['safetyImpact', 'financialImpact', 'privacyImpact', 'operationalImpact'];
            relevantProperties.concat(['time', 'expertise', 'knowledge', 'windowOfOpportunity', 'equipmentRequired']);
        }
    }

    getNode(nodeId: string) {
        for (const node of this.treeData.nodes) {
            if (node.id === nodeId) {
                return node;
            }
        }

        return null;
    }

    computeAttackerLikelihood(nodeId: string) {
        const node = this.getNode(nodeId);
        let result = null;

        if (node) {
            if (node.modelAttributes['likelihoodOfSuccess']) {
                result = node.modelAttributes['likelihoodOfSuccess']['value_float'];
            } else {
                // Need to inherit from children
                let nodeType = '';
                if (node.modelAttributes['node_type']) {
                    nodeType = node.modelAttributes['node_type']['value_string'];
                }
    
                const childLikelihoodValues = node.children.map(childId => this.computeAttackerLikelihood(childId));
    
                if (nodeType === 'and') {
                    result = childLikelihoodValues.reduce((acc, val) => acc * val['computed']['likelihoodOfSuccess'], 1);
                } else {
                    // Assumes mutual exclusion. Max of 1
                    result = Math.min(1.0, childLikelihoodValues.reduce((acc, val) => {
                        const jointProb = acc * val['computed']['likelihoodOfSuccess'];
                        return acc + val['computed']['likelihoodOfSuccess'] - jointProb;
                    }, 0));
                }
            }
        }

        return {
            computed: {
                likelihoodOfSuccess: result
            },
            interface: {
                primary: 'likelihoodOfSuccess'
            }
        }

    }
}
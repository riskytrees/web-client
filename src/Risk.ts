import TreeData from './interfaces/TreeData';

export interface NodeRiskResult {
    computed: Record<string, string | number>;
    interface: Record<string, any>
}

export class RiskyRisk {
    constructor(private treeMap: Record<string, TreeData>, private rootTreeId: string ) {
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
            return this.computeAttackRisk(nodeId);
        } else if (riskModel === 'bf4397f7-93ae-4502-a4a2-397f40f5cc49') {
            // EVITA
            return this.computeEVITARisk(nodeId);
        }
    }

    getNode(nodeId: string) {
        for (const tree of Object.values(this.treeMap)) {
            for (const node of tree.nodes) {
                if (node.id === nodeId) {
                    return node;
                }
            }
        }


        return null;
    }

    getInheritedEVITAValue(children, nodeType: string, attribute: string) {
        let result = null

        // If there are no children then inherit nothing.
        if (children.length === 0) {
            return null;
        }

        // All children must have valid properties otherwise return null
        for (const child of children) {
            if (!child.computed[attribute] || !child.computed[attribute]['value_int']) {
                return null;
            }
        }

        if (nodeType === 'and') {
            result = children.reduce((l, r) => l.computed[attribute]['value_int'] > r.computed[attribute]['value_int'] ? l.computed[attribute]['value_int'] : r.computed[attribute]['value_int'])
        } else if (nodeType === 'or') {
            result = children.reduce((l, r) => l.computed[attribute]['value_int'] < r.computed[attribute]['value_int'] ? l.computed[attribute]['value_int'] : r.computed[attribute]['value_int'])
        }

        return result;
    }

    getEVITARiskLevel(combinedAttackProbability: number, severity: number) {
        if (combinedAttackProbability === null || severity === null) {
            return null;
        }

        const evitaTable = [
            [0, 0, 1, 2, 3],
            [0, 1, 2, 3, 4],
            [1, 2, 3, 4, 5],
            [2, 3, 4, 5, 6]
        ];  

        return evitaTable[severity - 1][combinedAttackProbability - 1];
    }

    computeEVITARisk(nodeId: string) {
        const node = this.getNode(nodeId);

        // Severity
        let safetyImpact =  null;
        let financialImpact = null;
        let privacyImpact = null;
        let operationalImpact = null;

        // Attack Potential
        let time = null;
        let expertise = null;
        let knowledge = null;
        let windowOfOpportunity = null;
        let equipmentRequired = null;

        // Risk
        let riskFinancial = null;
        let riskOperational = null;
        let riskPrivacy = null;
        let riskSafety = null;

        if (!this.isNodeComputable(nodeId)) {
            return null;
        }

        if (node) {
            safetyImpact = node.modelAttributes['safetyImpact'] ? node.modelAttributes['safetyImpact']['value_int'] : null;
            financialImpact = node.modelAttributes['financialImpact'] ? node.modelAttributes['financialImpact']['value_int'] : null;
            privacyImpact = node.modelAttributes['privacyImpact'] ? node.modelAttributes['privacyImpact']['value_int'] : null;
            operationalImpact = node.modelAttributes['operationalImpact'] ? node.modelAttributes['operationalImpact']['value_int'] : null;

            const childValues = node.children.map(childId => this.computeEVITARisk(childId)).filter(sub => {
                if (sub) {
                    return sub;
                }
            });
            let nodeType = node.modelAttributes['node_type'] ? node.modelAttributes['node_type']['value_string'] : null; 

            if (node.modelAttributes['time']) {
                time = node.modelAttributes['time'];
            } else {
                time = this.getInheritedEVITAValue(childValues, nodeType, 'time');
            }

            if (node.modelAttributes['expertise']) {
                expertise = node.modelAttributes['expertise'];
            } else {
                expertise = this.getInheritedEVITAValue(childValues, nodeType, 'expertise');
            }

            if (node.modelAttributes['knowledge']) {
                knowledge = node.modelAttributes['knowledge'];
            } else {
                knowledge = this.getInheritedEVITAValue(childValues, nodeType, 'knowledge');
            }

            if (node.modelAttributes['windowOfOpportunity']) {
                windowOfOpportunity = node.modelAttributes['windowOfOpportunity'];
            } else {
                windowOfOpportunity = this.getInheritedEVITAValue(childValues, nodeType, 'windowOfOpportunity');
            }

            if (node.modelAttributes['equipmentRequired']) {
                equipmentRequired = node.modelAttributes['equipmentRequired'];
            } else {
                // TODO inherit
                equipmentRequired = this.getInheritedEVITAValue(childValues, nodeType, 'equipmentRequired');
            }
        }

        let totalAttackPotential = time + expertise + knowledge + windowOfOpportunity + equipmentRequired;
        let attackProbability = null;
        if (totalAttackPotential >= 25) {
            attackProbability = 1;
        } else if (totalAttackPotential >= 20) {
            attackProbability = 2;
        } else if (totalAttackPotential >= 14) {
            attackProbability = 3;
        } else if (totalAttackPotential >= 10) {
            attackProbability = 2;
        } else {
            attackProbability = 1;
        }

        riskFinancial = this.getEVITARiskLevel(attackProbability, financialImpact);
        riskOperational = this.getEVITARiskLevel(attackProbability, operationalImpact);
        riskPrivacy = this.getEVITARiskLevel(attackProbability, privacyImpact);
        riskSafety = this.getEVITARiskLevel(attackProbability, safetyImpact);

        return {
            computed: {
                safetyImpact,
                financialImpact,
                privacyImpact,
                operationalImpact,

                time,
                expertise,
                knowledge,
                windowOfOpportunity,
                equipmentRequired,

                riskFinancial,
                riskOperational,
                riskPrivacy,
                riskSafety,

                singleValueDisplay: 'RF' + riskFinancial + ' RO' + riskOperational + ' RP' + riskPrivacy + ' RS' + riskSafety
            },
            interface: {
                primary: 'singleValueDisplay'
            }
        }
    }

    computeAttackRisk(nodeId: string) {
        const node = this.getNode(nodeId);
        if (this.computeAttackerLikelihood(nodeId) !== null) {
            const likelihood = this.computeAttackerLikelihood(nodeId).computed.likelihoodOfSuccess;
            let impact = null;
    
            if (!this.isNodeComputable(nodeId)) {
                return null;
            }
    
            if (node) {
                if (node.modelAttributes['impactToDefender']) {
                    impact = node.modelAttributes['impactToDefender']['value_float'];
                }
            }
    
            return {
                computed: {
                    likelihoodOfSuccess: likelihood,
                    impactToDefender: impact,
                    risk: impact ? likelihood * impact : null
                },
                interface: {
                    primary: 'risk'
                }
            }
        }

        return null;
    }

    isNodeComputable(nodeId: string) {
        const node = this.getNode(nodeId);

        return node && (!node.hasOwnProperty('conditionResolved') || node.conditionResolved == true);
    }

    computeAttackerLikelihood(nodeId: string) {
        const node = this.getNode(nodeId);
        let result = null;

        if (!this.isNodeComputable(nodeId)) {
            return null;
        }

        if (node) {
            if (node.modelAttributes['likelihoodOfSuccess']) {
                result = node.modelAttributes['likelihoodOfSuccess']['value_float'];
            } else {
                // Need to inherit from children
                let nodeType = '';
                if (node.modelAttributes['node_type']) {
                    nodeType = node.modelAttributes['node_type']['value_string'];
                }
    
                const childLikelihoodValues = node.children.map(childId => this.computeAttackerLikelihood(childId)).filter(subres => {
                    if (subres) {
                        return subres;
                    }
                });
    
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
                likelihoodOfSuccess: result as number
            },
            interface: {
                primary: 'likelihoodOfSuccess'
            }
        }

    }
}
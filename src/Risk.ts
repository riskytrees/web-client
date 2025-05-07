import TreeData from './interfaces/TreeData';

export interface NodeRiskResult {
    computed: Record<string, string | number>;
    interface: Record<string, any>
}

export interface AttackPathComponent {
    name: string | undefined;
    contribution: NodeRiskResult | null;
}

export class RiskyRisk {
    constructor(private treeMap: Record<string, TreeData>, private rootTreeId: string | null, private cache: Record<string, Record<string, any> | null> ) {
        this.cache = {
            "__lastTree": {"seen": JSON.stringify(this.treeMap)}
        }

    }

    // Returns an object of computed values:
    // {
    //   "computed": {...},
    //   "interface": { "primary": "keyNameInComputed" }
    // }
    //
    computeRiskForNode(nodeId: string, riskModel: string, forceConditions?: Record<string, boolean>) {
        const cacheKey = nodeId + riskModel + JSON.stringify(forceConditions);

        if (this.cache.__lastTree?.seen !== JSON.stringify(this.treeMap)) {
            // Tree was updated. Start cache over.
            this.cache = {
                "__lastTree": this.treeMap
            }
        }

        if (cacheKey in this.cache) {
            return this.cache[cacheKey];
        }

        let result: Record<string, any> | null  = null;

        // For now, add empty attributes for the appropriate model.
        if (riskModel === 'b9ff54e0-37cf-41d4-80ea-f3a9b1e3af74') {
            // Attacker likelihood
            result = this.computeAttackerLikelihood(nodeId, [], forceConditions);
        } else if (riskModel === 'f1644cb9-b2a5-4abb-813f-98d0277e42f2') {
            // Risk of Attack
            result =  this.computeAttackRisk(nodeId, [], forceConditions);
        } else if (riskModel === 'bf4397f7-93ae-4502-a4a2-397f40f5cc49') {
            // EVITA
            result = this.computeEVITARisk(nodeId, [], forceConditions);
        }

        this.cache[cacheKey] = result;

        return result;
    }
    
    getDominatingAttackPath(nodeId: string, riskModel: string): AttackPathComponent[] {
        const node = this.getNode(nodeId);
        const thisRisk = this.computeRiskForNode(nodeId, riskModel);

        let result = [{
            name: node?.title,
            contribution: thisRisk
        }]

        let maxRisk = 0;
        let maxId = null;
        for (const child of node?.children) {
            let childRisk = this.computeRiskForNode(child, riskModel);

            if (maxRisk === 0 || childRisk['computed'][childRisk['interface']['primary']] > maxRisk['computed'][maxRisk['interface']['primary']]) {
                maxRisk = childRisk;
                maxId = child;
            }
        }

        if (maxId) {
            return result.concat(this.getDominatingAttackPath(maxId, riskModel));
        } else {
            return result;
        }
    }

    computeAveragePrimaryRiskValue(riskModel: string)  {
        let sumOfRisks = 0;
        let counter = 0;

        for (const tree of Object.values(this.treeMap)) {
            for (const node of tree.nodes) {
                const nodeRisk = this.computeRiskForNode(node.id, riskModel);
                if (nodeRisk) {
                    let primaryRisk = nodeRisk.computed[nodeRisk.interface.primary];
                    sumOfRisks += primaryRisk;
                    counter += 1;
                }

            }
        }

        return sumOfRisks / counter;
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

    getParentNode(nodeId: string) {
        for (const tree of Object.values(this.treeMap)) {
            for (const node of tree.nodes) {
                for (const child of node.children) {
                    if (child == nodeId) {
                        return node;
                    }
                }
            }
        }


        return null;
    }

    getMostImpactfulConditions(riskModel: string, rootNodeId: string): Record<string, number> {
        const results = {};

        if (this.rootTreeId) {
            for (const node of this.treeMap[this.rootTreeId].nodes) {
                console.log(node)
                if (node.hasOwnProperty('conditionResolved') && node.conditionAttribute) {
                    const risk = this.computeRiskForNode(rootNodeId, riskModel);
                    console.log("Computed a thing")

                    let override = {};
                    override[node.id] = !node.conditionResolved;
                    const riskNoCondition = this.computeRiskForNode(rootNodeId, riskModel, override);

                    const diff = riskNoCondition?.computed[riskNoCondition.interface.primary] - risk?.computed[risk.interface.primary];

                    results[node.conditionAttribute] = diff;
                }
            }
        }
        

        return results;
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

    computeEVITARisk(nodeId: string, seenNodeIds: string[], forceConditions?: Record<string, boolean>) {
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

        if (!this.isNodeComputable(nodeId, seenNodeIds, forceConditions)) {
            return null;
        }

        if (node) {
            safetyImpact = node.modelAttributes['safetyImpact'] ? node.modelAttributes['safetyImpact']['value_int'] : null;
            financialImpact = node.modelAttributes['financialImpact'] ? node.modelAttributes['financialImpact']['value_int'] : null;
            privacyImpact = node.modelAttributes['privacyImpact'] ? node.modelAttributes['privacyImpact']['value_int'] : null;
            operationalImpact = node.modelAttributes['operationalImpact'] ? node.modelAttributes['operationalImpact']['value_int'] : null;

            const childValues = node.children.map(childId => this.computeEVITARisk(childId, [...seenNodeIds, nodeId])).filter(sub => {
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

    computeAttackRisk(nodeId: string, seenNodeIds: string[], forceConditions?: Record<string, boolean>) {
        const node = this.getNode(nodeId);
        if (this.computeAttackerLikelihood(nodeId, seenNodeIds) !== null) {
            const likelihood = this.computeAttackerLikelihood(nodeId, seenNodeIds, forceConditions).computed.likelihoodOfSuccess;
            let impact: number | null = null;
    
            if (!this.isNodeComputable(nodeId, seenNodeIds, forceConditions)) {
                return null;
            }
    
            if (node) {
                if (node.modelAttributes['impactToDefender']) {
                    if (node.modelAttributes['impactToDefender']['value_float']) {
                        impact = node.modelAttributes['impactToDefender']['value_float'];
                    } else {
                        impact = node.modelAttributes['impactToDefender']['value_int'];
                    }
                }

                if (!impact) {
                    const childImpactValues = node.children.map(childId => this.computeAttackRisk(childId, [...seenNodeIds, nodeId], forceConditions, )).filter(subres => {
                        if (subres?.computed.impactToDefender) {
                            return subres;
                        }

                    })

                    if (childImpactValues.length > 0) {
                        impact = childImpactValues.reduce((acc, val) => acc + (val?.computed.impactToDefender ? val?.computed.impactToDefender : 0), 0)
                    } else {
                        const parentNode = this.getParentNode(nodeId);
                        if (parentNode) {
                            const parentImpact = this.computeAttackRisk(parentNode.id, seenNodeIds.filter(val => {
                                if (val != nodeId) {
                                    return val;
                                }
                            }), forceConditions);
    
                            if (parentImpact) {
                                impact = parentImpact.computed.impactToDefender;
                            }
                        }
                    }
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

    isNodeComputable(nodeId: string, seenNodeIds: string[], forceConditions?: Record<string, boolean>) {
        if (seenNodeIds.includes(nodeId)) {
            return false;
        }

        const node = this.getNode(nodeId);
        let nodeType = '';
        if (node && node.modelAttributes['node_type']) {
            nodeType = node.modelAttributes['node_type']['value_string'];
        }

        if (node && forceConditions && forceConditions[node.id] !== undefined) {
            return forceConditions[node.id];
        }
    
        return node && (!node.hasOwnProperty('conditionResolved') || node['conditionAttribute'] === "" || node.conditionResolved == true || nodeType !== 'condition');
    }

    computeAttackerLikelihood(nodeId: string, seenNodeIds: string[], forceConditions?: Record<string, boolean>) {
        const node = this.getNode(nodeId);
        let result = null;

        if (!this.isNodeComputable(nodeId, seenNodeIds, forceConditions)) {
            return null;
        }

        if (node) {
            if (node.modelAttributes['likelihoodOfSuccess'] && node.modelAttributes['likelihoodOfSuccess']['value_float']) {
                result = node.modelAttributes['likelihoodOfSuccess']['value_float'];
            } else if (node.modelAttributes['likelihoodOfSuccess'] && node.modelAttributes['likelihoodOfSuccess']['value_int']) {
                result = node.modelAttributes['likelihoodOfSuccess']['value_int'];
            } else {
                // Need to inherit from children
                let nodeType = '';
                if (node.modelAttributes['node_type']) {
                    nodeType = node.modelAttributes['node_type']['value_string'];
                }
    
                const childLikelihoodValues = node.children.map(childId => this.computeAttackerLikelihood(childId, [...seenNodeIds, nodeId], forceConditions)).filter(subres => {
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
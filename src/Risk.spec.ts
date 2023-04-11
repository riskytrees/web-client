import { RiskyRisk } from './Risk';
import {expect} from '@jest/globals';

it('Lets you construct a RiskyRisk object', () => {
    const riskyRisk = new RiskyRisk({
        "root": {
            title: "test",
            nodes: []
        }
    }, "root");

    expect(riskyRisk).not.toBeNull;
});

it('Lets you compute attacker likelihood at node locations', () => {
    const attackerLikelihoodModel = 'b9ff54e0-37cf-41d4-80ea-f3a9b1e3af74';

    const tree = {
        title: "test",
        nodes: [{
            id: '000',
            title: "root",
            children: ["001", "002"],
            modelAttributes: {
                'node_type': {
                    'value_string': 'and'
                }
            }
        }, {
            id: '001',
            title: "child",
            children: [],
            modelAttributes: {
                'likelihoodOfSuccess': {
                    'value_float': 0.5
                }
            }
        }, {
            id: '002',
            title: "child2",
            children: [],
            modelAttributes: {
                'likelihoodOfSuccess': {
                    'value_float': 0.5
                }
            }
        }]
    };

    const riskyRisk = new RiskyRisk({
        "root": tree
    }, "root");

    expect(riskyRisk.computeRiskForNode("000", attackerLikelihoodModel)['computed']['likelihoodOfSuccess']).toEqual(0.25);

    tree['nodes'][0]['modelAttributes']['node_type']['value_string'] = 'or';

    expect(riskyRisk.computeRiskForNode("000", attackerLikelihoodModel)['computed']['likelihoodOfSuccess']).toEqual(0.75);

});

it('Lets you compute attacker likelihood with conditional logic', () => {
    const attackerLikelihoodModel = 'b9ff54e0-37cf-41d4-80ea-f3a9b1e3af74';

    const tree = {
        title: "test",
        nodes: [{
            id: '000',
            title: "root",
            children: ["001", "002"],
            modelAttributes: {
                'node_type': {
                    'value_string': 'and'
                }
            }
        }, {
            id: '001',
            title: "child",
            children: [],
            modelAttributes: {
                'likelihoodOfSuccess': {
                    'value_float': 0.5
                }
            }
        }, {
            id: '002',
            title: "child2",
            children: [],
            modelAttributes: {
                'likelihoodOfSuccess': {
                    'value_float': 0.5
                }
            },
            conditionResolved: false
        }]
    };

    const riskyRisk = new RiskyRisk({
        "root": tree
    }, "root");

    expect(riskyRisk.computeRiskForNode("000", attackerLikelihoodModel)['computed']['likelihoodOfSuccess']).toEqual(0.5);

});

it('Lets you compute attack risk at node locations', () => {
    const attackRiskModel = 'f1644cb9-b2a5-4abb-813f-98d0277e42f2';

    const tree = {
        title: "test",
        nodes: [{
            id: '000',
            title: "root",
            children: ["001", "002"],
            modelAttributes: {
                'node_type': {
                    'value_string': 'and'
                }, 'impactToDefender': {
                    'value_float': 100.0
                }
            }
        }, {
            id: '001',
            title: "child",
            children: [],
            modelAttributes: {
                'likelihoodOfSuccess': {
                    'value_float': 0.5
                }
            }
        }, {
            id: '002',
            title: "child2",
            children: [],
            modelAttributes: {
                'likelihoodOfSuccess': {
                    'value_float': 0.5
                }
            }
        }]
    };

    const riskyRisk = new RiskyRisk({
        "root": tree
    }, "root");

    expect(riskyRisk.computeRiskForNode("000", attackRiskModel)['computed']['likelihoodOfSuccess']).toEqual(0.25);
    expect(riskyRisk.computeRiskForNode("000", attackRiskModel)['computed']['risk']).toEqual(25);

    tree['nodes'][0]['modelAttributes']['node_type']['value_string'] = 'or';

    expect(riskyRisk.computeRiskForNode("000", attackRiskModel)['computed']['likelihoodOfSuccess']).toEqual(0.75);
    expect(riskyRisk.computeRiskForNode("000", attackRiskModel)['computed']['risk']).toEqual(75);

});

it('Lets you compute attack risk with conditions', () => {
    const attackRiskModel = 'f1644cb9-b2a5-4abb-813f-98d0277e42f2';

    const tree = {
        title: "test",
        nodes: [{
            id: '000',
            title: "root",
            children: ["001", "002"],
            modelAttributes: {
                'node_type': {
                    'value_string': 'and'
                }, 'impactToDefender': {
                    'value_float': 100.0
                }
            }
        }, {
            id: '001',
            title: "child",
            children: [],
            modelAttributes: {
                'likelihoodOfSuccess': {
                    'value_float': 0.5
                }
            }
        }, {
            id: '002',
            title: "child2",
            children: [],
            modelAttributes: {
                'likelihoodOfSuccess': {
                    'value_float': 0.5
                }
            }, conditionResolved: false
        }]
    };

    const riskyRisk = new RiskyRisk({
        "root": tree
    }, "root");

    expect(riskyRisk.computeRiskForNode("000", attackRiskModel)['computed']['likelihoodOfSuccess']).toEqual(0.5);
    expect(riskyRisk.computeRiskForNode("000", attackRiskModel)['computed']['risk']).toEqual(50);
});

it('Lets you compute evita risk at node locations', () => {
    const evitaRiskModel = 'bf4397f7-93ae-4502-a4a2-397f40f5cc49';

    const tree = {
        title: "test",
        nodes: [{
            id: '000',
            title: "root",
            children: ["001", "002"],
            modelAttributes: {
                'node_type': {
                    'value_string': 'and'
                }, 'safetyImpact': {
                    'value_int': 1
                }, 'privacyImpact': {
                    'value_int': 2
                }, 'financialImpact': {
                    'value_int': 3
                }, 'operationalImpact': {
                    'value_int': 4
                }
            }
        }, {
            id: '001',
            title: "child",
            children: [],
            modelAttributes: {
                'time': {
                    'value_int': 4
                }, 'expertise': {
                    'value_int': 4
                }, 'knowledge': {
                    'value_int': 4
                }, 'windowOfOpportunity': {
                    'value_int': 4
                }, 'equipmentRequired': {
                    'value_int': 4
                }
            }
        }, {
            id: '002',
            title: "child2",
            children: [],
            modelAttributes: {
                'time': {
                    'value_int': 20
                }, 'expertise': {
                    'value_int': 20
                }, 'knowledge': {
                    'value_int': 20
                }, 'windowOfOpportunity': {
                    'value_int': 20
                }, 'equipmentRequired': {
                    'value_int': 20
                }
            }
        }]
    };

    const riskyRisk = new RiskyRisk({
        "root": tree
    }, "root")
 
    // Combined potential of left node: 20   --> 2
    // Combined potential of right node: 100 --> 1
    expect(riskyRisk.computeRiskForNode("000", evitaRiskModel)['computed']['singleValueDisplay']).toEqual('RF1 RO2 RP0 RS0');

    tree['nodes'][0]['modelAttributes']['node_type']['value_string'] = 'or';

    expect(riskyRisk.computeRiskForNode("000", evitaRiskModel)['computed']['singleValueDisplay']).toEqual('RF2 RO3 RP1 RS0');

});

it('Lets you compute evita risk with conditions', () => {
    const evitaRiskModel = 'bf4397f7-93ae-4502-a4a2-397f40f5cc49';

    const tree = {
        title: "test",
        nodes: [{
            id: '000',
            title: "root",
            children: ["001", "002"],
            modelAttributes: {
                'node_type': {
                    'value_string': 'and'
                }, 'safetyImpact': {
                    'value_int': 1
                }, 'privacyImpact': {
                    'value_int': 2
                }, 'financialImpact': {
                    'value_int': 3
                }, 'operationalImpact': {
                    'value_int': 4
                }
            }
        }, {
            id: '001',
            title: "child",
            children: [],
            modelAttributes: {
                'time': {
                    'value_int': 4
                }, 'expertise': {
                    'value_int': 4
                }, 'knowledge': {
                    'value_int': 4
                }, 'windowOfOpportunity': {
                    'value_int': 4
                }, 'equipmentRequired': {
                    'value_int': 4
                }
            }
        }, {
            id: '002',
            title: "child2",
            children: [],
            modelAttributes: {
                'time': {
                    'value_int': 20
                }, 'expertise': {
                    'value_int': 20
                }, 'knowledge': {
                    'value_int': 20
                }, 'windowOfOpportunity': {
                    'value_int': 20
                }, 'equipmentRequired': {
                    'value_int': 20
                }
            },
            conditionResolved: false
        }]
    };

    const riskyRisk = new RiskyRisk({
        "root": tree
    }, "root")
 
    // Combined potential of left node: 20   --> 2
    // Combined potential of right node: 100 --> 1
    expect(riskyRisk.computeRiskForNode("000", evitaRiskModel)['computed']['singleValueDisplay']).toEqual('RF1 RO2 RP0 RS0');

    tree['nodes'][0]['modelAttributes']['node_type']['value_string'] = 'or';

    expect(riskyRisk.computeRiskForNode("000", evitaRiskModel)['computed']['singleValueDisplay']).toEqual('RF1 RO2 RP0 RS0');
});


it('works without modelAttributes', () => {
    const evitaRiskModel = 'bf4397f7-93ae-4502-a4a2-397f40f5cc49';

    const tree = {
        title: "test",
        nodes: [{
            id: '000',
            title: "root",
            children: ["001"],
            modelAttributes: {
                'node_type': {
                    'value_string': 'and'
                }, 'safetyImpact': {
                    'value_int': 1
                }, 'privacyImpact': {
                    'value_int': 2
                }, 'financialImpact': {
                    'value_int': 3
                }, 'operationalImpact': {
                    'value_int': 4
                }
            }
        }, {
            id: '001',
            title: "child",
            children: [],
            modelAttributes: {

            }
        }]
    };

    const riskyRisk = new RiskyRisk({
        "root": tree
    }, "root");
 
    // Combined potential of left node: 20   --> 2
    // Combined potential of right node: 100 --> 1
    expect(riskyRisk.computeRiskForNode("000", evitaRiskModel)['computed']['singleValueDisplay']).toContain('R')
    expect(riskyRisk.computeRiskForNode("001", evitaRiskModel)['computed']['singleValueDisplay']).toContain('R')

});

it('works without children', () => {
    const evitaRiskModel = 'bf4397f7-93ae-4502-a4a2-397f40f5cc49';

    const tree = {
        title: "test",
        nodes: [{
            id: '000',
            title: "root",
            children: [],
            modelAttributes: {
                'node_type': {
                    'value_string': 'and'
                }, 'safetyImpact': {
                    'value_int': 1
                }, 'privacyImpact': {
                    'value_int': 2
                }, 'financialImpact': {
                    'value_int': 3
                }, 'operationalImpact': {
                    'value_int': 4
                }
            }
        }]
    };

    const riskyRisk = new RiskyRisk({
        "root": tree
    }, "root");
 
    // Combined potential of left node: 20   --> 2
    // Combined potential of right node: 100 --> 1
    expect(riskyRisk.computeRiskForNode("000", evitaRiskModel)['computed']['singleValueDisplay']).toContain('R')

});
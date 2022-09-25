import { RiskyRisk } from './Risk';
import {expect} from '@jest/globals';

it('Lets you construct a RiskyRisk object', () => {
    const riskyRisk = new RiskyRisk({
        title: "test",
        nodes: []
    });

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

    const riskyRisk = new RiskyRisk(tree);

    expect(riskyRisk.computeRiskForNode("000", attackerLikelihoodModel)['computed']['likelihoodOfSuccess']).toEqual(0.25);

    tree['nodes'][0]['modelAttributes']['node_type']['value_string'] = 'or';

    expect(riskyRisk.computeRiskForNode("000", attackerLikelihoodModel)['computed']['likelihoodOfSuccess']).toEqual(0.75);

});
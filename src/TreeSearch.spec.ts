import {expect} from '@jest/globals';
import { TreeSearch } from './TreeSearch';

it('Lets you construct a TreeSearch object', () => {
    const treeSearch = new TreeSearch({
        "root": {
            title: "test",
            nodes: []
        }
    }, "root");

    expect(treeSearch).not.toBeNull;
});

it('Lets you search titles and descriptions', () => {

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

    const searchTree = new TreeSearch({
        "root": tree
    }, "root");

    expect(searchTree.search("child2")).toContain("002");

});

import TreeData from './interfaces/TreeData';

export class TreeSearch {
    constructor(private treeMap: Record<string, TreeData>, private rootTreeId: string | null) {
    }

    // Searches for val in the tree and returns the set of matching node ids
    search(val: string) {
        let results: string[] = [];

        for (const tree_id in this.treeMap) {
            for (const node of this.treeMap[tree_id].nodes) {
                if (node.title.includes(val) || node.description?.includes(val)) {
                    results.push(node.id);
                }
            }
        }

        return results;
    }
}
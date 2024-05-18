import TreeData from './interfaces/TreeData';

export class TreeSearch {
    constructor(private treeMap: Record<string, TreeData>, private rootTreeId: string | null) {
    }

    // Searches for val in the tree and returns the set of matching node ids
    search(val: string) {
        val = val.toLowerCase();
        let results: string[] = [];

        for (const tree_id in this.treeMap) {
            for (const node of this.treeMap[tree_id].nodes) {
                if (node.title.toLowerCase().includes(val) || node.description?.toLowerCase().includes(val)) {
                    results.push(node.id);
                }
            }
        }

        return results;
    }
}
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

    // Returns the path from the root node to the target node as an array of node IDs
    findPathToNode(treeId: string, targetNodeId: string): string[] {
        const tree = this.treeMap[treeId];
        if (!tree) return [];
        const nodes = tree.nodes;
        // Build a set of all child node ids
        const childIds = new Set<string>();
        for (const node of nodes) {
            if (Array.isArray(node.children)) {
                node.children.forEach(id => childIds.add(id));
            }
        }
        // Root node is the one whose id is not in any children array
        const rootNode = nodes.find(n => !childIds.has(n.id));
        if (!rootNode) return [];
        // Helper to build path recursively
        function dfs(currentId: string, targetId: string, path: string[]): string[] | null {
            path.push(currentId);
            if (currentId === targetId) return path;
            const currentNode = nodes.find(n => n.id === currentId);
            if (!currentNode || !Array.isArray(currentNode.children)) return null;
            for (const childId of currentNode.children) {
                const result = dfs(childId, targetId, [...path]);
                if (result) return result;
            }
            return null;
        }
        const result = dfs(rootNode.id, targetNodeId, []);
        return result || [];
    }

    
}
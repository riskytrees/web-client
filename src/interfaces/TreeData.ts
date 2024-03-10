export default interface TreeData {
    title: string;
    rootNodeId: string;
    nodes: {
        id: string;
        title: string;
        children: string[];
        modelAttributes: Record<string, any>;
        description?: string;
        conditionAttribute?: string;
        conditionResolved?: boolean;
    }[];
};
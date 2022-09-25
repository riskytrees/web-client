export default interface TreeData {
    title: string;
    nodes: {
        id: string;
        title: string;
        children: string[];
        modelAttributes: Record<string, any>
    }[];
};
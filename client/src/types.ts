export interface ICard {
    _id: string;
    title: string;
    description?: string;
    columnId: string;
    order: number;
    assignee?: string;
    dueDate?: string;
    priority?: "Low" | "Medium" | "High";
    tags?: string[];
}

export interface IColumn {
    id: string;
    title: string;
}

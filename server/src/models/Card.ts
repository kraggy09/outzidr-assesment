import mongoose, { Schema, Document } from 'mongoose';

export interface ICard extends Document {
    title: string;
    description?: string;
    columnId: string;
    order: number;
    assignee?: string;
    dueDate?: Date;
    priority?: 'Low' | 'Medium' | 'High';
    tags?: string[];
}

const CardSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    columnId: { type: String, required: true },
    order: { type: Number, required: true, default: 0 },
    assignee: { type: String },
    dueDate: { type: Date },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    tags: { type: [String], default: [] }
}, {
    timestamps: true
});

export default mongoose.model<ICard>('Card', CardSchema);


import { Request, Response } from 'express';
import Card from '../models/Card';

export const getCards = async (req: Request, res: Response) => {
    try {
        const cards = await Card.find().sort({ order: 1 });
        res.json(cards);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const createCard = async (req: Request, res: Response) => {
    const { title, description, columnId, order, assignee, dueDate, priority, tags } = req.body;
    try {
        const newCard = new Card({
            title,
            description,
            columnId,
            order,
            assignee,
            dueDate,
            priority,
            tags
        });
        const savedCard = await newCard.save();


        req.app.get("io").emit("cardUpdated", savedCard);

        res.status(201).json(savedCard);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};

export const updateCard = async (req: Request, res: Response) => {
    try {
        const updatedCard = await Card.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCard) return res.status(404).json({ message: 'Card not found' });


        req.app.get("io").emit("cardUpdated", updatedCard);

        res.json(updatedCard);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};

export const deleteCard = async (req: Request, res: Response) => {
    try {
        const result = await Card.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ message: 'Card not found' });


        req.app.get("io").emit("cardDeleted", req.params.id);

        res.json({ message: 'Card deleted' });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const reorderCards = async (req: Request, res: Response) => {
    const { columnId, cardIds } = req.body;

    try {
        const operations = cardIds.map((id: string, index: number) => {
            return {
                updateOne: {
                    filter: { _id: id },
                    update: { columnId, order: index }
                }
            };
        });

        await Card.bulkWrite(operations);

        req.app.get("io").emit("boardUpdated");

        res.json({ message: 'Cards reordered' });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

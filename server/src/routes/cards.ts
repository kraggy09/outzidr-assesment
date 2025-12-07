
import { Router } from 'express';
import { getCards, createCard, updateCard, deleteCard, reorderCards } from '../controllers/cardController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.get('/', protect, getCards);
router.post('/', protect, authorize('Editor'), createCard);
router.put('/reorder', protect, authorize('Editor'), reorderCards);
router.put('/:id', protect, authorize('Editor'), updateCard);
router.delete('/:id', protect, authorize('Editor'), deleteCard);

export default router;

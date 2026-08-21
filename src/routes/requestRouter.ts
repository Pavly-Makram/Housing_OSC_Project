import { Router } from 'express';
import {
  createInterestRequest,
  getSeekerRequests,
  cancelRequest,
  getListerRequests,
  updateRequestStatus,
} from '../controllers/requestController';
import { protect } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';

const router = Router();

// 🟢 Seeker Routes
router.post('/', protect, authorize('Seeker'), createInterestRequest);
router.get('/seeker/my-requests', protect, authorize('Seeker'), getSeekerRequests);
router.delete('/:requestId', protect, authorize('Seeker'), cancelRequest);

// 🔵 Lister Routes
router.get('/lister/my-requests', protect, authorize('Lister'), getListerRequests);
router.patch('/:requestId/status', protect, authorize('Lister'), updateRequestStatus);

export default router;
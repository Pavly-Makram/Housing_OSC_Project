import { Router } from 'express';
import {
  createListing,
  getAllListings,
  getListingById,
  updateListing,
  deleteListing,
} from '../controllers/listingController';
import { protect } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';

const router = Router();

router.get('/', getAllListings);
router.get('/:id', getListingById);

router.post('/', protect, authorize('Lister'), createListing);
router.put('/:id', protect, authorize('Lister'), updateListing);
router.delete('/:id', protect, authorize('Lister'), deleteListing);


export default router;
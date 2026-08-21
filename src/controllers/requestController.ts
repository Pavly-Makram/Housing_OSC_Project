import { Request, Response } from 'express';
import { InterestRequest } from '../models/InterestRequest';
import { Listing } from '../models/Listing';
import { Types } from 'mongoose';


/**
 * @description Send an interest request on a listing (Seeker only)
 * @route POST /api/requests
 */


export const createInterestRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { listingId } = req.body;
    const seekerId = req.user?.id;

    if (!seekerId) {
      res.status(401).json({ message: 'Unauthorized. User not authenticated.' });
      return;
    }

    if (!listingId) {
      res.status(400).json({ message: 'listingId is required' });
      return;
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      res.status(404).json({ message: 'Listing not found' });
      return;
    }

    if (!listing.isAvailable) {
      res.status(400).json({ message: 'Listing is not available' });
      return;
    }

    
    const existingRequest = await InterestRequest.findOne({
      listing: new Types.ObjectId(listingId),
      seeker: new Types.ObjectId(seekerId),
      status: 'pending',
    });

    if (existingRequest) {
      res.status(409).json({ message: 'You already have a pending request for this listing' });
      return;
    }

    const request = await InterestRequest.create({
      listing: new Types.ObjectId(listingId),
      seeker: new Types.ObjectId(seekerId),
      status: 'pending',
    });

    res.status(201).json({
      message: 'Interest request submitted successfully',
      request,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

/**
 * @description View Seeker's own request history
 * @route GET /api/requests/seeker/my-requests
 */
export const getSeekerRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const seekerId = req.user?.id;

    if (!seekerId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const requests = await InterestRequest.find({ seeker: new Types.ObjectId(seekerId) })
      .populate('listing')
      .sort({ createdAt: -1 });

    res.status(200).json({ count: requests.length, requests });
  } catch (error: any) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

/**
 * @description Cancel own request (Seeker only)
 * @route DELETE /api/requests/:requestId
 */
export const cancelRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const requestId = req.params.requestId;
    const seekerId = req.user?.id;

    if (!seekerId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const request = await InterestRequest.findById(requestId);
    if (!request) {
      res.status(404).json({ message: 'Request not found' });
      return;
    }

    if (request.seeker.toString() !== seekerId) {
      res.status(403).json({ message: 'Unauthorized: You can only cancel your own requests' });
      return;
    }

    await InterestRequest.findByIdAndDelete(requestId);

    res.status(200).json({ message: 'Request cancelled successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

/**
 * @description View requests on Lister's listings (Lister only)
 * @route GET /api/requests/lister/my-requests
 */


export const getListerRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const listerId = req.user?.id;

    if (!listerId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const myListings = await Listing.find({ owner: new Types.ObjectId(listerId) }).select('_id');
    const listingIds = myListings.map((l) => l._id);

    const requests = await InterestRequest.find({ listing: { $in: listingIds } })
      .populate('listing')
      .populate('seeker', 'fullName email')
      .sort({ createdAt: -1 });

    res.status(200).json({ count: requests.length, requests });
  } catch (error: any) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};



/**
 * @description Accept or Decline interest request (Listing Owner only)
 * @route PATCH /api/requests/:requestId/status
 */


export const updateRequestStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const requestId = req.params.requestId;
    const listerId = req.user?.id;
    const { status } = req.body;

    if (!listerId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    if (!status || !['accepted', 'declined'].includes(status)) {
      res.status(400).json({ message: 'Status must be either accepted or declined' });
      return;
    }

    const request = await InterestRequest.findById(requestId).populate('listing');
    if (!request) {
      res.status(404).json({ message: 'Request not found' });
      return;
    }

    const listing: any = request.listing;
    if (!listing || listing.owner.toString() !== listerId) {
      res.status(403).json({ message: 'Unauthorized: Only the listing owner can manage this request' });
      return;
    }

    request.status = status;
    await request.save();

    res.status(200).json({
      message: `Request ${status} successfully`,
      request,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
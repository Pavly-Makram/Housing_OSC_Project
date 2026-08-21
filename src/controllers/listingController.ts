import { Request, Response } from 'express';
import { Listing } from '../models/Listing';
import { Types } from 'mongoose';


/**
 * @description Create a new listing (Lister only)
 * @route POST /api/listings
 */


export const createListing = async (req: Request, res: Response): Promise<void> => {
  try {
    const { location, price, roomsAvailable, description } = req.body;
    const userId = req.user?.id; 

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized. User not found.' });
      return;
    }

    if (!location || price === undefined || !roomsAvailable || !description) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    if (Number(price) <= 0) {
      res.status(400).json({ message: 'Price must be a positive number' });
      return;
    }

    const newListing = await Listing.create({
      location,
      price: Number(price),
      roomsAvailable: Number(roomsAvailable),
      description,
      owner: new Types.ObjectId(userId),
    });

    res.status(201).json({
      message: 'Listing created successfully',
      listing: newListing,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};





/**
 * @description Search & Filter listings (Location, Price, Rooms, Availability)
 * @route GET /api/listings
 */
export const getAllListings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { location, minPrice, maxPrice, roomsAvailable, isAvailable } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (location) filter.location = { $regex: location as string, $options: 'i' };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (roomsAvailable) filter.roomsAvailable = { $gte: Number(roomsAvailable) };
    if (isAvailable !== undefined) filter.isAvailable = isAvailable === 'true';

    const total = await Listing.countDocuments(filter);
    const listings = await Listing.find(filter)
      .populate('owner', 'fullName email role')
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      total,
      page,
      pages: Math.ceil(total / limit),
      count: listings.length,
      listings,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};




/**
 * @description Get a single listing by ID
 * @route GET /api/listings/:id
 */
export const getListingById = async (req: Request, res: Response): Promise<void> => {
  try {
    const listing = await Listing.findById(req.params.id).populate('owner', 'fullName email role');
    if (!listing) {
      res.status(404).json({ message: 'Listing not found' });
      return;
    }

    res.status(200).json({ listing });
  } catch (error: any) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};



/**
 * @description Update listing (Owner Lister only)
 * @route PUT /api/listings/:id
 */



export const updateListing = async (req: Request, res: Response): Promise<void> => {
  try {
    const listingId = req.params.id;
    const userId = req.user?.id;
    const { location, price, roomsAvailable, description, isAvailable } = req.body;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      res.status(404).json({ message: 'Listing not found' });
      return;
    }

    if (listing.owner.toString() !== userId) {
      res.status(403).json({ message: 'Forbidden: You can only edit your own listings' });
      return;
    }

    if (price !== undefined && Number(price) <= 0) {
      res.status(400).json({ message: 'Price must be a positive number' });
      return;
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      listingId,
      { 
        location, 
        price: price !== undefined ? Number(price) : undefined, 
        roomsAvailable: roomsAvailable !== undefined ? Number(roomsAvailable) : undefined, 
        description, 
        isAvailable 
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: 'Listing updated successfully',
      listing: updatedListing,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};



/**
 * @description Delete listing (Owner Lister only)
 * @route DELETE /api/listings/:id
 */


export const deleteListing = async (req: Request, res: Response): Promise<void> => {
  try {
    const listingId = req.params.id;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      res.status(404).json({ message: 'Listing not found' });
      return;
    }

    if (listing.owner.toString() !== userId) {
      res.status(403).json({ message: 'Unauthorized: You can only delete your own listings' });
      return;
    }

    await Listing.findByIdAndDelete(listingId);

    res.status(200).json({ message: 'Listing deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
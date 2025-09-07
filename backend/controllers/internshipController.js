const Internship = require('../models/Internship');
const Organization = require('../models/Organization');
const Application = require('../models/Application');

// Get all internships with filters
const getInternships = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      domain,
      location,
      isRemote,
      minStipend,
      maxStipend
    } = req.query;

    const filter = { status: 'published' };

    if (domain) filter.domain = new RegExp(domain, 'i');
    if (location) filter.location = new RegExp(location, 'i');
    if (isRemote !== undefined) filter.isRemote = isRemote === 'true';
    
    if (minStipend || maxStipend) {
      filter['stipend.amount'] = {};
      if (minStipend) filter['stipend.amount'].$gte = parseInt(minStipend);
      if (maxStipend) filter['stipend.amount'].$lte = parseInt(maxStipend);
    }

    const internships = await Internship.find(filter)
      .populate('organizationId')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Internship.countDocuments(filter);

    res.json({
      internships,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get single internship
const getInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id)
      .populate('organizationId');

    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    res.json(internship);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Create internship
const createInternship = async (req, res) => {
  try {
    const organization = await Organization.findOne({ userId: req.user._id });
    if (!organization) {
      return res.status(404).json({ message: 'Organization profile not found' });
    }

    const internship = await Internship.create({
      organizationId: organization._id,
      ...req.body
    });

    res.status(201).json(internship);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update internship
const updateInternship = async (req, res) => {
  try {
    const organization = await Organization.findOne({ userId: req.user._id });
    if (!organization) {
      return res.status(404).json({ message: 'Organization profile not found' });
    }

    const internship = await Internship.findOneAndUpdate(
      { _id: req.params.id, organizationId: organization._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    res.json(internship);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete internship
const deleteInternship = async (req, res) => {
  try {
    const organization = await Organization.findOne({ userId: req.user._id });
    if (!organization) {
      return res.status(404).json({ message: 'Organization profile not found' });
    }

    const internship = await Internship.findOneAndDelete({
      _id: req.params.id,
      organizationId: organization._id
    });

    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    // Also delete related applications
    await Application.deleteMany({ internshipId: req.params.id });

    res.json({ message: 'Internship deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getInternships,
  getInternship,
  createInternship,
  updateInternship,
  deleteInternship
};
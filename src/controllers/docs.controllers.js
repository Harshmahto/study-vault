import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Docs } from "../models/docs.model.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/Cloudinary.js";


const uploadPDF = asyncHandler(async (req, res) => {
  const { title, year, semester, branch, category, subject, description } = req.body;

  if (!title || !year || !semester || !branch || !category) {
    throw new ApiError(400, "Title, year, semester, branch, and category are required");
  }

  if (!req.file) {
    throw new ApiError(400, "PDF file is required");
  }

  if (req.file.mimetype !== "application/pdf") {
    throw new ApiError(400, "Only PDF files are allowed");
  }

  const cloudinaryResponse = await uploadOnCloudinary(req.file.path);

  if (!cloudinaryResponse) {
    throw new ApiError(500, "Failed to upload PDF to Cloudinary");
  }

  const newDoc = await Docs.create({
    title,
    year: Number(year),
    semester: Number(semester),
    branch: branch.toUpperCase(),
    category,
    subject: subject || undefined,
    description: description || undefined,
    cloudinaryUrl: cloudinaryResponse.secure_url,
    uploadedBy: req.user._id
  });

  await newDoc.populate("uploadedBy", "email role");

  return res
    .status(201)
    .json(new ApiResponse(201, "PDF uploaded successfully", newDoc));
});

// @desc    Get all PDFs (with filters)
// @route   GET /api/v1/user/pdfs?year=2&semester=1&branch=CSE&category=PYQ
// @access  Authenticated users
const getPDFs = asyncHandler(async (req, res) => {
  const { year, semester, branch, category, subject } = req.query;

  const filter = {};
  
  if (year) filter.year = Number(year);
  if (semester) filter.semester = Number(semester);
  if (branch) filter.branch = branch.toUpperCase();
  if (category) filter.category = category;
  if (subject) filter.subject = new RegExp(subject, "i");

  const pdfs = await Docs.find(filter)
    .populate("uploadedBy", "email")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, "PDFs fetched successfully", { count: pdfs.length, pdfs }));
});

// @desc    Get single PDF by ID
// @route   GET /api/v1/user/pdfs/:id
// @access  Authenticated users
const getPDFById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const pdf = await Docs.findById(id).populate("uploadedBy", "email role");

  if (!pdf) {
    throw new ApiError(404, "PDF not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "PDF fetched successfully", pdf));
});

// @desc    Increment download count
// @route   PATCH /api/v1/user/pdfs/:id/download
// @access  Authenticated users
const incrementDownload = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const pdf = await Docs.findByIdAndUpdate(
    id,
    { $inc: { downloadCount: 1 } },
    { new: true }
  );

  if (!pdf) {
    throw new ApiError(404, "PDF not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Download count updated", pdf));
});

// @desc    Update PDF details (not the file itself)
// @route   PATCH /api/v1/admin/update-pdf/:id
// @access  Admin only
const updatePDF = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, year, semester, branch, category, subject, description } = req.body;

  const pdf = await Docs.findById(id);

  if (!pdf) {
    throw new ApiError(404, "PDF not found");
  }

  if (title) pdf.title = title;
  if (year) pdf.year = Number(year);
  if (semester) pdf.semester = Number(semester);
  if (branch) pdf.branch = branch.toUpperCase();
  if (category) pdf.category = category;
  if (subject !== undefined) pdf.subject = subject;
  if (description !== undefined) pdf.description = description;

  await pdf.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "PDF details updated successfully", pdf));
});

// @desc    Delete PDF
// @route   DELETE /api/v1/admin/delete-pdf/:id
// @access  Admin only
const deletePDF = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const pdf = await Docs.findById(id);

  if (!pdf) {
    throw new ApiError(404, "PDF not found");
  }

  // Delete from Cloudinary using stored publicId
  await deleteFromCloudinary(pdf.cloudinaryPublicId);

  // Delete from database
  await Docs.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, "PDF deleted successfully", null));
});

export {
  uploadPDF,
  getPDFs,
  getPDFById,
  incrementDownload,
  updatePDF,
  deletePDF
};
import mongoose, { Schema } from "mongoose";

const docsSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters long"],
      maxlength: [200, "Title cannot exceed 200 characters"]
    },
    
    year: {
      type: Number,
      required: [true, "Year is required"],
      enum: {
        values: [1, 2, 3, 4],
        message: "Year must be 1, 2, 3, or 4"
      },
      index: true
    },
    
    semester: {
      type: Number,
      required: [true, "Semester is required"],
      enum: {
        values: [1, 2],
        message: "Semester must be 1 or 2"
      },
      index: true
    },
    
    branch: {
      type: String,
      required: [true, "Branch is required"],
      enum: {
        values: ["CSE", "ECE", "ME", "CE", "EE", "IT"],
        message: "Invalid branch selected"
      },
      uppercase: true
    },
    
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: ["Book", "Assignment", "PYQ", "Notes", "Other"],
        message: "Category must be Book, Assignment, PYQ, Notes, or Other"
      },
      index: true
    },
    
    subject: {
      type: String,
      trim: true,
      maxlength: [100, "Subject name cannot exceed 100 characters"]
    },
    
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"]
    },
    
    cloudinaryUrl: {
      type: String,
      required: [true, "Cloudinary URL is required"]
    },
    
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Uploader information is required"],
      index: true
    },
    
    downloadCount: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

const Docs = mongoose.model("Docs", docsSchema);

export { Docs };
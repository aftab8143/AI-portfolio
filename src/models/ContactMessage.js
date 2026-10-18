import mongoose from "mongoose";

// Every message sent through the contact form, kept even if the email fails.
const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 80 },
  email: { type: String, required: true, maxlength: 254 },
  type: { type: String, maxlength: 60 },
  message: { type: String, required: true, maxlength: 5000 },
  emailed: { type: Boolean, default: false },
  emailError: { type: String },
  ipHash: { type: String, select: false },
  userAgent: { type: String, maxlength: 300, select: false },
  createdAt: { type: Date, default: Date.now, index: true },
});

export default mongoose.models.ContactMessage || mongoose.model("ContactMessage", contactMessageSchema);

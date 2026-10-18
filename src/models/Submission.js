import mongoose from "mongoose";

// One row per write (comment, reply, contact message), used only to rate-limit.
// Shared across every server instance, unlike in-memory limits.
// Rows delete themselves after 24 hours via the TTL index.
const submissionSchema = new mongoose.Schema({
  kind: { type: String, required: true }, // 'comment' | 'reply' | 'contact'
  ipHash: { type: String, required: true },
  fingerprint: { type: String }, // hash of the content, to spot repeats
  createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 },
});

submissionSchema.index({ kind: 1, ipHash: 1, createdAt: -1 });
submissionSchema.index({ kind: 1, fingerprint: 1 });

export default mongoose.models.Submission || mongoose.model("Submission", submissionSchema);

import mongoose from 'mongoose';

// schema for Purchase model
// This schema defines the structure of a purchase document in the database 
const purchaseSchema = new mongoose.Schema({
  userId: { type: String, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
},{ timestamps: true });

// Create the Purchase model using the defined schema
// This model will be used to interact with the purchases collection in the database
export const Purchase = mongoose.model('Purchase', purchaseSchema);

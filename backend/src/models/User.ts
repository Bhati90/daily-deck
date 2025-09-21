import mongoose, { Model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// 1. Create an interface representing a document in MongoDB.
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId; // <-- ADD THIS LINE
  username: string;
  password: string;
  streak: number;
  lastQuizTakenAt?: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

// 2. Create a Schema corresponding to the document interface.
const userSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  streak: { type: Number, default: 0 },
  lastQuizTakenAt: { type: Date },
}, { timestamps: true });

// 3. Add the method to the schema's methods object.
userSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 4. Add the pre-save hook for password hashing.
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


// 5. Create the Model.
const User = mongoose.model<IUser>('User', userSchema);

export default User;
import mongoose, { Schema, Document } from 'mongoose';

interface ITeam extends Document {
  name: string;
  wallet: number;
  availableShares: number;  // Track available shares for selling
}

const teamSchema: Schema = new Schema({
  name: { type: String, required: true },
  wallet: { type: Number, required: true },
  availableShares: { type: Number, required: true },
});

const Team = mongoose.model<ITeam>('Team', teamSchema);

export default Team;

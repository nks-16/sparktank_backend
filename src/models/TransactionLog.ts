import mongoose, { Schema, Document } from 'mongoose';

interface ITransaction extends Document {
  purchasingTeamId: mongoose.Schema.Types.ObjectId;
  sellingTeamId: mongoose.Schema.Types.ObjectId;
  sharesBought: number;
  costPerShare: number;
  totalCost: number;
}

const transactionSchema: Schema = new Schema({
  purchasingTeamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  sellingTeamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  sharesBought: { type: Number, required: true },
  costPerShare: { type: Number, required: true },
  totalCost: { type: Number, required: true },
});

const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);

export default Transaction;

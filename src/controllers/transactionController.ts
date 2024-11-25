import { Request, Response } from 'express';
import Team from '../models/Team';
import TransactionLog from '../models/TransactionLog';
import { updateTeamWalletAndShares } from './teamController';

// Main logic for buying shares
export const buyShares = async (req: Request, res: Response) => {
  const { purchasingTeamId, sellingTeamId, sharesToBuy, costPerShare } = req.body;

  try {
    // Find the teams involved in the transaction
    const purchasingTeam = await Team.findById(purchasingTeamId);
    const sellingTeam = await Team.findById(sellingTeamId);

    // Check if both teams exist
    if (!purchasingTeam || !sellingTeam) {
      res.status(404).json({ message: "Team not found" });
      return ;
    }

    // Calculate the total cost
    const totalCost = costPerShare;

    // Check if purchasing team's wallet is sufficient
    if (purchasingTeam.wallet <= 0) {
      res.status(400).json({ message: "Your team's wallet is empty. Transaction can't happen." });
      return ;
    }

    // Check if the selling team has too many shares
    if ((sellingTeam.availableShares + sharesToBuy)> 40) {
       res.status(400).json({ message: "Selling team is out of stock (>= 40). Transaction can't happen." });
       return;
    }

    // Check if the purchasing team has enough money
    if (purchasingTeam.wallet < totalCost) {
      res.status(400).json({ message: "Your team doesn't have enough money." });
      return ;
    }

    // Update wallets and shares
    purchasingTeam.wallet -= totalCost;
    sellingTeam.availableShares += sharesToBuy;

    // Save updated team data
    await purchasingTeam.save();
    await sellingTeam.save();

    // Log the transaction
    const transactionLog = new TransactionLog({
      purchasingTeamId,
      sellingTeamId,
      sharesBought: sharesToBuy,
      costPerShare,
      totalCost,
    });

    await transactionLog.save();

    // Return success message
    res.json({ message: "Transaction successful!", transactionLog });
  } catch (err) {
    res.status(500).json({ err });
  }
};

// Fetch transaction logs for a team
export const getTransactionLogsForTeam = async (req: Request, res: Response) => {
  const teamId = req.params.id;

  try {
    const transactions = await TransactionLog.find({
      $or: [{purchasingTeamId: teamId}],
    });

    res.json(transactions);
  } catch (err) {
    res.status(500).json({err });
  }
};

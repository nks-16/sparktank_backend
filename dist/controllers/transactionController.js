"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionLogsForTeam = exports.buyShares = void 0;
const Team_1 = __importDefault(require("../models/Team"));
const TransactionLog_1 = __importDefault(require("../models/TransactionLog"));
// Main logic for buying shares
const buyShares = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { purchasingTeamId, sellingTeamId, sharesToBuy, costPerShare } = req.body;
    try {
        // Find the teams involved in the transaction
        const purchasingTeam = yield Team_1.default.findById(purchasingTeamId);
        const sellingTeam = yield Team_1.default.findById(sellingTeamId);
        // Check if both teams exist
        if (!purchasingTeam || !sellingTeam) {
            res.status(404).json({ message: "Team not found" });
            return;
        }
        // Calculate the total cost
        const totalCost = costPerShare;
        // Check if purchasing team's wallet is sufficient
        if (purchasingTeam.wallet <= 0) {
            res.status(400).json({ message: "Your team's wallet is empty. Transaction can't happen." });
            return;
        }
        // Check if the selling team has too many shares
        if ((sellingTeam.availableShares + sharesToBuy) > 40) {
            res.status(400).json({ message: "Selling team is out of stock (>= 40). Transaction can't happen." });
            return;
        }
        // Check if the purchasing team has enough money
        if (purchasingTeam.wallet < totalCost) {
            res.status(400).json({ message: "Your team doesn't have enough money." });
            return;
        }
        // Update wallets and shares
        purchasingTeam.wallet -= totalCost;
        sellingTeam.availableShares += sharesToBuy;
        // Save updated team data
        yield purchasingTeam.save();
        yield sellingTeam.save();
        // Log the transaction
        const transactionLog = new TransactionLog_1.default({
            purchasingTeamId,
            sellingTeamId,
            sharesBought: sharesToBuy,
            costPerShare,
            totalCost,
        });
        yield transactionLog.save();
        // Return success message
        res.json({ message: "Transaction successful!", transactionLog });
    }
    catch (err) {
        res.status(500).json({ err });
    }
});
exports.buyShares = buyShares;
// Fetch transaction logs for a team
const getTransactionLogsForTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const teamId = req.params.id;
    try {
        const transactions = yield TransactionLog_1.default.find({
            $or: [{ purchasingTeamId: teamId }],
        });
        res.json(transactions);
    }
    catch (err) {
        res.status(500).json({ err });
    }
});
exports.getTransactionLogsForTeam = getTransactionLogsForTeam;

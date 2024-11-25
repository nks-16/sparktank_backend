"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const transactionController_1 = require("../controllers/transactionController");
const router = express_1.default.Router();
// Buy shares from another team
router.post('/buy', transactionController_1.buyShares);
// Get transaction logs for a specific team
router.get('/logs/:id', transactionController_1.getTransactionLogsForTeam);
exports.default = router;

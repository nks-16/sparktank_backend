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
exports.createTeam = exports.updateTeamWalletAndShares = exports.getTeamById = void 0;
const Team_1 = __importDefault(require("../models/Team"));
const getTeamById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const teamId = req.params.id;
    const team = yield Team_1.default.findById(teamId);
    if (!team) {
        res.status(404).json({ message: "Team not found" });
        return;
    }
    res.json(team);
});
exports.getTeamById = getTeamById;
const updateTeamWalletAndShares = (teamId, amount, shares) => __awaiter(void 0, void 0, void 0, function* () {
    const team = yield Team_1.default.findById(teamId);
    if (!team) {
        throw new Error('Team not found');
    }
    team.wallet -= amount;
    team.availableShares += shares;
    yield team.save();
});
exports.updateTeamWalletAndShares = updateTeamWalletAndShares;
const createTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, wallet, availableShares } = req.body;
        // Validate request body
        if (!name || wallet === undefined || availableShares === undefined) {
            res.status(400).json({
                success: false,
                message: 'Missing required fields: name, wallet, and availableShares are mandatory.',
            });
            return;
        }
        const newTeam = new Team_1.default({ name, wallet, availableShares });
        yield newTeam.save();
        res.status(201).json({ success: true, data: newTeam });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create team',
            error,
        });
    }
});
exports.createTeam = createTeam;

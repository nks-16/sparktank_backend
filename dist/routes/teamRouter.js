"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const teamController_1 = require("../controllers/teamController");
const teamController_2 = require("../controllers/teamController");
const router = express_1.default.Router();
// Get team by ID
router.get('/:id', teamController_1.getTeamById);
router.post('/', teamController_2.createTeam);
exports.default = router;

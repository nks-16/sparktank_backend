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
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const teamRouter_1 = __importDefault(require("./routes/teamRouter"));
const transactionRouter_1 = __importDefault(require("./routes/transactionRouter"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config(); // Load environment variables
const app = (0, express_1.default)();
const port = 5000;
// Middleware
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
// MongoDB Atlas connection URL from .env
const dbURI = process.env.MONGO_URI;
if (!dbURI) {
    throw new Error('MONGO_URI is not defined in the environment variables.');
}
// Function to check and create collections if they don't exist
const ensureCollectionsExist = () => __awaiter(void 0, void 0, void 0, function* () {
    const db = mongoose_1.default.connection.db;
    if (!db) {
        throw new Error('Database connection is not initialized.');
    }
    // Check and create 'teams' collection
    const teamCollection = yield db.listCollections({ name: 'teams' }).next();
    if (!teamCollection) {
        console.log("Creating 'teams' collection...");
        yield db.createCollection('teams');
        console.log("'teams' collection created.");
    }
    // Check and create 'transactions' collection
    const transactionCollection = yield db.listCollections({ name: 'transactions' }).next();
    if (!transactionCollection) {
        console.log("Creating 'transactions' collection...");
        yield db.createCollection('transactions');
        console.log("'transactions' collection created.");
    }
});
// Connect to MongoDB Atlas
mongoose_1.default.connect(dbURI)
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Connected to MongoDB Atlas');
    yield ensureCollectionsExist(); // Ensure collections exist
}))
    .catch((err) => console.error('MongoDB connection error:', err));
// Routes
app.use('/teams', teamRouter_1.default);
app.use('/transactions', transactionRouter_1.default);
// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const specialties_1 = __importDefault(require("./routes/specialties"));
const doctors_1 = __importDefault(require("./routes/doctors"));
const appointments_1 = __importDefault(require("./routes/appointments"));
const auth_1 = __importDefault(require("./routes/auth"));
const doctors_auth_1 = __importDefault(require("./routes/doctors-auth"));
const contact_1 = __importDefault(require("./routes/contact"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use('/api/specialties', specialties_1.default);
app.use('/api/doctors', doctors_1.default);
app.use('/api/appointments', appointments_1.default);
app.use('/api', auth_1.default);
app.use('/api/doctors-auth', doctors_auth_1.default);
app.use('/api/contact', contact_1.default);
// Health check
app.get('/api/health', (req, res) => {
    res.json({ message: 'Backend API is running', status: 'OK' });
});
app.listen(PORT, () => {
    console.log(`Backend server is running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map
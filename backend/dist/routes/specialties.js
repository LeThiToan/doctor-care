"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../config/database");
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    try {
        const specialties = await (0, database_1.query)("SELECT * FROM specialties");
        res.json(specialties);
    }
    catch (error) {
        console.error("Lỗi khi lấy danh sách chuyên khoa:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
});
exports.default = router;
//# sourceMappingURL=specialties.js.map
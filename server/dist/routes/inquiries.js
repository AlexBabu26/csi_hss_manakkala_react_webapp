"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = require("../db/index");
const auth_1 = require("../middleware/auth");
const zod_1 = require("zod");
const router = express_1.default.Router();
const inquirySchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    email: zod_1.z.string().email(),
    message: zod_1.z.string().min(1)
});
// POST new inquiry (public)
router.post('/', async (req, res) => {
    try {
        const { name, email, message } = inquirySchema.parse(req.body);
        const result = await (0, index_1.query)(`INSERT INTO inquiries (name, email, message) 
             VALUES ($1, $2, $3) 
             RETURNING id, created_at`, [name, email, message]);
        res.status(201).json({ message: 'Inquiry submitted successfully', id: result.rows[0].id });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ error: 'Invalid input', details: error.issues });
            return;
        }
        console.error('Create inquiry error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// GET all inquiries (protected)
router.get('/', auth_1.authenticate, async (req, res) => {
    try {
        const result = await (0, index_1.query)('SELECT * FROM inquiries ORDER BY created_at DESC');
        res.json(result.rows);
    }
    catch (error) {
        console.error('Get inquiries error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// PUT update inquiry status (protected)
router.put('/:id/status', auth_1.authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const statusSchema = zod_1.z.object({ status: zod_1.z.enum(['unread', 'read', 'replied']) });
        const { status } = statusSchema.parse(req.body);
        const result = await (0, index_1.query)(`UPDATE inquiries SET status = $1 WHERE id = $2 RETURNING *`, [status, id]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Inquiry not found' });
            return;
        }
        res.json({ message: 'Inquiry status updated', inquiry: result.rows[0] });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ error: 'Invalid input', details: error.issues });
            return;
        }
        console.error('Update inquiry error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;

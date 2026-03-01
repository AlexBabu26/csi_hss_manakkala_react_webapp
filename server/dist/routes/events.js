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
const eventSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    date: zod_1.z.string().datetime(),
    description: zod_1.z.string().optional(),
    images: zod_1.z.array(zod_1.z.string()).optional()
});
// GET all events
router.get('/', async (req, res) => {
    try {
        const result = await (0, index_1.query)('SELECT * FROM events ORDER BY date DESC');
        res.json(result.rows);
    }
    catch (error) {
        console.error('Get events error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// GET single event
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await (0, index_1.query)('SELECT * FROM events WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Event not found' });
            return;
        }
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error('Get event error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// POST create event (protected)
router.post('/', auth_1.authenticate, async (req, res) => {
    try {
        const { title, date, description, images } = eventSchema.parse(req.body);
        const userId = req.user?.id;
        const result = await (0, index_1.query)(`INSERT INTO events (title, date, description, images, created_by) 
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING *`, [title, date, description || '', JSON.stringify(images || []), userId]);
        res.status(201).json({ message: 'Event created successfully', event: result.rows[0] });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ error: 'Invalid input', details: error.issues });
            return;
        }
        console.error('Create event error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// PUT update event (protected)
router.put('/:id', auth_1.authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, date, description, images } = eventSchema.parse(req.body);
        const result = await (0, index_1.query)(`UPDATE events 
             SET title = $1, date = $2, description = $3, images = $4, updated_at = CURRENT_TIMESTAMP
             WHERE id = $5 
             RETURNING *`, [title, date, description || '', JSON.stringify(images || []), id]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Event not found' });
            return;
        }
        res.json({ message: 'Event updated successfully', event: result.rows[0] });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ error: 'Invalid input', details: error.issues });
            return;
        }
        console.error('Update event error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// DELETE event (protected)
router.delete('/:id', auth_1.authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await (0, index_1.query)('DELETE FROM events WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Event not found' });
            return;
        }
        res.json({ message: 'Event deleted successfully' });
    }
    catch (error) {
        console.error('Delete event error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;

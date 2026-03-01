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
const contentSchema = zod_1.z.object({
    page_key: zod_1.z.string(),
    content_data: zod_1.z.any()
});
// GET content for a specific page
router.get('/:page_key', async (req, res) => {
    try {
        const { page_key } = req.params;
        const result = await (0, index_1.query)('SELECT content_data FROM page_content WHERE page_key = $1', [page_key]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Content not found' });
            return;
        }
        res.json(result.rows[0].content_data);
    }
    catch (error) {
        console.error('Get content error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// PUT (update) content for a specific page (protected)
router.put('/:page_key', auth_1.authenticate, async (req, res) => {
    try {
        const { page_key } = req.params;
        const content_data = req.body;
        const userId = req.user?.id;
        // Upsert logic
        const result = await (0, index_1.query)(`INSERT INTO page_content (page_key, content_data, updated_by, updated_at) 
             VALUES ($1, $2, $3, CURRENT_TIMESTAMP) 
             ON CONFLICT (page_key) 
             DO UPDATE SET content_data = $2, updated_by = $3, updated_at = CURRENT_TIMESTAMP
             RETURNING *`, [page_key, JSON.stringify(content_data), userId]);
        res.json({ message: 'Content updated successfully', data: result.rows[0].content_data });
    }
    catch (error) {
        console.error('Update content error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;

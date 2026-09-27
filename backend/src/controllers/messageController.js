import Message from '../models/Message.js';

// @desc    Send a message (REST fallback)
// @route   POST /api/messages
export const sendMessage = async (req, res, next) => {
    try {
        const { username, text } = req.body;

        if (!username || !text) {
            res.status(400);
            throw new Error('username and text are required');
        }

        const message = await Message.create({ username, text, delivered: true });
        res.status(201).json({ success: true, data: message });
    } catch (error) {
        next(error);
    }
};

// @desc    Get chat history
// @route   GET /api/messages
export const getMessages = async (req, res, next) => {
    try {
        const messages = await Message.find().sort({ createdAt: 1 }).limit(200);
        res.status(200).json({ success: true, count: messages.length, data: messages });
    } catch (error) {
        next(error);
    }
};
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'Username is required'],
            trim: true,
        },
        text: {
            type: String,
            required: [true, 'Message text is required'],
            trim: true,
        },
        delivered: { type: Boolean, default: false },
        readBy: [{ type: String }],
    },
    { timestamps: true }
);

export default mongoose.model('Message', messageSchema);
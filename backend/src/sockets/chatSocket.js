import Message from '../models/Message.js';

// In-memory map: socketId -> username
const onlineUsers = new Map();

const broadcastOnlineUsers = (io) => {
    io.emit('online_users', Array.from(new Set(onlineUsers.values())));
};

const chatSocket = (io) => {
    io.on('connection', (socket) => {
        console.log(`🔌 Connected: ${socket.id}`);

        // Join chat with username
        socket.on('join_chat', async ({ username }) => {
            try {
                if (!username) return;

                socket.username = username;
                onlineUsers.set(socket.id, username);
                broadcastOnlineUsers(io);

                // Send recent history to this socket
                const history = await Message.find().sort({ createdAt: 1 }).limit(200);
                socket.emit('chat_history', history);

                // System message
                io.emit('system_message', {
                    text: `${username} joined the chat`,
                    createdAt: new Date().toISOString(),
                });
            } catch (err) {
                socket.emit('error_message', { message: 'Failed to load chat history' });
            }
        });

        // New message
        socket.on('send_message', async (payload, ack) => {
            try {
                const { username, text } = payload;
                if (!username || !text?.trim()) return;

                const message = await Message.create({ username, text, delivered: true });

                io.emit('receive_message', message);

                if (typeof ack === 'function') ack({ success: true, data: message });
            } catch (err) {
                socket.emit('error_message', { message: 'Message failed to send' });
                if (typeof ack === 'function') ack({ success: false, error: err.message });
            }
        });

        // Typing indicator
        socket.on('typing', ({ username, isTyping }) => {
            socket.broadcast.emit('user_typing', { username, isTyping });
        });

        // Mark message as read
        socket.on('message_read', async ({ messageId, username }) => {
            try {
                await Message.findByIdAndUpdate(messageId, { $addToSet: { readBy: username } });
                io.emit('message_read_update', { messageId, username });
            } catch (err) {
                /* silent */
            }
        });

        socket.on('disconnect', () => {
            const username = onlineUsers.get(socket.id);
            onlineUsers.delete(socket.id);
            broadcastOnlineUsers(io);

            if (username) {
                io.emit('system_message', {
                    text: `${username} left the chat`,
                    createdAt: new Date().toISOString(),
                });
            }
            console.log(`❌ Disconnected: ${socket.id}`);
        });
    });
};

export default chatSocket;
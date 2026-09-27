import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import { useChat } from '../hooks/useChat';

export default function ChatWindow({ username, onLogout }) {
    const {
        messages,
        systemMessages,
        onlineUsers,
        typingUsers,
        connected,
        sendMessage,
        sendTyping,
    } = useChat(username);

    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, systemMessages, typingUsers]);

    return (
        <div className="chat-container">
            <div className="chat-header">
                <div>
                    <h2>💬 Chat Room</h2>
                    <small style={{ color: '#94a3b8' }}>
                        {connected ? '🟢 Connected' : '🔴 Disconnected'} · You: {username}
                    </small>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="online-count">{onlineUsers.length} online</span>
                    <button onClick={onLogout}>Logout</button>
                </div>
            </div>

            <div className="messages">
                {messages.map((m) => (
                    <MessageBubble key={m._id} message={m} isOwn={m.username === username} />
                ))}
                {systemMessages.map((s, i) => (
                    <div key={i} className="system-message">
                        {s.text}
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            <TypingIndicator users={typingUsers} />
            <MessageInput onSend={sendMessage} onTyping={sendTyping} />
        </div>
    );
}
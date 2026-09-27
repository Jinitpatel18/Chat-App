import { useCallback, useEffect, useRef, useState } from 'react';
import { getSocket } from '../services/socket';
import { fetchMessages } from '../services/api';

export const useChat = (username) => {
    const [messages, setMessages] = useState([]);
    const [systemMessages, setSystemMessages] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [typingUsers, setTypingUsers] = useState({});
    const [connected, setConnected] = useState(false);
    const socketRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    useEffect(() => {
        if (!username) return;

        const socket = getSocket();
        socketRef.current = socket;
        socket.connect();

        socket.on('connect', () => {
            setConnected(true);
            socket.emit('join_chat', { username });
        });

        socket.on('disconnect', () => setConnected(false));

        socket.on('chat_history', (history) => {
            setMessages(history);
        });

        socket.on('receive_message', (message) => {
            setMessages((prev) => {
                if (prev.some((m) => m._id === message._id)) return prev;
                return [...prev, message];
            });
        });

        socket.on('system_message', (msg) => {
            setSystemMessages((prev) => [...prev, msg]);
        });

        socket.on('online_users', (users) => setOnlineUsers(users));

        socket.on('user_typing', ({ username: who, isTyping }) => {
            setTypingUsers((prev) => {
                const next = { ...prev };
                if (isTyping) next[who] = true;
                else delete next[who];
                return next;
            });
        });

        socket.on('error_message', ({ message }) => {
            console.error('Socket error:', message);
        });

        // REST fallback: load history immediately
        fetchMessages()
            .then((data) => {
                setMessages((prev) => (prev.length ? prev : data));
            })
            .catch((err) => console.warn('History fetch failed', err));

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('chat_history');
            socket.off('receive_message');
            socket.off('system_message');
            socket.off('online_users');
            socket.off('user_typing');
            socket.off('error_message');
            socket.disconnect();
        };
    }, [username]);

    const sendMessage = useCallback(
        (text) => {
            if (!socketRef.current || !text.trim()) return;
            socketRef.current.emit(
                'send_message',
                { username, text: text.trim() },
                (ack) => {
                    if (!ack?.success) console.error('Send failed', ack?.error);
                }
            );
        },
        [username]
    );

    const sendTyping = useCallback(
        (isTyping) => {
            if (!socketRef.current) return;
            socketRef.current.emit('typing', { username, isTyping });

            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            if (isTyping) {
                typingTimeoutRef.current = setTimeout(() => {
                    socketRef.current?.emit('typing', { username, isTyping: false });
                }, 2000);
            }
        },
        [username]
    );

    return {
        messages,
        systemMessages,
        onlineUsers,
        typingUsers,
        connected,
        sendMessage,
        sendTyping,
    };
};
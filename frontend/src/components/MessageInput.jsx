import { useState } from 'react';

export default function MessageInput({ onSend, onTyping }) {
    const [text, setText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        onSend(text);
        setText('');
        onTyping(false);
    };

    const handleChange = (e) => {
        setText(e.target.value);
        onTyping(e.target.value.length > 0);
    };

    return (
        <form className="input-area" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Type a message..."
                value={text}
                onChange={handleChange}
                onBlur={() => onTyping(false)}
                maxLength={500}
            />
            <button type="submit" disabled={!text.trim()}>
                Send
            </button>
        </form>
    );
}
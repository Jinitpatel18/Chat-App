import { useState } from 'react';

export default function Login({ onLogin }) {
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = name.trim();
        if (trimmed.length < 2) {
            setError('Username must be at least 2 characters');
            return;
        }
        onLogin(trimmed);
    };

    return (
        <div className="app-container">
            <form className="login-container" onSubmit={handleSubmit}>
                <h1>💬 Real-Time Chat</h1>
                <p>Enter a username to join the conversation</p>

                <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        setError('');
                    }}
                    maxLength={20}
                    autoFocus
                />

                {error && <p style={{ color: '#ef4444', marginBottom: 12 }}>{error}</p>}

                <button type="submit">Join Chat</button>
            </form>
        </div>
    );
}
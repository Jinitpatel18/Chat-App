import { useState } from 'react';
import Login from './components/Login';
import ChatWindow from './components/ChatWindow';

export default function App() {
    const [username, setUsername] = useState('');

    return (
        <div className="app-container">
            {username ? (
                <ChatWindow username={username} onLogout={() => setUsername('')} />
            ) : (
                <Login onLogin={setUsername} />
            )}
        </div>
    );
}
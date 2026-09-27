const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export default function MessageBubble({ message, isOwn }) {
    return (
        <div className={`message ${isOwn ? 'own' : ''}`}>
            {!isOwn && <div className="meta">{message.username}</div>}
            <div className="text">{message.text}</div>
            <div className="time">{formatTime(message.createdAt)}</div>
        </div>
    );
}
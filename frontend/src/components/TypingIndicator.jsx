export default function TypingIndicator({ users }) {
    const names = Object.keys(users);
    if (!names.length) return <div className="typing-indicator" />;

    const text =
        names.length === 1
            ? `${names[0]} is typing...`
            : names.length === 2
                ? `${names[0]} and ${names[1]} are typing...`
                : `${names.length} people are typing...`;

    return <div className="typing-indicator">{text}</div>;
}
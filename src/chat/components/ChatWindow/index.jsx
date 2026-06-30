import ChatHeader from '../ChatHeader';
import MessageList from '../MessageList';
import MessageInput from '../MessageInput';
import './ChatWindow.css';

export default function ChatWindow() {
  return (
    <div className="chat-window">
      <ChatHeader />
      <MessageList />
      <MessageInput />
    </div>
  );
}

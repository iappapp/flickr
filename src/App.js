import './App.css';
import { Routes, Route } from 'react-router-dom';
import Login from './Login';
import Game from './component/Game';
import Clock from './component/Clock';
import Counter from './component/Counter';
import HelloMessage from './component/Message';
import FlavorForm from './component/FormList';
import LoginControl from './component/LoginBox';
import Stopwatch from './component/Stopwatch';
import TaskListPage from './component/TaskListPage';
import LogPage from './component/LogPage';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/game" element={<Game />} />
      <Route path="/message" element={<HelloMessage />} />
      <Route path="/form" element={<FlavorForm />} />
      <Route path="/loginBox" element={<LoginControl />} />
      <Route path="/stopwatch" element={<Stopwatch />} />
      <Route path="/log" element={<LogPage />} />
      <Route path="/taskListPage" element={<TaskListPage />} />
    </Routes>
  );
}

export default App;

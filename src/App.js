import './App.css';
import logo from './logo.svg';
import { Routes, Route } from 'react-router-dom';
import Login from './Login';
import Game from './component/Game';
import Clock from './component/Clock';
import WebApp from './component/WebApp';
import Counter from './component/Counter';
import HelloMessage from './component/Message';
import FlavorForm from './component/FormList';
import LoginControl from './component/LoginBox';
import Stopwatch from './component/Stopwatch';
import BasicLayout from './routes/BasicLayout';
import TaskListPage from './component/TaskListPage';
import LogPage from './component/LogPage';

function Home() {
  return (
    <div className="App" width="1920px" height="1080px">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <BasicLayout />
        </header>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
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

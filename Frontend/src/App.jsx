import './App.css';
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import Auth from "./Auth.jsx";
import DebateMode from "./DebateMode.jsx";
import MemoryManager from "./MemoryManager.jsx";
import {MyContext} from "./MyContext.jsx";
import { useState, useEffect } from 'react';
import {v1 as uuidv1} from "uuid";

function App() {
  const [user, setUser] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]); //stores all chats of curr threads
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar toggle (open by default)
  const [currentView, setCurrentView] = useState('chat'); // 'chat', 'debate', 'memory'
  const [selectedPersonality, setSelectedPersonality] = useState('professional');

  // Check if user is logged in (only persists during browser session - cleared when browser closes)
  useEffect(() => {
    const storedUser = sessionStorage.getItem('novamind_user');
    const isLoggedIn = sessionStorage.getItem('novamind_logged_in');
    if (storedUser && isLoggedIn === 'true') {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    }
  }, []);

  const handleLogin = (userData) => {
    // Set user data and persist to sessionStorage (cleared when browser closes)
    setUser(userData);
        sessionStorage.setItem('cognisphere_logged_in', 'true');
        sessionStorage.setItem('cognisphere_user', JSON.stringify(userData));
    setAllThreads([]);
    setCurrThreadId(uuidv1());
    setNewChat(true);
    setPrompt("");
    setReply(null);
  };

  const handleLogout = () => {
    // Clear user and all session data
    setUser(null);
    sessionStorage.setItem('novamind_logged_in', 'false');
    sessionStorage.removeItem('novamind_user');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    
    // Clear chat data on logout
    setPrevChats([]);
    setAllThreads([]);
    setCurrThreadId(uuidv1());
    setNewChat(true);
    setPrompt("");
    setReply(null);
  };

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads,
    user, 
    handleLogout,
    isSidebarOpen, 
    setIsSidebarOpen,
    currentView,
    setCurrentView,
    selectedPersonality,
    setSelectedPersonality
  }; 

  // Show auth screen if not logged in
  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className='app'>
      <MyContext.Provider value={providerValues}>
          <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
          <div className={`app-content ${isSidebarOpen ? '' : 'sidebar-closed'}`}>
            {currentView === 'chat' && <ChatWindow />}
            {currentView === 'debate' && <DebateMode />}
            {currentView === 'memory' && <MemoryManager user={user} />}
          </div>
        </MyContext.Provider>
    </div>
  )
}

export default App

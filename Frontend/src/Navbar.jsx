import { useContext, useState } from "react";
import { MyContext } from "./MyContext.jsx";
import "./Navbar.css";

function Navbar({ isVisible = true }) {
    const { user, handleLogout, isSidebarOpen, setIsSidebarOpen, currentView, setCurrentView } = useContext(MyContext);
    const [isOpen, setIsOpen] = useState(false);

    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <div className={`navbar ${isVisible ? 'navbar-visible' : 'navbar-hidden'}`}>
                <button className="hamburger-menu" onClick={() => setIsSidebarOpen && setIsSidebarOpen(!isSidebarOpen)}>
                    <i className="fa-solid fa-bars"></i>
                </button>
                <div className="brand-name">
                    <img src="/cognisphere-logo.png" alt="CogniSphere" className="navbar-logo" />
                    CogniSphere
                </div>
                
                {/* View Navigation Tabs */}
                <div className="navbar-tabs">
                    <button 
                        className={`navbar-tab ${currentView === 'chat' ? 'active' : ''}`}
                        onClick={() => setCurrentView('chat')}
                    >
                        <i className="fa-solid fa-message"></i>
                        <span>Chat</span>
                    </button>
                    <button 
                        className={`navbar-tab ${currentView === 'debate' ? 'active' : ''}`}
                        onClick={() => setCurrentView('debate')}
                    >
                        <i className="fa-solid fa-scale-balanced"></i>
                        <span>Debate</span>
                    </button>
                    <button 
                        className={`navbar-tab ${currentView === 'memory' ? 'active' : ''}`}
                        onClick={() => setCurrentView('memory')}
                    >
                        <i className="fa-solid fa-brain"></i>
                        <span>Memory</span>
                    </button>
                </div>

                <div className="userIconDiv" onClick={handleProfileClick}>
                    <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                </div>
            </div>
            {isOpen && 
                <div className="dropDown">
                    <div className="dropDownItem user-info">
                        <i className="fa-solid fa-user"></i>
                        <span>{user?.name || 'User'}</span>
                    </div>
                    <div className="dropDownItem"><i className="fa-solid fa-gear"></i> Settings</div>
                    <div className="dropDownItem" onClick={handleLogout}>
                        <i className="fa-solid fa-arrow-right-from-bracket"></i> Log out
                    </div>
                </div>
            }
        </>
    );
}

export default Navbar;

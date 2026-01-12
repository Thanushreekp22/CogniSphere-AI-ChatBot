import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import QuickActions from "./QuickActions.jsx";
import PersonalitySelector from "./PersonalitySelector.jsx";
import Navbar from "./Navbar.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect, useRef } from "react";
import {ScaleLoader} from "react-spinners";

function ChatWindow() {
    const {prompt, setPrompt, reply, setReply, currThreadId, setPrevChats, setNewChat, user, selectedPersonality, setSelectedPersonality} = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [navbarVisible, setNavbarVisible] = useState(true);
    const chatContentRef = useRef(null);
    const lastScrollTop = useRef(0);
    const [isListening, setIsListening] = useState(false);
    const [isSpeechSupported, setIsSpeechSupported] = useState(false);
    const recognitionRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [currentImage, setCurrentImage] = useState(null); // Store image for current message
    const [currentPrompt, setCurrentPrompt] = useState(""); // Store prompt for current message
    const [wordLimit, setWordLimit] = useState(null); // null = no limit, 50, 250
    const [isInputFocused, setIsInputFocused] = useState(false);
    const fileInputRef = useRef(null);

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check if file is an image
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }
            
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size should be less than 5MB');
                return;
            }
            
            setSelectedImage(file);
            
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const getReply = async (quickActionPrompt) => {
        // Use quick action prompt if provided, otherwise use state prompt
        const currentPrompt = quickActionPrompt || prompt;
        
        // Don't send if both prompt and image are empty
        if ((!currentPrompt || !currentPrompt.trim()) && !selectedImage) {
            return;
        }
        
        setLoading(true);
        setNewChat(false);

        let imageBase64 = null;
        
        // Use default message if prompt is empty but image exists
        let messageToSend = (currentPrompt && currentPrompt.trim()) ? currentPrompt : "Analyze this image";
        let displayPrompt = messageToSend; // What user sees in chat
        
        // Add word limit instruction if selected (use a more subtle format)
        if (wordLimit) {
            messageToSend = `[Response length: ~${wordLimit} words]\n\n${messageToSend}`;
        }
        
        // Store current image and prompt for chat history BEFORE clearing
        setCurrentImage(imagePreview);
        setCurrentPrompt(displayPrompt);
        
        // Convert image to base64 if present
        if (selectedImage) {
            const reader = new FileReader();
            imageBase64 = await new Promise((resolve) => {
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(selectedImage);
            });
        }

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: messageToSend,
                threadId: currThreadId,
                userId: user?.email || user?.guestId || 'anonymous',
                userEmail: user?.email || 'anonymous@cognisphere.ai',
                image: imageBase64,
                personality: selectedPersonality
            })
        };

        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        
        try {
            const response = await fetch(`${API_URL}/api/chat`, options);
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Backend error:", errorData);
                setReply(`Error: ${errorData.error || 'Failed to get response'}`);
                setLoading(false);
                return;
            }
            
            const res = await response.json();
            
            if (res.reply) {
                setReply(res.reply);
                // Clear image and word limit after successful response
                removeImage();
                setWordLimit(null);
            } else {
                console.error("No reply in response");
                setReply("Error: No response from AI");
            }
        } catch(err) {
            console.error("Network error:", err);
            setReply(`Network error: ${err.message}. Please check if backend is running.`);
        } finally {
            setLoading(false);
        }
    }

    // Initialize speech recognition
    useEffect(() => {
        // Check if browser supports Web Speech API
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (SpeechRecognition) {
            setIsSpeechSupported(true);
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onstart = () => {
                setIsListening(true);
            };

            recognition.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map(result => result[0])
                    .map(result => result.transcript)
                    .join('');
                
                setPrompt(transcript);
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current = recognition;
        } else {
            setIsSpeechSupported(false);
            console.log('Speech recognition not supported in this browser');
        }
    }, []);

    const toggleVoiceInput = () => {
        if (!isSpeechSupported) {
            alert('Voice input is not supported in your browser. Please use Chrome, Edge, or Safari.');
            return;
        }

        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            recognitionRef.current?.start();
        }
    };

    //Append new chat to prevChats
    useEffect(() => {
        // Add to chat if we have a reply and either a prompt or an image
        if(reply && (currentPrompt || currentImage)) {
            setPrevChats(prevChats => [...prevChats, {
                role: "user",
                content: currentPrompt,
                image: currentImage // Include image in chat history
            },{
                role: "assistant",
                content: reply
            }]);
            setPrompt("");
            setCurrentImage(null); // Clear after adding to chat
            setCurrentPrompt(""); // Clear after adding to chat
        }
    }, [reply]);

    // Handle scroll to hide/show navbar
    const handleScroll = (event) => {
        let scrollTop = 0;
        
        // Get scroll position from the event target (the actual scrolling element)
        if (event && event.target) {
            scrollTop = event.target.scrollTop;
        } else if (chatContentRef.current) {
            // Try to find the .chats element
            const chatsElement = chatContentRef.current.querySelector('.chats');
            if (chatsElement) {
                scrollTop = chatsElement.scrollTop;
            } else {
                scrollTop = chatContentRef.current.scrollTop;
            }
        } else {
            scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        }
        
        const scrollDirection = scrollTop > lastScrollTop.current ? 'down' : 'up';
        
        // Hide navbar when scrolling down, show when scrolling up
        if (scrollDirection === 'down' && scrollTop > 30) {
            setNavbarVisible(false);
        } else if (scrollDirection === 'up' || scrollTop <= 30) {
            setNavbarVisible(true);
        }
        
        lastScrollTop.current = scrollTop;
    };

    // Add scroll listener to the actual scrollable element (.chats)
    useEffect(() => {
        const setupScrollListener = () => {
            const chatContent = chatContentRef.current;
            
            if (chatContent) {
                // Find the .chats element which is the actual scrollable container
                const chatsElement = chatContent.querySelector('.chats');
                
                if (chatsElement) {
                    chatsElement.addEventListener('scroll', handleScroll, { passive: true });
                    
                    return () => {
                        chatsElement.removeEventListener('scroll', handleScroll);
                    };
                } else {
                    chatContent.addEventListener('scroll', handleScroll, { passive: true });
                    
                    return () => {
                        chatContent.removeEventListener('scroll', handleScroll);
                    };
                }
            }
        };

        // Delay setup to ensure DOM is fully rendered
        const timer = setTimeout(setupScrollListener, 500);
        
        return () => {
            clearTimeout(timer);
        };
    }, []);


    return (
        <div className="chatWindow">
            <Navbar isVisible={navbarVisible} />
            
            <div className="chatContent" ref={chatContentRef}>
                {/* Personality Selector */}
                <PersonalitySelector 
                    selectedPersonality={selectedPersonality}
                    onPersonalityChange={setSelectedPersonality}
                />
                
                <Chat onQuickActionSubmit={(quickPrompt) => getReply(quickPrompt)}></Chat>
                {loading && (
                    <div className="loaderContainer">
                        <ScaleLoader color="#fff" loading={loading} />
                    </div>
                )}
            </div>
            
            <div className="chatInput">
                {imagePreview && (
                    <div className="image-preview-container">
                        <div className="image-preview">
                            <img src={imagePreview} alt="Selected" />
                            <button className="remove-image-btn" onClick={removeImage}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                    </div>
                )}
                <div className="inputBox">
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleImageSelect}
                        style={{ display: 'none' }}
                    />
                    <div 
                        className="image-upload-btn"
                        onClick={() => fileInputRef.current?.click()}
                        title="Upload image"
                    >
                        <i className="fa-solid fa-image"></i>
                    </div>
                    <input placeholder="Ask anything"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter'? getReply() : ''}
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={(e) => {
                            // Delay to allow clicking word limit buttons
                            setTimeout(() => setIsInputFocused(false), 200);
                        }}
                    >
                    </input>
                    <div className="word-limit-selector-inline" onMouseDown={(e) => e.preventDefault()}>
                        <button 
                            className={`word-limit-btn-inline ${wordLimit === 50 ? 'active' : ''}`}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                setWordLimit(50);
                            }}
                            title="Very short response (~50 words)"
                        >
                            50
                        </button>
                        <button 
                            className={`word-limit-btn-inline ${wordLimit === 100 ? 'active' : ''}`}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                setWordLimit(100);
                            }}
                            title="Brief response (~100 words)"
                        >
                            100
                        </button>
                        <button 
                            className={`word-limit-btn-inline ${wordLimit === 250 ? 'active' : ''}`}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                setWordLimit(250);
                            }}
                            title="Detailed response (~250 words)"
                        >
                            250
                        </button>
                        <button 
                            className={`word-limit-btn-inline ${wordLimit === 500 ? 'active' : ''}`}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                setWordLimit(500);
                            }}
                            title="Comprehensive response (~500 words)"
                        >
                            500
                        </button>
                    </div>
                    {isSpeechSupported && (
                        <div 
                            id="voiceInput" 
                            className={`voice-btn ${isListening ? 'listening' : ''}`}
                            onClick={toggleVoiceInput}
                            title={isListening ? 'Stop recording' : 'Start voice input'}
                        >
                            <i className={`fa-solid ${isListening ? 'fa-stop' : 'fa-microphone'}`}></i>
                        </div>
                    )}
                    <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
                </div>
                <p className="info">
                    CogniSphere can make mistakes. Consider checking important information.
                </p>
            </div>
        </div>
    )
}

export default ChatWindow;
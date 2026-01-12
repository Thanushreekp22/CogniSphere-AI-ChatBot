import { useState } from 'react';
import './QuickActions.css';

const QUICK_ACTIONS = [
    {
        id: 'summarize',
        title: 'Summarize',
        description: 'Summarize long text or articles',
        prompt: 'Please summarize the following text in a concise way, highlighting the key points:\n\n',
        placeholder: 'Paste your article or long text here...'
    },
    {
        id: 'email',
        title: 'Professional Email',
        description: 'Write a professional email',
        prompt: 'Write a professional email based on these details:\n\n',
        placeholder: 'e.g., "Request for meeting about project deadline extension"'
    },
    {
        id: 'eli5',
        title: 'Explain Like I\'m 5',
        description: 'Simple explanations for complex topics',
        prompt: 'Explain the following concept in very simple terms, as if explaining to a 5-year-old:\n\n',
        placeholder: 'e.g., "quantum computing", "blockchain", etc.'
    },
    {
        id: 'debug',
        title: 'Debug Code',
        description: 'Find and fix code errors',
        prompt: 'Help me debug this code. Explain the error and provide a solution:\n\n```\n',
        placeholder: 'Paste your code and error message here...',
        suffix: '\n```'
    },
    {
        id: 'translate',
        title: 'Translate',
        description: 'Translate text to another language',
        prompt: 'Translate the following text to ',
        placeholder: 'Enter target language and text...',
        requiresLanguage: true
    },
    {
        id: 'improve',
        title: 'Improve Writing',
        description: 'Enhance grammar and style',
        prompt: 'Improve the grammar, clarity, and style of this text while keeping the original meaning:\n\n',
        placeholder: 'Paste your text here...'
    }
];

function QuickActions({ onSelectAction }) {
    const [showModal, setShowModal] = useState(false);
    const [selectedAction, setSelectedAction] = useState(null);
    const [userInput, setUserInput] = useState('');
    const [language, setLanguage] = useState('English');

    const handleActionClick = (action) => {
        setSelectedAction(action);
        setUserInput('');
        setLanguage('English');
        setShowModal(true);
    };

    const handleSubmit = () => {
        if (!userInput.trim()) return;

        let finalPrompt = selectedAction.prompt;
        
        if (selectedAction.requiresLanguage) {
            finalPrompt += `${language}:\n\n`;
        }
        
        finalPrompt += userInput;
        
        if (selectedAction.suffix) {
            finalPrompt += selectedAction.suffix;
        }

        onSelectAction(finalPrompt);
        setShowModal(false);
        setUserInput('');
        setSelectedAction(null);
    };

    const handleCancel = () => {
        setShowModal(false);
        setUserInput('');
        setSelectedAction(null);
    };

    return (
        <>
            <div className="quick-actions-container">
                <div className="quick-actions-header">
                    <h3>Quick Actions</h3>
                    <p>Select a template to get started quickly</p>
                </div>
                
                <div className="quick-actions-grid">
                    {QUICK_ACTIONS.map((action) => (
                        <button
                            key={action.id}
                            className="quick-action-card"
                            onClick={() => handleActionClick(action)}
                        >
                            <div className="action-content">
                                <div className="action-title">{action.title}</div>
                                <div className="action-description">{action.description}</div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {showModal && selectedAction && (
                <div className="quick-action-modal-overlay" onClick={handleCancel}>
                    <div className="quick-action-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{selectedAction.title}</h2>
                            <button className="modal-close" onClick={handleCancel}>×</button>
                        </div>
                        
                        <div className="modal-body">
                            <p className="modal-description">{selectedAction.description}</p>
                            
                            {selectedAction.requiresLanguage && (
                                <div className="language-input">
                                    <label>Target Language:</label>
                                    <input
                                        type="text"
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                        placeholder="e.g., Spanish, French, Hindi"
                                    />
                                </div>
                            )}
                            
                            <textarea
                                className="modal-textarea"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder={selectedAction.placeholder}
                                rows={8}
                                autoFocus
                            />
                        </div>
                        
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={handleCancel}>
                                Cancel
                            </button>
                            <button 
                                className="btn-submit" 
                                onClick={handleSubmit}
                                disabled={!userInput.trim()}
                            >
                                Generate Response
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default QuickActions;

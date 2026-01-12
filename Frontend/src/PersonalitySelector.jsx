import { useState, useEffect, useRef } from 'react';
import './PersonalitySelector.css';

const PERSONALITIES = [
    {
        id: 'professional',
        name: 'Professional Assistant',
        icon: 'briefcase',
        description: 'Clear, concise, business-oriented responses'
    },
    {
        id: 'creative',
        name: 'Creative Writer',
        icon: 'palette',
        description: 'Imaginative, poetic, and inspiring'
    },
    {
        id: 'mentor',
        name: 'Code Mentor',
        icon: 'graduation-cap',
        description: 'Patient, educational programming guidance'
    },
    {
        id: 'casual',
        name: 'Casual Friend',
        icon: 'comments',
        description: 'Relaxed, friendly, conversational'
    },
    {
        id: 'socratic',
        name: 'Socratic Teacher',
        icon: 'lightbulb',
        description: 'Guides learning through thoughtful questions'
    },
    {
        id: 'debugger',
        name: 'Debug Partner',
        icon: 'bug',
        description: 'Systematic, technical problem-solving'
    },
    {
        id: 'motivational',
        name: 'Motivational Coach',
        icon: 'trophy',
        description: 'Encouraging, positive, inspiring'
    },
    {
        id: 'scientist',
        name: 'Scientific Analyst',
        icon: 'flask',
        description: 'Precise, evidence-based, analytical'
    }
];

function PersonalitySelector({ selectedPersonality, onPersonalityChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const currentPersonality = PERSONALITIES.find(p => p.id === selectedPersonality) || PERSONALITIES[0];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (personalityId) => {
        onPersonalityChange(personalityId);
        setIsOpen(false);
    };

    return (
        <div className="personality-selector">
            <label>AI Personality:</label>
            <div className="personality-dropdown" ref={dropdownRef}>
                <div 
                    className="personality-selected"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <i className={`fa-solid fa-${currentPersonality.icon} icon`}></i>
                    <span className="name">{currentPersonality.name}</span>
                    <i className={`fa-solid fa-chevron-down arrow ${isOpen ? 'open' : ''}`}></i>
                </div>

                {isOpen && (
                    <div className="personality-options">
                        {PERSONALITIES.map((personality) => (
                            <div
                                key={personality.id}
                                className={`personality-option ${personality.id === selectedPersonality ? 'active' : ''}`}
                                onClick={() => handleSelect(personality.id)}
                            >
                                <i className={`fa-solid fa-${personality.icon} icon`}></i>
                                <div className="details">
                                    <div className="name">{personality.name}</div>
                                    <div className="description">{personality.description}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default PersonalitySelector;

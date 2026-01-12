import { useState, useEffect } from 'react';
import Navbar from './Navbar.jsx';
import './MemoryManager.css';

function MemoryManager({ user }) {
    const [memories, setMemories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Form state
    const [key, setKey] = useState('');
    const [value, setValue] = useState('');
    const [category, setCategory] = useState('other');
    const [importance, setImportance] = useState(3);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const userId = user?.email || user?.guestId || 'anonymous';

    useEffect(() => {
        loadMemories();
    }, []);

    const loadMemories = async () => {
        try {
            const response = await fetch(`${API_URL}/api/memory/${encodeURIComponent(userId)}`);
            const data = await response.json();
            if (response.ok) {
                setMemories(data.memories || []);
            }
        } catch (err) {
            console.error('Error loading memories:', err);
        }
    };

    const handleAddMemory = async (e) => {
        e.preventDefault();
        
        if (!key.trim() || !value.trim()) {
            setError('Key and value are required');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch(`${API_URL}/api/memory`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    userEmail: user?.email || 'anonymous@cognisphere.ai',
                    key,
                    value,
                    category,
                    importance
                })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Memory saved successfully!');
                setKey('');
                setValue('');
                setCategory('other');
                setImportance(3);
                loadMemories();
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(data.error || 'Failed to save memory');
            }
        } catch (err) {
            console.error('Error saving memory:', err);
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteMemory = async (memoryKey) => {
        if (!confirm(`Delete memory: ${memoryKey}?`)) return;

        try {
            const response = await fetch(
                `${API_URL}/api/memory/${encodeURIComponent(userId)}/${encodeURIComponent(memoryKey)}`,
                { method: 'DELETE' }
            );

            if (response.ok) {
                setSuccess('Memory deleted successfully');
                loadMemories();
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (err) {
            console.error('Error deleting memory:', err);
            setError('Failed to delete memory');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="memory-container">
            <Navbar />
            <div className="memory-manager">
            <div className="memory-header">
                <h2>🧠 Personal Knowledge Base</h2>
                <p>Teach the AI to remember facts about you for personalized conversations</p>
            </div>

            <div className="memory-stats">
                <div className="memory-stat">
                    <div className="memory-stat-value">{memories.length}</div>
                    <div className="memory-stat-label">Total Memories</div>
                </div>
                <div className="memory-stat">
                    <div className="memory-stat-value">
                        {memories.filter(m => m.importance >= 4).length}
                    </div>
                    <div className="memory-stat-label">Important</div>
                </div>
            </div>

            <form className="memory-add-form" onSubmit={handleAddMemory}>
                {error && <div className="memory-error">{error}</div>}
                {success && <div className="memory-success">{success}</div>}

                <div className="memory-form-row">
                    <div className="memory-form-group">
                        <label>Memory Key</label>
                        <input
                            type="text"
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            placeholder="e.g., Favorite Language"
                            disabled={loading}
                        />
                    </div>
                    <div className="memory-form-group">
                        <label>Value</label>
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder="e.g., JavaScript"
                            disabled={loading}
                        />
                    </div>
                </div>

                <div className="memory-form-row">
                    <div className="memory-form-group">
                        <label>Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            disabled={loading}
                        >
                            <option value="personal">Personal</option>
                            <option value="preference">Preference</option>
                            <option value="skill">Skill</option>
                            <option value="goal">Goal</option>
                            <option value="fact">Fact</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div className="memory-form-group">
                        <label>Importance</label>
                        <div className="memory-importance">
                            {[1, 2, 3, 4, 5].map(star => (
                                <i
                                    key={star}
                                    className={`fa-solid fa-star importance-star ${star <= importance ? 'filled' : ''}`}
                                    onClick={() => setImportance(star)}
                                ></i>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="memory-form-actions">
                    <button
                        type="submit"
                        className="memory-btn memory-btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : '💾 Save Memory'}
                    </button>
                    <button
                        type="button"
                        className="memory-btn memory-btn-secondary"
                        onClick={() => {
                            setKey('');
                            setValue('');
                            setCategory('other');
                            setImportance(3);
                        }}
                        disabled={loading}
                    >
                        Clear
                    </button>
                </div>
            </form>

            <div className="memory-list">
                <div className="memory-list-header">
                    Your Memories ({memories.length})
                </div>

                {memories.length === 0 ? (
                    <div className="memory-empty">
                        <div className="memory-empty-icon">🧠</div>
                        <div className="memory-empty-text">No memories yet</div>
                        <div className="memory-empty-hint">
                            Add your first memory to help AI remember things about you
                        </div>
                    </div>
                ) : (
                    <div className="memory-items">
                        {memories.map((memory, idx) => (
                            <div
                                key={idx}
                                className={`memory-item category-${memory.category}`}
                            >
                                <div className="memory-item-content">
                                    <div className="memory-item-header">
                                        <span className="memory-item-key">{memory.key}</span>
                                        <span className="memory-item-category">
                                            {memory.category}
                                        </span>
                                    </div>
                                    <div className="memory-item-value">{memory.value}</div>
                                    <div className="memory-item-meta">
                                        <span>
                                            {'⭐'.repeat(memory.importance)}
                                        </span>
                                        <span>
                                            Created: {formatDate(memory.createdAt)}
                                        </span>
                                        {memory.useCount > 0 && (
                                            <span>Used {memory.useCount}x</span>
                                        )}
                                    </div>
                                </div>
                                <div className="memory-item-actions">
                                    <button
                                        className="memory-action-btn"
                                        onClick={() => handleDeleteMemory(memory.key)}
                                        title="Delete memory"
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            </div>
        </div>
    );
}

export default MemoryManager;

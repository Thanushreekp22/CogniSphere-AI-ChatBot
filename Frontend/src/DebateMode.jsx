import { useState } from 'react';
import { ScaleLoader } from 'react-spinners';
import Navbar from './Navbar.jsx';
import './DebateMode.css';

function DebateMode() {
    const [topic, setTopic] = useState('');
    const [rounds, setRounds] = useState(3);
    const [debate, setDebate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const startDebate = async () => {
        if (!topic.trim()) {
            setError('Please enter a debate topic');
            return;
        }

        setLoading(true);
        setError('');
        setDebate(null);

        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

        try {
            const response = await fetch(`${API_URL}/api/debate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ topic, rounds })
            });

            const data = await response.json();

            if (response.ok) {
                setDebate(data);
            } else {
                setError(data.error || 'Failed to start debate');
            }
        } catch (err) {
            console.error('Debate error:', err);
            setError('Network error. Please check if backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const resetDebate = () => {
        setDebate(null);
        setTopic('');
        setError('');
    };

    // Group debate by rounds
    const groupedDebate = debate ? debate.debate.reduce((acc, item) => {
        const roundIndex = item.round - 1;
        if (!acc[roundIndex]) {
            acc[roundIndex] = { round: item.round, pro: null, con: null };
        }
        if (item.side === 'pro') {
            acc[roundIndex].pro = item.argument;
        } else {
            acc[roundIndex].con = item.argument;
        }
        return acc;
    }, []) : [];

    return (
        <div className="debate-container">
            <Navbar />
            <div className="debate-mode">
            <div className="debate-header">
                <h2>🎭 AI Debate Arena</h2>
                <p>Watch two AI personas debate any topic from opposing perspectives</p>
            </div>

            {!debate && (
                <div className="debate-setup">
                    <div className="debate-input-group">
                        <label>Debate Topic</label>
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g., AI will improve humanity"
                            disabled={loading}
                        />
                    </div>

                    <div className="debate-input-group">
                        <label>Number of Rounds (1-10)</label>
                        <select
                            value={rounds}
                            onChange={(e) => setRounds(Number(e.target.value))}
                            disabled={loading}
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                <option key={n} value={n}>{n} rounds</option>
                            ))}
                        </select>
                    </div>

                    {error && (
                        <div style={{ color: '#f44336', marginBottom: '15px', fontSize: '14px' }}>
                            {error}
                        </div>
                    )}

                    <div className="debate-controls">
                        <button
                            className="debate-btn debate-btn-primary"
                            onClick={startDebate}
                            disabled={loading}
                        >
                            {loading ? 'Starting Debate...' : '🎭 Start Debate'}
                        </button>
                    </div>
                </div>
            )}

            {loading && (
                <div className="debate-loading">
                    <div className="debate-loading-spinner">
                        <ScaleLoader color="#fff" />
                    </div>
                    <div className="debate-loading-text">
                        AI personas are preparing their arguments...
                    </div>
                </div>
            )}

            {debate && !loading && (
                <div className="debate-arena">
                    <div className="debate-topic-display">
                        <h3>Topic: {debate.topic}</h3>
                    </div>

                    {groupedDebate.map((exchange, idx) => (
                        <div key={idx} className="debate-exchange">
                            <div className="debate-round-label">
                                Round {exchange.round}
                            </div>
                            <div className="debate-arguments">
                                <div className="debate-argument pro">
                                    <div className="debate-argument-header">
                                        <span className="debate-argument-icon">✅</span>
                                        <span className="debate-side-label">For</span>
                                    </div>
                                    <div className="debate-argument-text">
                                        {exchange.pro}
                                    </div>
                                </div>

                                <div className="debate-argument con">
                                    <div className="debate-argument-header">
                                        <span className="debate-argument-icon">❌</span>
                                        <span className="debate-side-label">Against</span>
                                    </div>
                                    <div className="debate-argument-text">
                                        {exchange.con}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="debate-summary">
                        <h3>Debate Complete!</h3>
                        <p>
                            {debate.totalArguments} arguments exchanged across {debate.rounds} rounds
                        </p>
                        <button className="debate-summary-btn" onClick={resetDebate}>
                            Start New Debate
                        </button>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
}

export default DebateMode;

import './ConfirmDialog.css';

function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }) {
    if (!isOpen) return null;

    return (
        <div className="confirm-overlay" onClick={onCancel}>
            <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
                <div className="confirm-header">
                    <i className="fa-solid fa-triangle-exclamation"></i>
                    <h3>{title}</h3>
                </div>
                <p className="confirm-message">{message}</p>
                <div className="confirm-actions">
                    <button className="confirm-btn cancel-btn" onClick={onCancel}>
                        Cancel
                    </button>
                    <button className="confirm-btn delete-btn" onClick={onConfirm}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDialog;

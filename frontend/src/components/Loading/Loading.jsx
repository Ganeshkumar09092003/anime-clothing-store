import './Loading.css';

const Loading = ({ text = 'Loading...' }) => {
    return (
        <div className="loading-container">
            <div className="loading-spinner">
                <div className="spinner"></div>
            </div>
            <p className="loading-text">{text}</p>
        </div>
    );
};

export default Loading;

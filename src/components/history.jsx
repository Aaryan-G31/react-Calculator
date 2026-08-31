export default function History({
  history,
  clearHistory,
  clickHistory,
  isOpen,
}) {
  return (
    <div className={`history-panel ${isOpen ? "open" : ""}`}>
      <div className="history-header">
        <h2>History</h2>

        <button onClick={clearHistory} className="clear-history">
          Clear
        </button>
      </div>

      <div className="history-list">
        {[...history].reverse().map((item, index) => (
          <div
            key={index}
            className="history-item"
            onClick={() => clickHistory(item)}
          >
            <span>{item.expression}</span>
            <strong>{item.result}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
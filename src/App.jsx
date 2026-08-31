import "./App.css";
import NumButtons from "./components/numButtons.jsx";
import CalculatorDisplay from "./components/calculatorDisplay.jsx";
import useCalculator from "./hooks/useCalculator.js";
import History from "./components/history.jsx";
import { useState } from "react";

function App() {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const {
    num,
    history,
    handleNumChange,
    handleSelectedOperation,
    handleResult,
    handleClear,
    handleBackspace,
    handleClearHistory,
    handleHistoryClick,
  } = useCalculator();

  return (
    <div className="calculator-container">
      <div>
        <h1 className="calculator-title">Let's Calculate</h1>
        <button
          className={`history-toggle ${isHistoryOpen ? "history-toggle-open" : ""}`}
          onClick={() => setIsHistoryOpen((prev) => !prev)}
        >
          {isHistoryOpen ? "x" : "☰"}
        </button>

        <div className="calculator-layout">
          <div className="calculator">
            <CalculatorDisplay num={num} />

            <NumButtons
              numAns={handleNumChange}
              singAns={handleSelectedOperation}
              result={handleResult}
              clear={handleClear}
              backspace={handleBackspace}
            />
          </div>

          <History
            history={history}
            clearHistory={handleClearHistory}
            clickHistory={handleHistoryClick}
            isOpen={isHistoryOpen}
          />
        </div>
      </div>
    </div>
  );
}

export default App;

import { useState, useEffect } from "react";

export default function useCalculator() {
  const [num, setNum] = useState({
    expression: [],
    finaleAns: undefined,
  });

  const [history, setHistory] = useState(() => {
    const storedHistory = localStorage.getItem("calculatorHistory");
    return storedHistory ? JSON.parse(storedHistory) : [];
  });

  const operators = ["+", "-", "*", "/", "%"];

  // -------------------------
  // Number input
  // -------------------------
  const handleNumChange = (value) => {
    setNum((prev) => {
      // If a result exists, start a new calculation
      if (prev.finaleAns !== undefined) {
        return {
          expression: [`${value}`],
          finaleAns: undefined,
        };
      }

      const expression = [...prev.expression];

      // No expression yet
      if (expression.length === 0) {
        return {
          ...prev,
          expression: [`${value}`],
        };
      }

      const last = expression[expression.length - 1];

      // Don't allow a number directly after ")"
      if (last === ")") {
        alert("Please enter an operator first");
        return prev;
      }

      // If the last item is an operator
      if (operators.includes(last)) {
        // Negative number at the beginning
        if (last === "-" && expression.length === 1) {
          return {
            ...prev,
            expression: [`-${value}`],
          };
        }

        // Negative number after another operator
        if (
          last === "-" &&
          expression.length >= 2 &&
          (operators.includes(expression[expression.length - 2]) ||
            expression[expression.length - 2] === "(")
        ) {
          return {
            ...prev,
            expression: [...expression.slice(0, -1), `-${value}`],
          };
        }

        return {
          ...prev,
          expression: [...expression, `${value}`],
        };
      }

      // Number immediately after "("
      if (last === "(") {
        return {
          ...prev,
          expression: [...expression, `${value}`],
        };
      }

      // Last item is a number
      if (value === "." && last.includes(".")) {
        alert("Only one decimal point is allowed");
        return prev;
      }

      const newNumber = `${last}${value}`;

      return {
        ...prev,
        expression: [...expression.slice(0, -1), newNumber],
      };
    });
  };

  // -------------------------
  // Operators + parentheses
  // -------------------------
  const handleSelectedOperation = (value) => {
    setNum((prev) => {
      // If result exists, continue from result
      if (prev.finaleAns !== undefined) {
        if (value === ")") {
          alert("Invalid closing parenthesis");
          return prev;
        }

        return {
          expression: [`${prev.finaleAns}`, value],
          finaleAns: undefined,
        };
      }

      const expression = [...prev.expression];

      // -------------------------
      // Opening parenthesis "("
      // -------------------------
      if (value === "(") {
        // Can start with "("
        if (expression.length === 0) {
          return {
            ...prev,
            expression: ["("],
          };
        }

        const last = expression[expression.length - 1];

        // "(" is allowed after an operator
        if (operators.includes(last)) {
          return {
            ...prev,
            expression: [...expression, "("],
          };
        }

        // "(" after another "("
        if (last === "(") {
          return {
            ...prev,
            expression: [...expression, "("],
          };
        }

        alert("Please enter an operator before '('");
        return prev;
      }

      // -------------------------
      // Closing parenthesis ")"
      // -------------------------
      if (value === ")") {
        if (expression.length === 0) {
          alert("Please enter a number first");
          return prev;
        }

        const last = expression[expression.length - 1];

        // Cannot close after an operator
        if (operators.includes(last)) {
          alert("Please enter a number before ')'");
          return prev;
        }

        // Cannot close immediately after "("
        if (last === "(") {
          alert("Empty parentheses are not allowed");
          return prev;
        }

        // Check matching parentheses
        let openCount = 0;
        let closeCount = 0;

        expression.forEach((item) => {
          if (item === "(") openCount++;
          if (item === ")") closeCount++;
        });

        if (openCount <= closeCount) {
          alert("No matching opening parenthesis");
          return prev;
        }

        return {
          ...prev,
          expression: [...expression, ")"],
        };
      }

      // -------------------------
      // Normal operators
      // -------------------------
      if (expression.length === 0) {
        // Allow negative number
        if (value === "-") {
          return {
            ...prev,
            expression: ["-"],
          };
        }

        alert("Please enter a number first");
        return prev;
      }

      const last = expression[expression.length - 1];

      // Operator after "("
      if (last === "(") {
        // Allow negative number
        if (value === "-") {
          return {
            ...prev,
            expression: [...expression, "-"],
          };
        }

        alert("Please enter a number first");
        return prev;
      }

      // Operator after ")"
      if (last === ")") {
        return {
          ...prev,
          expression: [...expression, value],
        };
      }

      // Operator after another operator
      if (operators.includes(last)) {
        // Allow negative number
        if (value === "-") {
          return {
            ...prev,
            expression: [...expression, "-"],
          };
        }

        // Replace previous operator
        return {
          ...prev,
          expression: [...expression.slice(0, -1), value],
        };
      }

      return {
        ...prev,
        expression: [...expression, value],
      };
    });
  };

  // -------------------------
  // Evaluate expression
  // -------------------------
  const evaluateExpression = (expression) => {
    const tokens = [...expression];

    // Convert unary "-" before parentheses into multiplication by -1
    for (let i = 0; i < tokens.length - 1; i++) {
      const isUnaryMinus =
        tokens[i] === "-" &&
        (i === 0 || tokens[i - 1] === "(" || operators.includes(tokens[i - 1]));

      if (isUnaryMinus && tokens[i + 1] === "(") {
        tokens.splice(i, 1, "-1", "*");
        i++;
      }
    }

    const applyOperation = (left, operator, right) => {
      const num1 = Number(left);
      const num2 = Number(right);

      if (!Number.isFinite(num1) || !Number.isFinite(num2)) {
        return undefined;
      }

      if (operator === "+") {
        return num1 + num2;
      }

      if (operator === "-") {
        return num1 - num2;
      }

      if (operator === "*") {
        return num1 * num2;
      }

      if (operator === "/") {
        if (num2 === 0) {
          return undefined;
        }

        return num1 / num2;
      }

      if (operator === "%") {
        if (num2 === 0) {
          return undefined;
        }

        return num1 % num2;
      }

      return undefined;
    };

    const evaluateTokens = (startIndex = 0) => {
      const values = [];
      let i = startIndex;

      while (i < tokens.length) {
        const token = tokens[i];

        // Opening parenthesis
        if (token === "(") {
          const result = evaluateTokens(i + 1);

          if (result === undefined) {
            return undefined;
          }

          values.push(result.value);
          i = result.nextIndex;
          continue;
        }

        // Closing parenthesis
        if (token === ")") {
          return {
            value: calculateValues(values),
            nextIndex: i + 1,
          };
        }

        values.push(token);
        i++;
      }

      return {
        value: calculateValues(values),
        nextIndex: i,
      };
    };

    const calculateValues = (values) => {
      if (values.length === 0) {
        return undefined;
      }

      // -------------------------
      // Multiplication, division, modulo
      // -------------------------
      const numbers = [...values];

      for (let i = 1; i < numbers.length - 1; i += 2) {
        const operator = numbers[i];

        if (!["*", "/", "%"].includes(operator)) {
          continue;
        }

        const result = applyOperation(numbers[i - 1], operator, numbers[i + 1]);

        if (result === undefined) {
          return undefined;
        }

        numbers.splice(i - 1, 3, result);
        i -= 2;
      }

      // -------------------------
      // Addition and subtraction
      // -------------------------
      let result = Number(numbers[0]);

      if (!Number.isFinite(result)) {
        return undefined;
      }

      for (let i = 1; i < numbers.length; i += 2) {
        const operator = numbers[i];
        const number = Number(numbers[i + 1]);

        if (!Number.isFinite(number)) {
          return undefined;
        }

        if (operator === "+") {
          result += number;
        } else if (operator === "-") {
          result -= number;
        } else {
          return undefined;
        }
      }

      return result;
    };

    const result = evaluateTokens(0);

    if (!result || result.nextIndex !== tokens.length + 0) {
      return undefined;
    }

    return result.value;
  };

  // -------------------------
  // Calculate result
  // -------------------------
  const calculateResult = (current) => {
    const expression = current.expression;

    if (expression.length === 0) {
      alert("Please enter an expression first.");
      return;
    }

    // Cannot end with an operator
    const last = expression[expression.length - 1];

    if (operators.includes(last) || last === "(" || last === "-") {
      alert("Please complete the expression before calculating.");
      return;
    }

    // Check parentheses
    let openCount = 0;
    let closeCount = 0;

    for (const item of expression) {
      if (item === "(") openCount++;
      if (item === ")") closeCount++;

      if (closeCount > openCount) {
        alert("Invalid parentheses");
        return;
      }
    }

    if (openCount !== closeCount) {
      alert("Please close all parentheses before calculating.");
      return;
    }

    // Validate expression structure
    let expectingNumber = true;

    for (let i = 0; i < expression.length; i++) {
      const item = expression[i];

      if (item === "(") {
        if (!expectingNumber) {
          alert("Invalid use of parentheses");
          return;
        }

        expectingNumber = true;
        continue;
      }

      if (item === ")") {
        if (expectingNumber) {
          alert("Please enter a number before ')'");
          return;
        }

        expectingNumber = false;
        continue;
      }

      if (operators.includes(item)) {
        // Negative numbers are stored as "-2", "-5", etc.
        if (item === "-" && expectingNumber) {
          continue;
        }

        if (expectingNumber) {
          alert("Invalid operation");
          return;
        }

        expectingNumber = true;
        continue;
      }

      // Number
      if (!Number.isFinite(Number(item))) {
        alert("Invalid number");
        return;
      }

      expectingNumber = false;
    }

    if (expectingNumber) {
      alert("Please complete the expression.");
      return;
    }

    const result = evaluateExpression(expression);

    if (result === undefined || !Number.isFinite(result)) {
      alert("Invalid operation");
      return;
    }

    return result;
  };

  // -------------------------
  // Equals
  // -------------------------
  const handleResult = () => {
    const result = calculateResult(num);

    if (result === undefined) {
      return;
    }

    setHistory((oldHistory) => [
      ...oldHistory,
      {
        expression: num.expression.join(" "),
        result,
      },
    ]);

    setNum((prev) => ({
      ...prev,
      finaleAns: result,
    }));
  };

  // -------------------------
  // AC
  // -------------------------
  const handleClear = () => {
    setNum({
      expression: [],
      finaleAns: undefined,
    });
  };

  // -------------------------
  // Backspace
  // -------------------------
  const handleBackspace = () => {
    setNum((prev) => {
      if (prev.finaleAns !== undefined) {
        return {
          ...prev,
          finaleAns: undefined,
        };
      }

      if (prev.expression.length === 0) {
        return prev;
      }

      const expression = [...prev.expression];
      const last = expression[expression.length - 1];

      // Parentheses and operators are removed as complete items
      if (last === "(" || last === ")" || operators.includes(last)) {
        expression.pop();

        return {
          ...prev,
          expression,
        };
      }

      // Number
      if (last.length > 1) {
        expression[expression.length - 1] = last.slice(0, -1);
      } else {
        expression.pop();
      }

      return {
        ...prev,
        expression,
      };
    });
  };

  // -------------------------
  // Clear history
  // -------------------------
  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem("calculatorHistory");
  };

  // -------------------------
  // History click
  // -------------------------
  const handleHistoryClick = (item) => {
    const expression = item.expression.split(" ");

    setNum({
      expression,
      finaleAns: undefined,
    });
  };

  // -------------------------
  // Keyboard
  // -------------------------
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (/^[0-9.]$/.test(event.key)) {
        handleNumChange(event.key);
      }

      if (["+", "-", "*", "/", "%", "(", ")"].includes(event.key)) {
        handleSelectedOperation(event.key);
      }

      if (event.key === "Enter" || event.key === "=") {
        event.preventDefault();
        event.stopPropagation();
        handleResult();
      }

      if (event.key === "Backspace") {
        event.preventDefault();
        handleBackspace();
      }

      if (event.key === "Escape") {
        handleClear();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [num]);

  // -------------------------
  // Save history
  // -------------------------
  useEffect(() => {
    localStorage.setItem("calculatorHistory", JSON.stringify(history));
  }, [history]);

  return {
    num,
    history,
    handleNumChange,
    handleSelectedOperation,
    handleResult,
    handleClear,
    handleBackspace,
    handleClearHistory,
    handleHistoryClick,
  };
}

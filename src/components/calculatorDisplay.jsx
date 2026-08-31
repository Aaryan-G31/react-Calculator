export default function CalculatorDisplay({ num }) {
  const expression = num.expression.join("");

  return (
    <div className="display">
      <div className="expression">
        {expression || "0"}
      </div>

      <div className="result">
        {num.finaleAns !== undefined ? num.finaleAns : expression || "0"}
      </div>
    </div>
  );
}
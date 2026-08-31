export default function NumButtons({
  numAns,
  singAns,
  result,
  clear,
  backspace,
}) {
  return (
    <div className="buttons">
      {/* Top row */}
      <button className="clear" onClick={clear}>
        AC
      </button>

      <button className="backspace" onClick={backspace}>
        C
      </button>

      <button className="operator" onClick={() => singAns("%")}>
        %
      </button>

      <button className="operator" onClick={() => singAns("/")}>
        ÷
      </button>

      {/* 7 8 9 × */}
      <button onClick={() => numAns(7)}>7</button>
      <button onClick={() => numAns(8)}>8</button>
      <button onClick={() => numAns(9)}>9</button>

      <button className="operator" onClick={() => singAns("*")}>
        ×
      </button>

      {/* 4 5 6 − */}
      <button onClick={() => numAns(4)}>4</button>
      <button onClick={() => numAns(5)}>5</button>
      <button onClick={() => numAns(6)}>6</button>

      <button className="operator" onClick={() => singAns("-")}>
        −
      </button>

      {/* 1 2 3 + */}
      <button onClick={() => numAns(1)}>1</button>
      <button onClick={() => numAns(2)}>2</button>
      <button onClick={() => numAns(3)}>3</button>

      <button className="operator" onClick={() => singAns("+")}>
        +
      </button>

      {/* Bottom row */}
      <button className="operator" onClick={() => singAns("(")}>
        (
      </button>

      <button onClick={() => numAns(0)}>0</button>

      <button className="operator" onClick={() => singAns(")")}>
        )
      </button>

      <button className="equals" onClick={result}>
        =
      </button>
    </div>
  );
}
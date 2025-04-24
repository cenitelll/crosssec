import React, { useEffect, useRef } from "react";
import { MathJax, MathJaxContext } from "better-react-mathjax";

function Equation2and6({ title }) {
  const [mValue, setMValue] = useState(null);
  const [error, setError] = useState(null);

  // Зчитуємо m
  const readM = () => {
    try {
      const savedM = localStorage.getItem("m");
      if (savedM === null) {
        setError("m не знайдено в localStorage.");
        setMValue(null);
      } else {
        setError(null);
        setMValue(Number(savedM));
      }
    } catch (e) {
      setError("Помилка при зчитуванні m з localStorage.");
      setMValue(null);
    }
  };

  const updateMath = () => {
    if (window.MathJax) {
      window.MathJax.typesetPromise && window.MathJax.typesetPromise();
    }
  };

  useEffect(() => {
    // 1. При монтуванні
    readM();

    // 2. Слухаємо подію "updateM" (з Table1)
    const handleUpdate = () => {
      readM();
      setTimeout(updateMath, 100);
    };
    window.addEventListener("updateM", handleUpdate);

    return () => {
      window.removeEventListener("updateM", handleUpdate);
    };
  }, []);

  useEffect(() => {
    updateMath();
  }, []);

  return (
    <MathJaxContext>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="bg-gray-100 p-3 rounded-lg shadow-md mb-4">
          <h4 className="text-md font-semibold mb-2">Формула (2):</h4>
          <MathJax>
            {"\\[w_i = \\frac{v_i}{\\sum\\limits_{j=1}^n v_j}\\]"}
          </MathJax>
        </div>
        <div className="bg-gray-100 p-3 rounded-lg shadow-md">
          <h4 className="text-md font-semibold mb-2">Формула (6):</h4>
          <MathJax>
            {"\\[m(P) = \\sum\\limits_{i=1}^n w_i \\cdot \\mu(O_i)\\]"}
          </MathJax>
        </div>
        <p>
          Де <MathJax inline>{"\\( w_i \\)"}</MathJax> — нормована вага для{" "}
          <MathJax inline>{"\\( i \\)"}</MathJax>-го критерію,{" "}
          <MathJax inline>{"\\( v_i \\)"}</MathJax> — початкова вага{" "}
          <MathJax inline>{"\\( i \\)"}</MathJax>-го критерію, а{" "}
          <MathJax inline>{"\\( \\sum_{j=1}^n v_j \\)"}</MathJax> — сума всіх
          ваг у таблиці.
        </p>

        <h4 className="text-md font-semibold mt-6 mb-2">
          Формула для <MathJax inline>{"\\( m(P) \\)"}</MathJax> з урахуванням
          μ(O):
        </h4>
        <div
          className="bg-gray-100 p-3 rounded-lg shadow-md mt-4 mb-4"
          style={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            overflowWrap: "break-word",
            maxWidth: "100%",
          }}
        >
          <MathJax>
            {`\\[
              m(P) = \\sum_{i=1}^{n} w_i \\cdot \\mu(O_i) = ${
                mValue !== null ? mValue : "—"
              }
            \\]`}
          </MathJax>
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </MathJaxContext>
  );
}

export default Equation2and6;

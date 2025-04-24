import React, { useState, useEffect } from "react";
import { MathJax, MathJaxContext } from "better-react-mathjax";

function Equation11and12() {
  const [mValue, setMValue] = useState(null);
  const [deltaValues, setDeltaValues] = useState([]);
  const [weights, setWeights] = useState([1, 1, 1, 1]); // p1, p2, p3, p4
  const [error, setError] = useState(null);
  const [yTpResult, setYTpResult] = useState(0);
  const [financingLevel, setFinancingLevel] = useState("");

  // Функція для визначення рівня фінансування
  const determineFinancingLevel = (yTp) => {
    if (yTp > 0.89 && yTp <= 1) {
      return "високий рівень щодо можливості фінансування проекту транскордонного співробітництва";
    } else if (yTp > 0.77 && yTp <= 0.89) {
      return "рівень щодо можливості фінансування проекту транскордонного співробітництва – вище середнього";
    } else if (yTp > 0.65 && yTp <= 0.77) {
      return "середній рівень щодо можливості фінансування проекту транскордонного співробітництва";
    } else if (yTp > 0.54 && yTp <= 0.65) {
      return "низький рівень щодо можливості фінансування проекту транскордонного співробітництва";
    } else {
      return "дуже низький рівень щодо можливості фінансування проекту транскордонного співробітництва";
    }
  };

  // Функція для розрахунку дельта
  const calculateDelta = (m, phi) => {
    if (m === null) return 0;
    if (m < 0) return 0;
    if (m > 1) return 1;
    return Math.pow(m, phi);
  };

  // Функція для розрахунку Y_TP
  const calculateYTp = (weights, deltas) => {
    if (deltas.length !== 4 || weights.length !== 4) return 0;

    const weightSum = weights.reduce((sum, weight) => sum + weight, 0);
    const numerator = weights.reduce((sum, weight, index) => {
      return sum + weight * deltas[index];
    }, 0);

    const result = numerator / weightSum;
    setFinancingLevel(determineFinancingLevel(result));
    return result;
  };

  const handleWeightChange = (index, value) => {
    const newValue = Math.min(Math.max(1, value), 10);
    const newWeights = [...weights];
    newWeights[index] = newValue;
    setWeights(newWeights);
    localStorage.setItem("weights", JSON.stringify(newWeights));
  };

  useEffect(() => {
    // Зчитуємо збережені ваги
    const savedWeights = localStorage.getItem("weights");
    if (savedWeights) {
      setWeights(JSON.parse(savedWeights));
    }
  }, []); // Run only once on mount

  useEffect(() => {
    // Зчитуємо m та phi
    const readValues = () => {
      try {
        const savedM = localStorage.getItem("m");
        const groupPhiValues = JSON.parse(
          localStorage.getItem("groupPhi") || "[]"
        );

        if (savedM === null) {
          setError("m не знайдено в localStorage.");
          setMValue(null);
          return;
        }

        const m = Number(savedM);
        setError(null);
        setMValue(m);

        // Розраховуємо значення дельта для кожної групи
        const deltas = groupPhiValues.map((phi) => calculateDelta(m, phi));
        setDeltaValues(deltas);
        localStorage.setItem("deltaValues", JSON.stringify(deltas));

        // Розраховуємо Y_TP
        const result = calculateYTp(weights, deltas);
        setYTpResult(result);
        localStorage.setItem("yTpResult", result.toString());
      } catch (e) {
        setError("Помилка при зчитуванні даних з localStorage.");
        setMValue(null);
      }
    };

    // При монтуванні та при зміні ваг
    readValues();

    // Слухаємо подію "updateM"
    const handleUpdate = () => {
      readValues();
    };
    window.addEventListener("updateM", handleUpdate);
    window.addEventListener("updateMF", handleUpdate);

    return () => {
      window.removeEventListener("updateM", handleUpdate);
      window.removeEventListener("updateMF", handleUpdate);
    };
  }, [weights]); // Only depend on weights changes

  // Effect for updating Y_TP when deltaValues change
  useEffect(() => {
    if (deltaValues.length === 4) {
      const result = calculateYTp(weights, deltaValues);
      setYTpResult(result);
      localStorage.setItem("yTpResult", result.toString());
    }
  }, [deltaValues, weights]);

  return (
    <MathJaxContext>
      <div id="printEquation11and12" style={{ padding: "1rem" }}>
        <h4 className="text-md font-semibold mb-4">
          Формула для обчислення Δ:
        </h4>
        <div className="bg-gray-100 p-3 rounded-lg shadow-md mb-4">
          <MathJax>
            {`\\[
              \\Delta_g = \\begin{cases}
                0, & m(P) < 0; \\\\
                (m(P))^{\\phi_g}, & 0 \\leq m(P) \\leq 1; \\\\
                1, & m(P) > 1.
              \\end{cases} \\quad g = \\overline{1,4}
            \\]`}
          </MathJax>
        </div>

        <div className="mt-6">
          <h4 className="text-md font-semibold mb-2">Розраховані значення:</h4>
          <div className="bg-gray-100 p-3 rounded-lg shadow-md flex flex-col items-center">
            {deltaValues.map((delta, index) => (
              <div key={index} className="mb-2 text-center">
                <MathJax inline>{`\\( \\Delta_{${index + 1}} = ${delta.toFixed(
                  4
                )} \\)`}</MathJax>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-md font-semibold mb-2">
            Вагові коефіцієнти факторів впливу [1; 10]:
          </h4>
          <div className="bg-gray-100 p-3 rounded-lg shadow-md grid grid-cols-2 gap-4">
            {weights.map((weight, index) => (
              <div key={index} className="flex items-center">
                <label className="mr-2">p{index + 1}:</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={weight}
                  onChange={(e) =>
                    handleWeightChange(index, Number(e.target.value))
                  }
                  className="w-20 px-2 py-1 border rounded"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-md font-semibold mb-2">Формула розрахунку Y:</h4>
          <div className="bg-gray-100 p-3 rounded-lg shadow-md text-center">
            <MathJax>
              {`\\[
                Y_{TP}(P) = \\frac{1}{p_1 + p_2 + p_3 + p_4}(p_1 \\cdot \\Delta_1 + p_2 \\cdot \\Delta_2 + p_3 \\cdot \\Delta_3 + p_4 \\cdot \\Delta_4)
              \\]`}
            </MathJax>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-md font-semibold mb-2">Розрахунок:</h4>
          <div className="bg-gray-100 p-3 rounded-lg shadow-md text-center">
            <MathJax>
              {`\\[
                Y_{TP}(P) = \\frac{1}{${weights.join(" + ")}}(${weights
                .map(
                  (p, i) => `${p} \\cdot ${deltaValues[i]?.toFixed(4) || "0"}`
                )
                .join(" + ")})
              \\]`}
            </MathJax>
            <div className="mt-4 text-lg font-semibold">
              <MathJax inline>{`\\( = ${yTpResult.toFixed(4)} \\)`}</MathJax>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-md font-semibold mb-2">
            Оцінка рівня можливості фінансування:
          </h4>
          <div className="bg-gray-100 p-3 rounded-lg shadow-md">
            <div className="text-center font-medium text-lg mb-4">
              {financingLevel}
            </div>
            <div className="mt-4">
              <div className="mb-3 font-semibold">Діапазони оцінки:</div>
              <div className="space-y-2 pl-4">
                <div className="flex items-center gap-2 font-medium">
                  <span className="w-24">(0,89; 1]</span>
                  <span>–</span>
                  <span>високий рівень</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <span className="w-24">(0,77; 0,89]</span>
                  <span>–</span>
                  <span>рівень вище середнього</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <span className="w-24">(0,65; 0,77]</span>
                  <span>–</span>
                  <span>середній рівень</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <span className="w-24">(0,54; 0,65]</span>
                  <span>–</span>
                  <span>низький рівень</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <span className="w-24">[0; 0,54]</span>
                  <span>–</span>
                  <span>дуже низький рівень</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </MathJaxContext>
  );
}

export default Equation11and12;

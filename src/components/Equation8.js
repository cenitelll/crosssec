import React, { useState, useEffect, useRef } from "react";
import { MathJax, MathJaxContext } from "better-react-mathjax";

const config = {
  loader: { load: ["[tex]/html"] },
  tex: {
    packages: { "[+]": ["html"] },
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"],
    ],
    displayMath: [
      ["$$", "$$"],
      ["\\[", "\\]"],
    ],
  },
};

const initialRanges = {
  L: { min: 0, max: 0.2 },
  BA: { min: 0.2, max: 0.4 },
  A: { min: 0.4, max: 0.6 },
  AA: { min: 0.6, max: 0.8 },
  H: { min: 0.8, max: 1.0 },
};

function Equation8() {
  const [linguisticRanges, setLinguisticRanges] = useState(() => {
    const saved = localStorage.getItem("linguisticRanges");
    return saved
      ? JSON.parse(saved)
      : {
          L: { min: 0, max: 0.2 },
          BA: { min: 0.2, max: 0.4 },
          A: { min: 0.4, max: 0.6 },
          AA: { min: 0.6, max: 0.8 },
          H: { min: 0.8, max: 1.0 },
        };
  });

  const [groupPhi, setGroupPhi] = useState(() => {
    const saved = localStorage.getItem("groupPhi");
    return saved ? JSON.parse(saved) : [0, 0, 0, 0];
  });

  const updateMath = () => {
    if (window.MathJax) {
      window.MathJax.typesetPromise && window.MathJax.typesetPromise();
    }
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem("groupPhi");
      if (saved) {
        setGroupPhi(JSON.parse(saved));
        setTimeout(updateMath, 100);
      }
    };

    window.addEventListener("updateMF", handleStorageChange);
    return () => window.removeEventListener("updateMF", handleStorageChange);
  }, []);

  useEffect(() => {
    updateMath();
  }, [groupPhi, linguisticRanges]);

  const handleRangeChange = (level, field, value) => {
    const newValue = parseFloat(value);
    if (!isNaN(newValue)) {
      setLinguisticRanges((prev) => {
        const newRanges = {
          ...prev,
          [level]: { ...prev[level], [field]: newValue },
        };
        localStorage.setItem("linguisticRanges", JSON.stringify(newRanges));
        setTimeout(updateMath, 100);
        return newRanges;
      });
    }
  };

  const labels = {
    L: "L - Низький рівень",
    BA: "BA - Рівень нижче середнього",
    A: "A - Середній рівень",
    AA: "AA - Рівень вище середнього",
    H: "H - Високий рівень",
  };

  return (
    <MathJaxContext config={config}>
      <div className="p-4">
        <h2 className="text-lg font-bold mb-3">Лінгвістичні змінні</h2>
        <div className="bg-gray-100 p-3 rounded-lg shadow-md mt-4 mb-4">
          <div className="space-y-2">
            {Object.entries(linguisticRanges).map(([level, range]) => (
              <div key={level} className="grid grid-cols-[200px_1fr] gap-2 p-2">
                <div>
                  <span className="text-sm">{labels[level]}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm">d(R) ∈ [</span>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={range.min}
                    onChange={(e) =>
                      handleRangeChange(level, "min", e.target.value)
                    }
                    className="w-16 px-1 py-0.5 text-sm border rounded"
                  />
                  <span className="text-sm">;</span>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={range.max}
                    onChange={(e) =>
                      handleRangeChange(level, "max", e.target.value)
                    }
                    className="w-16 px-1 py-0.5 text-sm border rounded"
                  />
                  <span className="text-sm">]</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 border-t pt-4">
          <div className="bg-gray-100 p-3 rounded-lg shadow-md mt-4 mb-4">
            <MathJax>
              {
                "\\[\\vartheta_e^g = a_t + \\frac{1}{100} \\mu(F_e^g) \\cdot (a_{t+1} - a_t)\\]"
              }
            </MathJax>
          </div>

          <p className="text-sm text-gray-700">
            Де <MathJax inline>{"\\(a_t\\)"}</MathJax> – значення проміжку для
            лінгвістичної змінної <MathJax inline>{"\\(L_e^g\\)"}</MathJax>,{" "}
            <MathJax inline>{"\\(t=\\overline{1,9}\\)"}</MathJax>.{" "}
            <MathJax inline>{"\\(\\vartheta_e^g\\)"}</MathJax> – нормоване
            числове значення критерію для фактору впливу на прогнозований рівень
            керованості процесами при реалізації проекту, що кориговане на
            впевненості міркувань експерта{" "}
            <MathJax inline>{"\\(g=\\overline{1,4}\\)"}</MathJax>,{" "}
            <MathJax inline>{"\\(e=\\overline{1,m_g}\\)"}</MathJax>.
          </p>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <h3 className="text-lg font-bold mb-2 text-center">
            Групи факторів:
          </h3>
          <div className="space-y-2 flex flex-col items-center">
            <MathJax>{`\\(\\varphi_1 = ${groupPhi[0].toFixed(4)}\\)`}</MathJax>
            <MathJax>{`\\(\\varphi_2 = ${groupPhi[1].toFixed(4)}\\)`}</MathJax>
            <MathJax>{`\\(\\varphi_3 = ${groupPhi[2].toFixed(4)}\\)`}</MathJax>
            <MathJax>{`\\(\\varphi_4 = ${groupPhi[3].toFixed(4)}\\)`}</MathJax>
          </div>
        </div>
      </div>
    </MathJaxContext>
  );
}

export default Equation8;

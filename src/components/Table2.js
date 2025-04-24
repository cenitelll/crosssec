import React, { useState, useEffect, useRef } from "react";

const initialTableData = {
  title: "Вхідні та нормовані оцінки згідно інформаційної моделі – Kₚᵣ",
  data: [
    {
      group: "f₁",
      criteria: ["F₁¹", "F₂¹", "F₃¹", "F₄¹", "F₅¹", "F₆¹", "F₇¹"],
      values: [
        {
          name: "Наявність у партнерів реалістичного та збалансованого бюджету, які відповідають їхній реальній участі.",
          α: "9",
          L: "AA",
          μF: "80",
        },
        {
          name: "Фінансовий план є реалістичним та ефективним.",
          α: "8",
          L: "H",
          μF: "90",
        },
        {
          name: "Цілі проекту відповідають аналізу потреб та охоплені головною ціллю програми чи виклику.",
          α: "10",
          L: "H",
          μF: "70",
        },
        {
          name: "Всі заходи в проекті спрямовані на досягнення його завдань та головної мети.",
          α: "9",
          L: "BA",
          μF: "90",
        },
        {
          name: "Проект має реальну необхідність, що визначається чіткими потребами громадськості.",
          α: "10",
          L: "A",
          μF: "80",
        },
        {
          name: "Рівень впливу на реалізацію проекту законодавства та політичної ситуації.",
          α: "9",
          L: "AA",
          μF: "70",
        },
        {
          name: "Рівень впливу на реалізацію проекту соціокультурних факторів, таких як культурні особливості, мовні бар'єри та інші соціальні чинники.",
          α: "8",
          L: "AA",
          μF: "90",
        },
      ],
    },
    {
      group: "f₂",
      criteria: ["F₁²", "F₂²", "F₃²", "F₄²", "F₅²", "F₆²"],
      values: [
        {
          name: "Проект містить комплексний та детальний аналіз ризиків, а також план їх усунення.",
          α: "10",
          L: "A",
          μF: "70",
        },
        {
          name: "Ризики зміни в політичному середовищі країн-партнерів, конфлікти та нестабільність, можливість зміни уряду, що може вплинути на реалізацію проекту.",
          α: "9",
          L: "H",
          μF: "80",
        },
        {
          name: "Ризики щодо можливості змін у світовій економіці, податковій або митній політиці та будуть мати значний вплив на реалізацію проекту.",
          α: "10",
          L: "H",
          μF: "90",
        },
        {
          name: "Ризики виникнення суспільного невдоволення під час реалізації проекту.",
          α: "8",
          L: "BA",
          μF: "60",
        },
        {
          name: "Ризики негативного пливу проекту на навколишнє середовище та/або забруднення довкілля.",
          α: "9",
          L: "AA",
          μF: "80",
        },
        {
          name: "Ризики виникнення конфліктів щодо прав та обов'язків між партнерами проекту.",
          α: "9",
          L: "H",
          μF: "90",
        },
      ],
    },
    {
      group: "f₃",
      criteria: ["F₁³", "F₂³", "F₃³", "F₄³", "F₅³"],
      values: [
        {
          name: "Недостатня кваліфікація та досвід у керівників проекту.",
          α: "9",
          L: "H",
          μF: "90",
        },
        {
          name: "Можливість виникнення неефективного управління проектом та недостатній контроль над виконанням робіт.",
          α: "9",
          L: "H",
          μF: "90",
        },
        {
          name: "Недостатня кваліфікація виконавців та суб'єктів, які будуть приймати безпосередню участь у виконанні проекту.",
          α: "9",
          L: "H",
          μF: "70",
        },
        {
          name: "Можливість виникнення конфліктів між учасниками проекту.",
          α: "10",
          L: "AA",
          μF: "90",
        },
        {
          name: "Можливість неефективної взаємодії з партнерами, включаючи комунікацію, співпрацю та управління конфліктами.",
          α: "7",
          L: "H",
          μF: "80",
        },
      ],
    },
    {
      group: "f₄",
      criteria: ["F₁⁴", "F₂⁴", "F₃⁴", "F₄⁴", "F₅⁴", "F₆⁴"],
      values: [
        {
          name: "Стійкість до геополітичних та міжнародних ризиків – це здатність проекту витримувати геополітичні напруження та міжнародні виклики, які можуть виникнути під час його реалізації.",
          α: "10",
          L: "AA",
          μF: "80",
        },
        {
          name: "Ефективне використання ресурсів – це аналіз ефективності використання фінансових, технічних, та людських ресурсів проекту з метою максимізації результативності та мінімізації ризиків.",
          α: "10",
          L: "AA",
          μF: "90",
        },
        {
          name: "Захист від кіберзагроз та кібератак – це оцінка заходів з кібербезпеки та захисту інформаційних систем проекту від потенційних кіберзагроз та кібератак.",
          α: "7",
          L: "H",
          μF: "80",
        },
        {
          name: "Наявність механізмів, що забезпечують прозорість та відкритість в процесі виконання проекту, що включає доступ до інформації для зацікавлених сторін та громадськості.",
          α: "10",
          L: "H",
          μF: "70",
        },
        {
          name: "Управління ризиками та конфліктами – це оцінка стратегії управління ризиками та конфліктами, що дозволяють запобігати та мінімізувати можливі загрози для національної безпеки.",
          α: "9",
          L: "H",
          μF: "60",
        },
        {
          name: "Підвищення освіти та свідомості – це оцінка освіченості та свідомості щодо питань національної безпеки серед учасників країн-партнерів.",
          α: "10",
          L: "H",
          μF: "70",
        },
      ],
    },
  ],
};

function Table2() {
  const [tableData2, setTableData] = useState(() => {
    const saved = localStorage.getItem("tableData2");
    return saved ? JSON.parse(saved) : initialTableData;
  });

  const calculateAndStoreValues = (data) => {
    // Calculate total alpha for each group
    const groupTotalAlphas = data.data.map((group) =>
      group.values.reduce((sum, row) => sum + Number(row.α || 0), 0)
    );

    const allBeta = [];
    const allMuF = [];
    const allTheta = [];
    const groupPhi = []; // Array to store φ for each group

    // Get linguistic ranges from localStorage
    const linguisticRanges = JSON.parse(
      localStorage.getItem("linguisticRanges")
    ) || {
      L: { min: 0, max: 0.2 },
      BA: { min: 0.2, max: 0.4 },
      A: { min: 0.4, max: 0.6 },
      AA: { min: 0.6, max: 0.8 },
      H: { min: 0.8, max: 1.0 },
    };

    const calculateTheta = (L, muF) => {
      const ranges = {
        L: linguisticRanges.L,
        BA: linguisticRanges.BA,
        A: linguisticRanges.A,
        AA: linguisticRanges.AA,
        H: linguisticRanges.H,
      };

      const currentRange = ranges[L];
      if (!currentRange) return 0;

      const at = currentRange.min;
      const atNext = currentRange.max;

      return at + (1 / 100) * muF * (atNext - at);
    };

    data.data.forEach((group, groupIndex) => {
      const groupTotalAlpha = groupTotalAlphas[groupIndex];
      let groupPhiValue = 0; // Initialize φ for current group

      group.values.forEach((row) => {
        const alphaNum = Number(row.α);
        const muFNum = Number(row.μF);
        const betaValue =
          groupTotalAlpha === 0 ? 0 : alphaNum / groupTotalAlpha;
        const thetaValue = calculateTheta(row.L, muFNum);

        allBeta.push(betaValue);
        allMuF.push(muFNum);
        allTheta.push(thetaValue);

        // Add to group's φ calculation
        groupPhiValue += betaValue * thetaValue;
      });

      groupPhi.push(groupPhiValue);
    });

    const roundedBeta = allBeta.map((beta) => +beta.toFixed(3));
    const roundedTheta = allTheta.map((theta) => +theta.toFixed(4));
    const roundedGroupPhi = groupPhi.map((phi) => +phi.toFixed(4));

    localStorage.setItem("tableBeta", JSON.stringify(roundedBeta));
    localStorage.setItem("tableMuF", JSON.stringify(allMuF));
    localStorage.setItem("tableTheta", JSON.stringify(roundedTheta));
    localStorage.setItem("groupPhi", JSON.stringify(roundedGroupPhi));

    const mResult = roundedBeta.reduce(
      (acc, beta, i) => acc + beta * allMuF[i],
      0
    );
    localStorage.setItem("mF", mResult);
    window.dispatchEvent(new Event("updateMF"));
  };

  // Initial calculation when component mounts
  useEffect(() => {
    calculateAndStoreValues(tableData2);
  }, []);

  // Recalculate when table data changes
  useEffect(() => {
    localStorage.setItem("tableData2", JSON.stringify(tableData2));
    calculateAndStoreValues(tableData2);
  }, [tableData2]);

  const calculateBeta = (currentAlpha, groupIndex) => {
    const groupTotalAlpha = tableData2.data[groupIndex].values.reduce(
      (sum, row) => sum + Number(row.α || 0),
      0
    );
    if (groupTotalAlpha === 0) return "0.000";
    return (Number(currentAlpha) / groupTotalAlpha).toFixed(3);
  };

  const calculateMuF = (muF) => {
    const val = Number(muF);
    if (isNaN(val)) return "0.0000";
    if (val <= 1) return "0.0000";
    if (val <= 50) return ((2 * (val - 1) ** 2) / 2401).toFixed(4);
    if (val < 100) return (1 - (2 * (100 - val) ** 2) / 2401).toFixed(4);
    return "1.0000";
  };

  const autoResize = (textarea) => {
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const titleRef = useRef(null);
  useEffect(() => {
    if (titleRef.current) autoResize(titleRef.current);
  }, [tableData2.title]);

  const textAreaRefs = useRef(
    tableData2.data.flatMap((group) =>
      group.values.map(() => React.createRef())
    )
  );
  useEffect(() => {
    textAreaRefs.current.forEach((ref) => {
      if (ref.current) autoResize(ref.current);
    });
  }, [tableData2.data]);

  const handleTitleChange = (e) => {
    setTableData((prev) => ({ ...prev, title: e.target.value }));
  };

  const handleInputChange = (groupIndex, rowIndex, field, value) => {
    setTableData((prev) => {
      const newData = { ...prev };
      newData.data[groupIndex].values[rowIndex][field] = value;

      // Якщо змінилось значення L, одразу перераховуємо значення
      if (field === "L") {
        setTimeout(() => {
          calculateAndStoreValues(newData);
        }, 0);
      }

      return newData;
    });
  };

  const LOptions = [
    { value: "L", label: "низький" },
    { value: "BA", label: "нижче середнього" },
    { value: "A", label: "середній" },
    { value: "AA", label: "вище середнього" },
    { value: "H", label: "високий" },
  ];

  return (
    <div className="p-4" id="printTable2">
      <div className="mb-4">
        <textarea
          ref={titleRef}
          placeholder="Введіть назву таблиці"
          className="w-full border rounded p-2 text-center font-bold text-base"
          value={tableData2.title}
          onChange={handleTitleChange}
          style={{
            whiteSpace: "normal",
            wordBreak: "break-word",
            overflow: "hidden",
            resize: "none",
          }}
        />
      </div>
      <table className="w-full border-collapse text-base">
        <colgroup>
          <col className="min-w-[150px]" />
          <col className="min-w-[60px]" />
          <col className="min-w-[330px]" />
          <col className="min-w-[60px]" />
          <col className="min-w-[60px]" />
          <col className="min-w-[60px]" />
          <col className="min-w-[60px]" />
          <col className="min-w-[60px]" />
        </colgroup>
        <thead>
          <tr className="text-center bg-gray-200">
            <th className="border p-2">Група факторів</th>
            <th className="border p-2">Критерій</th>
            <th className="border p-2">Назва</th>
            <th className="border p-2">α</th>
            <th className="border p-2">β</th>
            <th className="border p-2">L</th>
            <th className="border p-2">μ(F)</th>
            <th className="border p-2">ϑ</th>
          </tr>
        </thead>
        <tbody>
          {tableData2.data.map((group, groupIndex) => (
            <React.Fragment key={groupIndex}>
              {group.values.map((row, rowIndex) => {
                const flatIndex =
                  tableData2.data
                    .slice(0, groupIndex)
                    .reduce((acc, g) => acc + g.values.length, 0) + rowIndex;

                // Get theta value from localStorage
                const thetaValues = JSON.parse(
                  localStorage.getItem("tableTheta") || "[]"
                );
                const thetaValue =
                  thetaValues[flatIndex] !== undefined
                    ? Number(thetaValues[flatIndex]).toFixed(4)
                    : "-";

                return (
                  <tr key={rowIndex} className="hover:bg-gray-50">
                    {rowIndex === 0 && (
                      <td
                        rowSpan={group.values.length}
                        className="border p-2 text-center align-middle"
                      >
                        {group.group}
                      </td>
                    )}
                    <td className="border p-2 text-center">
                      {group.criteria[rowIndex]}
                    </td>
                    <td className="border p-2">
                      <textarea
                        ref={textAreaRefs.current[flatIndex]}
                        className="w-full border rounded p-1 text-sm"
                        value={row.name}
                        onChange={(e) =>
                          handleInputChange(
                            groupIndex,
                            rowIndex,
                            "name",
                            e.target.value
                          )
                        }
                        style={{
                          whiteSpace: "normal",
                          wordBreak: "break-word",
                          overflow: "hidden",
                          resize: "none",
                        }}
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        min="1"
                        max="10"
                        step="1"
                        className="w-full border rounded p-1 text-center"
                        value={row.α}
                        onChange={(e) =>
                          handleInputChange(
                            groupIndex,
                            rowIndex,
                            "α",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td className="border p-2 text-center">
                      {calculateBeta(row.α, groupIndex)}
                    </td>
                    <td className="border p-2">
                      <select
                        className="w-full border rounded p-1 text-center"
                        value={row.L}
                        onChange={(e) =>
                          handleInputChange(
                            groupIndex,
                            rowIndex,
                            "L",
                            e.target.value
                          )
                        }
                      >
                        {LOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.value} - {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        min="1"
                        max="100"
                        step="1"
                        className="w-full border rounded p-1 text-center"
                        value={row.μF}
                        onChange={(e) =>
                          handleInputChange(
                            groupIndex,
                            rowIndex,
                            "μF",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td className="border p-2 text-center">{thetaValue}</td>
                  </tr>
                );
              })}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table2;

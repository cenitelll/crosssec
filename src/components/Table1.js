import React, { useState, useEffect, useRef } from "react";

// Початкові дані
const initialTableData = {
  title: "Вхідні та нормовані оцінки по критеріях оцінювання проекту P",
  data: [
    {
      group: "Фінансова та операційна спроможність",
      criteria: ["K₁", "K₂", "K₃", "K₄"],
      values: [
        {
          name: "Наявність достатнього досвіду в управлінні проектами, що підтверджується управлінськими навичками?",
          v: "10",
          O: "8",
        },
        {
          name: "Наявність потрібної кількості технічних знань та управлінських навичок?",
          v: "9",
          O: "8",
        },
        {
          name: "Наявність достатніх джерел фінансування повсякденної фінансової діяльності?",
          v: "8",
          O: "10",
        },
        {
          name: "Наявність достатніх і раціональних запланованих джерел для забезпечення реалізації проекту?",
          v: "9",
          O: "9",
        },
      ],
    },
    {
      group: "Транскордонний підхід",
      criteria: ["K₅", "K₆", "K₇", "K₈"],
      values: [
        {
          name: "Проект має виражений транскордонний вплив, що принесе сильного позитивного ефекту?",
          v: "9",
          O: "7",
        },
        {
          name: "Додаткова транскордонна цінність, що приносить користь всім учасникам на різних боках кордону, проект не може бути реалізований без співпраці іноземного партнера, який ділиться своїм досвідом, методами, моделями, даними, ідеями, знаннями і т. д.",
          v: "10",
          O: "8",
        },
        {
          name: "Якісний рівень партнерів, що будуть залучені до реалізації проекту.",
          v: "9",
          O: "7",
        },
        {
          name: "Наявність реальної вигоди від реалізації проекту для всіх його партнерів.",
          v: "9",
          O: "9",
        },
      ],
    },
    {
      group: "Сталість",
      criteria: ["K₉", "K₁₀", "K₁₁"],
      values: [
        {
          name: "прогнозується, що проект буде мати довгостроковий вплив на його цільову аудиторію, а результати зможуть бути використані після завершення проекту.",
          v: "8",
          O: "9",
        },
        {
          name: "Прогнозується, що проект буде мати мультиплікаційні ефекти щодо його повторення та розширення його результатів.",
          v: "8",
          O: "5",
        },
        {
          name: "Очікувані результати будуть сталими щодо: фінансової, екологічної та інституційної складових.",
          v: "9",
          O: "7",
        },
      ],
    },
    {
      group: "План заходів та комунікації",
      criteria: ["K₁₂", "K₁₃", "K₁₄", "K₁₅"],
      values: [
        {
          name: "Плани проекту є чіткими, логічними та практичними.",
          v: "7",
          O: "8",
        },
        {
          name: "Пропоновані заходи і проміжні результати проекту є належними, практичними, що відповідають цілям та очікуваним результатам.",
          v: "8",
          O: "10",
        },
        {
          name: "План комунікації проекту відповідає досягненню цілей проекту.",
          v: "9",
          O: "7",
        },
        {
          name: "Адекватний часовий план заходів.",
          v: "7",
          O: "9",
        },
      ],
    },
  ],
};

function Table1() {
  const [table1Data, setTableData] = useState(() => {
    const saved = localStorage.getItem("table1Data");
    return saved ? JSON.parse(saved) : initialTableData;
  });

  useEffect(() => {
    // 1. Зберігаємо увесь об'єкт таблиці
    localStorage.setItem("table1Data", JSON.stringify(table1Data));

    // 2. Обчислюємо загальну суму ваг
    const totalV = table1Data.data.reduce((acc, group) => {
      return (
        acc +
        group.values.reduce((sum, row) => sum + Number(row.v || 0), 0)
      );
    }, 0);

    // 3. Формуємо масиви W та mu(O)
    const allW = [];
    const allMu = [];

    table1Data.data.forEach((group) => {
      group.values.forEach((row) => {
        const vNum = Number(row.v);
        const oNum = Number(row.O);

        // w = v / totalV
        const wValue = totalV === 0 ? 0 : vNum / totalV;

        // μ(O)
        let muValue;
        if (isNaN(oNum)) {
          muValue = 0;
        } else if (oNum <= 1) {
          muValue = 0;
        } else if (oNum <= 5) {
          muValue = (2 * (oNum - 1) ** 2) / 81;
        } else if (oNum < 10) {
          muValue = 1 - (2 * (10 - oNum) ** 2) / 81;
        } else {
          muValue = 1;
        }

        allW.push(wValue);
        allMu.push(muValue);
      });
    });

    // 4. Записуємо W і mu(O) з заокругленням
    const roundedW = allW.map((w) => +w.toFixed(3));
    const roundedMu = allMu.map((mu) => +mu.toFixed(4));

    localStorage.setItem("table1W", JSON.stringify(roundedW));
    localStorage.setItem("table1Mu", JSON.stringify(roundedMu));

    // 5. Обчислюємо m(P) = Σ w_i × μ_i і зберігаємо
    const mResult = roundedW.reduce((acc, w, i) => acc + w * roundedMu[i], 0);
    localStorage.setItem("m", mResult);

    // 6. Подія "updateM" для оповіщення EquationComponent
    window.dispatchEvent(new Event("updateM"));

  }, [table1Data]);

  // Функції для відображення (в самій таблиці) — з потрібним заокругленням
  const calculateW = (currentV) => {
    const totalV = table1Data.data.reduce(
      (acc, group) =>
        acc + group.values.reduce((sum, row) => sum + Number(row.v || 0), 0),
      0
    );
    if (totalV === 0) return "0.000";
    const wVal = Number(currentV) / totalV;
    return wVal.toFixed(3);
  };

  const calculateMuO = (O) => {
    const val = Number(O);
    if (isNaN(val)) return "0.0000";
    if (val <= 1) return "0.0000";
    if (val <= 5) {
      return (2 * (val - 1) ** 2 / 81).toFixed(4);
    }
    if (val < 10) {
      return (1 - 2 * (10 - val) ** 2 / 81).toFixed(4);
    }
    return "1.0000";
  };

  // Авто-ресайз textarea
  const autoResize = (textarea) => {
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  // Реф для заголовка
  const titleRef = useRef(null);
  useEffect(() => {
    if (titleRef.current) autoResize(titleRef.current);
  }, [table1Data.title]);

  // Рефи для кожного рядка
  const textAreaRefs = useRef(
    table1Data.data.flatMap((group) => group.values.map(() => React.createRef()))
  );
  useEffect(() => {
    textAreaRefs.current.forEach((ref) => {
      if (ref.current) autoResize(ref.current);
    });
  }, [table1Data.data]);

  const handleTitleChange = (e) => {
    setTableData((prev) => ({ ...prev, title: e.target.value }));
  };

  const handleInputChange = (groupIndex, rowIndex, field, value) => {
    setTableData((prev) => {
      const newData = { ...prev };
      newData.data[groupIndex].values[rowIndex][field] = value;
      return newData;
    });
  };

  return (
    <div className="p-4" id="printTable1">
      <div className="mb-4">
        <textarea
          ref={titleRef}
          placeholder="Введіть назву таблиці"
          className="w-full border rounded p-2 text-center font-bold text-base"
          value={table1Data.title}
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
          <col className="min-w-[400px]" />
          <col className="min-w-[60px]" />
          <col className="min-w-[60px]" />
          <col className="min-w-[60px]" />
          <col className="min-w-[60px]" />
        </colgroup>
        <thead>
          <tr className="text-center bg-gray-200">
            <th className="border p-2">Назва групи</th>
            <th className="border p-2">Критерій</th>
            <th className="border p-2">Назва</th>
            <th className="border p-2">v</th>
            <th className="border p-2">w</th>
            <th className="border p-2">O</th>
            <th className="border p-2">μ(O)</th>
          </tr>
        </thead>
        <tbody>
          {table1Data.data.map((group, groupIndex) => (
            <React.Fragment key={groupIndex}>
              {group.values.map((row, rowIndex) => {
                const flatIndex = table1Data.data
                  .slice(0, groupIndex)
                  .reduce((acc, g) => acc + g.values.length, 0) + rowIndex;

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
                          handleInputChange(groupIndex, rowIndex, "name", e.target.value)
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
                        value={row.v}
                        onChange={(e) =>
                          handleInputChange(groupIndex, rowIndex, "v", e.target.value)
                        }
                      />
                    </td>
                    <td className="border p-2 text-center">
                      {calculateW(row.v)}
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        min="1"
                        max="10"
                        step="1"
                        className="w-full border rounded p-1 text-center"
                        value={row.O}
                        onChange={(e) =>
                          handleInputChange(groupIndex, rowIndex, "O", e.target.value)
                        }
                      />
                    </td>
                    <td className="border p-2 text-center">
                      {calculateMuO(row.O)}
                    </td>
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

export default Table1;

import React, { useRef, useEffect } from "react";
import { DockLayout } from "rc-dock";
import "rc-dock/dist/rc-dock.css";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import domtoimage from "dom-to-image";
import Table1 from "./components/Table1";
import Equation2and6 from "./components/Equation2and6";
import Table2 from "./components/Table2";
import Equation8 from "./components/Equation8";
import Equation11and12 from "./components/Equation11and12";
import "./App.css";
import timesNewRomanRegular from "./fonts/TimesNewRoman-Regular.js";
import timesNewRomanBold from "./fonts/TimesNewRoman-Bold.js";

function App() {
  const dockRef = useRef(null);
  const equationRef = useRef(null);
  const table2Ref = useRef(null);
  const equation8Ref = useRef(null);
  const equation11and12Ref = useRef(null);
  const pdfEquation2and6Ref = useRef(null);
  const pdfEquation8Ref = useRef(null);

  const initialLayout = {
    dockbox: {
      mode: "horizontal",
      children: [
        {
          size: 1,
          tabs: [
            {
              id: "table1",
              title: "Таблиця 1",
              content: (
                <div
                  style={{ width: "100%", height: "100%", overflow: "auto" }}
                >
                  <Table1 />
                </div>
              ),
            },
            {
              id: "table2",
              title: "Таблиця 2",
              content: (
                <div
                  ref={table2Ref}
                  style={{ width: "100%", height: "100%", overflow: "auto" }}
                >
                  <Table2 />
                </div>
              ),
            },
          ],
        },
        {
          size: 1,
          tabs: [
            {
              id: "Equation2and6",
              title: "Equation2and6",
              content: (
                <div
                  ref={equationRef}
                  style={{ width: "100%", height: "100%", overflow: "auto" }}
                >
                  <Equation2and6 />
                </div>
              ),
            },
            {
              id: "Equation8",
              title: "Equation8",
              content: (
                <div
                  ref={equation8Ref}
                  style={{ width: "100%", height: "100%", overflow: "auto" }}
                >
                  <Equation8 />
                </div>
              ),
            },
            {
              id: "Equation11and12",
              title: "Equation11and12",
              content: (
                <div
                  ref={equation11and12Ref}
                  style={{ width: "100%", height: "100%", overflow: "auto" }}
                >
                  <Equation11and12 />
                </div>
              ),
            },
          ],
        },
      ],
    },
  };

  const handleLayoutChange = () => {
    if (dockRef.current) {
      const currentLayout = dockRef.current.saveLayout();
      localStorage.setItem("savedDockLayout", JSON.stringify(currentLayout));
    }
  };

  useEffect(() => {
    const savedLayout = localStorage.getItem("savedDockLayout");
    if (savedLayout && dockRef.current) {
      try {
        const parsedLayout = JSON.parse(savedLayout);
        setTimeout(() => {
          dockRef.current.loadLayout(parsedLayout);
        }, 0);
      } catch (error) {
        console.error("Помилка парсингу збереженого макету:", error);
      }
    }
  }, []);

  const handleDownloadPDF = async () => {
    const doc = new jsPDF({ orientation: "landscape" });

    // Table1
    const savedData = localStorage.getItem("table1Data");
    if (!savedData) {
      alert("Дані таблиці 1 не знайдені в localStorage!");
      return;
    }
    const table1Data = JSON.parse(savedData);
    const tableTitle = table1Data.title || "Таблиця";
    const head = ["Назва групи", "Критерій", "Назва", "v", "w", "O", "μ(O)"];
    const tableBody = [];
    const rowSpans = [];

    const calcTotalV = () => {
      return table1Data.data.reduce(
        (acc, group) =>
          acc + group.values.reduce((sum, row) => sum + Number(row.v || 0), 0),
        0
      );
    };
    const totalV = calcTotalV();
    const calcW = (v) => (totalV === 0 ? "0.000" : (v / totalV).toFixed(3));
    const calcMuO = (O) => {
      const val = Number(O);
      if (isNaN(val)) return "0.0000";
      if (val <= 1) return "0.0000";
      if (val <= 5) return ((2 * (val - 1) ** 2) / 81).toFixed(4);
      if (val < 10) return (1 - (2 * (10 - val) ** 2) / 81).toFixed(4);
      return "1.0000";
    };

    table1Data.data.forEach((group) => {
      rowSpans.push(group.values.length);
      group.values.forEach((row, rowIndex) => {
        const w = calcW(Number(row.v));
        const muO = calcMuO(row.O);
        if (rowIndex === 0) {
          tableBody.push([
            group.group,
            group.criteria[rowIndex],
            row.name,
            row.v,
            w,
            row.O,
            muO,
          ]);
        } else {
          tableBody.push([
            "",
            group.criteria[rowIndex],
            row.name,
            row.v,
            w,
            row.O,
            muO,
          ]);
        }
      });
    });

    try {
      doc.addFileToVFS("TimesNewRoman-Regular.ttf", timesNewRomanRegular);
      doc.addFont("TimesNewRoman-Regular.ttf", "TimesNewRoman", "normal");
      doc.addFileToVFS("TimesNewRoman-Bold.ttf", timesNewRomanBold);
      doc.addFont("TimesNewRoman-Bold.ttf", "TimesNewRoman", "bold");
      doc.setFont("TimesNewRoman");
    } catch (error) {
      console.error("Помилка завантаження шрифтів:", error);
      doc.setFont("Helvetica");
    }

    const pageWidth = doc.internal.pageSize.getWidth();
    const titleWidth = doc.getTextWidth(tableTitle);
    const titleX = (pageWidth - titleWidth) / 2;
    doc.text(tableTitle, titleX, 10);

    const columnWidths = [30, 20, 130, 15, 15, 15, 15];
    const tableWidth = columnWidths.reduce((sum, w) => sum + w, 0);
    const pageMargin = (pageWidth - tableWidth) / 2;

    autoTable(doc, {
      startY: 15,
      head: [head],
      body: tableBody,
      theme: "grid",
      styles: {
        font: "TimesNewRoman",
        fontSize: 8,
        cellPadding: 2,
        halign: "center",
        valign: "middle",
        overflow: "linebreak",
        minCellHeight: 10,
      },
      headStyles: {
        font: "TimesNewRoman",
        fontStyle: "bold",
        fontSize: 8,
        fillColor: [41, 128, 185],
        textColor: 255,
        halign: "center",
      },
      columnStyles: {
        0: { cellWidth: 30, halign: "center" },
        1: { cellWidth: 20, halign: "center" },
        2: { cellWidth: 130, halign: "left" },
        3: { cellWidth: 15, halign: "center" },
        4: { cellWidth: 15, halign: "center" },
        5: { cellWidth: 15, halign: "center" },
        6: { cellWidth: 15, halign: "center" },
      },
      margin: { left: pageMargin, right: pageMargin },
      showHead: "firstPage",
      didParseCell: (data) => {
        if (data.row.section === "body") {
          const actualBodyRowIndex = data.row.index;
          let groupStartIndex = 0;
          let currentGroupIndex = 0;
          for (let i = 0; i < rowSpans.length; i++) {
            if (
              actualBodyRowIndex >= groupStartIndex &&
              actualBodyRowIndex < groupStartIndex + rowSpans[i]
            ) {
              currentGroupIndex = i;
              break;
            }
            groupStartIndex += rowSpans[i];
          }
          const fillColor =
            currentGroupIndex % 2 === 1 ? [240, 240, 240] : [255, 255, 255];
          data.cell.styles.fillColor = fillColor;

          if (data.column.index === 0) {
            if (actualBodyRowIndex === groupStartIndex) {
              data.cell.rowSpan = rowSpans[currentGroupIndex];
              data.cell.styles.valign = "middle";
              data.cell.styles.halign = "center";
              if (data.cell.text.length > 0) {
                data.cell.text = doc.splitTextToSize(data.cell.text[0], 25);
              }
            } else {
              data.cell.text = [""];
            }
          }

          if (data.column.index === 2 && data.cell.text.length > 0) {
            const textLines = doc.splitTextToSize(data.cell.text[0], 120);
            const textHeight = textLines.length * 5;
            data.cell.styles.minCellHeight = Math.max(
              data.cell.styles.minCellHeight || 0,
              textHeight
            );
          }
        }
      },
    });

    // Equation2and6
    doc.addPage();
    doc.setFontSize(14);
    doc.text("Формули для розрахунків", 10, 20);

    // Формула для нормованих ваг
    doc.setFontSize(12);
    doc.text("Формула для обчислення нормованих ваг wᵢ:", 10, 40);
    doc.text("wᵢ = vᵢ / ∑(vⱼ)", 10, 50);
    doc.text("Де:", 10, 60);
    doc.text("wᵢ — нормована вага для i-го критерію", 20, 70);
    doc.text("vᵢ — початкова вага i-го критерію", 20, 80);
    doc.text("∑(vⱼ) — сума всіх ваг у таблиці", 20, 90);

    // Формула для m(P)
    const mValue = localStorage.getItem("m");
    doc.text("Формула для m(P) з урахуванням μ(O):", 10, 110);
    doc.text(`m(P) = ∑(wᵢ ⋅ μ(Oᵢ)) = ${mValue || "—"}`, 10, 120);

    // Table2
    const savedTable2Data = localStorage.getItem("tableData2");
    if (!savedTable2Data) {
      alert("Дані таблиці 2 не знайдені в localStorage!");
      return;
    }
    const table2Data = JSON.parse(savedTable2Data);
    const table2Title = table2Data.title || "Таблиця 2";

    const savedBeta = localStorage.getItem("tableBeta");
    const savedMuF = localStorage.getItem("tableMuF");
    const savedTheta = localStorage.getItem("tableTheta");
    if (!savedBeta || !savedMuF || !savedTheta) {
      alert("Дані β, μ(F) або ϑ не знайдені в localStorage!");
      return;
    }
    const betaArray = JSON.parse(savedBeta);
    const muFArray = JSON.parse(savedMuF);
    const thetaArray = JSON.parse(savedTheta);

    const table2Body = [];
    const rowSpans2 = table2Data.data.map((group) => group.values.length);
    let betaIndex = 0;
    table2Data.data.forEach((group, groupIndex) => {
      group.values.forEach((row, rowIndex) => {
        const β = betaArray[betaIndex];
        const μF = muFArray[betaIndex];
        const LValue = row.L;
        const ϑ =
          thetaArray[betaIndex] !== undefined
            ? thetaArray[betaIndex].toFixed(4)
            : "-";
        if (rowIndex === 0) {
          table2Body.push([
            group.group,
            group.criteria[rowIndex],
            row.name,
            row.α,
            β,
            LValue,
            μF,
            ϑ,
          ]);
        } else {
          table2Body.push([
            "",
            group.criteria[rowIndex],
            row.name,
            row.α,
            β,
            LValue,
            μF,
            ϑ,
          ]);
        }
        betaIndex++;
      });
    });

    doc.addPage();
    const title2Width = doc.getTextWidth(table2Title);
    const title2X = (pageWidth - title2Width) / 2;
    doc.text(table2Title, title2X, 10);

    const head2 = [
      "Група факторів",
      "Критерій",
      "Назва",
      "α",
      "β",
      "L",
      "μ(F)",
      "ϑ",
    ];
    const columnWidths2 = [30, 20, 130, 15, 15, 20, 15, 15];
    const tableWidth2 = columnWidths2.reduce((sum, w) => sum + w, 0);
    const pageMargin2 = (pageWidth - tableWidth2) / 2;

    autoTable(doc, {
      startY: 15,
      head: [head2],
      body: table2Body,
      theme: "grid",
      styles: {
        font: "TimesNewRoman",
        fontSize: 8,
        cellPadding: 2,
        halign: "center",
        valign: "middle",
        overflow: "linebreak",
        minCellHeight: 10,
      },
      headStyles: {
        font: "TimesNewRoman",
        fontStyle: "bold",
        fontSize: 8,
        fillColor: [41, 128, 185],
        textColor: 255,
        halign: "center",
      },
      columnStyles: {
        0: { cellWidth: 30, halign: "center" },
        1: { cellWidth: 20, halign: "center" },
        2: { cellWidth: 130, halign: "left" },
        3: { cellWidth: 15, halign: "center" },
        4: { cellWidth: 15, halign: "center" },
        5: { cellWidth: 20, halign: "center" },
        6: { cellWidth: 15, halign: "center" },
        7: { cellWidth: 15, halign: "center" },
      },
      margin: { left: pageMargin2, right: pageMargin2 },
      showHead: "firstPage",
      didParseCell: (data) => {
        if (data.row.section === "body") {
          const actualBodyRowIndex = data.row.index;
          let groupStartIndex = 0;
          let currentGroupIndex = 0;
          for (let i = 0; i < rowSpans2.length; i++) {
            if (
              actualBodyRowIndex >= groupStartIndex &&
              actualBodyRowIndex < groupStartIndex + rowSpans2[i]
            ) {
              currentGroupIndex = i;
              break;
            }
            groupStartIndex += rowSpans2[i];
          }
          const fillColor =
            currentGroupIndex % 2 === 1 ? [240, 240, 240] : [255, 255, 255];
          data.cell.styles.fillColor = fillColor;

          if (data.column.index === 0) {
            if (actualBodyRowIndex === groupStartIndex) {
              data.cell.rowSpan = rowSpans2[currentGroupIndex];
              data.cell.styles.valign = "middle";
              data.cell.styles.halign = "center";
              if (data.cell.text.length > 0) {
                data.cell.text = doc.splitTextToSize(data.cell.text[0], 25);
              }
            } else {
              data.cell.text = [""];
            }
          }

          if (data.column.index === 2 && data.cell.text.length > 0) {
            const textLines = doc.splitTextToSize(data.cell.text[0], 120);
            const textHeight = textLines.length * 5;
            data.cell.styles.minCellHeight = Math.max(
              data.cell.styles.minCellHeight || 0,
              textHeight
            );
          }
        }
      },
    });

    // Equation8
    doc.addPage();
    doc.setFontSize(14);
    doc.text("Лінгвістичні змінні та функції належності", 10, 20);

    doc.setFontSize(12);
    // Лінгвістичні змінні та їх діапазони
    doc.text("Діапазони значень лінгвістичних змінних:", 10, 40);
    doc.text("L  - Низький рівень:              d(R) ∈ [0, 0.2]", 20, 50);
    doc.text("BA - Рівень нижче середнього:     d(R) ∈ [0.2, 0.4]", 20, 60);
    doc.text("A  - Середній рівень:             d(R) ∈ [0.4, 0.6]", 20, 70);
    doc.text("AA - Рівень вище середнього:      d(R) ∈ [0.6, 0.8]", 20, 80);
    doc.text("H  - Високий рівень:              d(R) ∈ [0.8, 1.0]", 20, 90);

    // Групові функції належності
    const groupPhi = JSON.parse(localStorage.getItem("groupPhi") || "[]");
    doc.text("Значення групових функцій належності:", 10, 110);
    let yPos = 120;
    groupPhi.forEach((value, index) => {
      doc.text(
        `Група ${index + 1}: φ(F) = ${Number(value).toFixed(4)}`,
        20,
        yPos
      );
      yPos += 10;
    });

    // Equation11and12
    doc.addPage();
    doc.setFontSize(14);
    doc.text("Розрахунок рівня можливості фінансування проекту", 10, 20);

    doc.setFontSize(12);
    doc.text("Формула для обчислення Δ:", 10, 40);
    doc.text("Δᵢ = (m(P))^φᵢ, де i = 1,2,3,4", 10, 50);

    // Отримуємо значення
    const deltaValues = JSON.parse(localStorage.getItem("deltaValues") || "[]");
    const weights = JSON.parse(
      localStorage.getItem("weights") || "[0.4, 0.3, 0.2, 0.1]"
    );
    const m = localStorage.getItem("m") || "0";

    // Виводимо поточні значення
    doc.text("Поточні значення:", 10, 70);
    doc.text(`m(P) = ${Number(m).toFixed(4)}`, 20, 80);

    // Виводимо значення Δ
    deltaValues.forEach((delta, index) => {
      doc.text(
        `Δ${index + 1} = ${Number(delta).toFixed(4)}`,
        20,
        90 + index * 10
      );
    });

    // Виводимо вагові коефіцієнти
    doc.text("Вагові коефіцієнти:", 10, 130);
    weights.forEach((weight, index) => {
      doc.text(
        `p${index + 1} = ${Number(weight).toFixed(2)}`,
        20,
        140 + index * 10
      );
    });

    // Додаємо нову сторінку для детального розрахунку
    doc.addPage();
    doc.setFontSize(14);
    doc.text("Розрахунок:", 10, 20);

    doc.setFontSize(12);
    // Формула з підставленими значеннями
    const weightSum = weights.reduce((sum, w) => sum + w, 0);
    const calculation = deltaValues
      .map((delta, i) => `${weights[i]} · ${delta.toFixed(4)}`)
      .join(" + ");
    doc.text(`Y_TP(P) = 1/(${weights.join(" + ")}) · (${calculation})`, 10, 35);

    // Обчислюємо Y_TP
    const yTp =
      deltaValues.reduce(
        (sum, delta, index) => sum + delta * weights[index],
        0
      ) / weightSum;
    doc.text(`= ${yTp.toFixed(4)}`, 10, 45);

    // Оцінка рівня можливості фінансування
    doc.text("Оцінка рівня можливості фінансування:", 10, 60);

    // Визначаємо рівень
    let level = "";
    if (yTp > 0.89 && yTp <= 1) {
      level =
        "високий рівень щодо можливості фінансування проекту транскордонного співробітництва";
    } else if (yTp > 0.77 && yTp <= 0.89) {
      level =
        "рівень щодо можливості фінансування проекту транскордонного співробітництва – вище середнього";
    } else if (yTp > 0.65 && yTp <= 0.77) {
      level =
        "середній рівень щодо можливості фінансування проекту транскордонного співробітництва";
    } else if (yTp > 0.54 && yTp <= 0.65) {
      level =
        "низький рівень щодо можливості фінансування проекту транскордонного співробітництва";
    } else {
      level =
        "дуже низький рівень щодо можливості фінансування проекту транскордонного співробітництва";
    }

    // Розбиваємо довгий текст на декілька рядків для кращого відображення
    const wrappedLevel = doc.splitTextToSize(level, 250);
    doc.text(wrappedLevel, 20, 70);

    // Діапазони оцінки
    doc.text("Діапазони оцінки:", 10, 90);
    doc.text("(0,89; 1]    – високий рівень", 20, 100);
    doc.text("(0,77; 0,89] – рівень вище середнього", 20, 108);
    doc.text("(0,65; 0,77] – середній рівень", 20, 116);
    doc.text("(0,54; 0,65] – низький рівень", 20, 124);
    doc.text("[0; 0,54]    – дуже низький рівень", 20, 132);

    doc.save("project-assessment.pdf");
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {/* Hidden components for PDF generation */}
      <div style={{ display: "none" }}>
        <div ref={pdfEquation2and6Ref}>
          <Equation2and6 />
        </div>
        <div ref={pdfEquation8Ref}>
          <Equation8 />
        </div>
      </div>

      <DockLayout
        ref={dockRef}
        defaultLayout={initialLayout}
        style={{ width: "100%", height: "100%" }}
        onLayoutChange={handleLayoutChange}
      />
      <button
        onClick={handleDownloadPDF}
        style={{
          position: "absolute",
          bottom: "10px",
          left: "10px",
          zIndex: 9999,
          padding: "10px 15px",
          fontSize: "14px",
          background: "#2980b9",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
        }}
      >
        Завантажити PDF
      </button>
    </div>
  );
}

export default App;

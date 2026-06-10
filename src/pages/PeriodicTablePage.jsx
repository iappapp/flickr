import React, { useState } from 'react';
import './PeriodicTablePage.css';

const PeriodicTablePage = () => {
  const [selectedElement, setSelectedElement] = useState(null);

  // 元素周期表数据
  const elements = [
    // 第一行
    { atomicNumber: 1, symbol: "H", name: "氢", weight: 1.008, group: 1, period: 1, category: "非金属", color: "#FFCCCB" },
    { atomicNumber: 2, symbol: "He", name: "氦", weight: 4.0026, group: 18, period: 1, category: "惰性气体", color: "#D3D3D3" },
    
    // 第二行
    { atomicNumber: 3, symbol: "Li", name: "锂", weight: 6.94, group: 1, period: 2, category: "碱金属", color: "#FFB6C1" },
    { atomicNumber: 4, symbol: "Be", name: "铍", weight: 9.0122, group: 2, period: 2, category: "碱土金属", color: "#FFA07A" },
    { atomicNumber: 5, symbol: "B", name: "硼", weight: 10.81, group: 13, period: 2, category: "类金属", color: "#98FB98" },
    { atomicNumber: 6, symbol: "C", name: "碳", weight: 12.011, group: 14, period: 2, category: "非金属", color: "#FFCCCB" },
    { atomicNumber: 7, symbol: "N", name: "氮", weight: 14.007, group: 15, period: 2, category: "非金属", color: "#FFCCCB" },
    { atomicNumber: 8, symbol: "O", name: "氧", weight: 15.999, group: 16, period: 2, category: "非金属", color: "#FFCCCB" },
    { atomicNumber: 9, symbol: "F", name: "氟", weight: 18.998, group: 17, period: 2, category: "卤素", color: "#87CEEB" },
    { atomicNumber: 10, symbol: "Ne", name: "氖", weight: 20.180, group: 18, period: 2, category: "惰性气体", color: "#D3D3D3" },
    
    // 第三行
    { atomicNumber: 11, symbol: "Na", name: "钠", weight: 22.990, group: 1, period: 3, category: "碱金属", color: "#FFB6C1" },
    { atomicNumber: 12, symbol: "Mg", name: "镁", weight: 24.305, group: 2, period: 3, category: "碱土金属", color: "#FFA07A" },
    { atomicNumber: 13, symbol: "Al", name: "铝", weight: 26.982, group: 13, period: 3, category: "贫金属", color: "#F0E68C" },
    { atomicNumber: 14, symbol: "Si", name: "硅", weight: 28.085, group: 14, period: 3, category: "类金属", color: "#98FB98" },
    { atomicNumber: 15, symbol: "P", name: "磷", weight: 30.974, group: 15, period: 3, category: "非金属", color: "#FFCCCB" },
    { atomicNumber: 16, symbol: "S", name: "硫", weight: 32.06, group: 16, period: 3, category: "非金属", color: "#FFCCCB" },
    { atomicNumber: 17, symbol: "Cl", name: "氯", weight: 35.45, group: 17, period: 3, category: "卤素", color: "#87CEEB" },
    { atomicNumber: 18, symbol: "Ar", name: "氩", weight: 39.948, group: 18, period: 3, category: "惰性气体", color: "#D3D3D3" },
    
    // 第四行
    { atomicNumber: 19, symbol: "K", name: "钾", weight: 39.098, group: 1, period: 4, category: "碱金属", color: "#FFB6C1" },
    { atomicNumber: 20, symbol: "Ca", name: "钙", weight: 40.078, group: 2, period: 4, category: "碱土金属", color: "#FFA07A" },
    { atomicNumber: 21, symbol: "Sc", name: "钪", weight: 44.956, group: 3, period: 4, category: "过渡金属", color: "#E6E6FA" },
    { atomicNumber: 22, symbol: "Ti", name: "钛", weight: 47.867, group: 4, period: 4, category: "过渡金属", color: "#E6E6FA" },
    { atomicNumber: 23, symbol: "V", name: "钒", weight: 50.942, group: 5, period: 4, category: "过渡金属", color: "#E6E6FA" },
    { atomicNumber: 24, symbol: "Cr", name: "铬", weight: 51.996, group: 6, period: 4, category: "过渡金属", color: "#E6E6FA" },
    { atomicNumber: 25, symbol: "Mn", name: "锰", weight: 54.938, group: 7, period: 4, category: "过渡金属", color: "#E6E6FA" },
    { atomicNumber: 26, symbol: "Fe", name: "铁", weight: 55.845, group: 8, period: 4, category: "过渡金属", color: "#E6E6FA" },
    { atomicNumber: 27, symbol: "Co", name: "钴", weight: 58.933, group: 9, period: 4, category: "过渡金属", color: "#E6E6FA" },
    { atomicNumber: 28, symbol: "Ni", name: "镍", weight: 58.693, group: 10, period: 4, category: "过渡金属", color: "#E6E6FA" },
    { atomicNumber: 29, symbol: "Cu", name: "铜", weight: 63.546, group: 11, period: 4, category: "过渡金属", color: "#E6E6FA" },
    { atomicNumber: 30, symbol: "Zn", name: "锌", weight: 65.38, group: 12, period: 4, category: "过渡金属", color: "#E6E6FA" },
    { atomicNumber: 31, symbol: "Ga", name: "镓", weight: 69.723, group: 13, period: 4, category: "贫金属", color: "#F0E68C" },
    { atomicNumber: 32, symbol: "Ge", name: "锗", weight: 72.630, group: 14, period: 4, category: "类金属", color: "#98FB98" },
    { atomicNumber: 33, symbol: "As", name: "砷", weight: 74.922, group: 15, period: 4, category: "类金属", color: "#98FB98" },
    { atomicNumber: 34, symbol: "Se", name: "硒", weight: 78.971, group: 16, period: 4, category: "非金属", color: "#FFCCCB" },
    { atomicNumber: 35, symbol: "Br", name: "溴", weight: 79.904, group: 17, period: 4, category: "卤素", color: "#87CEEB" },
    { atomicNumber: 36, symbol: "Kr", name: "氪", weight: 83.798, group: 18, period: 4, category: "惰性气体", color: "#D3D3D3" },
    
    // 第五行
    { atomicNumber: 37, symbol: "Rb", name: "铷", weight: 85.468, group: 1, period: 5, category: "碱金属", color: "#FFB6C1" },
    { atomicNumber: 38, symbol: "Sr", name: "锶", weight: 87.62, group: 2, period: 5, category: "碱土金属", color: "#FFA07A" },
    { atomicNumber: 39, symbol: "Y", name: "钇", weight: 88.906, group: 3, period: 5, category: "过渡金属", color: "#E6E6FA" },
    { atomicNumber: 40, symbol: "Zr", name: "锆", weight: 91.224, group: 4, period: 5, category: "过渡金属", color: "#E6E6FA" },
    { atomicNumber: 41, symbol: "Nb", name: "铌", weight: 92.906, group: 5, period: 5, category: "过渡金属", color: "#E6E6FA" },
    { atomicNumber: 42, symbol: "Mo", name: "钼", weight: 95.95, group: 6, period: 5, category: "过渡金属", color: "#E6E6FA" },
    { atomicNumber: 43, symbol: "Tc", name: "锝", weight: 98, group: 7, period: 5, category: "过渡金属", color: "#E6E6FA" },
    { atomicNumber: 44, symbol: "Ru", name: "钌", weight: 101.07, group: 8, period: 5, category: "过渡金属", color: "#E6E6FA" },
    { atomicNumber: 45, symbol: "Rh", name: "铑", weight: 102.91, group: 9, period: 5, category: "过渡金属", color: "#E6E6FA" },
    { atomicNumber: 46, symbol: "Pd", name: "钯", weight: 106.42, group: 10, period: 5, category: "过渡金属", color: "#E6E6FA" },
    { atomicNumber: 47, symbol: "Ag", name: "银", weight: 107.87, group: 11, period: 5, category: "过渡金属", color: "#E6E6FA" },
    { atomicNumber: 48, symbol: "Cd", name: "镉", weight: 112.41, group: 12, period: 5, category: "过渡金属", color: "#E6E6FA" },
    { atomicNumber: 49, symbol: "In", name: "铟", weight: 114.82, group: 13, period: 5, category: "贫金属", color: "#F0E68C" },
    { atomicNumber: 50, symbol: "Sn", name: "锡", weight: 118.71, group: 14, period: 5, category: "贫金属", color: "#F0E68C" },
    { atomicNumber: 51, symbol: "Sb", name: "锑", weight: 121.76, group: 15, period: 5, category: "类金属", color: "#98FB98" },
    { atomicNumber: 52, symbol: "Te", name: "碲", weight: 127.60, group: 16, period: 5, category: "类金属", color: "#98FB98" },
    { atomicNumber: 53, symbol: "I", name: "碘", weight: 126.90, group: 17, period: 5, category: "卤素", color: "#87CEEB" },
    { atomicNumber: 54, symbol: "Xe", name: "氙", weight: 131.29, group: 18, period: 5, category: "惰性气体", color: "#D3D3D3" },
    
    // 第六行
    { atomicNumber: 55, symbol: "Cs", name: "铯", weight: 132.91, group: 1, period: 6, category: "碱金属", color: "#FFB6C1" },
    { atomicNumber: 56, symbol: "Ba", name: "钡", weight: 137.33, group: 2, period: 6, category: "碱土金属", color: "#FFA07A" },
    { atomicNumber: 57, symbol: "La", name: "镧", weight: 138.91, group: 3, period: 6, category: "镧系", color: "#DDA0DD" },
    { atomicNumber: 72, symbol: "Hf", name: "铪", weight: 178.49, group: 4, period: 6, category: "过渡金属", color: "#E6E6FA" },
    { atomicNumber: 73, symbol: "Ta", name: "钽", weight: 180.95, group: 5, period: 6, category: "过渡金属", color: "#E6E6FA" },
    { atomicNumber: 74, symbol: "W", name: "钨", weight: 183.84, group: 6, period: 6, category: "过渡金属", color: "#E6E6FA" },
    { atomicNumber: 75, symbol: "Re", name: "铼", weight: 186.21, group: 7, period: 6, category: "过渡金属", color: "#E6E6FA" },
    { atomicNumber: 76, symbol: "Os", name: "锇", weight: 190.23, group: 8, period: 6, category: "过渡金属", color: "#E6E6FA" },
    { atomicNumber: 77, symbol: "Ir", name: "铱", weight: 192.22, group: 9, period: 6, category: "过渡金属", color: "#E6E6FA" },
    { atomicNumber: 78, symbol: "Pt", name: "铂", weight: 195.08, group: 10, period: 6, category: "过渡金属", color: "#E6E6FA" },
    { atomicNumber: 79, symbol: "Au", name: "金", weight: 196.97, group: 11, period: 6, category: "过渡金属", color: "#E6E6FA" },
    { atomicNumber: 80, symbol: "Hg", name: "汞", weight: 200.59, group: 12, period: 6, category: "过渡金属", color: "#E6E6FA" },
    { atomicNumber: 81, symbol: "Tl", name: "铊", weight: 204.38, group: 13, period: 6, category: "贫金属", color: "#F0E68C" },
    { atomicNumber: 82, symbol: "Pb", name: "铅", weight: 207.2, group: 14, period: 6, category: "贫金属", color: "#F0E68C" },
    { atomicNumber: 83, symbol: "Bi", name: "铋", weight: 208.98, group: 15, period: 6, category: "贫金属", color: "#F0E68C" },
    { atomicNumber: 84, symbol: "Po", name: "钋", weight: 209, group: 16, period: 6, category: "类金属", color: "#98FB98" },
    { atomicNumber: 85, symbol: "At", name: "砹", weight: 210, group: 17, period: 6, category: "卤素", color: "#87CEEB" },
    { atomicNumber: 86, symbol: "Rn", name: "氡", weight: 222, group: 18, period: 6, category: "惰性气体", color: "#D3D3D3" },
    
    // 第七行
    { atomicNumber: 87, symbol: "Fr", name: "钫", weight: 223, group: 1, period: 7, category: "碱金属", color: "#FFB6C1" },
    { atomicNumber: 88, symbol: "Ra", name: "镭", weight: 226, group: 2, period: 7, category: "碱土金属", color: "#FFA07A" },
    { atomicNumber: 89, symbol: "Ac", name: "锕", weight: 227, group: 3, period: 7, category: "锕系", color: "#F0D0D0" },
    { atomicNumber: 104, symbol: "Rf", name: "𬬻", weight: 267, group: 4, period: 7, category: "过渡金属", color: "#E6E6FA" },
    { atomicNumber: 105, symbol: "Db", name: "𬭊", weight: 268, group: 5, period: 7, category: "过渡金属", color: "#E6E6FA" },
    { atomicNumber: 106, symbol: "Sg", name: "𬭳", weight: 271, group: 6, period: 7, category: "过渡金属", color: "#E6E6FA" },
    { atomicNumber: 107, symbol: "Bh", name: "𬭛", weight: 272, group: 7, period: 7, category: "过渡金属", color: "#E6E6FA" },
    { atomicNumber: 108, symbol: "Hs", name: "𬭶", weight: 270, group: 8, period: 7, category: "过渡金属", color: "#E6E6FA" },
    { atomicNumber: 109, symbol: "Mt", name: "鿏", weight: 276, group: 9, period: 7, category: "过渡金属", color: "#E6E6FA" },
    { atomicNumber: 110, symbol: "Ds", name: "𫟼", weight: 281, group: 10, period: 7, category: "过渡金属", color: "#E6E6FA" },
    { atomicNumber: 111, symbol: "Rg", name: "𬬭", weight: 280, group: 11, period: 7, category: "过渡金属", color: "#E6E6FA" },
    { atomicNumber: 112, symbol: "Cn", name: "鎶", weight: 285, group: 12, period: 7, category: "过渡金属", color: "#E6E6FA" },
    { atomicNumber: 113, symbol: "Nh", name: "鉨", weight: 284, group: 13, period: 7, category: "贫金属", color: "#F0E68C" },
    { atomicNumber: 114, symbol: "Fl", name: "𫓧", weight: 289, group: 14, period: 7, category: "贫金属", color: "#F0E68C" },
    { atomicNumber: 115, symbol: "Mc", name: "镆", weight: 288, group: 15, period: 7, category: "贫金属", color: "#F0E68C" },
    { atomicNumber: 116, symbol: "Lv", name: "𫟷", weight: 293, group: 16, period: 7, category: "贫金属", color: "#F0E68C" },
    { atomicNumber: 117, symbol: "Ts", name: "鿬", weight: 294, group: 17, period: 7, category: "卤素", color: "#87CEEB" },
    { atomicNumber: 118, symbol: "Og", name: "鿫", weight: 294, group: 18, period: 7, category: "惰性气体", color: "#D3D3D3" },
    
    // 镧系
    { atomicNumber: 58, symbol: "Ce", name: "铈", weight: 140.12, group: 4, period: 8, category: "镧系", color: "#DDA0DD" },
    { atomicNumber: 59, symbol: "Pr", name: "镨", weight: 140.91, group: 5, period: 8, category: "镧系", color: "#DDA0DD" },
    { atomicNumber: 60, symbol: "Nd", name: "钕", weight: 144.24, group: 6, period: 8, category: "镧系", color: "#DDA0DD" },
    { atomicNumber: 61, symbol: "Pm", name: "钷", weight: 145, group: 7, period: 8, category: "镧系", color: "#DDA0DD" },
    { atomicNumber: 62, symbol: "Sm", name: "钐", weight: 150.36, group: 8, period: 8, category: "镧系", color: "#DDA0DD" },
    { atomicNumber: 63, symbol: "Eu", name: "铕", weight: 151.96, group: 9, period: 8, category: "镧系", color: "#DDA0DD" },
    { atomicNumber: 64, symbol: "Gd", name: "钆", weight: 157.25, group: 10, period: 8, category: "镧系", color: "#DDA0DD" },
    { atomicNumber: 65, symbol: "Tb", name: "铽", weight: 158.93, group: 11, period: 8, category: "镧系", color: "#DDA0DD" },
    { atomicNumber: 66, symbol: "Dy", name: "镝", weight: 162.50, group: 12, period: 8, category: "镧系", color: "#DDA0DD" },
    { atomicNumber: 67, symbol: "Ho", name: "钬", weight: 164.93, group: 13, period: 8, category: "镧系", color: "#DDA0DD" },
    { atomicNumber: 68, symbol: "Er", name: "铒", weight: 167.26, group: 14, period: 8, category: "镧系", color: "#DDA0DD" },
    { atomicNumber: 69, symbol: "Tm", name: "铥", weight: 168.93, group: 15, period: 8, category: "镧系", color: "#DDA0DD" },
    { atomicNumber: 70, symbol: "Yb", name: "镱", weight: 173.05, group: 16, period: 8, category: "镧系", color: "#DDA0DD" },
    { atomicNumber: 71, symbol: "Lu", name: "镥", weight: 174.97, group: 17, period: 8, category: "镧系", color: "#DDA0DD" },
    
    // 锕系
    { atomicNumber: 90, symbol: "Th", name: "钍", weight: 232.04, group: 4, period: 9, category: "锕系", color: "#F0D0D0" },
    { atomicNumber: 91, symbol: "Pa", name: "镤", weight: 231.04, group: 5, period: 9, category: "锕系", color: "#F0D0D0" },
    { atomicNumber: 92, symbol: "U", name: "铀", weight: 238.03, group: 6, period: 9, category: "锕系", color: "#F0D0D0" },
    { atomicNumber: 93, symbol: "Np", name: "镎", weight: 237, group: 7, period: 9, category: "锕系", color: "#F0D0D0" },
    { atomicNumber: 94, symbol: "Pu", name: "钚", weight: 244, group: 8, period: 9, category: "锕系", color: "#F0D0D0" },
    { atomicNumber: 95, symbol: "Am", name: "镅", weight: 243, group: 9, period: 9, category: "锕系", color: "#F0D0D0" },
    { atomicNumber: 96, symbol: "Cm", name: "锔", weight: 247, group: 10, period: 9, category: "锕系", color: "#F0D0D0" },
    { atomicNumber: 97, symbol: "Bk", name: "锫", weight: 247, group: 11, period: 9, category: "锕系", color: "#F0D0D0" },
    { atomicNumber: 98, symbol: "Cf", name: "锎", weight: 251, group: 12, period: 9, category: "锕系", color: "#F0D0D0" },
    { atomicNumber: 99, symbol: "Es", name: "锿", weight: 252, group: 13, period: 9, category: "锕系", color: "#F0D0D0" },
    { atomicNumber: 100, symbol: "Fm", name: "镄", weight: 257, group: 14, period: 9, category: "锕系", color: "#F0D0D0" },
    { atomicNumber: 101, symbol: "Md", name: "钔", weight: 258, group: 15, period: 9, category: "锕系", color: "#F0D0D0" },
    { atomicNumber: 102, symbol: "No", name: "锘", weight: 259, group: 16, period: 9, category: "锕系", color: "#F0D0D0" },
    { atomicNumber: 103, symbol: "Lr", name: "铹", weight: 262, group: 17, period: 9, category: "锕系", color: "#F0D0D0" },
  ];

  // 创建周期表布局矩阵
  const createPeriodicTable = () => {
    // 创建一个10x18的二维数组作为周期表的基础网格
    const table = Array(10).fill(null).map(() => Array(18).fill(null));
    
    elements.forEach(element => {
      let row = element.period - 1;
      let col = element.group - 1;
      
      // 特殊处理镧系和锕系元素
      if (element.category === "镧系") {
        row = 8; // 镧系放在第9行
        col = element.atomicNumber - 54; // 从第3列开始
      } else if (element.category === "锕系") {
        row = 9; // 锕系放在第10行
        col = element.atomicNumber - 86; // 从第3列开始
      }
      
      // 处理第一行特殊情况（氢和氦）
      if (element.period === 1) {
        if (element.atomicNumber === 1) {
          col = 0; // 氢在第1列
        } else if (element.atomicNumber === 2) {
          col = 17; // 氦在第18列
        }
      }
      
      // 填充表格
      if (row >= 0 && row < 10 && col >= 0 && col < 18) {
        table[row][col] = element;
      }
    });
    
    return table;
  };

  const periodicTable = createPeriodicTable();

  const handleElementClick = (element) => {
    setSelectedElement(element);
  };

  const closeElementInfo = () => {
    setSelectedElement(null);
  };

  return (
    <div className="periodic-table-page">
      <div className="page-header">
        <h1>元素周期表</h1>
        <p>点击元素查看详细信息</p>
      </div>
      
      <div className="periodic-table-container">
        {periodicTable.map((row, rowIndex) => (
          <div key={rowIndex} className="periodic-row">
            {row.map((element, colIndex) => (
              <div key={`${rowIndex}-${colIndex}`} className="cell">
                {element ? (
                  <div 
                    className={`element ${selectedElement?.atomicNumber === element.atomicNumber ? 'selected' : ''}`}
                    style={{ backgroundColor: element.color }}
                    onClick={() => handleElementClick(element)}
                    title={`${element.name} (${element.symbol})`}
                  >
                    <div className="atomic-number">{element.atomicNumber}</div>
                    <div className="symbol">{element.symbol}</div>
                    <div className="name">{element.name}</div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ))}
        
        {/* 添加分隔线以区分镧系和锕系 */}
        <div className="lanthanide-actinide-labels">
          <div className="series-label lanthanide-label">镧系</div>
          <div className="series-label actinide-label">锕系</div>
        </div>
      </div>
      
      {selectedElement && (
        <div className="element-modal" onClick={closeElementInfo}>
          <div className="element-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeElementInfo}>×</button>
            <h2>{selectedElement.name} ({selectedElement.symbol})</h2>
            <div className="element-details">
              <p><strong>原子序数:</strong> {selectedElement.atomicNumber}</p>
              <p><strong>原子量:</strong> {selectedElement.weight}</p>
              <p><strong>周期:</strong> {selectedElement.period}</p>
              <p><strong>族:</strong> {selectedElement.group}</p>
              <p><strong>分类:</strong> {selectedElement.category}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="legend">
        <h3>元素分类</h3>
        <div className="legend-items">
          <div className="legend-item">
            <div className="color-box" style={{ backgroundColor: "#FFB6C1" }}></div>
            <span>碱金属</span>
          </div>
          <div className="legend-item">
            <div className="color-box" style={{ backgroundColor: "#FFA07A" }}></div>
            <span>碱土金属</span>
          </div>
          <div className="legend-item">
            <div className="color-box" style={{ backgroundColor: "#E6E6FA" }}></div>
            <span>过渡金属</span>
          </div>
          <div className="legend-item">
            <div className="color-box" style={{ backgroundColor: "#DDA0DD" }}></div>
            <span>镧系</span>
          </div>
          <div className="legend-item">
            <div className="color-box" style={{ backgroundColor: "#F0D0D0" }}></div>
            <span>锕系</span>
          </div>
          <div className="legend-item">
            <div className="color-box" style={{ backgroundColor: "#F0E68C" }}></div>
            <span>贫金属</span>
          </div>
          <div className="legend-item">
            <div className="color-box" style={{ backgroundColor: "#98FB98" }}></div>
            <span>类金属</span>
          </div>
          <div className="legend-item">
            <div className="color-box" style={{ backgroundColor: "#FFCCCB" }}></div>
            <span>非金属</span>
          </div>
          <div className="legend-item">
            <div className="color-box" style={{ backgroundColor: "#87CEEB" }}></div>
            <span>卤素</span>
          </div>
          <div className="legend-item">
            <div className="color-box" style={{ backgroundColor: "#D3D3D3" }}></div>
            <span>惰性气体</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeriodicTablePage;
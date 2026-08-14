import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  useWindowDimensions,
} from 'react-native';

const elements = [
  { atomicNumber: 1, symbol: 'H', name: '氢', weight: 1.008, group: 1, period: 1, category: '非金属', color: '#FFCCCB' },
  { atomicNumber: 2, symbol: 'He', name: '氦', weight: 4.0026, group: 18, period: 1, category: '惰性气体', color: '#D3D3D3' },
  { atomicNumber: 3, symbol: 'Li', name: '锂', weight: 6.94, group: 1, period: 2, category: '碱金属', color: '#FFB6C1' },
  { atomicNumber: 4, symbol: 'Be', name: '铍', weight: 9.0122, group: 2, period: 2, category: '碱土金属', color: '#FFA07A' },
  { atomicNumber: 5, symbol: 'B', name: '硼', weight: 10.81, group: 13, period: 2, category: '类金属', color: '#98FB98' },
  { atomicNumber: 6, symbol: 'C', name: '碳', weight: 12.011, group: 14, period: 2, category: '非金属', color: '#FFCCCB' },
  { atomicNumber: 7, symbol: 'N', name: '氮', weight: 14.007, group: 15, period: 2, category: '非金属', color: '#FFCCCB' },
  { atomicNumber: 8, symbol: 'O', name: '氧', weight: 15.999, group: 16, period: 2, category: '非金属', color: '#FFCCCB' },
  { atomicNumber: 9, symbol: 'F', name: '氟', weight: 18.998, group: 17, period: 2, category: '卤素', color: '#87CEEB' },
  { atomicNumber: 10, symbol: 'Ne', name: '氖', weight: 20.18, group: 18, period: 2, category: '惰性气体', color: '#D3D3D3' },
  { atomicNumber: 11, symbol: 'Na', name: '钠', weight: 22.99, group: 1, period: 3, category: '碱金属', color: '#FFB6C1' },
  { atomicNumber: 12, symbol: 'Mg', name: '镁', weight: 24.305, group: 2, period: 3, category: '碱土金属', color: '#FFA07A' },
  { atomicNumber: 13, symbol: 'Al', name: '铝', weight: 26.982, group: 13, period: 3, category: '贫金属', color: '#F0E68C' },
  { atomicNumber: 14, symbol: 'Si', name: '硅', weight: 28.085, group: 14, period: 3, category: '类金属', color: '#98FB98' },
  { atomicNumber: 15, symbol: 'P', name: '磷', weight: 30.974, group: 15, period: 3, category: '非金属', color: '#FFCCCB' },
  { atomicNumber: 16, symbol: 'S', name: '硫', weight: 32.06, group: 16, period: 3, category: '非金属', color: '#FFCCCB' },
  { atomicNumber: 17, symbol: 'Cl', name: '氯', weight: 35.45, group: 17, period: 3, category: '卤素', color: '#87CEEB' },
  { atomicNumber: 18, symbol: 'Ar', name: '氩', weight: 39.948, group: 18, period: 3, category: '惰性气体', color: '#D3D3D3' },
  { atomicNumber: 19, symbol: 'K', name: '钾', weight: 39.098, group: 1, period: 4, category: '碱金属', color: '#FFB6C1' },
  { atomicNumber: 20, symbol: 'Ca', name: '钙', weight: 40.078, group: 2, period: 4, category: '碱土金属', color: '#FFA07A' },
  { atomicNumber: 21, symbol: 'Sc', name: '钪', weight: 44.956, group: 3, period: 4, category: '过渡金属', color: '#E6E6FA' },
  { atomicNumber: 22, symbol: 'Ti', name: '钛', weight: 47.867, group: 4, period: 4, category: '过渡金属', color: '#E6E6FA' },
  { atomicNumber: 23, symbol: 'V', name: '钒', weight: 50.942, group: 5, period: 4, category: '过渡金属', color: '#E6E6FA' },
  { atomicNumber: 24, symbol: 'Cr', name: '铬', weight: 51.996, group: 6, period: 4, category: '过渡金属', color: '#E6E6FA' },
  { atomicNumber: 25, symbol: 'Mn', name: '锰', weight: 54.938, group: 7, period: 4, category: '过渡金属', color: '#E6E6FA' },
  { atomicNumber: 26, symbol: 'Fe', name: '铁', weight: 55.845, group: 8, period: 4, category: '过渡金属', color: '#E6E6FA' },
  { atomicNumber: 27, symbol: 'Co', name: '钴', weight: 58.933, group: 9, period: 4, category: '过渡金属', color: '#E6E6FA' },
  { atomicNumber: 28, symbol: 'Ni', name: '镍', weight: 58.693, group: 10, period: 4, category: '过渡金属', color: '#E6E6FA' },
  { atomicNumber: 29, symbol: 'Cu', name: '铜', weight: 63.546, group: 11, period: 4, category: '过渡金属', color: '#E6E6FA' },
  { atomicNumber: 30, symbol: 'Zn', name: '锌', weight: 65.38, group: 12, period: 4, category: '过渡金属', color: '#E6E6FA' },
  { atomicNumber: 31, symbol: 'Ga', name: '镓', weight: 69.723, group: 13, period: 4, category: '贫金属', color: '#F0E68C' },
  { atomicNumber: 32, symbol: 'Ge', name: '锗', weight: 72.63, group: 14, period: 4, category: '类金属', color: '#98FB98' },
  { atomicNumber: 33, symbol: 'As', name: '砷', weight: 74.922, group: 15, period: 4, category: '类金属', color: '#98FB98' },
  { atomicNumber: 34, symbol: 'Se', name: '硒', weight: 78.971, group: 16, period: 4, category: '非金属', color: '#FFCCCB' },
  { atomicNumber: 35, symbol: 'Br', name: '溴', weight: 79.904, group: 17, period: 4, category: '卤素', color: '#87CEEB' },
  { atomicNumber: 36, symbol: 'Kr', name: '氪', weight: 83.798, group: 18, period: 4, category: '惰性气体', color: '#D3D3D3' },
  { atomicNumber: 37, symbol: 'Rb', name: '铷', weight: 85.468, group: 1, period: 5, category: '碱金属', color: '#FFB6C1' },
  { atomicNumber: 38, symbol: 'Sr', name: '锶', weight: 87.62, group: 2, period: 5, category: '碱土金属', color: '#FFA07A' },
  { atomicNumber: 39, symbol: 'Y', name: '钇', weight: 88.906, group: 3, period: 5, category: '过渡金属', color: '#E6E6FA' },
  { atomicNumber: 40, symbol: 'Zr', name: '锆', weight: 91.224, group: 4, period: 5, category: '过渡金属', color: '#E6E6FA' },
  { atomicNumber: 41, symbol: 'Nb', name: '铌', weight: 92.906, group: 5, period: 5, category: '过渡金属', color: '#E6E6FA' },
  { atomicNumber: 42, symbol: 'Mo', name: '钼', weight: 95.95, group: 6, period: 5, category: '过渡金属', color: '#E6E6FA' },
  { atomicNumber: 43, symbol: 'Tc', name: '锝', weight: 98, group: 7, period: 5, category: '过渡金属', color: '#E6E6FA' },
  { atomicNumber: 44, symbol: 'Ru', name: '钌', weight: 101.07, group: 8, period: 5, category: '过渡金属', color: '#E6E6FA' },
  { atomicNumber: 45, symbol: 'Rh', name: '铑', weight: 102.91, group: 9, period: 5, category: '过渡金属', color: '#E6E6FA' },
  { atomicNumber: 46, symbol: 'Pd', name: '钯', weight: 106.42, group: 10, period: 5, category: '过渡金属', color: '#E6E6FA' },
  { atomicNumber: 47, symbol: 'Ag', name: '银', weight: 107.87, group: 11, period: 5, category: '过渡金属', color: '#E6E6FA' },
  { atomicNumber: 48, symbol: 'Cd', name: '镉', weight: 112.41, group: 12, period: 5, category: '过渡金属', color: '#E6E6FA' },
  { atomicNumber: 49, symbol: 'In', name: '铟', weight: 114.82, group: 13, period: 5, category: '贫金属', color: '#F0E68C' },
  { atomicNumber: 50, symbol: 'Sn', name: '锡', weight: 118.71, group: 14, period: 5, category: '贫金属', color: '#F0E68C' },
  { atomicNumber: 51, symbol: 'Sb', name: '锑', weight: 121.76, group: 15, period: 5, category: '类金属', color: '#98FB98' },
  { atomicNumber: 52, symbol: 'Te', name: '碲', weight: 127.6, group: 16, period: 5, category: '类金属', color: '#98FB98' },
  { atomicNumber: 53, symbol: 'I', name: '碘', weight: 126.9, group: 17, period: 5, category: '卤素', color: '#87CEEB' },
  { atomicNumber: 54, symbol: 'Xe', name: '氙', weight: 131.29, group: 18, period: 5, category: '惰性气体', color: '#D3D3D3' },
  { atomicNumber: 55, symbol: 'Cs', name: '铯', weight: 132.91, group: 1, period: 6, category: '碱金属', color: '#FFB6C1' },
  { atomicNumber: 56, symbol: 'Ba', name: '钡', weight: 137.33, group: 2, period: 6, category: '碱土金属', color: '#FFA07A' },
  { atomicNumber: 57, symbol: 'La', name: '镧', weight: 138.91, group: 3, period: 6, category: '镧系', color: '#DDA0DD' },
  { atomicNumber: 72, symbol: 'Hf', name: '铪', weight: 178.49, group: 4, period: 6, category: '过渡金属', color: '#E6E6FA' },
  { atomicNumber: 73, symbol: 'Ta', name: '钽', weight: 180.95, group: 5, period: 6, category: '过渡金属', color: '#E6E6FA' },
  { atomicNumber: 74, symbol: 'W', name: '钨', weight: 183.84, group: 6, period: 6, category: '过渡金属', color: '#E6E6FA' },
  { atomicNumber: 75, symbol: 'Re', name: '铼', weight: 186.21, group: 7, period: 6, category: '过渡金属', color: '#E6E6FA' },
  { atomicNumber: 76, symbol: 'Os', name: '锇', weight: 190.23, group: 8, period: 6, category: '过渡金属', color: '#E6E6FA' },
  { atomicNumber: 77, symbol: 'Ir', name: '铱', weight: 192.22, group: 9, period: 6, category: '过渡金属', color: '#E6E6FA' },
  { atomicNumber: 78, symbol: 'Pt', name: '铂', weight: 195.08, group: 10, period: 6, category: '过渡金属', color: '#E6E6FA' },
  { atomicNumber: 79, symbol: 'Au', name: '金', weight: 196.97, group: 11, period: 6, category: '过渡金属', color: '#E6E6FA' },
  { atomicNumber: 80, symbol: 'Hg', name: '汞', weight: 200.59, group: 12, period: 6, category: '过渡金属', color: '#E6E6FA' },
  { atomicNumber: 81, symbol: 'Tl', name: '铊', weight: 204.38, group: 13, period: 6, category: '贫金属', color: '#F0E68C' },
  { atomicNumber: 82, symbol: 'Pb', name: '铅', weight: 207.2, group: 14, period: 6, category: '贫金属', color: '#F0E68C' },
  { atomicNumber: 83, symbol: 'Bi', name: '铋', weight: 208.98, group: 15, period: 6, category: '贫金属', color: '#F0E68C' },
  { atomicNumber: 84, symbol: 'Po', name: '钋', weight: 209, group: 16, period: 6, category: '类金属', color: '#98FB98' },
  { atomicNumber: 85, symbol: 'At', name: '砹', weight: 210, group: 17, period: 6, category: '卤素', color: '#87CEEB' },
  { atomicNumber: 86, symbol: 'Rn', name: '氡', weight: 222, group: 18, period: 6, category: '惰性气体', color: '#D3D3D3' },
  { atomicNumber: 87, symbol: 'Fr', name: '钫', weight: 223, group: 1, period: 7, category: '碱金属', color: '#FFB6C1' },
  { atomicNumber: 88, symbol: 'Ra', name: '镭', weight: 226, group: 2, period: 7, category: '碱土金属', color: '#FFA07A' },
  { atomicNumber: 89, symbol: 'Ac', name: '锕', weight: 227, group: 3, period: 7, category: '锕系', color: '#F0D0D0' },
  { atomicNumber: 104, symbol: 'Rf', name: '𬬻', weight: 267, group: 4, period: 7, category: '过渡金属', color: '#E6E6FA' },
  { atomicNumber: 105, symbol: 'Db', name: '𬭊', weight: 268, group: 5, period: 7, category: '过渡金属', color: '#E6E6FA' },
  { atomicNumber: 106, symbol: 'Sg', name: '𬭳', weight: 269, group: 6, period: 7, category: '过渡金属', color: '#E6E6FA' },
  { atomicNumber: 107, symbol: 'Bh', name: ' Complementary', weight: 270, group: 7, period: 7, category: '过渡金属', color: '#E6E6FA' },
  { atomicNumber: 108, symbol: 'Hs', name: '𬭶', weight: 269, group: 8, period: 7, category: '过渡金属', color: '#E6E6FA' },
  { atomicNumber: 109, symbol: 'Mt', name: '鿏', weight: 278, group: 9, period: 7, category: '过渡金属', color: '#E6E6FA' },
  { atomicNumber: 110, symbol: 'Ds', name: '𫟼', weight: 281, group: 10, period: 7, category: '过渡金属', color: '#E6E6FA' },
  { atomicNumber: 111, symbol: 'Rg', name: '𬬭', weight: 282, group: 11, period: 7, category: '过渡金属', color: '#E6E6FA' },
  { atomicNumber: 112, symbol: 'Cn', name: '鿔', weight: 285, group: 12, period: 7, category: '过渡金属', color: '#E6E6FA' },
  { atomicNumber: 113, symbol: 'Nh', name: '鿭', weight: 286, group: 13, period: 7, category: '贫金属', color: '#F0E68C' },
  { atomicNumber: 114, symbol: 'Fl', name: '𫓧', weight: 289, group: 14, period: 7, category: '贫金属', color: '#F0E68C' },
  { atomicNumber: 115, symbol: 'Mc', name: '镆', weight: 289, group: 15, period: 7, category: '贫金属', color: '#F0E68C' },
  { atomicNumber: 116, symbol: 'Lv', name: '鉝', weight: 293, group: 16, period: 7, category: '贫金属', color: '#F0E68C' },
  { atomicNumber: 117, symbol: 'Ts', name: '鿬', weight: 294, group: 17, period: 7, category: '卤素', color: '#87CEEB' },
  { atomicNumber: 118, symbol: 'Og', name: '鿫', weight: 294, group: 18, period: 7, category: '惰性气体', color: '#D3D3D3' },
  { atomicNumber: 58, symbol: 'Ce', name: '铈', weight: 140.12, group: 4, period: 8, category: '镧系', color: '#DDA0DD' },
  { atomicNumber: 59, symbol: 'Pr', name: '镨', weight: 140.91, group: 5, period: 8, category: '镧系', color: '#DDA0DD' },
  { atomicNumber: 60, symbol: 'Nd', name: '钕', weight: 144.24, group: 6, period: 8, category: '镧系', color: '#DDA0DD' },
  { atomicNumber: 61, symbol: 'Pm', name: '钷', weight: 145, group: 7, period: 8, category: '镧系', color: '#DDA0DD' },
  { atomicNumber: 62, symbol: 'Sm', name: '钐', weight: 150.36, group: 8, period: 8, category: '镧系', color: '#DDA0DD' },
  { atomicNumber: 63, symbol: 'Eu', name: '铕', weight: 151.96, group: 9, period: 8, category: '镧系', color: '#DDA0DD' },
  { atomicNumber: 64, symbol: 'Gd', name: '钆', weight: 157.25, group: 10, period: 8, category: '镧系', color: '#DDA0DD' },
  { atomicNumber: 65, symbol: 'Tb', name: '铽', weight: 158.93, group: 11, period: 8, category: '镧系', color: '#DDA0DD' },
  { atomicNumber: 66, symbol: 'Dy', name: '镝', weight: 162.5, group: 12, period: 8, category: '镧系', color: '#DDA0DD' },
  { atomicNumber: 67, symbol: 'Ho', name: '钬', weight: 164.93, group: 13, period: 8, category: '镧系', color: '#DDA0DD' },
  { atomicNumber: 68, symbol: 'Er', name: '铒', weight: 167.26, group: 14, period: 8, category: '镧系', color: '#DDA0DD' },
  { atomicNumber: 69, symbol: 'Tm', name: '铥', weight: 168.93, group: 15, period: 8, category: '镧系', color: '#DDA0DD' },
  { atomicNumber: 70, symbol: 'Yb', name: '镱', weight: 173.05, group: 16, period: 8, category: '镧系', color: '#DDA0DD' },
  { atomicNumber: 71, symbol: 'Lu', name: '镥', weight: 174.97, group: 17, period: 8, category: '镧系', color: '#DDA0DD' },
  { atomicNumber: 90, symbol: 'Th', name: '钍', weight: 232.04, group: 4, period: 9, category: '锕系', color: '#F0D0D0' },
  { atomicNumber: 91, symbol: 'Pa', name: '镤', weight: 231.04, group: 5, period: 9, category: '锕系', color: '#F0D0D0' },
  { atomicNumber: 92, symbol: 'U', name: '铀', weight: 238.03, group: 6, period: 9, category: '锕系', color: '#F0D0D0' },
  { atomicNumber: 93, symbol: 'Np', name: '镎', weight: 237, group: 7, period: 9, category: '锕系', color: '#F0D0D0' },
  { atomicNumber: 94, symbol: 'Pu', name: '钚', weight: 244, group: 8, period: 9, category: '锕系', color: '#F0D0D0' },
  { atomicNumber: 95, symbol: 'Am', name: '镅', weight: 243, group: 9, period: 9, category: '锕系', color: '#F0D0D0' },
  { atomicNumber: 96, symbol: 'Cm', name: '锔', weight: 247, group: 10, period: 9, category: '锕系', color: '#F0D0D0' },
  { atomicNumber: 97, symbol: 'Bk', name: '锫', weight: 247, group: 11, period: 9, category: '锕系', color: '#F0D0D0' },
  { atomicNumber: 98, symbol: 'Cf', name: '锎', weight: 251, group: 12, period: 9, category: '锕系', color: '#F0D0D0' },
  { atomicNumber: 99, symbol: 'Es', name: '锿', weight: 252, group: 13, period: 9, category: '锕系', color: '#F0D0D0' },
  { atomicNumber: 100, symbol: 'Fm', name: '镄', weight: 257, group: 14, period: 9, category: '锕系', color: '#F0D0D0' },
  { atomicNumber: 101, symbol: 'Md', name: '钔', weight: 258, group: 15, period: 9, category: '锕系', color: '#F0D0D0' },
  { atomicNumber: 102, symbol: 'No', name: '锘', weight: 259, group: 16, period: 9, category: '锕系', color: '#F0D0D0' },
  { atomicNumber: 103, symbol: 'Lr', name: '铹', weight: 262, group: 17, period: 9, category: '锕系', color: '#F0D0D0' },
];

const legendItems = [
  { color: '#FFB6C1', label: '碱金属' },
  { color: '#FFA07A', label: '碱土金属' },
  { color: '#E6E6FA', label: '过渡金属' },
  { color: '#DDA0DD', label: '镧系' },
  { color: '#F0D0D0', label: '锕系' },
  { color: '#F0E68C', label: '贫金属' },
  { color: '#98FB98', label: '类金属' },
  { color: '#FFCCCB', label: '非金属' },
  { color: '#87CEEB', label: '卤素' },
  { color: '#D3D3D3', label: '惰性气体' },
];

const COLS = 18;
const ROWS = 10;
const BASE_CELL = 44;
const SERIES_GAP = 10;
const CONTENT_PAD = 8;
const MAX_SCALE = 3;

function createPeriodicTable() {
  const table = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  elements.forEach((element) => {
    let row = element.period - 1;
    let col = element.group - 1;
    if (element.category === '镧系' && element.atomicNumber >= 58) {
      row = 8;
      col = element.atomicNumber - 54;
    } else if (element.category === '锕系' && element.atomicNumber >= 90) {
      row = 9;
      col = element.atomicNumber - 86;
    }
    if (element.atomicNumber === 57) {
      row = 5;
      col = 2;
    }
    if (element.atomicNumber === 89) {
      row = 6;
      col = 2;
    }
    if (element.period === 1) {
      if (element.atomicNumber === 1) col = 0;
      else if (element.atomicNumber === 2) col = 17;
    }
    if (row >= 0 && row < ROWS && col >= 0 && col < COLS) {
      table[row][col] = element;
    }
  });
  return table;
}

const periodicTable = createPeriodicTable();

const TABLE_W = BASE_CELL * COLS;
const TABLE_H = BASE_CELL * 1.15 * ROWS + SERIES_GAP;
const LEGEND_H = 120;
const CONTENT_W = TABLE_W + CONTENT_PAD * 2;
const CONTENT_H = TABLE_H + LEGEND_H + 40;

function distance(a, b) {
  const dx = a.pageX - b.pageX;
  const dy = a.pageY - b.pageY;
  return Math.sqrt(dx * dx + dy * dy);
}

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

/**
 * Pinch-zoom + pan canvas (no extra native deps).
 */
function ZoomPanViewport({
  children,
  contentWidth,
  contentHeight,
  viewportWidth,
  viewportHeight,
  minScale,
  maxScale,
  initialScale,
  resetKey,
}) {
  const [scale, setScale] = useState(initialScale);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);

  const scaleRef = useRef(initialScale);
  const txRef = useRef(0);
  const tyRef = useRef(0);
  const modeRef = useRef(null); // 'pan' | 'pinch'
  const pinchStartDist = useRef(0);
  const pinchStartScale = useRef(1);
  const panStart = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const lastTap = useRef(0);

  const boundsFor = useCallback(
    (s) => {
      const scaledW = contentWidth * s;
      const scaledH = contentHeight * s;
      let minX;
      let maxX;
      let minY;
      let maxY;
      if (scaledW <= viewportWidth) {
        const cx = (viewportWidth - scaledW) / 2;
        minX = cx;
        maxX = cx;
      } else {
        minX = viewportWidth - scaledW;
        maxX = 0;
      }
      if (scaledH <= viewportHeight) {
        const cy = (viewportHeight - scaledH) / 2;
        minY = cy;
        maxY = cy;
      } else {
        minY = viewportHeight - scaledH;
        maxY = 0;
      }
      return { minX, maxX, minY, maxY };
    },
    [contentWidth, contentHeight, viewportWidth, viewportHeight],
  );

  const applyTransform = useCallback(
    (s, x, y) => {
      const b = boundsFor(s);
      const nx = clamp(x, b.minX, b.maxX);
      const ny = clamp(y, b.minY, b.maxY);
      scaleRef.current = s;
      txRef.current = nx;
      tyRef.current = ny;
      setScale(s);
      setTx(nx);
      setTy(ny);
    },
    [boundsFor],
  );

  const centerAtScale = useCallback(
    (s) => {
      const b = boundsFor(s);
      applyTransform(s, (b.minX + b.maxX) / 2, (b.minY + b.maxY) / 2);
    },
    [boundsFor, applyTransform],
  );

  // Reset when orientation / fit scale changes
  useEffect(() => {
    centerAtScale(initialScale);
  }, [resetKey, initialScale, centerAtScale]);

  const zoomBy = (factor) => {
    const next = clamp(scaleRef.current * factor, minScale, maxScale);
    const cx = viewportWidth / 2;
    const cy = viewportHeight / 2;
    const contentX = (cx - txRef.current) / scaleRef.current;
    const contentY = (cy - tyRef.current) / scaleRef.current;
    applyTransform(next, cx - contentX * next, cy - contentY * next);
  };

  const resetZoom = () => centerAtScale(initialScale);

  const movedRef = useRef(false);

  const onTouchStart = (e) => {
    const touches = e.nativeEvent.touches;
    movedRef.current = false;
    if (touches.length >= 2) {
      modeRef.current = 'pinch';
      pinchStartDist.current = distance(touches[0], touches[1]);
      pinchStartScale.current = scaleRef.current;
    } else if (touches.length === 1) {
      modeRef.current = 'pan';
      panStart.current = {
        x: touches[0].pageX,
        y: touches[0].pageY,
        tx: txRef.current,
        ty: tyRef.current,
      };
    }
  };

  const onTouchMove = (e) => {
    const touches = e.nativeEvent.touches;
    if (modeRef.current === 'pinch' && touches.length >= 2) {
      movedRef.current = true;
      const dist = distance(touches[0], touches[1]);
      if (pinchStartDist.current <= 0) return;
      const next = clamp(
        pinchStartScale.current * (dist / pinchStartDist.current),
        minScale,
        maxScale,
      );
      const contentX = (viewportWidth / 2 - txRef.current) / scaleRef.current;
      const contentY = (viewportHeight / 2 - tyRef.current) / scaleRef.current;
      applyTransform(
        next,
        viewportWidth / 2 - contentX * next,
        viewportHeight / 2 - contentY * next,
      );
    } else if (modeRef.current === 'pan' && touches.length === 1) {
      const dx = touches[0].pageX - panStart.current.x;
      const dy = touches[0].pageY - panStart.current.y;
      if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
        movedRef.current = true;
      }
      if (movedRef.current) {
        applyTransform(
          scaleRef.current,
          panStart.current.tx + dx,
          panStart.current.ty + dy,
        );
      }
    }
  };

  const onTouchEnd = (e) => {
    const remaining = e.nativeEvent.touches;
    if (remaining.length === 0) {
      if (!movedRef.current && modeRef.current === 'pan') {
        const now = Date.now();
        if (now - lastTap.current < 280) {
          resetZoom();
          lastTap.current = 0;
        } else {
          lastTap.current = now;
        }
      }
      modeRef.current = null;
    } else if (remaining.length === 1) {
      modeRef.current = 'pan';
      const t = remaining[0];
      panStart.current = {
        x: t.pageX,
        y: t.pageY,
        tx: txRef.current,
        ty: tyRef.current,
      };
    }
  };

  return (
    <View style={styles.viewport}>
      <View
        style={styles.gestureLayer}
        onStartShouldSetResponder={() => false}
        onMoveShouldSetResponder={(e) => {
          const touches = e.nativeEvent.touches;
          if (touches.length >= 2) return true;
          if (modeRef.current === 'pan' && movedRef.current) return true;
          const t = touches[0];
          if (!t) return false;
          const dx = Math.abs(t.pageX - panStart.current.x);
          const dy = Math.abs(t.pageY - panStart.current.y);
          return dx > 8 || dy > 8;
        }}
        onStartShouldSetResponderCapture={(e) => e.nativeEvent.touches.length >= 2}
        onMoveShouldSetResponderCapture={(e) => e.nativeEvent.touches.length >= 2}
        onResponderTerminationRequest={() => false}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
        onResponderGrant={onTouchStart}
        onResponderMove={onTouchMove}
        onResponderRelease={onTouchEnd}
        onResponderTerminate={onTouchEnd}
      >
        <View
          style={{
            width: contentWidth,
            height: contentHeight,
            transform: [
              { translateX: tx },
              { translateY: ty },
              { translateX: contentWidth / 2 },
              { translateY: contentHeight / 2 },
              { scale },
              { translateX: -contentWidth / 2 },
              { translateY: -contentHeight / 2 },
            ],
          }}
          pointerEvents="box-none"
        >
          {children}
        </View>
      </View>

      <View style={styles.zoomBar} pointerEvents="box-none">
        <TouchableOpacity style={styles.zoomBtn} onPress={() => zoomBy(1 / 1.25)}>
          <Text style={styles.zoomBtnText}>−</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.zoomBtn} onPress={resetZoom}>
          <Text style={styles.zoomBtnText}>{Math.round(scale * 100)}%</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.zoomBtn} onPress={() => zoomBy(1.25)}>
          <Text style={styles.zoomBtnText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function PeriodicTableScreen() {
  const { width: screenW, height: screenH } = useWindowDimensions();
  const [selectedElement, setSelectedElement] = useState(null);
  const [viewportSize, setViewportSize] = useState({ w: screenW, h: screenH });

  const isPortrait = screenH >= screenW;

  const fit = useMemo(() => {
    const availW = Math.max(1, viewportSize.w || screenW);
    const availH = Math.max(120, viewportSize.h || screenH - 36);
    const fitW = availW / CONTENT_W;
    const fitH = availH / CONTENT_H;
    // Landscape: fit entire table; Portrait: fit width, pan for height
    const fitAll = Math.min(fitW, fitH);
    const initialScale = isPortrait
      ? clamp(fitW, 0.35, 1.25)
      : clamp(fitAll, 0.25, 1.6);
    const minScale = clamp(Math.min(fitAll, fitW) * 0.8, 0.2, initialScale);
    return { initialScale, minScale, availW, availH };
  }, [screenW, screenH, viewportSize, isPortrait]);

  const cellW = BASE_CELL;
  const cellH = BASE_CELL * 1.15;
  const font = {
    z: 9,
    symbol: 14,
    name: 8,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.hint}>
        {isPortrait
          ? '竖屏适配宽度 · 双指缩放 / 拖动 / 双击复位'
          : '横屏适配全表 · 双指缩放 / 按钮调节'}
      </Text>

      <View
        style={styles.viewportHost}
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          setViewportSize({ w: width, h: height });
        }}
      >
        <ZoomPanViewport
          contentWidth={CONTENT_W}
          contentHeight={CONTENT_H}
          viewportWidth={fit.availW}
          viewportHeight={fit.availH}
          minScale={fit.minScale}
          maxScale={MAX_SCALE}
          initialScale={fit.initialScale}
          resetKey={`${isPortrait ? 'p' : 'l'}-${Math.round(fit.availW)}x${Math.round(fit.availH)}`}
        >
          <View style={{ padding: CONTENT_PAD, width: CONTENT_W }}>
            <View style={{ width: TABLE_W }}>
              {periodicTable.map((row, rowIndex) => (
                <View
                  key={rowIndex}
                  style={[styles.row, rowIndex === 8 && { marginTop: SERIES_GAP }]}
                >
                  {row.map((element, colIndex) => (
                    <TouchableOpacity
                      key={`${rowIndex}-${colIndex}`}
                      style={{ width: cellW, height: cellH, padding: 1 }}
                      activeOpacity={element ? 0.65 : 1}
                      disabled={!element}
                      onPress={() => element && setSelectedElement(element)}
                    >
                      {element ? (
                        <View
                          style={[
                            styles.elementBox,
                            { backgroundColor: element.color },
                            selectedElement?.atomicNumber ===
                              element.atomicNumber && styles.selected,
                          ]}
                        >
                          <Text style={[styles.atomicNumber, { fontSize: font.z }]}>
                            {element.atomicNumber}
                          </Text>
                          <Text style={[styles.symbol, { fontSize: font.symbol }]}>
                            {element.symbol}
                          </Text>
                          <Text
                            style={[styles.name, { fontSize: font.name }]}
                            numberOfLines={1}
                          >
                            {element.name}
                          </Text>
                        </View>
                      ) : (
                        <View style={styles.emptyCell} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </View>

            <View style={[styles.legend, { width: TABLE_W }]}>
              <Text style={styles.legendTitle}>元素分类</Text>
              <View style={styles.legendGrid}>
                {legendItems.map((item, i) => (
                  <View key={i} style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                    <Text style={styles.legendLabel}>{item.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ZoomPanViewport>
      </View>

      <Modal
        visible={!!selectedElement}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedElement(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSelectedElement(null)}
        >
          <View
            style={[styles.modalContent, { width: Math.min(screenW - 48, 360) }]}
            onStartShouldSetResponder={() => true}
          >
            {selectedElement && (
              <>
                <View
                  style={[
                    styles.modalSwatch,
                    { backgroundColor: selectedElement.color },
                  ]}
                >
                  <Text style={styles.modalSwatchZ}>{selectedElement.atomicNumber}</Text>
                  <Text style={styles.modalSwatchSymbol}>{selectedElement.symbol}</Text>
                </View>
                <Text style={styles.modalTitle}>
                  {selectedElement.name} ({selectedElement.symbol})
                </Text>
                <View style={styles.detailGrid}>
                  <DetailRow label="原子序数" value={String(selectedElement.atomicNumber)} />
                  <DetailRow label="原子量" value={String(selectedElement.weight)} />
                  <DetailRow
                    label="周期"
                    value={String(
                      selectedElement.period <= 7
                        ? selectedElement.period
                        : selectedElement.category,
                    )}
                  />
                  <DetailRow label="族" value={String(selectedElement.group)} />
                  <DetailRow label="分类" value={selectedElement.category} />
                </View>
                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => setSelectedElement(null)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.closeBtnText}>关闭</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

function DetailRow({ label, value }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  hint: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  viewportHost: {
    flex: 1,
  },
  viewport: {
    flex: 1,
    overflow: 'hidden',
  },
  gestureLayer: {
    flex: 1,
  },
  zoomBar: {
    position: 'absolute',
    right: 12,
    bottom: 16,
    flexDirection: 'row',
    gap: 8,
  },
  zoomBtn: {
    minWidth: 44,
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  zoomBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
  },
  elementBox: {
    flex: 1,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 1,
  },
  emptyCell: {
    flex: 1,
  },
  selected: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  atomicNumber: {
    color: '#333',
    fontWeight: '600',
    lineHeight: 12,
  },
  symbol: {
    fontWeight: '700',
    color: '#222',
    lineHeight: 18,
  },
  name: {
    color: '#555',
    lineHeight: 11,
  },
  legend: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginTop: 14,
    borderRadius: 12,
    padding: 14,
  },
  legendTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 10,
  },
  legendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minWidth: '40%',
  },
  legendColor: {
    width: 14,
    height: 14,
    borderRadius: 3,
  },
  legendLabel: {
    fontSize: 12,
    color: '#ddd',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 22,
    alignItems: 'center',
  },
  modalSwatch: {
    width: 72,
    height: 72,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalSwatchZ: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  modalSwatchSymbol: {
    fontSize: 28,
    fontWeight: '700',
    color: '#222',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  detailGrid: {
    width: '100%',
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  detailLabel: {
    fontSize: 15,
    color: '#666',
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  closeBtn: {
    marginTop: 18,
    backgroundColor: '#007AFF',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 20,
  },
  closeBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

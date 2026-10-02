// 法式手繪插畫：鬆散的墨線 + 錯位的水彩色塊 + 紙張顆粒（8 個類別 + 金幣 + 口金包圖示）
// 配色取自巴洛克油畫：赭金、朱紅、橄欖綠、灰藍、象牙、深棕
// 每張圖都是 100×100；fills = 色塊層（略微錯位），lines = 墨線層
'use strict';

const ART_DEFS = `
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <defs>
    <filter id="wash" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="2" result="lo"/>
      <feDisplacementMap in="SourceGraphic" in2="lo" scale="3" xChannelSelector="R" yChannelSelector="G" result="d"/>
      <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="7" result="hi"/>
      <feColorMatrix in="hi" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -1.6 0.8" result="light"/>
      <feComposite in="light" in2="d" operator="in" result="lightOn"/>
      <feColorMatrix in="hi" type="matrix" values="0 0 0 0 0.15  0 0 0 0 0.1  0 0 0 0 0.05  0 0 0 1.4 -0.95" result="dark"/>
      <feComposite in="dark" in2="d" operator="in" result="darkOn"/>
      <feMerge><feMergeNode in="d"/><feMergeNode in="lightOn"/><feMergeNode in="darkOn"/></feMerge>
    </filter>
    <filter id="ink" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="11" result="lo"/>
      <feDisplacementMap in="SourceGraphic" in2="lo" scale="1.8" xChannelSelector="R" yChannelSelector="G" result="d"/>
      <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="1" seed="5" result="hi"/>
      <feColorMatrix in="hi" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1.3 0.05" result="grain"/>
      <feComposite in="d" in2="grain" operator="in"/>
    </filter>
  </defs>
</svg>`;

// 形狀小工具
const C = (cx, cy, r) => `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0 Z`;
const E = (cx, cy, rx, ry) => `M${cx - rx} ${cy} a${rx} ${ry} 0 1 0 ${2 * rx} 0 a${rx} ${ry} 0 1 0 ${-2 * rx} 0 Z`;
const R = (x, y, w, h) => `M${x} ${y} H${x + w} V${y + h} H${x} Z`;


const INK = '#241B15';
const PAL = {
  ochre: '#C8923E', gold: '#D4A64E', vermilion: '#B4432C', olive: '#6C7448', oliveLt: '#8E9466',
  slate: '#7D8FA0', slateLt: '#AFBCC4', ivory: '#F1E7D1', umber: '#7A4C2C', umberDk: '#4E3222',
  rose: '#C9877A', navy: '#2F3F57', lavender: '#8E7FA8', terracotta: '#B5643F',
};

/*
  每個部件：
  { d, f }          → 色塊（f = 顏色）
  { d, s, w, dash } → 彩色筆觸（畫在色塊層）
  { d, ink, iw }    → 墨線（ink: true）
  一個部件可以同時有 f 和 ink
  clip: 'id'        → 這個色塊只畫在某個形狀裡（例如條紋衫的條紋）
*/
const ART = {
  // 食：一杯咖啡歐蕾 + 可頌
  food: {
    clips: { cup: 'M24 50 H66 C66 68 58 78 45 78 C32 78 24 68 24 50 Z' },
    parts: [
      { d: 'M28 40 q-3 -5 0 -10 t0 -10', ink: true, iw: 1.3 },
      { d: 'M40 38 q-3 -5 0 -10 t0 -12', ink: true, iw: 1.3 },
      { d: 'M52 40 q-3 -5 0 -9 t0 -9', ink: true, iw: 1.3 },
      { d: E(46, 79, 36, 8), f: PAL.ivory, ink: true },
      { d: E(46, 78, 22, 4), ink: true, iw: 1.1 },
      { d: 'M65 54 C77 51 78 67 62 69', s: PAL.slate, w: 4.2, ink: true },
      { d: 'M24 50 H66 C66 68 58 78 45 78 C32 78 24 68 24 50 Z', f: PAL.slate, ink: true },
      { d: 'M20 57 H70', s: PAL.vermilion, w: 2.2, clip: 'cup' },
      { d: 'M20 61 H70', s: PAL.ivory, w: 1.2, clip: 'cup' },
      { d: E(45, 50, 21, 4.5), f: '#9A6A44', ink: true },
      { d: 'M48 49 q3 -2 6 0', s: '#E8D3B0', w: 1.4 },
      { d: 'M56 70 l3 -4 M52 74 l3 -4 M60 64 l2 -4', ink: true, iw: 1 },
      { d: 'M56 88 C56 64 94 64 96 88 C90 83 82 81 76 81 C70 81 62 83 56 88 Z', f: PAL.ochre, ink: true },
      { d: 'M66 83 C66 78 68 76 70 74.5 M76 81 V73.5 M86 83 C86 78 84 76 82 74.5', ink: true, iw: 1.1 },
      { d: 'M68 78 q8 -4 16 0', s: '#E7BE73', w: 1.6 },
    ],
  },
  // 衣：掛在衣架上的長袖條紋衫（衣架藏在衣服裡，只露出掛鉤）
  clothes: {
    clips: { shirt: 'M40 25 Q50 29 60 25 L72 28 C78 30 81 34 82 39 L88 80 L78 82 L71 49 L70 89 Q50 91 30 89 L29 49 L22 82 L12 80 L18 39 C19 34 22 30 28 28 Z' },
    parts: [
      { d: 'M50 26 V16 C50 11 55.5 9.5 57.5 12.5 C59.5 15.5 56.5 18.5 54.5 17.5', ink: true, iw: 1.5 },
      { d: 'M40 25 Q50 29 60 25 L72 28 C78 30 81 34 82 39 L88 80 L78 82 L71 49 L70 89 Q50 91 30 89 L29 49 L22 82 L12 80 L18 39 C19 34 22 30 28 28 Z', f: PAL.ivory, ink: true },
      { d: 'M0 36 H100 M0 43 H100 M0 50 H100 M0 57 H100 M0 64 H100 M0 71 H100 M0 78 H100', s: PAL.navy, w: 3, clip: 'shirt' },
      { d: 'M44.5 26.6 L50 23 L55.5 26.6', ink: true, iw: 1.2 },
      { d: 'M40 25 Q50 29 60 25', ink: true, iw: 1.6 },
      { d: 'M36 26.5 Q50 32.5 64 26.5', s: PAL.vermilion, w: 1.4 },
      { d: 'M29 49 Q31 70 30 89 M71 49 Q69 70 70 89', ink: true, iw: 0.9 },
      { d: 'M12 80 L22 82 L21.5 86 L11.5 84 Z M88 80 L78 82 L78.5 86 L88.5 84 Z', f: PAL.ivory, ink: true, iw: 1 },
      { d: 'M30 84.5 Q50 86.5 70 84.5', ink: true, iw: 0.8 },
    ],
  },
  // 住：法式小房子（鋅板斜屋頂、老虎窗、百葉窗、花台）
  home: {
    parts: [
      { d: R(63, 12, 8, 16), f: PAL.terracotta, ink: true },
      { d: R(62, 10, 10, 3), f: PAL.umber, ink: true, iw: 1.1 },
      { d: 'M17 41 L26 22 H74 L83 41 Z', f: PAL.slate, ink: true },
      { d: 'M33 23 L30 40 M41 23 L40 40 M59 23 L60 40 M67 23 L70 40', ink: true, iw: 0.7 },
      { d: 'M43 40 V31 a7 6 0 0 1 14 0 V40 Z', f: PAL.ivory, ink: true, iw: 1.3 },
      { d: 'M45.5 40 V32 a4.5 4 0 0 1 9 0 V40 Z', f: PAL.slateLt, ink: true, iw: 0.9 },
      { d: R(20, 41, 60, 49), f: PAL.ivory, ink: true },
      { d: 'M16 41 H84', ink: true, iw: 2.2 },
      { d: 'M21 46 h4 M21 52 h4 M21 58 h4 M21 64 h4 M21 70 h4 M21 76 h4 M21 82 h4 M75 46 h4 M75 52 h4 M75 58 h4 M75 64 h4 M75 70 h4 M75 76 h4 M75 82 h4', ink: true, iw: 0.7 },
      { d: `${R(23.5, 49, 4, 17)} ${R(38.5, 49, 4, 17)} ${R(57.5, 49, 4, 17)} ${R(72.5, 49, 4, 17)}`, f: PAL.olive, ink: true, iw: 1 },
      { d: `${R(28, 48, 10, 18)} ${R(62, 48, 10, 18)}`, f: PAL.slateLt, ink: true, iw: 1.3 },
      { d: 'M33 48 V66 M28 56 H38 M67 48 V66 M62 56 H72', ink: true, iw: 0.9 },
      { d: 'M30 51 l4 -3 M64 51 l4 -3', s: '#E6ECEE', w: 1.4 },
      { d: `${R(27, 66, 12, 4)} ${R(61, 66, 12, 4)}`, f: PAL.terracotta, ink: true, iw: 1 },
      { d: `${C(29.5, 65, 2)} ${C(33, 64, 2.2)} ${C(36.5, 65, 2)} ${C(63.5, 65, 2)} ${C(67, 64, 2.2)} ${C(70.5, 65, 2)}`, f: PAL.vermilion },
      { d: 'M43 90 V71 a7 7 0 0 1 14 0 V90 Z', f: '#4F5A36', ink: true },
      { d: 'M50 64 V90', ink: true, iw: 0.8 },
      { d: C(53.5, 79, 1.1), f: PAL.gold },
      { d: R(40, 89, 20, 3), f: '#D8CBB2', ink: true, iw: 1 },
      { d: `${C(16, 86, 5)} ${C(84, 86, 5)}`, f: PAL.olive, ink: true, iw: 0.9 },
    ],
  },
  // 行（交通）：復古偉士牌風格的小綿羊
  transport: {
    parts: [
      { d: C(30, 77, 9), f: '#3A2E26', ink: true, iw: 1.6 },
      { d: C(30, 77, 3.4), f: PAL.ivory, ink: true, iw: 0.9 },
      { d: C(77, 77, 9), f: '#3A2E26', ink: true, iw: 1.6 },
      { d: C(77, 77, 3.4), f: PAL.ivory, ink: true, iw: 0.9 },
      { d: 'M48 70 H68 L67 75 H49 Z', f: PAL.umberDk, ink: true, iw: 1.1 },
      { d: 'M12 73 C10 58 21 50 38 51 C47 52 51 58 51 66 L51 73 Z', f: PAL.vermilion, ink: true },
      { d: 'M18 63 C22 58 30 56 38 57', s: '#E68B6E', w: 1.8 },
      { d: 'M40 66 l6 0 M40 69 l6 0', ink: true, iw: 0.8 },
      { d: 'M21 51 C23 45 43 45 46 51 Z', f: PAL.umberDk, ink: true },
      { d: 'M62 75 C62 60 64 44 70 30 L76 30 C72 44 72 60 74 75 Z', f: PAL.vermilion, ink: true },
      { d: 'M66 73 C66 64 88 64 88 73 Z', f: PAL.vermilion, ink: true },
      { d: 'M64 29 H84', ink: true, iw: 2.2 },
      { d: 'M64 29 H68 M80 29 H84', s: PAL.umberDk, w: 3 },
      { d: C(74, 26, 2.8), f: '#FBF1D8', ink: true, iw: 1 },
      { d: 'M70.5 36 q-2 14 0.5 30', s: '#E68B6E', w: 1.6 },
      { d: 'M12 74 H51', ink: true, iw: 0.9 },
    ],
  },
  // 育樂：金色畫框裡的蒙娜麗莎（用我們的手繪風重畫）
  fun: {
    clips: { canvas: R(24, 26, 52, 44) },
    parts: [
      { d: 'M50 6 L28 16 M50 6 L72 16', ink: true, iw: 1 },
      { d: C(50, 6, 1.6), f: INK },
      { d: R(14, 16, 72, 64), f: PAL.gold, ink: true },
      { d: R(19, 21, 62, 54), f: '#B58236', ink: true, iw: 1 },
      { d: 'M16 18 L22 23 M84 18 L78 23 M16 78 L22 73 M84 78 L78 73', ink: true, iw: 0.9 },
      { d: R(24, 26, 52, 44), f: '#9BA48A', ink: true },
      { d: 'M20 44 C28 40 34 44 40 40 L40 72 H20 Z M60 42 C66 38 72 42 80 39 V72 H60 Z', f: '#7E8A62', clip: 'canvas' },
      { d: 'M20 34 C28 31 34 34 40 31 M60 33 C68 30 74 33 80 31', s: '#C2C6AE', w: 2, clip: 'canvas' },
      { d: 'M27 60 C30 54 34 52 36 48 M66 58 C68 54 70 52 73 50', s: PAL.ochre, w: 1.6, clip: 'canvas' },
      { d: 'M38 72 C36 56 38 35 50 32 C62 35 64 56 62 72 Z', f: '#3B2A1E', clip: 'canvas' },
      { d: 'M44 53 C46 51 54 51 56 53 L57.5 59 C54 61 46 61 42.5 59 Z', f: '#DDB98C', clip: 'canvas' },
      { d: E(50, 43.5, 5.8, 7.6), f: '#E4C79C', ink: true, iw: 0.9 },
      { d: 'M28 72 C30 62 37 57 43 56 C46 60.5 54 60.5 57 56 C63 57 70 62 72 72 Z', f: '#4A3A27', clip: 'canvas' },
      { d: 'M42 56.5 C46 61 54 61 58 56.5', ink: true, iw: 0.8 },
      { d: 'M43 70 C46 65.5 55 65 60 68 L59 72 H44 Z', f: '#E0BF92', clip: 'canvas' },
      { d: 'M46 69 q4 -2.5 9 -1.5', ink: true, iw: 0.6 },
      { d: `${E(47.6, 42, 1, 0.55)} ${E(52.4, 42, 1, 0.55)}`, f: '#3B2A1E' },
      { d: 'M50 43 q-0.4 2 0.2 3 M48.6 48 q1.5 0.5 3 -0.1', ink: true, iw: 0.45 },
      { d: 'M44.5 38 C46 34 50 33.5 50 33.5 C50 33.5 54 34 55.5 38', ink: true, iw: 0.7 },
      { d: 'M40 40 C40 50 41 60 39 72 M60 40 C60 50 59 60 61 72', s: '#56402C', w: 1.6, clip: 'canvas' },
    ],
  },
  // 醫療：藥局的玻璃藥瓶 + 薰衣草
  health: {
    parts: [
      { d: 'M74 92 C73 76 76 60 80 44 M78 92 C80 78 84 66 90 56', ink: true, iw: 1 },
      { d: `${E(80, 44, 2.2, 3.5)} ${E(81, 50, 2.3, 3.5)} ${E(79, 56, 2.3, 3.5)} ${E(82, 39, 2, 3.2)} ${E(90, 56, 2, 3.2)} ${E(88, 62, 2.2, 3.4)} ${E(86, 68, 2.2, 3.4)}`, f: PAL.lavender },
      { d: R(36, 8, 18, 12), f: '#C9A479', ink: true },
      { d: 'M38 12 h14 M38 16 h14', ink: true, iw: 0.7 },
      { d: 'M34 20 H56 V28 C56 32 68 34 68 44 V84 C68 89 64 92 59 92 H31 C26 92 22 89 22 84 V44 C22 34 34 32 34 28 Z', f: '#2F4A3A', ink: true },
      { d: 'M28 44 C28 38 32 36 36 34 M27 52 V82', s: '#6F8F78', w: 2.2 },
      { d: R(26, 52, 38, 26), f: PAL.ivory, ink: true },
      { d: R(28.5, 54.5, 33, 21), ink: true, iw: 0.7 },
      { d: 'M42 58 h6 v4.5 h4.5 v6 h-4.5 v4.5 h-6 v-4.5 h-4.5 v-6 h4.5 Z', f: PAL.vermilion, ink: true, iw: 0.9 },
    ],
  },
  // 投資：疊起來的金幣，上面長出一枝橄欖葉
  invest: {
    parts: [
      { d: 'M50 74 V85 a16 4.5 0 0 0 32 0 V74 Z', f: '#B58236', ink: true, iw: 1.3 },
      { d: 'M50 79.5 a16 4.5 0 0 0 32 0', ink: true, iw: 0.7 },
      { d: E(66, 74, 16, 4.5), f: PAL.gold, ink: true, iw: 1.3 },
      { d: 'M22 60 V85 a16 4.5 0 0 0 32 0 V60 Z', f: '#B58236', ink: true, iw: 1.3 },
      { d: 'M22 66 a16 4.5 0 0 0 32 0 M22 72 a16 4.5 0 0 0 32 0 M22 78.5 a16 4.5 0 0 0 32 0', ink: true, iw: 0.7 },
      { d: E(38, 60, 16, 4.5), f: PAL.gold, ink: true, iw: 1.3 },
      { d: 'M31 58.6 q4 -1.6 8 -1.4 M59 72.6 q4 -1.6 8 -1.4', s: '#F2D791', w: 1.4 },
      { d: 'M24 67 V82 M52 80 V87', s: '#D9A757', w: 1.6 },
      { d: 'M40 58 C40 46 42 34 50 22', ink: true, iw: 1.3 },
      { d: 'M40.5 50 q-9 -2 -11 -9 q9 1 11 9 Z M41.5 42 q8 -4 9 -11 q-8 2 -9 11 Z M44.5 34 q-8 -3 -9 -10 q8 2 9 10 Z M48.5 26 q6 -5 6 -11 q-6 3 -6 11 Z', f: PAL.olive, ink: true, iw: 0.8 },
    ],
  },
  // 其他：市集提籃，裡面有一束花
  other: {
    parts: [
      { d: 'M30 44 C28 22 72 22 70 44', s: PAL.umber, w: 3.6 },
      { d: 'M30 44 C28 22 72 22 70 44', ink: true, iw: 1 },
      { d: 'M44 46 L38 18 L52 30 L60 14 L58 46 Z', f: '#E6DCC6', ink: true },
      { d: 'M46 46 C44 34 42 26 40 22 M52 46 C52 36 52 30 52 28 M56 46 C58 36 60 26 61 22', ink: true, iw: 0.8 },
      { d: `${C(40, 20, 4)} ${C(61, 20, 4.2)} ${C(51, 25, 3.6)}`, f: PAL.vermilion, ink: true, iw: 0.9 },
      { d: `${C(46, 16, 3.2)} ${C(56, 17, 3)}`, f: PAL.rose, ink: true, iw: 0.9 },
      { d: 'M36 30 q-6 -2 -8 2 q6 2 8 -2 Z M64 30 q6 -3 9 1 q-6 3 -9 -1 Z', f: PAL.olive, ink: true, iw: 0.8 },
      { d: 'M14 46 H86 L78 90 H22 Z', f: PAL.ochre, ink: true },
      { d: 'M15.5 54 H84.5 M17 62 H83 M18.5 70 H81.5 M20 78 H80 M21.5 85 H78.5', ink: true, iw: 0.8 },
      { d: 'M24 46 L27 90 M34 46 L36 90 M44 46 L45 90 M56 46 L55 90 M66 46 L64 90 M76 46 L73 90', s: '#A87631', w: 1.4 },
      { d: R(12, 42, 76, 6), f: PAL.umber, ink: true },
    ],
  },
  // App 圖示主角：古錢幣，刻著 $ 與月桂葉
  coin: {
    parts: [
      { d: C(50, 50, 38), f: PAL.gold, ink: true, iw: 2 },
      { d: C(50, 50, 32), ink: true, iw: 1 },
      { d: 'M30 72 C22 62 20 46 26 34 M70 72 C78 62 80 46 74 34', ink: true, iw: 1.2 },
      { d: `${E(23.5, 44, 2.4, 4.4)} ${E(24, 54, 2.4, 4.4)} ${E(27, 63, 2.4, 4.4)} ${E(76.5, 44, 2.4, 4.4)} ${E(76, 54, 2.4, 4.4)} ${E(73, 63, 2.4, 4.4)}`, f: PAL.olive, ink: true, iw: 0.7 },
      { d: 'M50 28 V72', s: PAL.umberDk, w: 3.4 },
      { d: 'M61 38 C57 31 40 31 40 41 C40 50 61 48 61 58.5 C61 68 43 69 38.5 61', s: PAL.umberDk, w: 4.6 },
      { d: 'M61 38 C57 31 40 31 40 41 C40 50 61 48 61 58.5 C61 68 43 69 38.5 61 M50 28 V72', ink: true, iw: 0.9 },
      { d: 'M33 30 l4 3 M30 38 l5 2 M68 30 l-4 3', s: '#F2D791', w: 1.6 },
    ],
  },
};

// 蝴蝶結（口金包上用）
const BOW = (cx, cy, s, col) => [
  { d: `M${cx} ${cy} C${cx - 10 * s} ${cy - 9 * s} ${cx - 17 * s} ${cy - 4 * s} ${cx - 15 * s} ${cy + 3 * s} C${cx - 13 * s} ${cy + 9 * s} ${cx - 6 * s} ${cy + 6 * s} ${cx} ${cy} Z`, f: col, ink: true, iw: 1.8 },
  { d: `M${cx} ${cy} C${cx + 10 * s} ${cy - 9 * s} ${cx + 17 * s} ${cy - 4 * s} ${cx + 15 * s} ${cy + 3 * s} C${cx + 13 * s} ${cy + 9 * s} ${cx + 6 * s} ${cy + 6 * s} ${cx} ${cy} Z`, f: col, ink: true, iw: 1.8 },
  { d: `M${cx - 2 * s} ${cy + 1 * s} L${cx - 8 * s} ${cy + 16 * s} L${cx - 4 * s} ${cy + 14 * s} L${cx - 2 * s} ${cy + 17 * s} L${cx + 1 * s} ${cy + 2 * s} Z M${cx + 2 * s} ${cy + 1 * s} L${cx + 8 * s} ${cy + 16 * s} L${cx + 4 * s} ${cy + 14 * s} L${cx + 2 * s} ${cy + 17 * s} L${cx - 1 * s} ${cy + 2 * s} Z`, f: col, ink: true, iw: 1.5 },
  { d: E(cx, cy + 0.5 * s, 3.2 * s, 3.6 * s), f: col, ink: true, iw: 1.7 },
  { d: `M${cx - 12 * s} ${cy} q4 -4 8 -2 M${cx + 12 * s} ${cy} q-4 -4 -8 -2`, s: 'rgba(255,255,255,.45)', w: 1.4 },
];
const BRASS = '#B07F33';
// App 圖示主角：圓鼓鼓的口金包 + 紅色蝴蝶結（也用在帳本空白時）
ART.purse = { parts: [
  { d: `${C(44.5, 23.5, 5.8)} ${C(55.5, 23.5, 5.8)}`, f: BRASS, ink: true, iw: 1.8 },
  { d: 'M42 21.5 q2 -2 4 -1 M53 21.5 q2 -2 4 -1', s: '#E8C77A', w: 1.4 },
  { d: 'M21 51 C21 24 79 24 79 51 C95 59 95 88 74 93.5 H26 C5 88 5 59 21 51 Z', f: '#F3DC85', ink: true, iw: 2.6 },
  { d: 'M21 51 C21 24 79 24 79 51', s: BRASS, w: 7.5 },
  { d: 'M21 51 C21 24 79 24 79 51', ink: true, iw: 1.8 },
  { d: `${C(20.5, 51, 3.8)} ${C(79.5, 51, 3.8)}`, f: BRASS, ink: true, iw: 1.4 },
  { d: 'M31 42 C39 36 61 36 69 42', s: '#FFF3C4', w: 2.6 },
  { d: 'M16 63 C28 58 72 58 84 63', s: '#FFF3C4', w: 2.6 },
  { d: 'M22 60 C17 70 18 82 25 89 M78 60 C83 70 82 82 75 89', ink: true, iw: 0.9 },
  ...BOW(50, 68, 1.35, '#B4302A'),
]};

let __artSeq = 0;
function artSVG(id, cls = '') {
  const a = ART[id] || ART.other;
  const uid = 'a' + (++__artSeq);
  const clipDefs = Object.entries(a.clips || {}).map(([k, d]) => `<clipPath id="${uid}${k}"><path d="${d}"/></clipPath>`).join('');
  const fills = a.parts.filter(p => p.f || p.s).map(p => {
    const clip = p.clip ? ` clip-path="url(#${uid}${p.clip})"` : '';
    if (p.f) return `<path d="${p.d}" fill="${p.f}"${clip}/>`;
    return `<path d="${p.d}" fill="none" stroke="${p.s}" stroke-width="${p.w || 1.6}" stroke-linecap="round" stroke-linejoin="round"${clip}/>`;
  }).join('');
  const lines = a.parts.filter(p => p.ink).map(p =>
    `<path d="${p.d}" stroke-width="${p.iw || 1.7}"/>`).join('');
  return `<svg class="art ${cls}" viewBox="0 0 100 100" aria-hidden="true">${clipDefs ? `<defs>${clipDefs}</defs>` : ''}` +
    `<g filter="url(#wash)" transform="translate(1.4 1.6)" opacity=".93">${fills}</g>` +
    `<g filter="url(#ink)" fill="none" stroke="${INK}" stroke-linecap="round" stroke-linejoin="round">${lines}</g></svg>`;
}

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Search,
  Sparkles,
  Layers,
  Shapes,
  Download,
  Upload,
  Plus,
  Minus,
  RotateCw,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  ChevronDown,
  MousePointer2,
  Undo2,
  Redo2,
  Maximize2,
  Grid2X2,
  WandSparkles,
  BookOpen,
  Smartphone,
  Headphones,
  Wallet,
  Coins,
  PenLine,
  Folder,
  Lightbulb,
  Puzzle,
  Check,
  X,
  ArrowUp,
  ArrowDown,
  SlidersHorizontal,
  Flower2,
} from 'lucide-react';
import components from './data/components.json';
import { backgrounds } from './data/backgrounds.js';
import './style.css';

const W = 1200,
  H = 630;
const palettes = [
  {
    id: 'lavender',
    name: 'Лавандовая',
    bg: '#D7CDF5',
    colors: ['#D7CDF5', '#7864D7', '#F9ECB0', '#F9A3AA', '#FFE3E1', '#181817'],
  },
  {
    id: 'warm',
    name: 'Тёплая / мятная',
    bg: '#FDD7B9',
    colors: ['#BEEBEB', '#80DADA', '#FDD7B9', '#D27532', '#F9ECB0', '#181817'],
  },
  {
    id: 'cool',
    name: 'Мятная / контрастная',
    bg: '#BEEBEB',
    colors: ['#BEEBEB', '#5ABEBE', '#FFD4F2', '#6D7BFC', '#B6C6FE', '#181817'],
  },
];
const icons = {
  Пазлы: Puzzle,
  Книга: BookOpen,
  Телефон: Smartphone,
  Наушники: Headphones,
  Лампа: Lightbulb,
  Кошелек: Wallet,
  Монета: Coins,
  Ручка: PenLine,
  Папка: Folder,
  'Букет цветов': Flower2,
};
/* Смысловые связи каталога. Словарь намеренно охватывает бытовые и творческие темы,
   а не только деловую лексику: результат всегда ограничен существующими SVG-компонентами. */
const semantic = {
  обучение: ['Книга', 'Пазлы', 'Ручка', 'Лампа'],
  образование: ['Книга', 'Пазлы', 'Ручка', 'Лампа'],
  знания: ['Книга', 'Лампа', 'Пазлы'],
  курс: ['Книга', 'Телефон', 'Пазлы'],
  чтение: ['Книга', 'Лампа'],
  учёба: ['Книга', 'Ручка', 'Лампа'],
  экзамен: ['Книга', 'Ручка', 'Лампа', 'Папка'],
  подготовка: ['Книга', 'Ручка', 'Папка'],
  учебный: ['Книга', 'Ручка', 'Лампа'],
  школа: ['Книга', 'Ручка', 'Папка'],
  университет: ['Книга', 'Ручка', 'Папка'],
  финансы: ['Кошелек', 'Монета', 'Телефон'],
  деньги: ['Кошелек', 'Монета'],
  банк: ['Кошелек', 'Монета', 'Телефон'],
  оплата: ['Телефон', 'Монета', 'Кошелек'],
  покупки: ['Кошелек', 'Телефон', 'Монета'],
  магазин: ['Кошелек', 'Телефон', 'Монета'],
  экономия: ['Кошелек', 'Монета'],
  технологии: ['Телефон', 'Наушники', 'Лампа'],
  цифровой: ['Телефон', 'Наушники'],
  связь: ['Телефон', 'Наушники'],
  музыка: ['Наушники', 'Телефон'],
  звонок: ['Телефон', 'Наушники'],
  общение: ['Телефон', 'Наушники'],
  интернет: ['Телефон', 'Наушники'],
  гаджет: ['Телефон', 'Наушники'],
  работа: ['Папка', 'Ручка', 'Телефон', 'Книга'],
  документы: ['Папка', 'Ручка'],
  офис: ['Папка', 'Ручка', 'Телефон'],
  задача: ['Папка', 'Ручка', 'Книга'],
  планирование: ['Папка', 'Ручка', 'Книга'],
  продуктивность: ['Книга', 'Телефон', 'Лампа', 'Ручка'],
  идея: ['Лампа', 'Книга', 'Пазлы'],
  креатив: ['Пазлы', 'Лампа', 'Ручка'],
  творчество: ['Лампа', 'Пазлы', 'Ручка'],
  творческий: ['Лампа', 'Пазлы', 'Ручка'],
  рисование: ['Ручка', 'Лампа', 'Пазлы'],
  рисунок: ['Ручка', 'Лампа', 'Пазлы'],
  вдохновение: ['Лампа', 'Букет цветов', 'Книга'],
  мысль: ['Лампа', 'Книга', 'Пазлы'],
  решение: ['Пазлы', 'Лампа', 'Книга'],
  головоломка: ['Пазлы', 'Книга'],
  конструктор: ['Пазлы'],
  путешествие: ['Папка', 'Телефон', 'Книга'],
  отпуск: ['Телефон', 'Книга', 'Кошелек'],
  поездка: ['Телефон', 'Папка', 'Книга'],
  город: ['Телефон', 'Книга'],
  подарок: ['Букет цветов', 'Книга'],
  цветы: ['Букет цветов', 'Лампа'],
  букет: ['Букет цветов'],
  романтика: ['Букет цветов', 'Книга'],
  любовь: ['Букет цветов', 'Книга'],
  праздник: ['Букет цветов', 'Книга'],
  дом: ['Книга', 'Лампа', 'Букет цветов'],
  уют: ['Лампа', 'Книга', 'Букет цветов'],
  семья: ['Букет цветов', 'Книга', 'Телефон'],
  друзья: ['Телефон', 'Букет цветов'],
  хобби: ['Книга', 'Наушники', 'Пазлы'],
  отдых: ['Наушники', 'Книга', 'Букет цветов'],
  вечеринка: ['Наушники', 'Телефон', 'Букет цветов'],
  утро: ['Книга', 'Лампа', 'Букет цветов'],
  ночь: ['Лампа', 'Книга', 'Наушники'],
  свет: ['Лампа'],
  энергия: ['Лампа', 'Телефон'],
  природа: ['Букет цветов', 'Лампа'],
  сад: ['Букет цветов'],
  растение: ['Букет цветов'],
  красота: ['Букет цветов', 'Лампа'],
  искусство: ['Лампа', 'Пазлы', 'Букет цветов'],
  спорт: ['Телефон', 'Наушники'],
  игра: ['Пазлы', 'Телефон'],
  развлечение: ['Наушники', 'Пазлы', 'Телефон'],
  фильм: ['Наушники', 'Телефон'],
  подкаст: ['Наушники', 'Телефон'],
  фото: ['Телефон'],
  видео: ['Телефон'],
  контент: ['Телефон', 'Книга'],
  music: ['Наушники', 'Телефон'],
  home: ['Книга', 'Лампа', 'Букет цветов'],
  travel: ['Папка', 'Телефон', 'Книга'],
  flowers: ['Букет цветов', 'Лампа'],
  study: ['Книга', 'Ручка', 'Лампа'],
  gift: ['Букет цветов', 'Книга'],
  creative: ['Лампа', 'Пазлы', 'Ручка'],
  relax: ['Наушники', 'Книга', 'Букет цветов'],
};
const normalizeWords = (value) =>
  String(value || '')
    .toLocaleLowerCase('ru')
    .replace(/ё/g, 'е')
    .match(/[a-zа-я0-9]+/gi) || [];

const stemWord = (word) => {
  let value = word.toLocaleLowerCase('ru').replace(/ё/g, 'е');

  for (const suffix of [
    'иями',
    'ями',
    'ами',
    'ого',
    'ему',
    'ому',
    'ыми',
    'ими',
    'ее',
    'ие',
    'ые',
    'ое',
    'ей',
    'ий',
    'ый',
    'ой',
    'ая',
    'яя',
    'ое',
    'ее',
    'ую',
    'юю',
    'ам',
    'ям',
    'ах',
    'ях',
    'ов',
    'ев',
    'ом',
    'ем',
    'ой',
    'ей',
    'ы',
    'и',
    'а',
    'я',
    'у',
    'ю',
    'е',
    'о',
  ]) {
    if (value.length > suffix.length + 2 && value.endsWith(suffix)) {
      value = value.slice(0, -suffix.length);
      break;
    }
  }

  return value;
};

const uid = () => Math.random().toString(36).slice(2, 9);
const escapeXml = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c],
  );

const safeDownloadName = (value) => {
  const cleaned = String(value || '')
    .normalize('NFC')
    .trim()
    // eslint-disable-next-line no-control-regex
    .replace(/[\\/:*?"<>|\u0000-\u001F]/g, '-')
    .replace(/[\s]+/g, '-')
    .replace(/-+/g, '-')
    // eslint-disable-next-line no-useless-escape
    .replace(/^[.\-]+|[.\-]+$/g, '')
    .slice(0, 100);

  return cleaned || 'Новая-композиция';
};

function colorize(markup, colors, monochrome = false) {
  const sourceMap = {
    '#D7CDF5': colors[0],
    '#7864D7': colors[1] || colors[0],
    '#F9ECB0': colors[2] || colors[0],
    '#F9A3AA': colors[3] || colors[2] || colors[0],
    '#AA9BF0': colors[1] || colors[0],
    '#FFE3E1': colors[4] || colors[0],
    '#181817': colors[5] || colors[colors.length - 1] || '#24233A',
  };

  return markup.replace(/#[0-9a-fA-F]{3,8}\b/g, (c) => {
    if (!monochrome) return sourceMap[c.toUpperCase()] || c;
    const hex = c.length === 4 ? '#' + [...c.slice(1)].map((x) => x + x).join('') : c;
    const rgb =
      hex.length === 7
        ? hex
          .slice(1)
          .match(/.{2}/g)
          .map((v) => parseInt(v, 16))
        : [128, 128, 128];
    const light = rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114 > 155;

    return light ? colors[0] : colors[1] || colors[0];
  });
}

function normalizeSvgFragment(source) {
  return String(source || '')
    .replace(/<(\/?)(?:ns\d+):/g, '<$1')
    .replace(/\s+xmlns:ns\d+="[^"]*"/g, '')
    .replace(/\bns\d+:/g, '');
}

function namespaceSvg(markup, defs, prefix) {
  const normalizedMarkup = normalizeSvgFragment(markup);
  const normalizedDefs = normalizeSvgFragment(defs);
  const safe = String(prefix).replace(/[^a-zA-Z0-9_-]/g, '');
  const ids = [...`${normalizedMarkup} ${normalizedDefs}`.matchAll(/\bid="([^"]+)"/g)].map(
    (m) => m[1],
  );
  const map = {};

  ids.forEach((id) => {
    map[id] = `${safe}-${id.replace(/[^a-zA-Z0-9_-]/g, '-')}`;
  });

  const rename = (s) =>
    String(s || '')
      .replace(/\bid="([^"]+)"/g, (m, id) => `id="${map[id] || id}"`)
      .replace(/url\(#([^)]*)\)/g, (m, id) => `url(#${map[id] || id})`)
      .replace(/((?:xlink:)?href=")#([^"]+)(")/g, (m, a, id, z) => `${a}#${map[id] || id}${z}`);

  return { markup: rename(normalizedMarkup), defs: rename(normalizedDefs) };
}

const SVG_NS = 'http://www.w3.org/2000/svg';
const FALLBACK_BOX = { x: 0, y: 0, width: 500, height: 300 };

/* Половина ширины штриха (с запасом на углы): getBBox() штрихи не учитывает, из-за чего они могли обрезаться */
function strokePad(markup) {
  let max = 0;

  for (const m of String(markup).matchAll(/stroke-width\s*[=:]\s*"?([\d.]+)/g))
    max = Math.max(max, parseFloat(m[1]) || 0);

  return max * 0.75;
}

/* Точные границы SVG-фрагмента. Разметку обязательно нормализуем (ns0: → без префикса),
   иначе браузер не распознаёт теги, getBBox() возвращает 0 и подставляются неверные границы. */
function measureMarkup(host, markup) {
  if (!markup) return null;
  const clean = normalizeSvgFragment(markup);
  const wrap = document.createElementNS(SVG_NS, 'g');

  try {
    wrap.innerHTML = clean;
    host.appendChild(wrap);
    const b = wrap.getBBox();

    if (!(b.width > 0 && b.height > 0)) return null;
    const pad = strokePad(clean);

    return { x: b.x - pad, y: b.y - pad, width: b.width + pad * 2, height: b.height + pad * 2 };
  } catch {
    return null;
  } finally {
    if (wrap.parentNode === host) host.removeChild(wrap);
  }
}

/* Фон холста под выбранную палитру. Для готовых палитр — SVG из src/data/backgrounds.js (заполняет холст без искажений, лишнее обрезается по краям холста).
   Для своей загруженной палитры готового фона нет — заливаем холст её первым цветом. */
function backgroundSvg(paletteId, customColors, w, h) {
  if (customColors) return `<rect width="${w}" height="${h}" fill="${customColors[0]}"/>`;
  const bg = backgrounds[paletteId];

  if (!bg) return `<rect width="${w}" height="${h}" fill="#fff"/>`;
  const ns = namespaceSvg(bg.markup, bg.defs, `bg-${paletteId}`);

  return `<svg x="0" y="0" width="${w}" height="${h}" viewBox="${bg.viewBox}" preserveAspectRatio="xMidYMid slice"><defs>${ns.defs}</defs>${ns.markup}</svg>`;
}

const viewBoxOf = (b, pad = 0) =>
  `${b.x - pad} ${b.y - pad} ${b.width + pad * 2} ${b.height + pad * 2}`;

function App() {
  const [items, setItems] = useState(() => {
      try {
        const saved = JSON.parse(localStorage.getItem('illustrator-studio-project') || '[]');

        if (!Array.isArray(saved)) return [];
        const used = new Set();

        return saved.map((it) => {
          let instanceId = it.instanceId;

          if (!instanceId || used.has(instanceId)) instanceId = uid();
          while (used.has(instanceId)) instanceId = uid();
          used.add(instanceId);

          return {
            ...it,
            instanceId,
            componentId: it.componentId || components.find((c) => c.name === it.name)?.id || '',
          };
        });
      } catch {
        return [];
      }
    }),
    [firstRun] = useState(() => {
      try {
        return !localStorage.getItem('illustrator-studio-project');
      } catch {
        return false;
      }
    }),
    [selected, setSelected] = useState(null),
    [tab, setTab] = useState('library'),
    [query, setQuery] = useState(''),
    [category, setCategory] = useState('Все'),
    [palette, setPalette] = useState(palettes[0]),
    [customColors, setCustomColors] = useState(null),
    [format, setFormat] = useState('L'),
    [title, setTitle] = useState('Новая композиция'),
    [notice, setNotice] = useState(''),
    [prompt, setPrompt] = useState(''),
    [showGrid, setShowGrid] = useState(true),
    [history, setHistory] = useState([]),
    [future, setFuture] = useState([]),
    [zoom, setZoom] = useState(70),
    [fitZoom, setFitZoom] = useState(70),
    [fitMode, setFitMode] = useState(false),
    [activeTool, setActiveTool] = useState('select'),
    [bounds, setBounds] = useState({}),
    [boundsReady, setBoundsReady] = useState(false),
    [libraryRevision] = useState(0),
    [isRotating, setIsRotating] = useState(false);
  const canvasRef = useRef(null),
    stageRef = useRef(null),
    dragRef = useRef(null),
    paletteRef = useRef(null),
    workspaceViewportRef = useRef(null);

  useEffect(() => {
    const stage = stageRef.current;

    if (!stage) return;

    const updateFit = () => {
      const styles = getComputedStyle(stage);
      const horizontalPadding = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
      const verticalPadding = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
      const availableWidth = Math.max(1, stage.clientWidth - horizontalPadding);
      const availableHeight = Math.max(1, stage.clientHeight - verticalPadding - 32);
      const next = Math.max(
        1,
        Math.min(100, Math.floor(Math.min(availableWidth / W, availableHeight / H) * 100)),
      );

      setFitZoom(next);
      if (fitMode) setZoom(next);
    };

    updateFit();
    const observer = new ResizeObserver(updateFit);

    observer.observe(stage);

    return () => observer.disconnect();
  }, [fitMode]);

  useEffect(() => {
    const ns = 'http://www.w3.org/2000/svg',
      host = document.createElementNS(ns, 'svg');

    host.setAttribute('width', '6000');
    host.setAttribute('height', '12000');
    host.style.cssText = 'position:fixed;left:-20000px;top:0;visibility:hidden;overflow:visible';
    document.body.appendChild(host);
    const next = {};
    const measure = (markup) => measureMarkup(host, markup);

    components.forEach((c) => {
      next[c.id] = {
        Lmain: measure(c.markup),
        Lbg: measure(c.backgroundMarkup),
        Smain: measure(c.sizeSMarkup),
        Sbg: measure(c.sizeSBackgroundMarkup),
      };
    });

    host.remove();
    setBounds(next);
    setBoundsReady(true);
  }, []);

  const componentFor = (it) => components.find((c) => c.id === it.componentId);

  const componentBounds = (c, role = 'main') => {
    if (!c) return null;
    const r = bounds[c.id] || {};

    if (format === 'S') {
      if (role === 'background')
        return (
          r.Sbg ||
          c.sizeSBackgroundBBox ||
          r.Lbg ||
          c.backgroundBBox ||
          r.Smain ||
          c.sizeSBBox ||
          r.Lmain ||
          c.bbox
        );

      return r.Smain || c.sizeSBBox || r.Lmain || c.bbox;
    }

    if (role === 'background') return r.Lbg || c.backgroundBBox || r.Lmain || c.bbox;

    return r.Lmain || c.bbox;
  };

  const boundsFor = (it) =>
    componentBounds(componentFor(it), it.role) ||
    it.bbox || { x: 0, y: 0, width: 500, height: 300 };

  const markupFor = (it) => {
    const c = componentFor(it);

    if (format === 'S' && c?.sizeSMarkup)
      return it.role === 'background' ? c.sizeSBackgroundMarkup || c.sizeSMarkup : c.sizeSMarkup;
    if (it.role === 'background') return c?.backgroundMarkup || c?.markup || it.sourceMarkup;

    return c?.markup || it.sourceMarkup;
  };

  const OBJECT_SCALE = 0.26;
  const widthFor = (it) => boundsFor(it).width * OBJECT_SCALE;
  const heightFor = (it) => boundsFor(it).height * OBJECT_SCALE;
  const activePalette = customColors || palette.colors;
  const categories = ['Все', 'Технологии', 'Обучение', 'Финансы', 'Работа', 'Предметы'];
  const filtered = useMemo(
    () =>
      components.filter(
        (c) =>
          (category === 'Все' || c.category === category) &&
          c.name.toLowerCase().includes(query.toLowerCase()),
      ),
    [category, query, libraryRevision],
  );
  const selectedItem = items.find((x) => x.instanceId === selected);

  // Удаление выбранного объекта клавишами Delete / Backspace.
  // Не перехватываем клавиши, когда пользователь вводит текст или редактирует поле.
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key !== 'Delete' && event.key !== 'Backspace') return;
      const target = event.target;

      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.closest('input, textarea, select, [contenteditable="true"], [role="textbox"]'))
      )
        return;
      if (!selected) return;
      const exists = items.some((item) => item.instanceId === selected);

      if (!exists) return;
      event.preventDefault();
      pushHistory(items.filter((item) => item.instanceId !== selected));
      setSelected(null);
    };

    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selected, items]);

  const pushHistory = (next) => {
    setHistory((h) => [...h.slice(-29), items]);
    setFuture([]);
    setItems(next);
  };

  const addComponent = (component, at) => {
    const n = items.filter((x) => x.componentId === component.id).length;
    const b = componentBounds(component) ||
      component.bbox || { x: 0, y: 0, width: 500, height: 300 };
    const width = b.width * OBJECT_SCALE;
    const obj = {
      instanceId: uid(),
      componentId: component.id,
      name: component.name,
      category: component.category,
      x: at?.x ?? W / 2 - width / 2 + (n % 3) * 22,
      y: at?.y ?? H / 2 - (b.height * OBJECT_SCALE) / 2 + (n % 3) * 20,
      width,
      height: b.height * OBJECT_SCALE,
      bbox: b,
      rotation: 0,
      role: 'main',
      visible: true,
      opacity: 1,
      sourceMarkup: component.markup,
      sourceViewBox: component.viewBox,
      defs: component.defs,
    };

    pushHistory([...items, obj]);
    setSelected(obj.instanceId);
  };

  const remove = (id) => pushHistory(items.filter((x) => x.instanceId !== id));
  const update = (id, patch) =>
    setItems((prev) => prev.map((x) => (x.instanceId === id ? { ...x, ...patch } : x)));

  const duplicate = () => {
    if (!selectedItem) return;
    const clone = {
      ...selectedItem,
      instanceId: uid(),
      x: selectedItem.x + 32,
      y: selectedItem.y + 28,
    };

    pushHistory([...items, clone]);
    setSelected(clone.instanceId);
  };

  const compose = () => {
    const words = normalizeWords(prompt);

    if (!words.length) {
      setNotice('Введите тему, заголовок или метафору.');
      setTimeout(() => setNotice(''), 4000);

      return;
    }

    const tokens = new Set(words.map(stemWord));
    const scores = new Map();

    Object.entries(semantic).forEach(([keyword, names]) => {
      const keyTokens = normalizeWords(keyword).map(stemWord);
      const matched = keyTokens.length > 0 && keyTokens.every((token) => tokens.has(token));

      if (matched)
        names.forEach((name, index) =>
          scores.set(name, (scores.get(name) || 0) + (index === 0 ? 4 : Math.max(1, 3 - index))),
        );
    });

    components.forEach((c) => {
      const nameTokens = normalizeWords(c.name).map(stemWord);

      if (nameTokens.length && nameTokens.every((token) => tokens.has(token)))
        scores.set(c.name, (scores.get(c.name) || 0) + 8);
    });

    const ranked = [...scores.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => components.find((c) => c.name === name))
      .filter((c) => c && (format !== 'S' || c.sizeSMarkup))
      .slice(0, 4);

    if (!ranked.length) {
      setNotice(
        'Не удалось подобрать подходящие объекты. Попробуйте уточнить тему или использовать понятия: обучение, музыка, дом, путешествие, творчество, цветы.',
      );

      setTimeout(() => setNotice(''), 6500);

      return;
    }

    const positions = {
      1: [{ x: 470, y: 190, rotation: 0 }],
      2: [
        { x: 345, y: 190, rotation: -6 },
        { x: 700, y: 245, rotation: 7 },
      ],
      3: [
        { x: 500, y: 135, rotation: -5 },
        { x: 270, y: 330, rotation: 7 },
        { x: 780, y: 330, rotation: -8 },
      ],
      4: [
        { x: 470, y: 110, rotation: -6 },
        { x: 225, y: 300, rotation: 6 },
        { x: 720, y: 285, rotation: -7 },
        { x: 480, y: 430, rotation: 4 },
      ],
    };
    const layout = ranked.map((c, i) => {
      const b = componentBounds(c) || c.bbox || { x: 0, y: 0, width: 500, height: 300 };
      const w = b.width * OBJECT_SCALE;
      const pos = positions[ranked.length][i];

      return {
        instanceId: uid(),
        componentId: c.id,
        name: c.name,
        category: c.category,
        x: pos.x,
        y: pos.y,
        width: w,
        height: b.height * OBJECT_SCALE,
        bbox: b,
        rotation: pos.rotation,
        role: i === 0 ? 'main' : 'background',
        visible: true,
        opacity: 1,
        sourceMarkup: c.markup,
        sourceViewBox: c.viewBox,
        defs: c.defs,
      };
    });

    pushHistory(layout);
    setSelected(layout[0]?.instanceId || null);
    setTab('layers');
    setNotice(
      `Подобрано ${layout.length} ${layout.length === 1 ? 'объект' : layout.length < 5 ? 'объекта' : 'объектов'} из исходной библиотеки. Новые объекты не создавались.`,
    );

    setTimeout(() => setNotice(''), 4500);
  };

  const loadExample = (kind) => {
    const sets = {
      balanced: [
        ['Телефон', 500, 185, 260, -8, 'main'],
        ['Пазлы', 690, 305, 220, 6, 'main'],
        ['Монета', 855, 215, 150, 12, 'background'],
      ],
      headline: [
        ['Книга', 680, 180, 250, -7, 'main'],
        ['Лампа', 390, 345, 180, 8, 'background'],
        ['Пазлы', 880, 375, 150, -12, 'background'],
      ],
      offset: [
        ['Наушники', 610, 210, 300, -10, 'main'],
        ['Телефон', 360, 375, 220, 7, 'background'],
        ['Кошелек', 850, 385, 180, -5, 'background'],
      ],
    };
    const next = sets[kind].map(([name, x, y, _width, rotation, role]) => {
      const c = components.find((z) => z.name === name);
      const b = componentBounds(c) || c.bbox || { x: 0, y: 0, width: 500, height: 300 };
      const width = b.width * OBJECT_SCALE;

      return {
        instanceId: uid(),
        componentId: c.id,
        name,
        category: c.category,
        x,
        y,
        width,
        height: b.height * OBJECT_SCALE,
        bbox: b,
        rotation,
        role,
        visible: true,
        opacity: 1,
        sourceMarkup: c.markup,
        sourceViewBox: c.viewBox,
        defs: c.defs,
      };
    });

    pushHistory(next);
    setSelected(next[0].instanceId);
    setTitle(
      kind === 'balanced'
        ? 'Собранная композиция'
        : kind === 'headline'
        ? 'Под заголовок'
        : 'Композиция со смещением',
    );
  };

  const onPointerDown = (e, item) => {
    if (activeTool !== 'select') return;
    e.stopPropagation();
    setSelected(item.instanceId);
    const rect = canvasRef.current.getBoundingClientRect();
    const sx = W / rect.width,
      sy = H / rect.height;
    const px = (e.clientX - rect.left) * sx,
      py = (e.clientY - rect.top) * sy;

    dragRef.current = {
      mode: 'move',
      id: item.instanceId,
      dx: px - item.x,
      dy: py - item.y,
      snapshot: items,
    };

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onRotatePointerDown = (e, item) => {
    if (activeTool !== 'select') return;
    e.preventDefault();
    e.stopPropagation();
    setSelected(item.instanceId);
    const rect = canvasRef.current.getBoundingClientRect();
    const cx = rect.left + (item.x + widthFor(item) / 2) * (rect.width / W);
    const cy = rect.top + (item.y + heightFor(item) / 2) * (rect.height / H);
    const startAngle = (Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI;

    dragRef.current = {
      mode: 'rotate',
      id: item.instanceId,
      cx,
      cy,
      startAngle,
      startRotation: Number(item.rotation) || 0,
      snapshot: items,
    };

    setIsRotating(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    const drag = dragRef.current;

    if (!drag) return;

    if (drag.mode === 'rotate') {
      const angle = (Math.atan2(e.clientY - drag.cy, e.clientX - drag.cx) * 180) / Math.PI;
      let rotation = drag.startRotation + angle - drag.startAngle;

      rotation = ((((rotation + 180) % 360) + 360) % 360) - 180;
      update(drag.id, { rotation: Math.round(rotation * 10) / 10 });

      return;
    }

    const rect = canvasRef.current.getBoundingClientRect();
    const sx = W / rect.width,
      sy = H / rect.height;
    const px = (e.clientX - rect.left) * sx,
      py = (e.clientY - rect.top) * sy;

    update(drag.id, { x: px - drag.dx, y: py - drag.dy });
  };

  const onPointerUp = () => {
    if (dragRef.current) {
      const snapshot = dragRef.current.snapshot;

      setHistory((h) => [...h.slice(-29), snapshot]);
      setFuture([]);
      dragRef.current = null;
      setIsRotating(false);
    }
  };

  const exportSvg = () => {
    // const defs = [...new Set(items.map((x) => x.defs).filter(Boolean))].join('');
    const body = items
      .filter((x) => x.visible)
      .map((x) => {
        const b = boundsFor(x);
        const w = widthFor(x);
        const h = heightFor(x);
        const ns = namespaceSvg(markupFor(x), x.defs || '', x.instanceId);
        const markup = colorize(ns.markup, activePalette, x.role === 'background');

        return `<g transform="translate(${x.x + w / 2} ${x.y + h / 2}) rotate(${x.rotation})" opacity="${x.opacity ?? 1}"><svg x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" viewBox="${b.x} ${b.y} ${b.width} ${b.height}" preserveAspectRatio="xMidYMid meet" overflow="visible"><defs>${ns.defs || ''}</defs>${markup}</svg></g>`;
      })
      .join('\n');
    const scaleGroup = body;
    const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="630" viewBox="0 0 1200 630"><title>${escapeXml(title)}</title>${backgroundSvg(palette.id, customColors, W, H)}${scaleGroup}</svg>`;
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }),
      url = URL.createObjectURL(blob),
      a = document.createElement('a');

    a.href = url;
    a.download = `${safeDownloadName(title)}-${format.toLowerCase()}.svg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice(`SVG экспортирован: ${a.download}. Векторные пути сохранены.`);
    setTimeout(() => setNotice(''), 3500);
  };

  const downloadPaletteTemplate = () => {
    const template = {
      name: 'Моя палитра',
      colors: ['#D7CDF5', '#7864D7', '#F9ECB0', '#F9A3AA', '#FFE3E1', '#181817'],
    };
    const blob = new Blob([JSON.stringify(template, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = 'palette-template.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const uploadPalette = (e) => {
    const f = e.target.files?.[0];

    if (!f) return;
    const reader = new FileReader();

    reader.onload = () => {
      let txt = String(reader.result);
      let colors = [...txt.matchAll(/#[0-9a-fA-F]{6}\b/g)].map((x) => x[0]);

      if (!colors.length) {
        try {
          const j = JSON.parse(txt);

          colors = j.colors || j.palette || [];
        } catch {
          // ignore
        }
      }

      colors = colors.filter((x) => /^#[0-9a-fA-F]{6}$/.test(x));
      if (colors.length) {
        setCustomColors(colors);
        setNotice(`Загружена палитра: ${colors.length} цветов.`);
      } else
        setNotice('Не удалось найти HEX-цвета. Используйте JSON, TXT или SVG с кодами #RRGGBB.');
      setTimeout(() => setNotice(''), 4000);
    };

    reader.readAsText(f);
    e.target.value = '';
  };

  const undo = () => {
    if (!history.length) return;
    setFuture((f) => [items, ...f]);
    setItems(history.at(-1));
    setHistory((h) => h.slice(0, -1));
  };

  const redo = () => {
    if (!future.length) return;
    setHistory((h) => [...h, items]);
    setItems(future[0]);
    setFuture((f) => f.slice(1));
  };

  const reorder = (id, dir) => {
    const i = items.findIndex((x) => x.instanceId === id),
      j = Math.max(0, Math.min(items.length - 1, i + dir));

    if (i < 0 || i === j) return;
    const n = [...items];

    [n[i], n[j]] = [n[j], n[i]];
    pushHistory(n);
  };

  const layers = [...items].reverse();

  useEffect(() => {
    const viewport = workspaceViewportRef.current;

    if (!viewport) return;

    // ─────────────────────────────────────────────────────────────────────────
    // Единая логика прокрутки (колесо / тачпад / касание) с фиксацией оси.
    // Цель: вертикальный жест НИКОГДА не двигает контент по горизонтали
    // (и наоборот), независимо от экрана и контейнера.
    // Контейнеры: .asset-grid, .layer-list, .right-panel, .canvas-stage,
    // а внешний .workspace-viewport отвечает только за горизонтальный сдвиг панелей.
    // ─────────────────────────────────────────────────────────────────────────
    const AXIS = {
      x: { pos: 'scrollLeft', size: 'scrollWidth', client: 'clientWidth', overflow: 'overflowX' },
      y: { pos: 'scrollTop', size: 'scrollHeight', client: 'clientHeight', overflow: 'overflowY' },
    };

    const isScrollable = (el, axis) => {
      const a = AXIS[axis];
      const o = getComputedStyle(el)[a.overflow];

      return (o === 'auto' || o === 'scroll') && el[a.size] - el[a.client] > 1;
    };

    const canMove = (el, axis, delta) => {
      const a = AXIS[axis];
      const max = el[a.size] - el[a.client];

      return (delta > 0 && el[a.pos] < max - 1) || (delta < 0 && el[a.pos] > 1);
    };

    // Ближайший к курсору предок (до viewport включительно), который реально прокручивается по оси.
    const findScroller = (from, axis, delta) => {
      let el = from;

      while (el && el instanceof Element) {
        if (isScrollable(el, axis) && canMove(el, axis, delta)) return el;
        if (el === viewport) break;
        el = el.parentElement;
      }

      return null;
    };

    const isTextField = (t) => t.closest('input[type="text"], input[type="number"], textarea, select, [contenteditable="true"]');

    // ── Колесо / тачпад ──────────────────────────────────────────────────────
    const onWheel = (event) => {
      const target = event.target;

      if (!(target instanceof Element) || event.ctrlKey) return; // ctrl+колесо = зум браузера
      if (isTextField(target)) return;

      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? viewport.clientHeight : 1;
      let dx = event.deltaX * unit;
      let dy = event.deltaY * unit;

      // Shift + колесо мыши = горизонтальная прокрутка.
      if (event.shiftKey && dy && !dx) {
        dx = dy;
        dy = 0;
      }

      if (!dx && !dy) return;

      // Строго одна ось — нативное поведение (плавность, инерция) не трогаем.
      // Горизонтальную ось при Shift обрабатываем сами (нативно Shift работает не везде).
      const axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      const delta = axis === 'x' ? dx : dy;
      const crossDelta = axis === 'x' ? dy : dx;
      const wasShift = event.shiftKey && !event.deltaX;

      if (!crossDelta && !wasShift) return;

      // Диагональный «шум» тачпада или Shift: гасим побочную ось и двигаем только основную.
      const scroller = findScroller(target, axis, delta);

      if (scroller) scroller[AXIS[axis].pos] += delta;

      // Если мы в раскладке с реальной горизонтальной прокруткой — блокируем «утечку» побочной оси.
      if (scroller || getComputedStyle(viewport).overflowX !== 'visible') event.preventDefault();
    };

    // passive: false нужен, чтобы вызвать preventDefault при диагональном жесте.
    viewport.addEventListener('wheel', onWheel, { passive: false });

    // ── Касание: фиксация оси для .canvas-stage (двухосевой контейнер) ──────
    // Вертикальные панели (asset-grid, layer-list, right-panel) защищены CSS: touch-action: pan-y.
    let lock = null; // { axis, el, left, top, startX, startY, decided, until }
    let lockTimer = 0;

    const clearLock = () => {
      lock = null;
      clearTimeout(lockTimer);
    };

    const onTouchStart = (event) => {
      if (event.touches.length !== 1) return clearLock();

      const stage = event.target instanceof Element ? event.target.closest('.canvas-stage') : null;

      if (!stage) return clearLock();

      clearTimeout(lockTimer);
      lock = {
        axis: null,
        el: stage,
        left: stage.scrollLeft,
        top: stage.scrollTop,
        startX: event.touches[0].clientX,
        startY: event.touches[0].clientY,
      };
    };

    const onTouchMove = (event) => {
      if (!lock) return;

      if (event.touches.length !== 1) return clearLock(); // щипок = зум, не мешаем

      if (!lock.axis) {
        const dx = Math.abs(event.touches[0].clientX - lock.startX);
        const dy = Math.abs(event.touches[0].clientY - lock.startY);

        if (Math.max(dx, dy) < 8) return;
        lock.axis = dy >= dx ? 'y' : 'x';
      }

      // Возвращаем побочную ось на место.
      if (lock.axis === 'y') lock.el.scrollLeft = lock.left;
      else lock.el.scrollTop = lock.top;
    };

    const onTouchEnd = () => {
      if (!lock) return;
      // Инерция после отпускания: ещё ~0.8 c держим ось (см. onScrollCapture).
      lockTimer = setTimeout(clearLock, 800);
    };

    // scroll не всплывает, поэтому слушаем в capture-фазе.
    const onScrollCapture = (event) => {
      if (!lock || !lock.axis || event.target !== lock.el) return;

      if (lock.axis === 'y' && lock.el.scrollLeft !== lock.left) lock.el.scrollLeft = lock.left;
      if (lock.axis === 'x' && lock.el.scrollTop !== lock.top) lock.el.scrollTop = lock.top;
    };

    viewport.addEventListener('touchstart', onTouchStart, { passive: true });
    viewport.addEventListener('touchmove', onTouchMove, { passive: true });
    viewport.addEventListener('touchend', onTouchEnd, { passive: true });
    viewport.addEventListener('touchcancel', clearLock, { passive: true });
    viewport.addEventListener('scroll', onScrollCapture, { capture: true, passive: true });

    return () => {
      clearLock();
      viewport.removeEventListener('wheel', onWheel);
      viewport.removeEventListener('touchstart', onTouchStart);
      viewport.removeEventListener('touchmove', onTouchMove);
      viewport.removeEventListener('touchend', onTouchEnd);
      viewport.removeEventListener('touchcancel', clearLock);
      viewport.removeEventListener('scroll', onScrollCapture, { capture: true });
    };
  }, []);

  useEffect(() => {
    if (firstRun && boundsReady && items.length === 0) loadExample('balanced');
  }, [boundsReady]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">
            <Shapes size={19} />
          </div>
          <div>
            <strong>
              ILLUSTRATOR<span> STUDIO</span>
            </strong>
            <small>VECTOR COMPOSITION WORKSPACE</small>
          </div>
        </div>
        <div className="doc-name">
          <span className="live-dot" />
          {title}
        </div>
        <div className="top-actions">
          <button className="icon-btn" title="Отменить" onClick={undo}>
            <Undo2 size={17} />
          </button>
          <button className="icon-btn" title="Повторить" onClick={redo}>
            <Redo2 size={17} />
          </button>
          <span className="top-divider" />
          <button className="primary-btn" onClick={exportSvg}>
            <Download size={16} /> Экспорт SVG
          </button>
        </div>
      </header>
      <div className="scroll-hint" role="note" aria-label="Подсказка по прокрутке">
        <span className="scroll-hint-wide">
          Панели можно прокручивать по горизонтали: Shift + колесо мыши или два пальца на тачпаде
        </span>
        <span className="scroll-hint-mobile">
          Прокрутите страницу вниз, чтобы перейти к редактору и свойствам
        </span>
        <span className="scroll-hint-track" aria-hidden="true">
          <i />
        </span>
      </div>
      <div
        ref={workspaceViewportRef}
        className="workspace-viewport"
        role="region"
        aria-label="Рабочая область редактора. Используйте горизонтальную прокрутку, Shift + колесо мыши или прокрутку двумя пальцами, чтобы перейти к панели свойств."
        tabIndex={0}
      >
        <main className="workspace">
          <aside className="left-panel">
            <div className="panel-tabs">
              <button
                className={tab === 'library' ? 'active' : ''}
                onClick={() => setTab('library')}
              >
                <Shapes size={16} /> Библиотека
              </button>
              <button className={tab === 'layers' ? 'active' : ''} onClick={() => setTab('layers')}>
                <Layers size={16} /> Слои <span className="count">{items.length}</span>
              </button>
            </div>
            {tab === 'library' ? (
              <>
                <div className="panel-intro">
                  <div>
                    <h2>Компоненты</h2>
                    <p>Готовые SVG-объекты из исходной библиотеки</p>
                  </div>
                </div>
                <div className="searchbox">
                  <Search size={15} />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Найти объект..."
                  />
                  <kbd>⌘ K</kbd>
                </div>
                <div className="category-list">
                  {categories.map((c) => (
                    <button
                      key={c}
                      className={category === c ? 'chosen' : ''}
                      onClick={() => setCategory(c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <div className="asset-grid">
                  {filtered.map((c) => {
                    // const Icon = icons[c.name] || Shapes;
                    const thumb = namespaceSvg(c.markup, c.defs || '', `thumb-${c.id}`);

                    return (
                      <button
                        className="asset-card"
                        key={c.id}
                        onClick={() => addComponent(c)}
                        disabled={format === 'S' && !c.sizeSMarkup}
                        title={
                          format === 'S' && !c.sizeSMarkup
                            ? 'Для этого объекта в исходной библиотеке есть только вариант L'
                            : undefined
                        }
                      >
                        <div className="asset-art">
                          <svg
                            viewBox={viewBoxOf(
                              bounds[c.id]?.Lmain || c.bbox || FALLBACK_BOX,
                              (bounds[c.id]?.Lmain || c.bbox || FALLBACK_BOX).width * 0.02,
                            )}
                            preserveAspectRatio="xMidYMid meet"
                          >
                            <defs dangerouslySetInnerHTML={{ __html: thumb.defs || '' }} />
                            <g
                              dangerouslySetInnerHTML={{
                                __html: colorize(thumb.markup, activePalette),
                              }}
                            />
                          </svg>
                          <span className="asset-plus">
                            <Plus size={13} />
                          </span>
                        </div>
                        <strong>{c.name}</strong>
                        <small>
                          {c.category}
                          {format === 'S' && !c.sizeSMarkup ? ' · только L' : ''}
                        </small>
                      </button>
                    );
                  })}
                </div>
                <div className="panel-footer">
                  <span className="green-dot" /> {components.length} исходных компонентов{' '}
                  <span>·</span> SVG
                </div>
              </>
            ) : (
              <>
                <div className="panel-intro">
                  <div>
                    <h2>Слои композиции</h2>
                    <p>Порядок и состояние объектов</p>
                  </div>
                  <span className="count-large">{items.length}</span>
                </div>
                {items.length === 0 ? (
                  <div className="empty-state">
                    <Layers size={28} />
                    <strong>Пока нет объектов</strong>
                    <span>Добавьте элементы из библиотеки или используйте AI-компоновщик</span>
                    <button onClick={() => setTab('library')}>Открыть библиотеку</button>
                  </div>
                ) : (
                  <div className="layer-list">
                    {layers.map((it) => {
                      const Icon = icons[it.name] || Shapes;

                      return (
                        <div
                          className={'layer-row ' + (selected === it.instanceId ? 'selected' : '')}
                          key={it.instanceId}
                          onClick={() => setSelected(it.instanceId)}
                        >
                          <div className="layer-icon">
                            <Icon size={17} />
                          </div>
                          <div className="layer-info">
                            <strong>{it.name}</strong>
                            <small>
                              {it.role === 'main' ? 'Главный объект' : 'Фоновый объект'}
                            </small>
                          </div>
                          <button
                            className="tiny-icon"
                            title="Выше"
                            onClick={(e) => {
                              e.stopPropagation();
                              reorder(it.instanceId, 1);
                            }}
                          >
                            <ArrowUp size={13} />
                          </button>
                          <button
                            className="tiny-icon"
                            title="Ниже"
                            onClick={(e) => {
                              e.stopPropagation();
                              reorder(it.instanceId, -1);
                            }}
                          >
                            <ArrowDown size={13} />
                          </button>
                          <button
                            className="tiny-icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              update(it.instanceId, { visible: !it.visible });
                            }}
                          >
                            {it.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                          </button>
                          <button
                            className="tiny-icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              remove(it.instanceId);
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
                <div className="panel-bottom-actions">
                  <button
                    onClick={() => {
                      setTab('library');
                    }}
                  >
                    <Plus size={15} /> Добавить объект
                  </button>
                </div>
              </>
            )}
          </aside>
          <section className="editor-area">
            <div className="editor-toolbar">
              <div className="tool-group">
                <button
                  className={activeTool === 'select' ? 'tool-active' : ''}
                  onClick={() => setActiveTool('select')}
                  title="Выделение"
                >
                  <MousePointer2 size={17} />
                </button>
                <button onClick={duplicate} title="Дублировать" disabled={!selectedItem}>
                  <Copy size={16} />
                </button>
                <button
                  onClick={() => {
                    if (!selectedItem) return;
                    remove(selectedItem.instanceId);
                    setSelected(null);
                  }}
                  title="Удалить"
                  disabled={!selectedItem}
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="canvas-meta">
                <span className="canvas-dot" /> ХОЛСТ <b>1200 × 630</b>
                <span className="meta-sep" /> RGB / SVG
              </div>
              <div className="tool-group">
                <button
                  onClick={() => setShowGrid(!showGrid)}
                  className={showGrid ? 'tool-active' : ''}
                  title="Сетка"
                >
                  <Grid2X2 size={16} />
                </button>
                <button
                  onClick={() => {
                    setFitMode(false);
                    setZoom(Math.max(10, zoom - 5));
                  }}
                  title="Уменьшить масштаб"
                  disabled={zoom <= 10}
                >
                  <Minus size={15} />
                </button>
                <span className="zoom-label">{zoom}%</span>
                <button
                  onClick={() => {
                    setFitMode(false);
                    setZoom(Math.min(100, zoom + 5));
                  }}
                  title="Увеличить масштаб"
                  disabled={zoom >= 100}
                >
                  <Plus size={15} />
                </button>
                <button
                  onClick={() => {
                    setFitMode(true);
                    setZoom(fitZoom);
                  }}
                  title="По размеру: вписать весь холст в рабочую область"
                >
                  <Maximize2 size={15} />
                </button>
              </div>
            </div>
            <div className="canvas-stage" ref={stageRef}>
              <div className="canvas-wrap" style={{ width: `${(W * zoom) / 100}px` }}>
                <svg
                  ref={canvasRef}
                  className={
                    'artboard ' + (showGrid ? 'with-grid ' : '') + (isRotating ? 'rotating' : '')
                  }
                  viewBox={`0 0 ${W} ${H}`}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerLeave={onPointerUp}
                  onClick={() => setSelected(null)}
                >
                  <defs>
                    <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                      <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#e9eaf0" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width={W} height={H} fill="#fff" />
                  <g
                    pointerEvents="none"
                    dangerouslySetInnerHTML={{
                      __html: backgroundSvg(palette.id, customColors, W, H),
                    }}
                  />
                  {showGrid && <rect width={W} height={H} fill="url(#grid)" />}
                  <g>
                    {items
                      .filter((x) => x.visible)
                      .map((it) => {
                        const c = componentFor(it);
                        const source = markupFor(it);
                        const ns = namespaceSvg(source, it.defs || c?.defs || '', it.instanceId);
                        const b = boundsFor(it);
                        const w = widthFor(it);
                        const h = heightFor(it);
                        const isSel = selected === it.instanceId;

                        return (
                          <g
                            key={it.instanceId}
                            transform={`translate(${it.x + w / 2} ${it.y + h / 2}) rotate(${it.rotation})`}
                            opacity={it.opacity ?? 1}
                            onPointerDown={(e) => onPointerDown(e, it)}
                            style={{ cursor: 'move' }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <svg
                              x={-w / 2}
                              y={-h / 2}
                              width={w}
                              height={h}
                              viewBox={`${b.x} ${b.y} ${b.width} ${b.height}`}
                              preserveAspectRatio="xMidYMid meet"
                              overflow="visible"
                            >
                              <defs dangerouslySetInnerHTML={{ __html: ns.defs || '' }} />
                              <g
                                dangerouslySetInnerHTML={{
                                  __html: colorize(
                                    ns.markup,
                                    activePalette,
                                    it.role === 'background',
                                  ),
                                }}
                              />
                            </svg>
                            {isSel && (
                              <>
                                <rect
                                  x={-w / 2 - 5}
                                  y={-h / 2 - 5}
                                  width={w + 10}
                                  height={h + 10}
                                  fill="none"
                                  stroke="#7664d8"
                                  strokeWidth="2"
                                  strokeDasharray="5 4"
                                  pointerEvents="none"
                                />
                                <line
                                  x1="0"
                                  y1={-h / 2 - 5}
                                  x2="0"
                                  y2={-h / 2 - 27}
                                  stroke="#7664d8"
                                  strokeWidth="2"
                                  pointerEvents="none"
                                />
                                <circle
                                  cx="0"
                                  cy={-h / 2 - 29}
                                  r="8"
                                  fill="#fff"
                                  stroke="#7664d8"
                                  strokeWidth="2"
                                  style={{
                                    cursor: isRotating ? 'grabbing' : 'grab',
                                    touchAction: 'none',
                                  }}
                                  onPointerDown={(e) => onRotatePointerDown(e, it)}
                                >
                                  <title>Повернуть объект мышью или касанием</title>
                                </circle>
                              </>
                            )}
                          </g>
                        );
                      })}
                  </g>
                </svg>
                <div className="artboard-caption">
                  <span>ARTBOARD 01</span>
                  <span>{format} FORMAT · 1200 × 630 PX</span>
                </div>
              </div>
            </div>
            <div className="bottom-bar">
              <div className="bottom-left">
                <span>
                  <span className="green-dot" /> Все изменения в редакторе
                </span>
                <span>·</span>
                <span>{items.length} объектов</span>
              </div>
              <div className="bottom-right">
                <button
                  title="Очистить холст: удалить все объекты"
                  aria-label="Очистить холст"
                  onClick={() => {
                    if (
                      items.length &&
                      window.confirm('Удалить все объекты с холста? Это действие можно отменить.')
                    ) {
                      pushHistory([]);
                      setSelected(null);
                    }
                  }}
                  disabled={!items.length}
                >
                  <Trash2 size={14} /> Очистить холст
                </button>
              </div>
            </div>
          </section>
          <aside className="right-panel">
            <div className="right-heading">
              <div>
                <h2>Свойства</h2>
                <p>Настройка композиции</p>
              </div>
              <SlidersHorizontal size={17} />
            </div>
            <section className="inspector-section">
              <div className="section-title">
                <span>РАЗМЕР ИЛЛЮСТРАЦИИ</span>
                <ChevronDown size={14} />
              </div>
              <div className="format-options">
                <button className={format === 'L' ? 'active' : ''} onClick={() => setFormat('L')}>
                  Размер L
                </button>
                <button className={format === 'S' ? 'active' : ''} onClick={() => setFormat('S')}>
                  Размер S
                </button>
              </div>
              <div className="field-label">Название композиции</div>
              <input
                className="text-field"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </section>
            <section className="inspector-section">
              <div className="section-title">
                <span>ЦВЕТОВАЯ ПАЛИТРА</span>
                <ChevronDown size={14} />
              </div>
              <div className="palette-list">
                {palettes.map((p) => (
                  <button
                    className={
                      'palette-row ' + (!customColors && palette.id === p.id ? 'active' : '')
                    }
                    key={p.id}
                    style={
                      !customColors && palette.id === p.id
                        ? { background: p.bg, borderColor: p.colors[1] }
                        : undefined
                    }
                    onClick={() => {
                      setPalette(p);
                      setCustomColors(null);
                    }}
                  >
                    <span className="swatches">
                      {p.colors.map((c) => (
                        <i key={c} style={{ background: c }} />
                      ))}
                    </span>
                    <span>{p.name}</span>
                  </button>
                ))}
              </div>
              <button className="upload-palette" onClick={() => paletteRef.current?.click()}>
                <Upload size={14} /> Загрузить свою палитру
              </button>
              <div className="palette-help">
                <strong>Как пользоваться</strong>
                <p>
                  Подготовьте файл JSON, TXT, CSS или SVG с HEX-цветами. Для JSON используйте ключ{' '}
                  <code>{'colors'}</code> и значения в формате <code>#RRGGBB</code>. Например:{' '}
                  <code>#D7CDF5</code>. После загрузки палитра сразу применится к объектам и фону.
                  Порядок важен: первый цвет задаёт фон, следующие — основные акценты и
                  дополнительные оттенки.
                </p>
                <button
                  type="button"
                  className="palette-template"
                  onClick={downloadPaletteTemplate}
                >
                  <Download size={12} /> Скачать шаблон палитры (.json)
                </button>
              </div>
              {customColors && (
                <div className="custom-palette">
                  {customColors.map((c) => (
                    <i key={c} style={{ background: c }} />
                  ))}
                  <button onClick={() => setCustomColors(null)}>Сбросить</button>
                </div>
              )}
            </section>
            <section className="inspector-section">
              <div className="section-title">
                <span>ПАРАМЕТРЫ ОБЪЕКТА</span>
                <ChevronDown size={14} />
              </div>
              {selectedItem ? (
                <>
                  <div className="selected-object">
                    <div className="selected-thumb">
                      {React.createElement(icons[selectedItem.name] || Shapes, { size: 21 })}
                    </div>
                    <div>
                      <strong>{selectedItem.name}</strong>
                      <small>{selectedItem.category}</small>
                    </div>
                  </div>
                  <div className="field-label">Состояние объекта</div>
                  <div className="role-switch">
                    <button
                      className={selectedItem.role === 'main' ? 'active' : ''}
                      onClick={() => update(selected, { role: 'main', opacity: 1 })}
                    >
                      Главный · цветной
                    </button>
                    <button
                      className={selectedItem.role === 'background' ? 'active' : ''}
                      onClick={() => update(selected, { role: 'background', opacity: 1 })}
                    >
                      Фоновый · моно
                    </button>
                  </div>
                  <div className="field-label role-hint">
                    Для фонового состояния используется отдельная монохромная SVG-версия
                  </div>
                  <div className="property-grid">
                    <label>
                      <span>Позиция X</span>
                      <input
                        type="number"
                        value={Math.round(selectedItem.x)}
                        onChange={(e) => update(selected, { x: +e.target.value })}
                      />
                    </label>
                    <label>
                      <span>Позиция Y</span>
                      <input
                        type="number"
                        value={Math.round(selectedItem.y)}
                        onChange={(e) => update(selected, { y: +e.target.value })}
                      />
                    </label>
                    <label>
                      <span>Поворот</span>
                      <div className="number-suffix">
                        <input
                          type="number"
                          value={selectedItem.rotation}
                          onChange={(e) => update(selected, { rotation: +e.target.value })}
                        />
                        <span>°</span>
                      </div>
                    </label>
                  </div>
                  <div className="scale-note">
                    Пропорции и относительный размер исходных объектов зафиксированы
                  </div>
                  <div className="scale-note">
                    Поворачивайте объект круглой ручкой над рамкой выделения — мышью или касанием.
                  </div>
                  <div className="inspector-buttons">
                    <button onClick={() => update(selected, { rotation: 0 })}>
                      <RotateCw size={14} /> Сбросить угол
                    </button>
                    <button onClick={duplicate}>
                      <Copy size={14} /> Дублировать
                    </button>
                  </div>
                </>
              ) : (
                <div className="no-selection">
                  <MousePointer2 size={22} />
                  <strong>Объект не выбран</strong>
                  <span>Выберите элемент на холсте, чтобы изменить его параметры</span>
                </div>
              )}
            </section>
            <section className="ai-card">
              <div className="ai-card-top">
                <div className="ai-icon">
                  <Sparkles size={17} />
                </div>
                <div>
                  <strong>AI-компоновщик</strong>
                  <small>Подбор по смыслу и метафоре</small>
                </div>
                <span className="ai-tag">BETA</span>
              </div>
              <p>
                Введите любую тему или метафору — деловую, бытовую, учебную или творческую. Подберём
                подходящие элементы из исходной библиотеки.
              </p>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Например: музыка, уютный дом, путешествие, творческие идеи..."
              />
              <button className="ai-button" onClick={compose} disabled={!prompt.trim()}>
                <WandSparkles size={15} /> Собрать композицию <span>→</span>
              </button>
              <small className="ai-footnote">
                Только исходные SVG · Без генерации новых объектов
              </small>
            </section>
            <div className="right-footer">
              <span className="green-dot" /> SVG-вектор сохраняется при экспорте
            </div>
          </aside>
        </main>
      </div>
      <input
        ref={paletteRef}
        type="file"
        accept=".json,.txt,.css,.svg"
        hidden
        onChange={uploadPalette}
      />
      {notice && (
        <div className="toast">
          <Check size={16} />
          {notice}
          <button onClick={() => setNotice('')}>
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);

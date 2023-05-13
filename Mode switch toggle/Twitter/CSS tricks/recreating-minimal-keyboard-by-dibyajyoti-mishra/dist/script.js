const keyboard = document.querySelector('.keyboard');
const rotation = { x: 20, y: 0 };
// const empty = document.querySelector('.empty');
// empty.style.color = 'white';
let animating = [];
let animatingColor;
const keysDown = new Set();
const keyCodeToEle = new Map();
const allKeys = [...document.querySelectorAll('.key')];
allKeys.forEach(ele => {
  ele.dataset.code && keyCodeToEle.set(ele.dataset.code, ele);
});
const capsLockKeyIndex = allKeys.indexOf(keyCodeToEle.get('CapsLock'));
const arrowKeyIndexes = ['Up', 'Left', 'Down', 'Right'].map(n => allKeys.indexOf(keyCodeToEle.get(`Arrow${n}`)));
const macroKeys = [document.querySelector('[data-code="Escape"]'), ...document.querySelectorAll('[data-macro]')];
const furthestKeys = {};
requestAnimationFrame(() => {
  const allKeyBounds = allKeys.map(n => n.getBoundingClientRect());
  for (const macro of macroKeys) {
    const index = allKeys.indexOf(macro);
    const color = macro.dataset.macro;
    furthestKeys[color] = 0;
    const macroBounds = allKeyBounds[index];
    for (let i = 0; i < allKeys.length; i++) {
      const ele = allKeys[i];
      if (macro === ele) continue;
      const eleBounds = allKeyBounds[i];
      const d = dist(
      macroBounds.x + macroBounds.width * 0.5, macroBounds.y + macroBounds.height * 0.5,
      eleBounds.x + eleBounds.width * 0.5, eleBounds.y + eleBounds.height * 0.5);

      ele.macro = ele.macro || {};
      ele.macro[color] = d;
      if (d > furthestKeys[color]) {
        furthestKeys[color] = d;
      }
    }
  }
});
function animateMacro(ele) {
  const { macro } = ele.dataset;
  const [color, id] = macro.split(':');
  if (!keysDown.has(capsLockKeyIndex)) {
    if (['Space', 'ShiftLeft'].includes(id)) {
      return;
    }
  }
  animating.push({ time: performance.now(), macro, color });
  // animating.push({ time: performance.now(), color: macro.split(':')[0] });
  if (animating.length === 1) {
    _draw();
  }
}
macroKeys.forEach(ele => {
  ele.addEventListener('click', () => animateMacro(ele));
});
function setKeyState(code, state) {
  const ele = keyCodeToEle.get(code);
  if (ele) {
    if (state) {
      keysDown.add(allKeys.indexOf(ele));
      ele.dataset.selected = 'true';
    } else
    {
      ele.dataset.selected = 'false';
      keysDown.delete(allKeys.indexOf(ele));
      if (macroKeys.includes(ele)) {
        animateMacro(ele);
      }
    }
    const [up, left, down, right] = arrowKeyIndexes.map(n => keysDown.has(n));
    if (up) rotation.x += 1;
    if (left) rotation.y += -1;
    if (down) rotation.x += -1;
    if (right) rotation.y += 1;
    keyboard.style.setProperty('--rot-x', `${rotation.x}deg`);
    keyboard.style.setProperty('--rot-y', `${rotation.y}deg`);
  }
}
window.addEventListener('keydown', e => {
  if (e.code.startsWith('F') && !isNaN(e.code.slice(1))) {
    return;
  }
  e.preventDefault();
  setKeyState('CapsLock', e.getModifierState('CapsLock'));
  if (e.code === 'CapsLock') {
    return;
  }
  // if(animating.length) return;
  // empty.textContent = e.code;
  // const ele = document.querySelector(`[data-code=${e.code}]`);
  setKeyState(e.code, true);
});
window.addEventListener('keyup', e => {
  e.preventDefault();
  setKeyState('CapsLock', e.getModifierState('CapsLock'));
  if (e.code === 'CapsLock') {
    return;
  }
  // if(animating.length) return;
  // empty.textContent = e.code;
  // const ele = document.querySelector(`[data-code=${e.code}]`);
  setKeyState(e.code, false);
});
window.addEventListener('blur', e => {
  if (animating.length) animating.splice(0);
  for (const ele of document.querySelectorAll('[data-selected="true"], [data-color]')) {
    const index = allKeys.indexOf(ele);
    if (index !== capsLockKeyIndex) {
      ele.dataset.selected = 'false';
      ele.dataset.color = '';
      keysDown.delete(index);
    }
  }
});

function distSq(x1, y1, x2, y2) {
  const _x = x2 - x1,_y = y2 - y1;
  return _x * _x + _y * _y;
}
function dist(x1, y1, x2, y2) {
  const d = distSq(x1, y1, x2, y2);
  if (d === 0) return 0;
  return Math.sqrt(d);
}

function _draw(e) {
  draw(e);
  if (animating.length) {
    requestAnimationFrame(_draw);
  } else
  {
    for (const ele of document.querySelectorAll('[data-selected="true"], [data-color]')) {
      ele.dataset.selected = 'false';
      ele.dataset.color = '';
    }
  }
}

function draw(e) {
  if (!animating.length) return;
  const actions = Array(allKeys.length).fill(false);
  keysDown.forEach(i => actions[i] = true);
  const dilation = 100;
  for (let i = animating.length - 1; i >= 0; i--) {
    const a = animating[i];
    const time = e - a.time;
    const duration = furthestKeys[a.macro] + dilation;
    if (time >= duration) {
      animating.splice(i, 1);
      return;
    }
    for (let keyIndex = 0; keyIndex < allKeys.length; keyIndex++) {
      const key = allKeys[keyIndex];
      const d = key.macro[a.macro];
      const t = Math.abs(time - d);
      if (t < dilation && !actions[keyIndex]) {
        actions[keyIndex] = a.color;
      }
    }
  }
  for (let i = 0; i < actions.length; i++) {
    const key = allKeys[i];
    if (actions[i]) {
      key.dataset.selected = 'true';
      if (typeof actions[i] === 'string') {
        key.dataset.color = actions[i];
      }
    } else
    {
      key.dataset.color = '';
      key.dataset.selected = 'false';
    }
  }
}
// eslint-disable-next-line
;(function () {
  const {
    // GSDevTools,
    gsap,
    gsap: { timeline, to, fromTo } } =
  window;

  const CURVES = {
    RIGHT:
    'M68.91306296.0087038s.77124463 23.43903799 6.34896852 36.75152668c9.014994 21.51630343 16.57659448 28.05805003 16.57659448 28.05805003',
    LEFT:
    'M29.2255629.00870376s-.77124454 23.43903794-6.34896837 36.75152662C13.86160061 58.2765338 6.3000002 64.81828041 6.3000002 64.81828041' };

  const STRAIGHTS = {
    LEFT: 'M29.2255633.00870392v68.74491',
    RIGHT: 'M68.9130633.00870392v68.74491' };


  const SPEEDS = {
    ON: 0.05,
    STAGGER: 0.05,
    SWING: 0.5,
    EASE: 4 };

  // Disabled for now
  // const isLightMode = window.matchMedia('(prefers-color-scheme: light)').matches
  const isLightMode = false;
  const CONFIG = {
    ROTATION: 30,
    FILAMENT: {
      LIGHTNESS: {
        OFF: isLightMode ? 70 : 40,
        ON: 100 } },


    GLASS: {
      ALPHA: {
        ON: 1,
        OFF: 0 },

      SATURATION: {
        ON: 100,
        OFF: 0 },

      LIGHTNESS: {
        ON: isLightMode ? 80 : 50,
        OFF: isLightMode ? 80 : 30 } } };




  // DOM ORDERING IS 3, 6, 5, 2, 1, 4 🤦‍♂
  const BULBS = document.querySelectorAll('.light-bulb__bulb');
  const GLASSES = document.querySelectorAll('.light-bulb__glass');
  const CHORDS = document.querySelectorAll('.light-bulb__chord');
  const BLOOMS = document.querySelectorAll('.light-bulb__bloom');
  const FILAMENTS = document.querySelectorAll('g.light-bulb__filament');

  // Set transform origin on swinging bulbs
  gsap.set('.wrapper', { display: 'block' });
  gsap.set(BULBS[1], { transformOrigin: `50% -375%`, rotate: -CONFIG.ROTATION });
  gsap.set(CHORDS[1], { morphSVG: { d: CURVES.RIGHT } });
  gsap.set(GLASSES, { '--light-alpha': CONFIG.GLASS.ALPHA.OFF });
  gsap.set(GLASSES[1], {
    '--light-alpha': CONFIG.GLASS.ALPHA.ON,
    '--glass-saturation': CONFIG.GLASS.SATURATION.ON,
    '--glass-lightness': CONFIG.GLASS.LIGHTNESS.ON });

  gsap.set(BULBS[4], { transformOrigin: '50% -375%' });
  gsap.set(BLOOMS, { scale: 0, transformOrigin: '50% 50%' });
  gsap.set(FILAMENTS[1], {
    '--filament-lightness': CONFIG.FILAMENT.LIGHTNESS.ON });


  //Create sub timelines
  const SWING_LEFT_TL = new timeline().
  add(
  to(CHORDS[4], {
    ease: `power${SPEEDS.EASE}.out`,
    duration: SPEEDS.SWING,
    morphSVG: {
      d: CURVES.LEFT } }),


  0).

  add(
  to(BULBS[4], {
    ease: `power${SPEEDS.EASE}.out`,
    rotate: CONFIG.ROTATION,
    duration: SPEEDS.SWING }),

  0).

  add(
  to(GLASSES[4], {
    '--light-alpha': CONFIG.GLASS.ALPHA.ON,
    '--glass-saturation': CONFIG.GLASS.SATURATION.ON,
    '--glass-lightness': CONFIG.GLASS.LIGHTNESS.ON,
    duration: SPEEDS.ON }),

  0).

  add(
  to(FILAMENTS[4], {
    '--filament-lightness': CONFIG.FILAMENT.LIGHTNESS.ON,
    duration: SPEEDS.ON }),

  0).

  add(
  to(BLOOMS[4], {
    duration: SPEEDS.ON * 5,
    scale: 1.3,
    opacity: 0 }),

  0).

  add(
  to(CHORDS[4], {
    ease: `power${SPEEDS.EASE}.in`,
    duration: SPEEDS.SWING,
    morphSVG: {
      d: STRAIGHTS.LEFT } }),


  SPEEDS.SWING).

  add(
  to(BULBS[4], {
    ease: `power${SPEEDS.EASE}.in`,
    rotate: 0,
    duration: SPEEDS.SWING }),

  SPEEDS.SWING).

  add(
  to(GLASSES[4], {
    duration: SPEEDS.ON,
    '--light-alpha': CONFIG.GLASS.ALPHA.OFF,
    '--glass-saturation': CONFIG.GLASS.SATURATION.OFF,
    '--glass-lightness': CONFIG.GLASS.LIGHTNESS.OFF }),

  'SWINGING_BACK').

  add(
  to(FILAMENTS[4], {
    '--filament-lightness': CONFIG.FILAMENT.LIGHTNESS.OFF,
    duration: SPEEDS.ON }),

  'SWINGING_BACK');


  const SWING_RIGHT_TL = new timeline().
  add(
  to(CHORDS[1], SPEEDS.SWING, {
    ease: `power${SPEEDS.EASE}.in`,
    morphSVG: {
      d: STRAIGHTS.RIGHT } }),


  0).

  add(
  to(BULBS[1], SPEEDS.SWING, {
    ease: `power${SPEEDS.EASE}.in`,
    rotate: 0 }),

  0).

  add(
  to(
  GLASSES[1],
  {
    duration: SPEEDS.ON,
    '--light-alpha': CONFIG.GLASS.ALPHA.OFF,
    '--glass-saturation': CONFIG.GLASS.SATURATION.OFF,
    '--glass-lightness': CONFIG.GLASS.LIGHTNESS.OFF },

  'SWITCH_OFF')).


  add(
  to(FILAMENTS[1], {
    duration: SPEEDS.ON,
    '--filament-lightness': CONFIG.FILAMENT.LIGHTNESS.OFF }),

  'SWITCH_OFF');


  const FLASH_TL = new timeline().
  add(
  to([GLASSES[2], GLASSES[5], GLASSES[0], GLASSES[3]], {
    duration: SPEEDS.ON,
    stagger: SPEEDS.STAGGER,
    '--light-alpha': CONFIG.GLASS.ALPHA.ON,
    '--glass-saturation': CONFIG.GLASS.SATURATION.ON,
    '--glass-lightness': CONFIG.GLASS.LIGHTNESS.ON }),

  'SWITCHING_ON').

  add(
  to([BLOOMS[2], BLOOMS[5], BLOOMS[0], BLOOMS[3]], {
    duration: SPEEDS.ON * 5,
    stagger: SPEEDS.STAGGER,
    scale: 1.25,
    opacity: 0 }),

  'SWITCHING_ON').

  add(
  to([FILAMENTS[2], FILAMENTS[5], FILAMENTS[0], FILAMENTS[3]], {
    duration: SPEEDS.ON,
    stagger: SPEEDS.STAGGER,
    '--filament-lightness': CONFIG.FILAMENT.LIGHTNESS.ON }),

  'SWITCHING_ON').

  add(
  to([GLASSES[2], GLASSES[5], GLASSES[0], GLASSES[3]], {
    duration: SPEEDS.ON * 2,
    stagger: SPEEDS.STAGGER,
    '--light-alpha': CONFIG.GLASS.ALPHA.OFF,
    '--glass-saturation': CONFIG.GLASS.SATURATION.OFF,
    '--glass-lightness': CONFIG.GLASS.LIGHTNESS.OFF }),

  SPEEDS.ON).

  add(
  to([FILAMENTS[2], FILAMENTS[5], FILAMENTS[0], FILAMENTS[3]], {
    duration: SPEEDS.ON * 2,
    stagger: SPEEDS.STAGGER,
    '--filament-lightness': CONFIG.FILAMENT.LIGHTNESS.OFF }),

  SPEEDS.ON);


  const FLASH_BACK_TL = new timeline().
  add(
  to([GLASSES[3], GLASSES[0], GLASSES[5], GLASSES[2]], {
    duration: SPEEDS.ON,
    stagger: SPEEDS.STAGGER,
    '--light-alpha': CONFIG.GLASS.ALPHA.ON,
    '--glass-saturation': CONFIG.GLASS.SATURATION.ON,
    '--glass-lightness': CONFIG.GLASS.LIGHTNESS.ON }),

  'SWITCHING_ON_2').

  add(
  fromTo(
  [BLOOMS[3], BLOOMS[0], BLOOMS[5], BLOOMS[2]],
  {
    scale: 0,
    opacity: 1 },

  {
    scale: 1.25,
    opacity: 0,
    duration: SPEEDS.ON * 5,
    stagger: SPEEDS.STAGGER }),


  'SWITCHING_ON_2').

  add(
  to([FILAMENTS[3], FILAMENTS[0], FILAMENTS[5], FILAMENTS[2]], {
    duration: SPEEDS.ON,
    stagger: SPEEDS.STAGGER,
    '--filament-lightness': CONFIG.FILAMENT.LIGHTNESS.ON }),

  'SWITCHING_ON_2').

  add(
  to([GLASSES[3], GLASSES[0], GLASSES[5], GLASSES[2]], {
    duration: SPEEDS.ON * 2,
    stagger: SPEEDS.STAGGER,
    '--light-alpha': CONFIG.GLASS.ALPHA.OFF,
    '--glass-saturation': CONFIG.GLASS.SATURATION.OFF,
    '--glass-lightness': CONFIG.GLASS.LIGHTNESS.OFF }),

  SPEEDS.ON).

  add(
  to([FILAMENTS[3], FILAMENTS[0], FILAMENTS[5], FILAMENTS[2]], {
    duration: SPEEDS.ON * 2,
    stagger: SPEEDS.STAGGER,
    '--filament-lightness': CONFIG.FILAMENT.LIGHTNESS.OFF }),

  SPEEDS.ON);


  const SWING_RIGHT_BACK_TL = new timeline().
  add(
  to(CHORDS[1], {
    ease: `power${SPEEDS.EASE}.out`,
    duration: SPEEDS.SWING,
    morphSVG: {
      d: CURVES.RIGHT } }),


  0).

  add(
  to(BULBS[1], {
    ease: `power${SPEEDS.EASE}.out`,
    duration: SPEEDS.SWING,
    rotation: -CONFIG.ROTATION }),

  0).

  add(
  to(GLASSES[1], {
    '--light-alpha': CONFIG.GLASS.ALPHA.ON,
    '--glass-saturation': CONFIG.GLASS.SATURATION.ON,
    '--glass-lightness': CONFIG.GLASS.LIGHTNESS.ON,
    duration: SPEEDS.ON }),

  0).

  add(
  to(FILAMENTS[1], {
    '--filament-lightness': CONFIG.FILAMENT.LIGHTNESS.ON,
    duration: SPEEDS.ON }),

  0).

  add(
  to(BLOOMS[1], {
    duration: SPEEDS.ON * 5,
    stagger: SPEEDS.STAGGER,
    scale: 1.3,
    opacity: 0 }),

  0);


  const BULBS_TL = new timeline({ repeat: -1 });

  BULBS_TL.add(SWING_RIGHT_TL, 'SWING_IN');
  BULBS_TL.add(FLASH_TL, `>-${SPEEDS.ON * 2}`);
  BULBS_TL.add(SWING_LEFT_TL, `>-${SPEEDS.ON * 4}`);
  BULBS_TL.add(FLASH_BACK_TL, `>-${SPEEDS.ON}`);
  BULBS_TL.add(SWING_RIGHT_BACK_TL, `>-${SPEEDS.ON * 4}`);

  /**
   * Easter EGG - Type to Hue
   */
  const CONTAINER = document.querySelector('.banner-container');
  let HUE = '';
  const processHue = e => {
    if (e.key !== undefined && parseInt(e.key, 10) !== undefined) {
      HUE += e.key;
      if (HUE.length === 3) {
        if (HUE >= 0 && HUE <= 360) {
          for (const BULB of BULBS) {
            BULB.style.setProperty('--bulb-hue', HUE);
          }
          const BANNER = document.createElement('div');
          BANNER.className = 'hue-banner';
          BANNER.style = `--hue: ${HUE};`;
          BANNER.innerHTML = `Hue changed to ${HUE}`;
          CONTAINER.appendChild(BANNER);
          BANNER.addEventListener('animationend', BANNER.remove);
        }
        // Reset the hue regardless of whether it is valid
        HUE = '';
      }
    }
  };
  window.addEventListener('keyup', processHue);
  // GSDevTools.create()
})();
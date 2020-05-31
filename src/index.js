/*
 * Display.log
 * Copyright 2019 Aleksandr Novikov
 * MIT License
 */

((global, displayLog) => {
  if (typeof global !== 'undefined') global.displayLog = displayLog();
})(window, () => {
  'use strict';

  const TYPE_WARN = 'warn';
  const TYPE_LOG = 'log';
  const TYPE_INFO = 'info';
  const TYPE_ERROR = 'error';
  const TYPE_CLEAR = 'clear';

  const settings = {
    bgColor: 'rgba(0, 0, 0, 0.4)',
    textColor: '#fff',
    fontSize: '1em',
    fontFamily: 'Courier New, sans-serif',
    padding: '0.5vw',
    maxHeight: '30vh',
    closable: true,
  };

  const openedToggleTitle = 'Console &#x25B2;';
  const closedToggleTitle = 'Console &#x25BC;';

  const originalConsole = {
    [TYPE_LOG]: console.log,
    [TYPE_INFO]: console.info,
    [TYPE_WARN]: console.warn,
    [TYPE_ERROR]: console.error,
    [TYPE_CLEAR]: console.clear,
  };

  const initialize = (customSettings) => {
    const mergedSettings = { ...settings, ...customSettings };

    const panel = createPanel(mergedSettings);
    if (document.body) {
      document.body.appendChild(panel);
    } else {
      throw new Error('Please insert this script after <body> tag');
    }

    const logOnPanelWithSettings = log(panel)(mergedSettings);
    console.warn = logOnPanelWithSettings(TYPE_WARN);
    console.log = logOnPanelWithSettings(TYPE_LOG);
    console.info = logOnPanelWithSettings(TYPE_INFO);
    console.error = logOnPanelWithSettings(TYPE_ERROR);
    console.clear = clear(panel)(mergedSettings)(TYPE_CLEAR);
  };

  const createPanel = (settings) => {
    const panel = createElement('div');

    Object.assign(panel.style, {
      color: settings.textColor,
      backgroundColor: settings.bgColor,
      fontSize: settings.fontSize,
      fontFamily: settings.fontFamily,
      width: '100vw',
      position: 'fixed',
      top: '0',
      left: '0',
      overflowY: 'auto',
      maxHeight: settings.maxHeight,
      zIndex: Number.MAX_SAFE_INTEGER,
      display: 'flex',
      flexDirection: 'column',
    });

    if (settings.closable) {
      appendToggle(panel)(settings);
    }

    return panel;
  };

  const createElement = (el) => document.createElement(el);

  const appendToggle = (panel) => (settings) => {
    const toggle = createElement('div');

    Object.assign(toggle.style, {
      textAlign: 'center',
      cursor: 'pointer',
      padding: settings.padding,
    });

    toggle.innerHTML = openedToggleTitle;
    toggle.addEventListener('click', togglePanel(panel, toggle));

    panel.appendChild(toggle);
    resetPanelPosition(panel);
  };

  const togglePanel = (panel, toggle) => () =>
    isClosed(panel) ? open(panel, toggle) : close(panel, toggle);

  const resetPanelPosition = (panel) => (panel.style.top = '0');

  const isClosed = (panel) => panel.style.top.slice(0, 1) === '-';

  const close = (panel, toggle) => {
    toggle.innerHTML = closedToggleTitle;
    panel.style.top =
      panel.scrollHeight / panel.children.length - panel.clientHeight + 'px';
  };

  const open = (panel, toggle) => {
    toggle.innerHTML = openedToggleTitle;
    resetPanelPosition(panel);
  };

  const log = (panel) => (settings) => (logType) => (...args) => {
    originalLog(logType)(...args);
    customLog(panel)(settings)(logType)(...args);
  };

  const clear = (panel) => (settings) => (logType) => () => {
    originalLog(logType);
    panel.innerHTML = '';
    if (settings.closable) appendToggle(panel)(settings);
  };

  const originalLog = (logType) => (...args) =>
    originalConsole[logType] && originalConsole[logType].apply(console, args);

  const customLog = (panel) => (settings) => (logType) => (...args) => {
    const line = createElement('div');
    line.style.padding = settings.padding;

    const message = args.reduce(
      (acc, arg) =>
        `${acc} ${typeof arg === 'object' ? JSON.stringify(arg) : arg}`
    );
    line.textContent = `[console.${logType}]: ${message}`;

    addElementOnPanel(panel)(line)(settings);
  };

  const panelScrollTop = (panel) =>
    (panel.scrollTop = panel.scrollHeight - panel.clientHeight);

  const addElementOnPanel = (panel) => (element) => (settings) => {
    if (settings.closable) {
      const toggle = panel.children[panel.children.length - 1];
      panel.insertBefore(element, toggle);
      if (isClosed(panel)) close(panel, toggle);
    } else {
      panel.appendChild(element);
    }

    panelScrollTop(panel);
  };

  return {
    init: (customSettings) => initialize(customSettings),
  };
});

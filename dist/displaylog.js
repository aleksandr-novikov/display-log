/*
 * Display.log
 * Copyright 2019 Aleksandr Novikov
 * MIT License
 */

((global, displayLog) => {
    if (typeof global !== 'undefined')
        global.displayLog = displayLog();
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
        padding: '0.5vw',
        maxHeight: '30vh',
        closable: true
    };

    const originalConsole = {
        [TYPE_LOG]: console.log,
        [TYPE_INFO]: console.info,
        [TYPE_WARN]: console.warn,
        [TYPE_ERROR]: console.error,
        [TYPE_CLEAR]: console.clear
    };

    const initialize = customSettings => {
        const mergedSettings = {...settings, ...customSettings};

        const panel = createPanel(mergedSettings);
        document.body.appendChild(panel);

        const logOnPanelWithSettings = log(panel)(mergedSettings);
        console.warn = logOnPanelWithSettings(TYPE_WARN);
        console.log = logOnPanelWithSettings(TYPE_LOG);
        console.info = logOnPanelWithSettings(TYPE_INFO);
        console.error = logOnPanelWithSettings(TYPE_ERROR);
        console.clear = clear(panel)(mergedSettings)(TYPE_CLEAR);
    };

    const createPanel = settings => {
        const panel = createElement('div');

        Object.assign(panel.style, {
            color: settings.textColor,
            backgroundColor: settings.bgColor,
            fontSize: settings.fontSize,
            width: '100vw',
            position: 'fixed',
            top: '0',
            overflow: 'auto',
            maxHeight: settings.maxHeight,
            zIndex: Number.MAX_SAFE_INTEGER
        });

        if (settings.closable) {
            appendToggle(panel, settings);
        }

        return panel;
    };

    const createElement = el => document.createElement(el);

    const appendToggle = (panel, settings) => {
        const toggle = createElement('div');

        Object.assign(toggle.style, {
            textAlign: 'center',
            paddingTop: settings.padding,
            paddingBottom: settings.padding
        });

        toggle.innerHTML = 'console &#8691;';
        toggle.addEventListener('click', togglePanel(panel));

        panel.appendChild(toggle);
    };

    const togglePanel = panel => () => isClosed(panel) ? open(panel) : close(panel);

    const isClosed = panel => panel.style.top.slice(0, 1) === '-';

    const close = panel =>
        panel.style.top = panel.scrollHeight / panel.children.length - panel.clientHeight + 'px';

    const open = panel => panel.style.top = '0';

    const log = panel => settings => logType => (...args) => {
        originalLog(logType, ...args);
        customLog(panel, logType, settings, ...args);
    };

    const clear = panel => settings => logType => () => {
        originalLog(logType);
        panel.innerHTML = '';
        if (settings.closable) appendToggle(panel, settings);
    };

    const originalLog = (logType, ...args) =>
        originalConsole[logType] && originalConsole[logType].apply(console, args);

    const customLog = (panel, logType, settings, ...args) => {
        const line = createElement('div');
        line.style.padding = settings.padding;

        const message = args.reduce((acc, arg) =>
            `${acc} ${typeof arg === 'object' ? JSON.stringify(arg) : arg}`);
        line.textContent = `[console.${logType}]: ${message}`;

        if (settings.closable) {
            panel.insertBefore(line, panel.children[panel.children.length - 1]);
            if (isClosed(panel)) close(panel);
        } else {
            panel.appendChild(line);
        }

        panel.scrollTop = panel.scrollHeight - panel.clientHeight;
    };

    return {
        init: customSettings => initialize(customSettings)
    };

});
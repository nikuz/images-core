
import './css/base.css';

const maxCanvasSize = 1920;

const remapValue = (value, inMin, inMax, outMin, outMax) => {
    if (value < inMin) {
        return outMin;
    }
    if (value > inMax) {
        return outMax;
    }

    return (
        ((value - inMin) * (outMax - outMin)) / (inMax - inMin)
    ) + outMin;
};

function hexToRgbA(hex, opacity) {
    let c;
    c = hex.substring(1).split('');
    if (c.length === 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = `0x4${c.join('')}`;

    return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',')}, ${opacity})`;
}

class Renderer {
    constructor(props) {
        const width = props.width < maxCanvasSize ? props.width : maxCanvasSize;
        const height = props.height < maxCanvasSize ? props.height : maxCanvasSize;

        this.newState = {
            ...props,
            width,
            height,
            text: props.text.trim(),
            textFontSize: props.width / 10,
            marginHorizontal: height / 9,
            textFrameOpacity: props.textEffect === 'type' ? 0.5 : 0.1,
            textFrameOpacityStep: props.textEffect === 'type' ? 0.5 : 0.1,
            authorFrameOpacity: props.authorEffect === 'type' ? 0.5 : 0.1,
            authorFrameOpacityStep: props.authorEffect === 'type' ? 0.5 : 0.1,
        };

        this.loadFonts(this.state.textFontFamily);
        this.loadFonts(this.state.authorFontFamily);

        let container = props.container;
        if (typeof props.container === 'string') {
            container = document.querySelector(props.container);
        }
        if (!container) {
            console.error('Wrong container selector'); // eslint-disable-line
            return;
        }

        this.containerEl = document.createElement('div');
        this.containerEl.id = 'images-core-container';
        this.canvasEl = document.createElement('canvas');
        this.containerEl.appendChild(this.canvasEl);
        container.appendChild(this.containerEl);

        this.context.font = this.getFont(this.state.textFontSize, this.state.textFontFamily);

        this.setCanvasSize();

        this.preloadFontsIntoScope();
    }

    containerEl;

    canvasEl;

    renderStartedAt;

    state = {
        width: 600,
        height: 600,
        // image
        image: null,
        imageURL: '',
        // text
        text: '',
        textLines: [],
        textLettersFade: [],
        textFontFamily: 'Kaushan',
        textFontSize: 12, // in px
        textFontLoaded: false,
        textEffect: 'fade', // type | fade-lines | fade-letters | slide-lines | append-lines | fade
        textFullyRendered: false,
        textLastRenderedLetter: '',
        textFrame: 1,
        textFrameOpacity: 0.1,
        textFrameOpacityStep: 0.1,
        textLettersOpacity: 0,
        textLettersOpacityStep: 0.05,
        textFramePosition: 0,
        textFramePositionStep: 0.1,
        textAlign: 'right', // left | center | right
        textVerticalAlign: 'top', // top | center | bottom
        // author
        author: '',
        authorLines: [],
        authorFontFamily: 'Nickainley',
        authorFontSize: 6,
        authorFontLoaded: false,
        authorEffect: 'fade', // type | slide | append | fade
        authorFullyRendered: false,
        authorLastRenderedLetter: '',
        authorFrame: 1,
        authorFrameOpacity: 0.1,
        authorFrameOpacityStep: 0.1,
        authorFramePosition: 0,
        authorFramePositionStep: 0.1,
        authorAlign: 'left', // left | center | right
        authorVerticalAlign: '', // stick | bottom
        authorPosition: {},
        // common
        animate: true,
        frameQuality: 0.93,
        overlay: '', // solid | lines | border
        separator: '', // line | dash | dot
        separatorFullyRendered: false,
        separatorOpacity: 0,
        separatorOpacityStep: 0.1,
        marginHorizontal: 50, // in px
        color: '#FFF',
    };

    set newState(props) {
        Object.keys(props).forEach((item) => {
            this.state[item] = props[item];
        });
    }

    loadFonts = (fontFamily) => {
        switch (fontFamily) {
            case 'Kaushan':
                return require('./css/kaushan.css');
            case 'NickAinley':
                return require('./css/nickainley.css');
            case 'Courgette':
                return require('./css/courgette.css');
            case 'Exo':
                return require('./css/exo.css');
            case 'GreatVibes':
                return require('./css/greatvibes.css');
            case 'Guerilla':
                return require('./css/guerilla.css');
            case 'Lato':
                return require('./css/lato.css');
            case 'Lobster':
                return require('./css/lobster.css');
            case 'MyUnderwood':
                return require('./css/myunderwood.css');
            case 'Sensei':
                return require('./css/sensei.css');
            case 'Sports':
                return require('./css/sports.css');
            case 'Tahoma':
                return require('./css/tahoma.css');
            case 'Typograph':
                return require('./css/typograph.css');
            case 'YellowTail':
                return require('./css/yellowtail.css');
            default:
                return null;
        }
    };

    preloadFontsIntoScope = () => {
        const {
            textFontSize,
            textFontFamily,
            authorFontFamily,
        } = this.state;

        const fonts = [{
            id: 'text',
            fontSize: textFontSize,
            font: this.getFont(textFontSize, textFontFamily),
            stateProp: 'textFontLoaded',
        }, {
            id: 'author',
            fontSize: textFontSize,
            font: this.getFont(textFontSize, authorFontFamily),
            stateProp: 'authorFontLoaded',
        }];

        fonts.forEach((fontItem) => {
            const el = document.createElement('span');
            el.innerText = 'Some text';
            el.style.position = 'absolute';
            el.style.top = '-9999px';
            el.style.left = '-9999px';
            el.style.font = `${fontItem.fontSize}px system`;
            document.body.appendChild(el);
            const fallbackFontWidth = el.offsetWidth;
            el.style.font = fontItem.font;

            const checkFontLoad = () => {
                const loadedFontWidth = el.offsetWidth;
                if (fallbackFontWidth === loadedFontWidth) {
                    setTimeout(checkFontLoad, 10);
                } else {
                    this.newState = {
                        [fontItem.stateProp]: true,
                    };
                }
            };
            checkFontLoad();
        });
    };

    setCanvasSize = () => {
        const {
            width,
            height,
        } = this.state;

        if (this.canvasEl) {
            this.canvasEl.width = width;
            this.canvasEl.height = height;
        }
    };

    get context() {
        if (this.canvasEl) {
            return this.canvasEl.getContext('2d');
        }

        return null;
    }

    get marginHorizontal() {
        const { overlay } = this.state;
        const { marginHorizontal } = this.state;

        if (overlay === 'solid' || overlay === 'border') {
            return marginHorizontal * 2;
        }

        return marginHorizontal;
    }

    loadImage = () => (
        new Promise((resolve, reject) => {
            const { imageURL } = this.state;
            const imageObj = new Image();
            imageObj.onload = () => {
                this.newState = {
                    image: imageObj,
                };
                resolve();
            };
            imageObj.onerror = (err) => {
                reject(err);
            };
            imageObj.src = imageURL;
        })
    );

    renderImage = () => {
        if (!this.context) {
            return;
        }

        const {
            image,
            width,
            height,
        } = this.state;

        if (image) {
            let w = image.width;
            let h = image.height;
            let x;
            let y;
            const ratio = w / h;
            if (w > h) {
                h = height;
                w = height * ratio;
                y = 0;
                x = -((w - width) / 2);
            } else {
                w = width;
                h = width / ratio;
                x = 0;
                y = -((h - height) / 2);
            }

            this.context.drawImage(image, x, y, w, h);
        }
    };

    renderOverlay = () => {
        if (!this.context) {
            return;
        }

        const {
            overlay,
            width,
            height,
            marginHorizontal,
            color,
        } = this.state;

        this.context.shadowOffsetX = 0;
        this.context.shadowOffsetY = 0;
        this.context.shadowColor = 0;
        this.context.shadowBlur = 0;

        if (overlay === 'solid') {
            this.context.fillStyle = hexToRgbA('#000', 0.5);
            this.context.fillRect(
                marginHorizontal / 2,
                marginHorizontal / 2,
                width - marginHorizontal,
                height - marginHorizontal
            );
        }
        if (overlay === 'border') {
            this.context.beginPath();
            this.context.lineWidth = 4;
            this.context.strokeStyle = color;
            this.context.rect(
                marginHorizontal / 2,
                marginHorizontal / 2,
                width - marginHorizontal,
                height - marginHorizontal
            );
            this.context.stroke();
        }
        if (overlay === 'lines') {
            this.context.lineWidth = 4;
            this.context.strokeStyle = color;

            this.context.beginPath();
            this.context.moveTo(marginHorizontal / 2, marginHorizontal / 2);
            this.context.lineTo(width - (marginHorizontal / 2), marginHorizontal / 2);
            this.context.stroke();

            this.context.beginPath();
            this.context.moveTo(marginHorizontal / 2, height - (marginHorizontal / 2));
            this.context.lineTo(width - (marginHorizontal / 2), height - (marginHorizontal / 2));
            this.context.stroke();
        }
    };

    getFont = (fontSize, fontFamily) => (
        `${fontSize}px "${fontFamily}"`
    );

    applyStyle = (el, styles) => {
        const elNode = el;
        Object.keys(styles).forEach((item) => {
            elNode.style[item] = styles[item];
        });
    };

    fontParams = {
        Kaushan: {      size: 68, lineHeight: 1.47  }, // eslint-disable-line
        Guerilla: {     size: 80, lineHeight: 1     }, // eslint-disable-line
        Courgette: {    size: 68, lineHeight: 1.3   }, // eslint-disable-line
        Exo: {          size: 68, lineHeight: 1.3   }, // eslint-disable-line
        GreatVibes: {   size: 95, lineHeight: 1     }, // eslint-disable-line
        Lato: {         size: 65, lineHeight: 1.3   }, // eslint-disable-line
        Lobster: {      size: 68, lineHeight: 1.3   }, // eslint-disable-line
        MyUnderwood: {  size: 68, lineHeight: 1.3   }, // eslint-disable-line
        NickAinley: {   size: 75, lineHeight: 1.2   }, // eslint-disable-line
        Sensei: {       size: 68, lineHeight: 1.3   }, // eslint-disable-line
        Sports: {       size: 55, lineHeight: 1.3   }, // eslint-disable-line
        Tahoma: {       size: 65, lineHeight: 1.3   }, // eslint-disable-line
        Typograph: {    size: 60, lineHeight: 1.3   }, // eslint-disable-line
        YellowTail: {   size: 75, lineHeight: 1.2   }, // eslint-disable-line
    };

    loadText = () => (
        new Promise((resolve) => {
            const {
                width,
                height,
                marginHorizontal,
                text,
                textFontFamily,
                textAlign,
                textVerticalAlign,
                author,
                authorFontFamily,
                authorAlign,
                authorVerticalAlign,
                overlay,
                separator,
                color,
            } = this.state;
            const debug = process.env.NODE_ENV !== 'production' && this.state.debug;
            const wrapFontSize = height < width ? height / 5 : width / 6;
            const fontParams = this.fontParams;

            const wrapper = document.createElement('div');
            wrapper.id = 'canvas-html-wrapper';
            const overlaySolid = overlay === 'solid' || overlay === 'border';
            const overlayLines = overlay === 'lines';
            const overlaySolidOrLines = overlaySolid || overlayLines;
            const containerLeft = overlaySolid ? marginHorizontal : marginHorizontal / 2;
            const containerTop = overlaySolidOrLines ? marginHorizontal : marginHorizontal / 2;
            const containerWidth = width - (overlaySolid ? marginHorizontal * 2 : marginHorizontal);
            const containerHeight = height - (
                overlaySolidOrLines ? marginHorizontal * 2 : marginHorizontal
            );
            this.applyStyle(wrapper, {
                fontSize: `${wrapFontSize}px`,
                color,
                left: `${containerLeft}px`,
                top: `${containerTop}px`,
                width: `${containerWidth}px`,
                height: `${containerHeight}px`,
            });

            const textEl = document.createElement('div');
            const baseFontSize = fontParams[textFontFamily].size;
            const maxFontSize = overlaySolid ? baseFontSize - 9 : baseFontSize;
            const minFontSize = overlaySolid ? baseFontSize - 35 : baseFontSize - 33;
            let textFZ = remapValue(
                text.length,
                10,
                256,
                height < width ? maxFontSize * 1.3 : maxFontSize,
                height < width ? minFontSize * 1.2 : minFontSize
            );
            textEl.id = 'canvas-html-wrapper-text';

            let textElStyles = {
                alignItems: textAlign === 'right' ? 'flex-end' : textAlign,
            };
            if (authorVerticalAlign === 'bottom') {
                textElStyles = {
                    ...textElStyles,
                    flex: 1,
                };
            }
            this.applyStyle(textEl, textElStyles);

            this.containerEl.appendChild(wrapper);
            wrapper.appendChild(textEl);

            let fontSizeIsConsistent = false;
            let textLines = [];

            let line = '';
            let lineHeight = 0;
            const words = text.split(' ');
            const lastWord = words[words.length - 1];
            const preLastWord = words[words.length - 2];
            if (
                words.length > 1
                && (lastWord.length < 5 || (lastWord.length < 8 && preLastWord.length < 5))
            ) {
                words[words.length - 1] = `${preLastWord} ${lastWord}`;
                words.splice(words.length - 2, 1);
            }

            const wordProcessing = (word, index) => {
                const el = document.createElement('span');
                el.innerText = `${line} ${word}`;
                this.applyStyle(el, {
                    position: 'absolute',
                    font: `${textFZ}%/${fontParams[textFontFamily].lineHeight} ${textFontFamily}`,
                    whiteSpace: 'nowrap',
                });
                wrapper.appendChild(el);
                if (el.offsetWidth > containerWidth) {
                    textLines.push(line);
                    line = word;
                } else {
                    line += line === '' ? word : ` ${word}`;
                }
                if (index === word.length - 1) {
                    lineHeight = el.offsetHeight;
                }
                wrapper.removeChild(el);

                if (index === words.length - 1) {
                    textLines.push(line);
                }
            };

            while (textFZ > 0 && !fontSizeIsConsistent) {
                textLines = [];
                line = '';

                words.forEach(wordProcessing);

                if (
                    (textLines.length > 1 && textLines[textLines.length - 1].indexOf(' ') === -1)
                    || textLines.length * lineHeight > containerHeight - lineHeight
                ) {
                    textFZ -= 1;
                } else {
                    fontSizeIsConsistent = true;
                }
            }

            this.applyStyle(wrapper, {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: textVerticalAlign === 'bottom' ? 'flex-end' : textVerticalAlign,
            });

            const textLettersFade = [];

            this.applyStyle(textEl, {
                font: `${textFZ}%/${fontParams[textFontFamily].lineHeight} ${textFontFamily}`,
            });

            textLines.forEach((lineItem, i) => {
                const el = document.createElement('div');
                el.innerText = lineItem;
                textEl.appendChild(el);
                requestAnimationFrame(() => {
                    const elPosition = el.getBoundingClientRect();
                    textLines[i] = {
                        text: lineItem,
                        top: elPosition.top,
                        left: elPosition.left,
                        width: elPosition.width,
                        height: elPosition.height,
                    };
                });

                const step = Math.ceil(lineItem.length / (Math.random() * (15 - 10) + 10));
                const fadeLettersIndex = [];
                for (let j = 0, l = lineItem.length; j < l; j += step) {
                    fadeLettersIndex.push(j);
                }
                textLettersFade.push(fadeLettersIndex);
            });

            const textElComputedStyles = window.getComputedStyle(textEl, null);
            const computedTextFontSize = parseFloat(
                textElComputedStyles.getPropertyValue('font-size')
            );

            const authorEl = document.createElement('div');
            authorEl.id = 'canvas-html-wrapper-author';
            let authorFZ = textFZ - 5;
            const authorMargin = remapValue(
                text.length,
                10,
                256,
                separator ? 8 : 5,
                separator ? 6 : 3
            );
            let authorFlexAlign = 'center';
            if (authorAlign === 'right') {
                authorFlexAlign = 'flex-end';
            } else if (authorAlign === 'left') {
                authorFlexAlign = 'flex-start';
            }
            this.applyStyle(authorEl, {
                font: `${authorFZ}%/${fontParams[authorFontFamily].lineHeight} ${authorFontFamily}`,
                alignSelf: authorFlexAlign,
                marginTop: `${authorMargin}%`,
            });
            authorEl.innerText = author;

            wrapper.appendChild(authorEl);

            while (authorEl.offsetWidth > width - (marginHorizontal * 2)) {
                authorFZ -= 1;
                this.applyStyle(authorEl, {
                    font: `${authorFZ}%/${fontParams[authorFontFamily].lineHeight} ${authorFontFamily}`,
                });
            }

            const authorElStyle = window.getComputedStyle(authorEl, null);
            const authorFontSize = parseFloat(authorElStyle.getPropertyValue('font-size'));
            const authorPositionProps = authorEl.getBoundingClientRect();

            this.newState = {
                textLettersFade,
                textFontSize: computedTextFontSize,
                textLines,
                author,
                authorFontSize,
                authorPosition: {
                    left: authorPositionProps.left,
                    top: authorPositionProps.top,
                    width: authorPositionProps.width,
                },
            };

            requestAnimationFrame(() => {
                if (debug) {
                    this.applyStyle(wrapper, {
                        color: 'rgba(255, 255, 255, 0.3)',
                        border: '2px solid red',
                    });
                } else {
                    this.containerEl.removeChild(wrapper);
                }

                resolve();
            });
        })
    );

    fillText = (color, text, x, y, shadow = true) => {
        if (!this.context) {
            return;
        }
        this.context.fillStyle = color;
        if (shadow) {
            this.context.shadowOffsetX = 3;
            this.context.shadowOffsetY = 3;
            this.context.shadowColor = hexToRgbA('#000', 0.3);
            this.context.shadowBlur = 4;
        }
        this.context.fillText(text, x, y);
    };

    animationType = (
        frame,
        line,
        renderedLettersCount,
        frameOpacity,
        x,
        y,
        multiline = true
    ) => {
        if (!this.context) {
            return '';
        }

        const { color } = this.state;

        let lastRenderedLetter;
        if (frame > renderedLettersCount + line.length) {
            this.fillText(color, line, x, y);
        } else {
            let letterIndex = frame;
            if (multiline) {
                letterIndex = frame - renderedLettersCount;
            }
            const currentText = line.substr(0, letterIndex - 1);
            if (currentText.length) {
                this.fillText(color, currentText, x, y);
            }
            const lineMetrics = this.context.measureText(currentText);
            lastRenderedLetter = line.substr(letterIndex - 1, 1);
            this.fillText(
                hexToRgbA(color, frameOpacity),
                lastRenderedLetter,
                x + lineMetrics.width,
                y,
                false
            );
        }

        return lastRenderedLetter;
    };

    animationFade = (
        line,
        frameOpacity,
        x,
        y
    ) => {
        if (!this.context) {
            return;
        }

        const { color } = this.state;

        this.fillText(hexToRgbA(color, frameOpacity), line, x, y);
    };

    animationFadeLine = (
        frame,
        line,
        lineCount,
        frameOpacity,
        x,
        y
    ) => {
        if (!this.context) {
            return;
        }

        const { color } = this.state;

        if (frame - 1 > lineCount) {
            this.fillText(color, line, x, y);
        }
        if (frame - 1 === lineCount) {
            this.animationFade(line, frameOpacity, x, y);
        }
    };

    animationSlide = (
        line,
        frameOpacity,
        framePosition,
        x,
        y,
        direction
    ) => {
        if (!this.context) {
            return;
        }

        const { color } = this.state;
        const { marginHorizontal } = this;

        const margin = remapValue(framePosition, 0, 1, marginHorizontal, 0);
        let targetX = x;
        let targetY = y;
        if (direction === 'x') {
            targetX = x - margin;
        } else {
            targetY = y - margin;
        }
        this.fillText(hexToRgbA(color, frameOpacity), line, targetX, targetY);
    };

    animationSlideLine = (
        frame,
        line,
        lineCount,
        frameOpacity,
        framePosition,
        x,
        y,
        direction
    ) => {
        if (!this.context) {
            return;
        }

        const { color } = this.state;

        if (frame - 1 > lineCount) {
            this.fillText(color, line, x, y);
        }
        if (frame - 1 === lineCount) {
            this.animationSlide(line, frameOpacity, framePosition, x, y, direction);
        }
    };

    renderText = () => {
        if (!this.context) {
            return;
        }

        const {
            animate,
            textEffect,
            textFontSize,
            textFontFamily,
            textLines,
            textLettersFade,
            textFrame,
            textFrameOpacity,
            textFrameOpacityStep,
            textLettersOpacity,
            textLettersOpacityStep,
            textFramePosition,
            textFramePositionStep,
            textFullyRendered,
            color,
        } = this.state;

        this.context.font = this.getFont(textFontSize, textFontFamily);
        this.context.textBaseline = 'hanging';

        let j = 0;
        let renderedLettersCount = 0;
        let lastRenderedLetter = '';
        for (let i = 0; i < textLines.length; i++) {
            const line = textLines[j];
            const x = line.left - 7;
            const y = line.top + (textFontSize / 7);

            if (animate) {
                if (textEffect === 'type') {
                    lastRenderedLetter = this.animationType(
                        textFrame,
                        line.text,
                        renderedLettersCount,
                        textFrameOpacity,
                        x,
                        y
                    );
                    if (lastRenderedLetter) {
                        break;
                    }
                }
                if (textEffect === 'fade-lines') {
                    this.animationFadeLine(textFrame, line.text, j, textFrameOpacity, x, y);
                    if (textFrame - 1 === j) {
                        break;
                    }
                }
                if (textEffect === 'fade-letters') {
                    const lineLettersFade = textLettersFade[j];

                    for (let t = 1, tl = line.text.length; t <= tl; t++) {
                        const prevLetters = this.context.measureText(line.text.substr(0, t - 1));
                        const currentLetter = line.text.substr(t - 1, 1);
                        let letterColor;
                        if (lineLettersFade.includes(t)) {
                            letterColor = hexToRgbA(color, textLettersOpacity);
                        } else {
                            letterColor = hexToRgbA(color, textFrameOpacity);
                        }
                        this.fillText(letterColor, currentLetter, x + prevLetters.width, y);
                    }
                }
                if (textEffect === 'fade') {
                    this.animationFade(line.text, textFrameOpacity, x, y);
                }
                if (textEffect === 'slide-lines') {
                    this.animationSlideLine(
                        textFrame,
                        line.text,
                        j,
                        textFrameOpacity,
                        textFramePosition,
                        x,
                        y,
                        'x'
                    );
                }
                if (textEffect === 'append-lines') {
                    this.animationSlideLine(
                        textFrame,
                        line.text,
                        j,
                        textFrameOpacity,
                        textFramePosition,
                        x,
                        y,
                        'y'
                    );
                }
            } else {
                this.fillText(color, line.text, x, y);
            }

            renderedLettersCount += line.text.length;
            j++;
        }

        if (textFullyRendered) {
            return;
        }

        switch (textEffect) {
            case 'type': {
                const totalLettersCount = textLines.reduce((accumulator, currentValue) => (
                    accumulator + currentValue.text.length
                ), 0);
                const emptyLetterOrOpacityIsFull = lastRenderedLetter === ' ' || textFrameOpacity >= 1;

                this.newState = {
                    textFullyRendered: animate
                        ? renderedLettersCount === totalLettersCount
                        : true,
                    textFrame: emptyLetterOrOpacityIsFull
                        ? textFrame + 1
                        : textFrame,
                    textFrameOpacity: emptyLetterOrOpacityIsFull
                        ? textFrameOpacityStep
                        : textFrameOpacity + textFrameOpacityStep,
                    textLastRenderedLetter: lastRenderedLetter,
                };
                break;
            }
            case 'fade-lines':
                this.newState = {
                    textFullyRendered: animate
                        ? textFrame > textLines.length
                        : true,
                    textFrame: textFrameOpacity >= 1
                        ? textFrame + 1
                        : textFrame,
                    textFrameOpacity: textFrameOpacity >= 1
                        ? textFrameOpacityStep
                        : textFrameOpacity + textFrameOpacityStep,
                };
                break;
            case 'fade-letters':
                this.newState = {
                    textFullyRendered: animate
                        ? textLettersOpacity === 1
                        : true,
                    textFrame: textLettersOpacity >= 1
                        ? textFrame + 1
                        : textFrame,
                    textFrameOpacity: textFrameOpacity >= 1
                        ? 1
                        : textFrameOpacity + textFrameOpacityStep,
                    textLettersOpacity: textLettersOpacity >= 1
                        ? 1
                        : textLettersOpacity + textLettersOpacityStep,
                };
                break;
            case 'fade':
                this.newState = {
                    textFullyRendered: animate
                        ? textFrameOpacity === 1
                        : true,
                    textFrame: textFrameOpacity >= 1
                        ? textFrame + 1
                        : textFrame,
                    textFrameOpacity: textFrameOpacity >= 1
                        ? 1
                        : textFrameOpacity + textFrameOpacityStep,
                };
                break;
            case 'slide-lines':
            case 'append-lines':
                this.newState = {
                    textFullyRendered: animate
                        ? textFrame > textLines.length
                        : true,
                    textFrame: textFramePosition >= 1
                        ? textFrame + 1
                        : textFrame,
                    textFrameOpacity: textFrameOpacity >= 1
                        ? textFrameOpacityStep
                        : textFrameOpacity + textFrameOpacityStep,
                    textFramePosition: textFramePosition >= 1
                        ? 0
                        : Number((textFramePosition + textFramePositionStep).toFixed(1)),
                };
                break;
            default:
        }
    };

    renderSeparator = () => {
        if (!this.context) {
            return;
        }

        const {
            animate,
            width,
            authorPosition,
            authorAlign,
            authorFontSize,
            separatorOpacity,
            separatorOpacityStep,
            separatorFullyRendered,
            separator,
            color,
        } = this.state;

        if (separator !== 'line' && separator !== 'dash' && separator !== 'dot') {
            if (!separatorFullyRendered) {
                this.newState = {
                    separatorFullyRendered: true,
                };
            }
            return;
        }

        const { marginHorizontal } = this;
        const separatorWidth = width / 5;

        let x = authorPosition.left;
        if (authorAlign === 'center') {
            x = (width - separatorWidth) / 2;
        } else if (authorAlign === 'right') {
            x = width - separatorWidth - (marginHorizontal / 2);
        }

        const y = authorPosition.top - 20;

        switch (separator) {
            case 'line':
                this.context.lineWidth = authorFontSize / 10;
                this.context.beginPath();
                this.context.moveTo(x, y);
                this.context.lineTo(x + separatorWidth, y);
                break;
            case 'dash': {
                this.context.lineWidth = authorFontSize / 10;
                this.context.beginPath();
                const piecesCount = 4;
                const gapWidth = separatorWidth / 10;
                const pieceWidth = (separatorWidth - (gapWidth * (piecesCount - 1))) / piecesCount;
                for (let i = 0, l = piecesCount; i < l; i++) {
                    const gap = i === 0 ? 0 : gapWidth;
                    const xPosition = x + (pieceWidth * i) + (gap * i);
                    this.context.moveTo(xPosition, y);
                    this.context.lineTo(xPosition + pieceWidth, y);
                }
                break;
            }
            case 'dot': {
                this.context.beginPath();
                const dotsCount = 7;
                const gapWidth = separatorWidth / dotsCount;
                const radius = authorFontSize / 10;
                for (let i = 0, l = dotsCount; i < l; i++) {
                    const gap = i === 0 ? 0 : gapWidth;
                    const xPosition = x + ((radius / 2) * i) + (gap * i);
                    this.context.arc(
                        xPosition,
                        y,
                        radius,
                        0,
                        Math.PI * 2
                    );
                }
                break;
            }
            default:
        }

        if (animate) {
            this.context.strokeStyle = hexToRgbA(color, separatorOpacity);
            this.context.fillStyle = hexToRgbA(color, separatorOpacity);
            this.newState = {
                separatorFullyRendered: separatorOpacity >= 1,
                separatorOpacity: separatorOpacity + separatorOpacityStep,
            };
        } else {
            this.context.strokeStyle = color;
            this.context.fillStyle = color;
            this.newState = {
                separatorFullyRendered: true,
            };
        }

        if (separator === 'line' || separator === 'dash') {
            this.context.stroke();
        } else {
            this.context.fill();
        }
    };

    renderAuthor = () => {
        if (!this.context) {
            return;
        }

        const {
            animate,
            authorEffect,
            authorFontSize,
            authorFontFamily,
            author,
            authorPosition,
            authorFrame,
            authorFrameOpacity,
            authorFrameOpacityStep,
            authorFramePosition,
            authorFramePositionStep,
            authorFullyRendered,
            color,
        } = this.state;

        this.context.font = this.getFont(authorFontSize, authorFontFamily);
        this.context.textBaseline = 'hanging';

        const x = authorPosition.left - 12;
        const y = authorPosition.top;

        let lastRenderedLetter = '';
        if (animate) {
            if (authorEffect === 'type') {
                lastRenderedLetter = this.animationType(
                    authorFrame,
                    author,
                    authorFrame,
                    authorFrameOpacity,
                    x,
                    y,
                    false
                );
            }
            if (authorEffect === 'fade') {
                this.animationFade(author, authorFrameOpacity, x, y);
            }
            if (authorEffect === 'slide') {
                this.animationSlide(author, authorFrameOpacity, authorFramePosition, x, y, 'x');
            }
            if (authorEffect === 'append') {
                this.animationSlide(author, authorFrameOpacity, authorFramePosition, x, y, 'y');
            }
        } else {
            this.fillText(color, author, x, y);
        }

        if (authorFullyRendered) {
            return;
        }

        switch (authorEffect) {
            case 'type': {
                const emptyLetterOrOpacityIsFull = lastRenderedLetter === ' ' || authorFrameOpacity >= 1;

                this.newState = {
                    authorFullyRendered: animate
                        ? authorFrame > author.length
                        : true,
                    authorFrame: emptyLetterOrOpacityIsFull
                        ? authorFrame + 1
                        : authorFrame,
                    authorFrameOpacity: emptyLetterOrOpacityIsFull
                        ? authorFrameOpacityStep
                        : authorFrameOpacity + authorFrameOpacityStep,
                    authorLastRenderedLetter: lastRenderedLetter,
                };
                break;
            }
            case 'fade':
                this.newState = {
                    authorFullyRendered: animate
                        ? authorFrameOpacity > 1
                        : true,
                    authorFrame: authorFrameOpacity >= 1
                        ? authorFrame + 1
                        : authorFrame,
                    authorFrameOpacity: authorFrameOpacity >= 1
                        ? authorFrameOpacityStep
                        : authorFrameOpacity + authorFrameOpacityStep,
                };
                break;
            case 'slide':
            case 'append':
                this.newState = {
                    authorFullyRendered: animate
                        ? authorFramePosition >= 1
                        : true,
                    authorFrame: authorFramePosition >= 1
                        ? authorFrame + 1
                        : authorFrame,
                    authorFrameOpacity: authorFrameOpacity >= 1
                        ? 1
                        : authorFrameOpacity + authorFrameOpacityStep,
                    authorFramePosition: authorFramePosition >= 1
                        ? 0
                        : authorFramePosition + authorFramePositionStep,
                };
                break;
            default:
        }
    };

    render = () => {
        const {
            image,
            textFullyRendered,
            animate,
            overlay,
            width,
            height,
            textFontLoaded,
            authorFontLoaded,
            separatorFullyRendered,
        } = this.state;

        if (!textFontLoaded || !authorFontLoaded) {
            setTimeout(this.render, 10);
            return;
        }

        if (!image) {
            Promise.all([
                this.loadImage(),
                this.loadText(),
            ]).then(() => {
                this.render();
            }).catch((err) => {
                console.error(err); // eslint-disable-line
                console.log('puppeteer: Error'); // eslint-disable-line
            });
            this.renderStartedAt = Date.now();
            return;
        }

        this.context.clearRect(0, 0, width, height);
        this.renderImage();
        if (overlay === 'solid') {
            this.renderOverlay();
        }
        this.renderText();
        if (overlay !== 'solid') {
            this.renderOverlay();
        }
        if (textFullyRendered || !animate) {
            this.renderSeparator();
        }
        if (separatorFullyRendered || !animate) {
            this.renderAuthor();
        }
        this.postRender();
    };

    postRender = () => {
        const {
            textEffect,
            textLastRenderedLetter,
            authorEffect,
            authorFullyRendered,
            authorLastRenderedLetter,
            frameQuality,
        } = this.state;

        if (
            this.canvasEl
            && window.puppeteer
            && (
                (textEffect !== 'type' || (textLastRenderedLetter !== '' && textLastRenderedLetter !== ' '))
                || (authorEffect !== 'type' || (authorLastRenderedLetter !== '' && authorLastRenderedLetter !== ' '))
            )
        ) {
            const imgdata = this.canvasEl.toDataURL('image/jpeg', frameQuality);
            console.log(imgdata); // eslint-disable-line
        }

        if (!authorFullyRendered) {
            if (window.puppeteer) {
                this.render();
            } else {
                requestAnimationFrame(() => {
                    // setTimeout(() => {
                    this.render();
                });
                // }, 200);
            }
        } else {
            console.log('Render time: ', (Date.now() - this.renderStartedAt) / 1000); // eslint-disable-line
            if (window.puppeteer) {
                console.log('puppeteer: Finish'); // eslint-disable-line
            }
        }
    };

    rerender = () => {
        const authorFullyRendered = this.state.authorFullyRendered;

        this.newState = {
            textFullyRendered: false,
            textLastRenderedLetter: '',
            textFrame: 1,
            authorFullyRendered: false,
            authorLastRenderedLetter: '',
            authorFrame: 1,
            separatorFullyRendered: false,
            separatorFrame: 1,
        };

        if (authorFullyRendered) {
            this.renderStartedAt = Date.now();
            this.render();
        }
    };

    stop = () => {
        this.newState = {
            textFullyRendered: true,
            authorFullyRendered: true,
            separatorFullyRendered: true,
        };
    };
}

export default Renderer;

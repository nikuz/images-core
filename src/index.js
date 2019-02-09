import './css/base.css';
import './css/fonts.css';

let canvasEl;
let fontRenderEl;

const state = {
    canvasWidth: 600,
    canvasHeight: 600,
    // image
    image: null,
    imageURL: '/graphics/output.jpg',
    // text
    text: 'Specify the color of the box to write. For the general syntax of this option',
    textLines: [],
    textLettersFade: [],
    maxTextLines: 0,
    textFontFamily: 'Kaushan Script',
    textFontSize: 12, // in rem
    textFontLineHeight: 0, // in px
    textEffect: 'fade', // type | fade lines | fade letters | slide lines | append lines | fade
    textFullyRendered: false,
    textLastRenderedLetter: '',
    textFrame: 1,
    textFrameOpacity: 0.5,
    textFrameOpacityStep: 0.5,
    textLettersOpacity: 0,
    textLettersOpacityStep: 0.05,
    textFramePosition: 0,
    textFramePositionStep: 0.1,
    textAlign: 'right', // left | center | right
    textVerticalAlign: 'top', // top | center | bottom
    // author
    author: 'William Longgood',
    authorLines: [],
    authorFontFamily: 'Nickainley',
    authorFontSize: 6,
    authorFontLineHeight: 0,
    authorEffect: 'fade', // type | slide | append | fade
    authorFullyRendered: false,
    authorLastRenderedLetter: '',
    authorFrame: 1,
    authorFrameOpacity: 0.1,
    authorFrameOpacityStep: 0.1,
    authorFramePosition: 0,
    authorFramePositionStep: 0.1,
    authorAlign: 'left', // left | center | right
    authorVerticalAlign: 'bottom', // top | center | bottom
    // common
    animate: true,
    frameQuality: 0.93,
    overlay: 'border', // solid | lines | border
    marginTop: 300, // in px
    marginLeft: 50, // in px
    color: '#FFF',
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

const setCanvasSize = () => {
    const {
        canvasWidth,
        canvasHeight,
    } = state;

    if (canvasEl) {
        canvasEl.width = canvasWidth;
        canvasEl.height = canvasHeight;
    }
};

const getContext = () => {
    const canvas = canvasEl;
    if (canvas) {
        return canvas.getContext('2d');
    }

    return null;
};

const loadImage = () => (
    new Promise((resolve, reject) => {
        const { imageURL } = state;
        const imageObj = new Image();
        imageObj.onload = () => {
            state.image = imageObj;
            resolve();
        };
        imageObj.onerror = (err) => {
            reject(err);
        };
        imageObj.src = imageURL;
    })
);

const renderImage = () => {
    const context = getContext();
    if (!context) {
        return;
    }

    const {
        image,
        canvasWidth,
        canvasHeight,
    } = state;

    if (image) {
        let w = image.width;
        let h = image.height;
        let x;
        let y;
        const ratio = w / h;
        if (w > h) {
            h = canvasHeight;
            w = canvasHeight * ratio;
            y = 0;
            x = -((w - canvasWidth) / 2);
        } else {
            w = canvasWidth;
            h = canvasWidth / ratio;
            x = 0;
            y = -((h - canvasHeight) / 2);
        }

        context.drawImage(image, x, y, w, h);
    }
};

const renderOverlay = () => {
    const context = getContext();
    if (!context) {
        return;
    }

    const {
        overlay,
        canvasWidth,
        canvasHeight,
        marginLeft,
        color,
    } = state;

    if (overlay === 'solid') {
        context.fillStyle = hexToRgbA('#000', 0.5);
        context.fillRect(
            marginLeft / 2,
            marginLeft / 2,
            canvasWidth - marginLeft,
            canvasHeight - marginLeft
        );
    }
    if (overlay === 'border') {
        context.lineWidth = 4;
        context.strokeStyle = color;
        context.rect(
            marginLeft / 2,
            marginLeft / 2,
            canvasWidth - marginLeft,
            canvasHeight - marginLeft
        );
        context.stroke();
    }
    if (overlay === 'lines') {
        context.lineWidth = 4;
        context.strokeStyle = color;

        context.beginPath();
        context.moveTo(marginLeft / 2, marginLeft / 2);
        context.lineTo(canvasWidth - (marginLeft / 2), marginLeft / 2);
        context.stroke();

        context.beginPath();
        context.moveTo(marginLeft / 2, canvasHeight - (marginLeft / 2));
        context.lineTo(canvasWidth - (marginLeft / 2), canvasHeight - (marginLeft / 2));
        context.stroke();
    }
};

const getFont = (fontSize, fontFamily) => (
    `${fontSize}rem "${fontFamily}"`
);

const getFontProps = (text, fontFamily, fontSize, splitToLines = true) => {
    const context = getContext();
    if (!fontRenderEl || !context) {
        return {};
    }

    const {
        marginTop,
        marginLeft,
        canvasWidth,
        canvasHeight,
    } = state;

    const font = getFont(fontSize, fontFamily);
    context.font = font;
    fontRenderEl.style.font = font;
    fontRenderEl.innerText = text;
    const fontH = fontRenderEl.offsetHeight;
    const fontLineHeight = fontH + (fontH * 0.2);
    const maxTextLines = Math.floor((canvasHeight - marginTop) / fontLineHeight);

    if (splitToLines) {
        const textLines = [];
        let line = '';
        const words = text.split(' ');
        words.forEach((word, index) => {
            const lineMetrics = context.measureText(`${line} ${word}`);
            if (lineMetrics.width > canvasWidth - marginLeft) {
                textLines.push(line);
                line = word;
            } else {
                line += line === '' ? word : ` ${word}`;
            }

            if (index === words.length - 1) {
                textLines.push(line);
            }
        });

        if (textLines.length > maxTextLines) {
            return getFontProps(text, fontFamily, fontSize - 1, splitToLines);
        }

        return {
            fontSize,
            fontLineHeight,
            maxTextLines,
            textLines,
        };
    }

    const lineMetrics = context.measureText(text);
    if (lineMetrics.width > canvasWidth - marginLeft) {
        return getFontProps(text, fontFamily, fontSize - 1, splitToLines);
    }

    return {
        fontSize,
        fontLineHeight,
    };
};

const loadText = () => (
    new Promise((resolve) => {
        const context = getContext();
        if (!context) {
            return;
        }

        const {
            textFontFamily,
            textFontSize,
            authorFontFamily,
            authorFontSize,
        } = state;
        const text = state.text.trim();
        const author = state.author.trim();

        context.textBaseline = 'middle';

        const textProps = getFontProps(text, textFontFamily, textFontSize);
        state.text = text;
        state.textFontSize = textProps.fontSize;
        state.textFontLineHeight = textProps.fontLineHeight;
        state.maxTextLines = textProps.maxTextLines;
        state.textLines = textProps.textLines;

        textProps.textLines.forEach((line) => {
            const step = Math.ceil(line.length / (Math.random() * (15 - 10) + 10));
            const fadeLettersIndex = [];
            for (let i = 0, l = line.length; i < l; i += step) {
                fadeLettersIndex.push(i);
            }
            state.textLettersFade.push(fadeLettersIndex);
        });

        const authorProps = getFontProps(author, authorFontFamily, authorFontSize, false);
        state.author = author;
        state.authorFontSize = authorProps.fontSize;
        state.authorFontLineHeight = authorProps.fontLineHeight;

        resolve();
    })
);

const animationType = (
    frame,
    line,
    renderedLettersCount,
    frameOpacity,
    x,
    y,
    multiline = true
) => {
    const context = getContext();
    if (!context) {
        return '';
    }

    const { color } = state;

    let lastRenderedLetter;
    if (frame > renderedLettersCount + line.length) {
        context.fillStyle = color;
        context.fillText(line, x, y);
    } else {
        let letterIndex = frame;
        if (multiline) {
            letterIndex = frame - renderedLettersCount;
        }
        const currentText = line.substr(0, letterIndex - 1);
        if (currentText.length) {
            context.fillStyle = color;
            context.fillText(currentText, x, y);
        }
        const lineMetrics = context.measureText(currentText);
        lastRenderedLetter = line.substr(letterIndex - 1, 1);
        context.fillStyle = hexToRgbA(color, frameOpacity);
        context.fillText(lastRenderedLetter, x + lineMetrics.width, y);
    }

    return lastRenderedLetter;
};

const animationFade = (
    line,
    frameOpacity,
    x,
    y
) => {
    const context = getContext();
    if (!context) {
        return;
    }

    const { color } = state;

    context.fillStyle = hexToRgbA(color, frameOpacity);
    context.fillText(line, x, y);
};

const animationFadeLine = (
    frame,
    line,
    lineCount,
    frameOpacity,
    x,
    y
) => {
    const context = getContext();
    if (!context) {
        return;
    }

    const { color } = state;

    if (frame - 1 > lineCount) {
        context.fillStyle = color;
        context.fillText(line, x, y);
    }
    if (frame - 1 === lineCount) {
        animationFade(line, frameOpacity, x, y);
    }
};

const animationSlide = (
    line,
    frameOpacity,
    framePosition,
    x,
    y,
    direction
) => {
    const context = getContext();
    if (!context) {
        return;
    }

    const {
        color,
        marginLeft,
    } = state;

    const margin = remapValue(framePosition, 0, 1, marginLeft, 0);
    context.fillStyle = hexToRgbA(color, frameOpacity);
    if (direction === 'x') {
        context.fillText(line, x - margin, y);
    } else {
        context.fillText(line, x, y - margin);
    }
};

const animationSlideLine = (
    frame,
    line,
    lineCount,
    frameOpacity,
    framePosition,
    x,
    y,
    direction
) => {
    const context = getContext();
    if (!context) {
        return;
    }

    const { color } = state;

    if (frame - 1 > lineCount) {
        context.fillStyle = color;
        context.fillText(line, x, y);
    }
    if (frame - 1 === lineCount) {
        animationSlide(line, frameOpacity, framePosition, x, y, direction);
    }
};

const renderText = () => {
    const context = getContext();
    if (!context) {
        return;
    }

    const {
        animate,
        textEffect,
        textFontSize,
        textFontFamily,
        textFontLineHeight,
        textLines,
        maxTextLines,
        textLettersFade,
        textFrame,
        textFrameOpacity,
        textFrameOpacityStep,
        textLettersOpacity,
        textLettersOpacityStep,
        textFramePosition,
        textFramePositionStep,
        authorFontLineHeight,
        canvasWidth,
        canvasHeight,
        color,
        textAlign,
        textVerticalAlign,
        authorVerticalAlign,
        marginLeft,
    } = state;

    context.font = getFont(textFontSize, textFontFamily);

    let j = 0;
    let renderedLettersCount = 0;
    let lastRenderedLetter = '';
    for (let i = (maxTextLines - textLines.length) / 2, l = i + textLines.length; i < l; i++) {
        const line = textLines[j];
        const lineMetrics = context.measureText(line);
        let x = marginLeft / 2;
        if (textAlign === 'center') {
            x = (canvasWidth - lineMetrics.width) / 2;
        } else if (textAlign === 'right') {
            x = canvasWidth - lineMetrics.width - (marginLeft / 2);
        }
        let yMargin = remapValue(textFontLineHeight, 40, 150, 30, 0);
        const maxHeightArea = maxTextLines * textFontLineHeight;
        if (textVerticalAlign === 'center') {
            yMargin = (canvasHeight - maxHeightArea) / 2;
        } else if (textVerticalAlign === 'bottom') {
            yMargin = canvasHeight - maxHeightArea - (authorFontLineHeight / 2);
        }
        let y = (i * textFontLineHeight) + (textFontLineHeight / 2) + yMargin;
        if (
            (textVerticalAlign === 'center' || textVerticalAlign === 'bottom')
            && textVerticalAlign === authorVerticalAlign
        ) {
            y -= authorFontLineHeight;
        }

        if (animate) {
            if (textEffect === 'type') {
                lastRenderedLetter = animationType(
                    textFrame,
                    line,
                    renderedLettersCount,
                    textFrameOpacity,
                    x,
                    y
                );
                if (lastRenderedLetter) {
                    break;
                }
            }
            if (textEffect === 'fade lines') {
                animationFadeLine(textFrame, line, j, textFrameOpacity, x, y);
                if (textFrame - 1 === j) {
                    break;
                }
            }
            if (textEffect === 'fade letters') {
                const lineLettersFade = textLettersFade[j];

                for (let t = 1, tl = line.length; t <= tl; i++) {
                    const prevLettersWidth = context.measureText(line.substr(0, t - 1)).width;
                    const currentLetter = line.substr(t - 1, 1);
                    if (lineLettersFade.includes(t)) {
                        context.fillStyle = hexToRgbA(color, textLettersOpacity);
                    } else {
                        context.fillStyle = hexToRgbA(color, textFrameOpacity);
                    }
                    context.fillText(currentLetter, x + prevLettersWidth, y);
                }
            }
            if (textEffect === 'fade') {
                animationFade(line, textFrameOpacity, x, y);
            }
            if (textEffect === 'slide lines') {
                animationSlideLine(textFrame, line, j, textFrameOpacity, textFramePosition, x, y, 'x');
            }
            if (textEffect === 'append lines') {
                animationSlideLine(textFrame, line, j, textFrameOpacity, textFramePosition, x, y, 'y');
            }
        } else {
            context.fillStyle = color;
            context.fillText(line, x, y);
        }

        renderedLettersCount += line.length;
        j++;
    }

    switch (textEffect) {
        case 'type': {
            const totalLettersCount = textLines.reduce((accumulator, currentValue) => (
                accumulator + currentValue.length
            ), 0);
            const emptyLetterOrOpacityIsFull = lastRenderedLetter === ' ' || textFrameOpacity >= 1;

            state.textFullyRendered = animate
                ? renderedLettersCount === totalLettersCount
                : true;
            state.textFrame = emptyLetterOrOpacityIsFull
                ? textFrame + 1
                : textFrame;
            state.textFrameOpacity = emptyLetterOrOpacityIsFull
                ? textFrameOpacityStep
                : textFrameOpacity + textFrameOpacityStep;
            state.textLastRenderedLetter = lastRenderedLetter;
            break;
        }
        case 'fade lines':
            state.textFullyRendered = animate
                ? textFrame > textLines.length
                : true;
            state.textFrame = textFrameOpacity >= 1
                ? textFrame + 1
                : textFrame;
            state.textFrameOpacity = textFrameOpacity >= 1
                ? textFrameOpacityStep
                : textFrameOpacity + textFrameOpacityStep;
            break;
        case 'fade letters':
            state.textFullyRendered = animate
                ? textLettersOpacity === 1
                : true;
            state.textFrame = textLettersOpacity >= 1
                ? textFrame + 1
                : textFrame;
            state.textFrameOpacity = textFrameOpacity >= 1
                ? 1
                : textFrameOpacity + textFrameOpacityStep;
            state.textLettersOpacity = textLettersOpacity >= 1
                ? 1
                : textLettersOpacity + textLettersOpacityStep;
            break;
        case 'fade':
            state.textFullyRendered = animate
                ? textFrameOpacity === 1
                : true;
            state.textFrame = textFrameOpacity >= 1
                ? textFrame + 1
                : textFrame;
            state.textFrameOpacity = textFrameOpacity >= 1
                ? 1
                : textFrameOpacity + textFrameOpacityStep;
            break;
        case 'slide lines':
        case 'append lines':
            state.textFullyRendered = animate
                ? textFrame > textLines.length
                : true;
            state.textFrame = textFramePosition >= 1
                ? textFrame + 1
                : textFrame;
            state.textFrameOpacity = textFrameOpacity >= 1
                ? textFrameOpacityStep
                : textFrameOpacity + textFrameOpacityStep;
            state.textFramePosition = textFramePosition >= 1
                ? 0
                : Number((textFramePosition + textFramePositionStep).toFixed(1));
            break;
        default:
    }
};

const renderAuthor = () => {
    const context = getContext();
    if (!context) {
        return;
    }

    if (!state.textFullyRendered) {
        renderContext(); //eslint-disable-line
        return;
    }

    const {
        animate,
        authorEffect,
        canvasHeight,
        authorFontSize,
        authorFontFamily,
        authorFontLineHeight,
        author,
        textLines,
        maxTextLines,
        textFontLineHeight,
        textVerticalAlign,
        authorFrame,
        authorFrameOpacity,
        authorFrameOpacityStep,
        authorFramePosition,
        authorFramePositionStep,
        canvasWidth,
        color,
        authorAlign,
        authorVerticalAlign,
        marginLeft,
    } = state;

    context.font = getFont(authorFontSize, authorFontFamily);

    const lineMetrics = context.measureText(author);
    let x = marginLeft / 2;
    if (authorAlign === 'center') {
        x = (canvasWidth - lineMetrics.width) / 2;
    } else if (authorAlign === 'right') {
        x = canvasWidth - lineMetrics.width - (marginLeft / 2);
    }
    const textFirstLine = (maxTextLines - textLines.length) / 2;
    const textLastLine = textFirstLine + textLines.length - 1;
    let yMargin = authorFontLineHeight * 1.3;
    const maxHeightArea = maxTextLines * textFontLineHeight;
    if (authorVerticalAlign === 'center' && textVerticalAlign === 'center') {
        yMargin = (canvasHeight - maxHeightArea) / 2;
    } else if (authorVerticalAlign === 'bottom') {
        yMargin = canvasHeight - maxHeightArea - (authorFontLineHeight / 2);
    }
    const y = (textLastLine * textFontLineHeight) + textFontLineHeight + yMargin;

    let lastRenderedLetter = '';
    if (animate) {
        if (authorEffect === 'type') {
            lastRenderedLetter = animationType(
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
            animationFade(author, authorFrameOpacity, x, y);
        }
        if (authorEffect === 'slide') {
            animationSlide(author, authorFrameOpacity, authorFramePosition, x, y, 'x');
        }
        if (authorEffect === 'append') {
            animationSlide(author, authorFrameOpacity, authorFramePosition, x, y, 'y');
        }
    } else {
        context.fillStyle = color;
        context.fillText(author, x, y);
    }

    switch (authorEffect) {
        case 'type': {
            const emptyLetterOrOpacityIsFull = lastRenderedLetter === ' ' || authorFrameOpacity >= 1;

            state.authorFullyRendered = animate
                ? authorFrame > author.length
                : true;
            state.authorFrame = emptyLetterOrOpacityIsFull
                ? authorFrame + 1
                : authorFrame;
            state.authorFrameOpacity = emptyLetterOrOpacityIsFull
                ? authorFrameOpacityStep
                : authorFrameOpacity + authorFrameOpacityStep;
            state.authorLastRenderedLetter = lastRenderedLetter;
            break;
        }
        case 'fade':
            state.authorFullyRendered = animate
                ? authorFrameOpacity > 1
                : true;
            state.authorFrame = authorFrameOpacity >= 1
                ? authorFrame + 1
                : authorFrame;
            state.authorFrameOpacity = authorFrameOpacity >= 1
                ? authorFrameOpacityStep
                : authorFrameOpacity + authorFrameOpacityStep;
            break;
        case 'slide':
        case 'append':
            state.authorFullyRendered = animate
                ? authorFramePosition >= 1
                : true;
            state.authorFrame = authorFramePosition >= 1
                ? authorFrame + 1
                : authorFrame;
            state.authorFrameOpacity = authorFrameOpacity >= 1
                ? 1
                : authorFrameOpacity + authorFrameOpacityStep;
            state.authorFramePosition = authorFramePosition >= 1
                ? 0
                : authorFramePosition + authorFramePositionStep;
            break;
        default:
    }

    renderContext(); //eslint-disable-line
};

let renderStartedAt;
const renderContext = () => {
    const {
        textEffect,
        textFullyRendered,
        textLastRenderedLetter,
        authorEffect,
        authorFullyRendered,
        authorLastRenderedLetter,
        frameQuality,
    } = state;

    if (
        canvasEl
        && window.puppeteer
        && (
            (textEffect !== 'type' || (textLastRenderedLetter !== '' && textLastRenderedLetter !== ' '))
            || (authorEffect !== 'type' || (authorLastRenderedLetter !== '' && authorLastRenderedLetter !== ' '))
        )
    ) {
        const imgdata = canvasEl.toDataURL('image/jpeg', frameQuality);
        console.log(imgdata); // eslint-disable-line
    }

    if (!textFullyRendered || !authorFullyRendered) {
        if (window.puppeteer) {
            renderImage();
            renderOverlay();
            renderText();
            renderAuthor();
        } else {
            requestAnimationFrame(() => {
                // setTimeout(() => {
                renderImage();
                renderOverlay();
                renderText();
                renderAuthor();
            });
            // }, 200);
        }
    } else {
        console.log('Render time: ', (Date.now() - renderStartedAt) / 1000); // eslint-disable-line
        console.log('puppeteer: Finish'); // eslint-disable-line
    }
};

export default (props) => {
    Object.keys(props).forEach((item) => {
        state[item] = props[item];
    });

    let container = props.container;
    if (typeof props.container === 'string') {
        container = document.querySelector(props.container);
    }
    if (!container) {
        console.error('Wrong container selector'); // eslint-disable-line
        return;
    }

    renderStartedAt = Date.now();

    canvasEl = document.createElement('canvas');
    fontRenderEl = document.createElement('div');
    fontRenderEl.id = 'canvas-font-renderer';
    container.appendChild(canvasEl);
    container.appendChild(fontRenderEl);

    setCanvasSize();

    Promise.all([loadImage(), loadText()]).then(() => {
        renderImage();
        renderOverlay();
        renderText();
        renderAuthor();
    }).catch((err) => {
        console.error(err); // eslint-disable-line
    });
};


import './css/base.css';
import './css/fonts.css';

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
        this.newState = props;

        let container = props.container;
        if (typeof props.container === 'string') {
            container = document.querySelector(props.container);
        }
        if (!container) {
            console.error('Wrong container selector'); // eslint-disable-line
            return;
        }

        this.renderStartedAt = Date.now();

        this.canvasEl = document.createElement('canvas');
        this.fontRenderEl = document.createElement('div');
        this.fontRenderEl.id = 'canvas-font-renderer';
        container.appendChild(this.canvasEl);
        container.appendChild(this.fontRenderEl);

        this.setCanvasSize();
    }

    canvasEl;

    fontRenderEl;

    renderStartedAt;

    state = {
        canvasWidth: 600,
        canvasHeight: 600,
        // image
        image: null,
        imageURL: '',
        // text
        text: '',
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

    set newState(props) {
        Object.keys(props).forEach((item) => {
            this.state[item] = props[item];
        });
    }

    setCanvasSize = () => {
        const {
            canvasWidth,
            canvasHeight,
        } = this.state;

        if (this.canvasEl) {
            this.canvasEl.width = canvasWidth;
            this.canvasEl.height = canvasHeight;
        }
    };

    get context() {
        if (this.canvasEl) {
            return this.canvasEl.getContext('2d');
        }

        return null;
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
            canvasWidth,
            canvasHeight,
        } = this.state;

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

            this.context.drawImage(image, x, y, w, h);
        }
    };

    renderOverlay = () => {
        if (!this.context) {
            return;
        }

        const {
            overlay,
            canvasWidth,
            canvasHeight,
            marginLeft,
            color,
        } = this.state;

        this.context.shadowOffsetX = 0;
        this.context.shadowOffsetY = 0;
        this.context.shadowColor = 0;
        this.context.shadowBlur = 0;

        if (overlay === 'solid') {
            this.context.fillStyle = hexToRgbA('#000', 0.5);
            this.context.fillRect(
                marginLeft / 2,
                marginLeft / 2,
                canvasWidth - marginLeft,
                canvasHeight - marginLeft
            );
        }
        if (overlay === 'border') {
            this.context.lineWidth = 4;
            this.context.strokeStyle = color;
            this.context.rect(
                marginLeft / 2,
                marginLeft / 2,
                canvasWidth - marginLeft,
                canvasHeight - marginLeft
            );
            this.context.stroke();
        }
        if (overlay === 'lines') {
            this.context.lineWidth = 4;
            this.context.strokeStyle = color;

            this.context.beginPath();
            this.context.moveTo(marginLeft / 2, marginLeft / 2);
            this.context.lineTo(canvasWidth - (marginLeft / 2), marginLeft / 2);
            this.context.stroke();

            this.context.beginPath();
            this.context.moveTo(marginLeft / 2, canvasHeight - (marginLeft / 2));
            this.context.lineTo(canvasWidth - (marginLeft / 2), canvasHeight - (marginLeft / 2));
            this.context.stroke();
        }
    };

    getFont = (fontSize, fontFamily) => (
        `${fontSize}rem "${fontFamily}"`
    );

    getFontProps = (text, fontFamily, fontSize, splitToLines = true) => {
        if (!this.fontRenderEl || !this.context) {
            return {};
        }

        const {
            marginTop,
            marginLeft,
            canvasWidth,
            canvasHeight,
        } = this.state;

        const font = this.getFont(fontSize, fontFamily);
        this.context.font = font;
        this.fontRenderEl.style.font = font;
        this.fontRenderEl.innerText = text;
        const fontH = this.fontRenderEl.offsetHeight;
        const fontLineHeight = fontH + (fontH * 0.2);
        const maxTextLines = Math.floor((canvasHeight - marginTop) / fontLineHeight);

        if (splitToLines) {
            const textLines = [];
            let line = '';
            const words = text.split(' ');
            words.forEach((word, index) => {
                const lineMetrics = this.context.measureText(`${line} ${word}`);
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
                return this.getFontProps(text, fontFamily, fontSize - 1, splitToLines);
            }

            return {
                fontSize,
                fontLineHeight,
                maxTextLines,
                textLines,
            };
        }

        const lineMetrics = this.context.measureText(text);
        if (lineMetrics.width > canvasWidth - marginLeft) {
            return this.getFontProps(text, fontFamily, fontSize - 1, splitToLines);
        }

        return {
            fontSize,
            fontLineHeight,
        };
    };

    loadText = () => (
        new Promise((resolve) => {
            if (!this.context) {
                return;
            }

            const {
                textFontFamily,
                textFontSize,
                authorFontFamily,
                authorFontSize,
            } = this.state;
            const text = this.state.text.trim();
            const author = this.state.author.trim();

            this.context.textBaseline = 'middle';

            const textProps = this.getFontProps(text, textFontFamily, textFontSize);
            const textLettersFade = [];

            textProps.textLines.forEach((line) => {
                const step = Math.ceil(line.length / (Math.random() * (15 - 10) + 10));
                const fadeLettersIndex = [];
                for (let i = 0, l = line.length; i < l; i += step) {
                    fadeLettersIndex.push(i);
                }
                textLettersFade.push(fadeLettersIndex);
            });

            const authorProps = this.getFontProps(author, authorFontFamily, authorFontSize, false);

            this.newState = {
                text,
                textLettersFade,
                textFontSize: textProps.fontSize,
                textFontLineHeight: textProps.fontLineHeight,
                maxTextLines: textProps.maxTextLines,
                textLines: textProps.textLines,
                author,
                authorFontSize: authorProps.fontSize,
                authorFontLineHeight: authorProps.fontLineHeight,
            };

            resolve();
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

        const {
            color,
            marginLeft,
        } = this.state;

        const margin = remapValue(framePosition, 0, 1, marginLeft, 0);
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
        } = this.state;

        this.context.font = this.getFont(textFontSize, textFontFamily);

        let j = 0;
        let renderedLettersCount = 0;
        let lastRenderedLetter = '';
        for (let i = (maxTextLines - textLines.length) / 2, l = i + textLines.length; i < l; i++) {
            const line = textLines[j];
            const lineMetrics = this.context.measureText(line);
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
                    lastRenderedLetter = this.animationType(
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
                    this.animationFadeLine(textFrame, line, j, textFrameOpacity, x, y);
                    if (textFrame - 1 === j) {
                        break;
                    }
                }
                if (textEffect === 'fade letters') {
                    const lineLettersFade = textLettersFade[j];

                    for (let t = 1, tl = line.length; t <= tl; t++) {
                        const prevLetters = this.context.measureText(line.substr(0, t - 1));
                        const currentLetter = line.substr(t - 1, 1);
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
                    this.animationFade(line, textFrameOpacity, x, y);
                }
                if (textEffect === 'slide lines') {
                    this.animationSlideLine(
                        textFrame,
                        line,
                        j,
                        textFrameOpacity,
                        textFramePosition,
                        x,
                        y,
                        'x'
                    );
                }
                if (textEffect === 'append lines') {
                    this.animationSlideLine(
                        textFrame,
                        line,
                        j,
                        textFrameOpacity,
                        textFramePosition,
                        x,
                        y,
                        'y'
                    );
                }
            } else {
                this.fillText(color, line, x, y);
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
            case 'fade lines':
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
            case 'fade letters':
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
            case 'slide lines':
            case 'append lines':
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

    renderAuthor = () => {
        if (!this.context) {
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
        } = this.state;

        this.context.font = this.getFont(authorFontSize, authorFontFamily);

        const lineMetrics = this.context.measureText(author);
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
        } = this.state;

        if (!image) {
            Promise.all([this.loadImage(), this.loadText()]).then(() => {
                this.render();
            }).catch((err) => {
                console.error(err); // eslint-disable-line
            });
            return;
        }

        this.renderImage();
        this.renderText();
        this.renderOverlay();
        if (textFullyRendered) {
            this.renderAuthor();
        }
        this.postRender();
    };

    postRender = () => {
        const {
            textEffect,
            textFullyRendered,
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

        if (!textFullyRendered || !authorFullyRendered) {
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
        const textFullyRendered = this.state.textFullyRendered;
        const authorFullyRendered = this.state.authorFullyRendered;

        this.newState = {
            textFullyRendered: false,
            textLastRenderedLetter: '',
            textFrame: 1,
            authorFullyRendered: false,
            authorLastRenderedLetter: '',
            authorFrame: 1,
        };

        if (textFullyRendered && authorFullyRendered) {
            this.render();
        }
    }
}

export default Renderer;

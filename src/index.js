
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
        this.newState = {
            ...props,
            textFontSize: props.width / 15,
            authorFontSize: props.width / 15,
            marginVertical: props.height / 5,
            marginHorizontal: props.height / 9,
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

        this.canvasEl = document.createElement('canvas');
        container.appendChild(this.canvasEl);

        this.context.font = this.getFont(this.state.textFontSize, this.state.textFontFamily);

        this.setCanvasSize();

        this.preloadFontsIntoScope();
    }

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
        maxTextLines: 0,
        textFontFamily: 'Kaushan',
        textFontSize: 12, // in px
        textFontLineHeight: 0, // in px
        textFontLoaded: false,
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
        // common
        animate: true,
        frameQuality: 0.93,
        overlay: 'border', // solid | lines | border
        marginVertical: 100, // in px
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
            authorFontSize,
            authorFontFamily,
        } = this.state;

        const fonts = [{
            id: 'text',
            fontSize: textFontSize,
            font: this.getFont(textFontSize, textFontFamily),
            stateProp: 'textFontLoaded',
        }, {
            id: 'author',
            fontSize: authorFontSize,
            font: this.getFont(authorFontSize, authorFontFamily),
            stateProp: 'authorFontLoaded',
        }];

        fonts.forEach((fontItem) => {
            const el = document.createElement('span');
            el.innerText = 'Some text';
            el.style.position = 'absolute';
            el.style.top = '-9999px';
            el.style.left = '-9999px';
            el.style.fontSize = `${fontItem.fontSize}px`;
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

    get textLinesIndexes() {
        const {
            textVerticalAlign,
            maxTextLines,
            textLines,
        } = this.state;

        let first = 0;
        switch (textVerticalAlign) {
            case 'center':
                first = (maxTextLines - textLines.length) / 2;
                break;
            case 'bottom':
                first = maxTextLines - textLines.length;
                break;
            default:
        }

        return {
            first,
            last: first + textLines.length,
        };
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

    getFontProps = (text, fontFamily, fontSize, splitToLines = true, additionalMargin = 0) => {
        if (!this.context) {
            return {};
        }

        const {
            width,
            height,
            marginVertical,
        } = this.state;
        const { marginHorizontal } = this;

        const font = this.getFont(fontSize, fontFamily);
        this.context.font = font;
        const fontLineHeight = fontSize * 1.5;
        const availableHeight = height - marginVertical;
        const maxTextLines = Math.floor(availableHeight / fontLineHeight);
        const maxDrawTextLines = Math.floor((availableHeight - additionalMargin) / fontLineHeight);

        if (splitToLines) {
            const textLines = [];
            let line = '';
            const words = text.split(' ');
            words.forEach((word, index) => {
                const lineMetrics = this.context.measureText(`${line} ${word}`);
                if (lineMetrics.width > width - marginHorizontal) {
                    textLines.push(line);
                    line = word;
                } else {
                    line += line === '' ? word : ` ${word}`;
                }

                if (index === words.length - 1) {
                    textLines.push(line);
                }
            });

            if (textLines.length > maxDrawTextLines) {
                return this.getFontProps(
                    text,
                    fontFamily,
                    fontSize - 1,
                    splitToLines,
                    additionalMargin
                );
            }

            return {
                fontSize,
                fontLineHeight,
                maxTextLines,
                textLines,
            };
        }

        const lineMetrics = this.context.measureText(text);
        if (lineMetrics.width > width - marginHorizontal) {
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

            const authorProps = this.getFontProps(author, authorFontFamily, authorFontSize, false);

            const textProps = this.getFontProps(
                text,
                textFontFamily,
                textFontSize,
                true,
                authorProps.fontLineHeight * 1.5
            );
            const textLettersFade = [];

            textProps.textLines.forEach((line) => {
                const step = Math.ceil(line.length / (Math.random() * (15 - 10) + 10));
                const fadeLettersIndex = [];
                for (let i = 0, l = line.length; i < l; i += step) {
                    fadeLettersIndex.push(i);
                }
                textLettersFade.push(fadeLettersIndex);
            });

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
            textFullyRendered,
            textVerticalAlign,
            authorVerticalAlign,
            authorFontLineHeight,
            width,
            color,
            textAlign,
            marginVertical,
        } = this.state;
        const { marginHorizontal } = this;

        this.context.font = this.getFont(textFontSize, textFontFamily);

        if (process.env.NODE_ENV !== 'production') {
            this.context.shadowOffsetX = 0;
            this.context.shadowOffsetY = 0;
            this.context.shadowColor = 0;
            this.context.shadowBlur = 0;
            for (let j = 0, l = maxTextLines; j < l; j++) {
                this.context.beginPath();
                this.context.strokeStyle = 'red';
                this.context.rect(
                    0,
                    j * textFontLineHeight + (marginVertical / 2),
                    width,
                    textFontLineHeight
                );
                this.context.stroke();
            }
        }

        let j = 0;
        let renderedLettersCount = 0;
        let lastRenderedLetter = '';
        const textLinesIndexes = this.textLinesIndexes;
        for (let i = textLinesIndexes.first; i < textLinesIndexes.last; i++) {
            const line = textLines[j];
            const lineMetrics = this.context.measureText(line);
            let x = marginHorizontal / 2;
            if (textAlign === 'center') {
                x = (width - lineMetrics.width) / 2;
            } else if (textAlign === 'right') {
                x = width - lineMetrics.width - (marginHorizontal / 2);
            }
            let yMargin = 0;
            if (authorVerticalAlign !== 'bottom' && textVerticalAlign !== 'top') {
                yMargin = authorFontLineHeight * 0.7;
            }
            if (textVerticalAlign === 'bottom') {
                yMargin = authorFontLineHeight * 1.7;
            }
            const lineHeight = (i * textFontLineHeight) + (textFontLineHeight / 2);
            const y = lineHeight + (marginVertical / 2) - yMargin;

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
                if (textEffect === 'fade-lines') {
                    this.animationFadeLine(textFrame, line, j, textFrameOpacity, x, y);
                    if (textFrame - 1 === j) {
                        break;
                    }
                }
                if (textEffect === 'fade-letters') {
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
                if (textEffect === 'slide-lines') {
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
                if (textEffect === 'append-lines') {
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

            if (process.env.NODE_ENV !== 'production') {
                this.context.shadowOffsetX = 0;
                this.context.shadowOffsetY = 0;
                this.context.shadowColor = 0;
                this.context.shadowBlur = 0;
                this.context.beginPath();
                this.context.strokeStyle = 'blue';
                this.context.rect(
                    x,
                    y - (textFontLineHeight / 2),
                    this.context.measureText(line).width,
                    textFontLineHeight
                );
                this.context.stroke();
            }

            renderedLettersCount += line.length;
            j++;
        }

        if (textFullyRendered) {
            return;
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

    renderAuthor = () => {
        if (!this.context) {
            return;
        }

        const {
            animate,
            textFontLineHeight,
            textVerticalAlign,
            authorEffect,
            authorFontSize,
            authorFontFamily,
            author,
            authorFrame,
            authorFrameOpacity,
            authorFrameOpacityStep,
            authorFramePosition,
            authorFramePositionStep,
            authorFullyRendered,
            authorFontLineHeight,
            width,
            height,
            color,
            authorAlign,
            authorVerticalAlign,
        } = this.state;
        const { marginHorizontal } = this;

        this.context.font = this.getFont(authorFontSize, authorFontFamily);

        const lineMetrics = this.context.measureText(author);
        let x = marginHorizontal / 2;
        if (authorAlign === 'center') {
            x = (width - lineMetrics.width) / 2;
        } else if (authorAlign === 'right') {
            x = width - lineMetrics.width - (marginHorizontal / 2);
        }

        const textLinesIndexes = this.textLinesIndexes;
        let yMargin = textFontLineHeight * 0.7;
        if (textVerticalAlign === 'top') {
            yMargin *= 2;
        }
        let y = (textLinesIndexes.last * textFontLineHeight) + (textFontLineHeight / 2) + yMargin;
        if (authorVerticalAlign === 'bottom' || textVerticalAlign === 'bottom') {
            y = height - (this.state.marginHorizontal / 2) - authorFontLineHeight;
        }

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
        } = this.state;

        if (!textFontLoaded || !authorFontLoaded) {
            setTimeout(this.render, 10);
            return;
        }

        if (!image) {
            Promise.all([this.loadImage(), this.loadText()]).then(() => {
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
            this.renderStartedAt = Date.now();
            this.render();
        }
    };

    stop = () => {
        this.newState = {
            textFullyRendered: true,
            authorFullyRendered: true,
        };
    };
}

export default Renderer;

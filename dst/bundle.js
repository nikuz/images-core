module.exports = function(modules) {
    var installedModules = {};
    function __webpack_require__(moduleId) {
        if (installedModules[moduleId]) return installedModules[moduleId].exports;
        var module = installedModules[moduleId] = {
            i: moduleId,
            l: !1,
            exports: {}
        };
        return modules[moduleId].call(module.exports, module, module.exports, __webpack_require__), 
        module.l = !0, module.exports;
    }
    return __webpack_require__.m = modules, __webpack_require__.c = installedModules, 
    __webpack_require__.d = function(exports, name, getter) {
        __webpack_require__.o(exports, name) || Object.defineProperty(exports, name, {
            enumerable: !0,
            get: getter
        });
    }, __webpack_require__.r = function(exports) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(exports, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(exports, "__esModule", {
            value: !0
        });
    }, __webpack_require__.t = function(value, mode) {
        if (1 & mode && (value = __webpack_require__(value)), 8 & mode) return value;
        if (4 & mode && "object" == typeof value && value && value.__esModule) return value;
        var ns = Object.create(null);
        if (__webpack_require__.r(ns), Object.defineProperty(ns, "default", {
            enumerable: !0,
            value
        }), 2 & mode && "string" != typeof value) for (var key in value) __webpack_require__.d(ns, key, function(key) {
            return value[key];
        }.bind(null, key));
        return ns;
    }, __webpack_require__.n = function(module) {
        var getter = module && module.__esModule ? function() {
            return module.default;
        } : function() {
            return module;
        };
        return __webpack_require__.d(getter, "a", getter), getter;
    }, __webpack_require__.o = function(object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
    }, __webpack_require__.p = "", __webpack_require__(__webpack_require__.s = 2);
}([ function(module, exports, __webpack_require__) {
    "use strict";
    module.exports = function(useSourceMap) {
        var list = [];
        return list.toString = function() {
            return this.map(function(item) {
                var content = function(item, useSourceMap) {
                    var content = item[1] || "";
                    var cssMapping = item[3];
                    if (!cssMapping) return content;
                    if (useSourceMap && "function" == typeof btoa) {
                        var sourceMapping = (sourceMap = cssMapping, "/*# sourceMappingURL=data:application/json;charset=utf-8;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */");
                        var sourceURLs = cssMapping.sources.map(function(source) {
                            return "/*# sourceURL=" + cssMapping.sourceRoot + source + " */";
                        });
                        return [ content ].concat(sourceURLs).concat([ sourceMapping ]).join("\n");
                    }
                    var sourceMap;
                    return [ content ].join("\n");
                }(item, useSourceMap);
                return item[2] ? "@media " + item[2] + "{" + content + "}" : content;
            }).join("");
        }, list.i = function(modules, mediaQuery) {
            "string" == typeof modules && (modules = [ [ null, modules, "" ] ]);
            var alreadyImportedModules = {};
            for (var i = 0; i < this.length; i++) {
                var id = this[i][0];
                null != id && (alreadyImportedModules[id] = !0);
            }
            for (i = 0; i < modules.length; i++) {
                var item = modules[i];
                null != item[0] && alreadyImportedModules[item[0]] || (mediaQuery && !item[2] ? item[2] = mediaQuery : mediaQuery && (item[2] = "(" + item[2] + ") and (" + mediaQuery + ")"), 
                list.push(item));
            }
        }, list;
    };
}, function(module, exports, __webpack_require__) {
    var stylesInDom = {};
    var isOldIE = (fn = function() {
        return window && document && document.all && !window.atob;
    }, function() {
        return void 0 === memo && (memo = fn.apply(this, arguments)), memo;
    });
    var fn, memo;
    var getElement = function(fn) {
        var memo = {};
        return function(target, parent) {
            if ("function" == typeof target) return target();
            if (void 0 === memo[target]) {
                var styleTarget = function(target, parent) {
                    return parent ? parent.querySelector(target) : document.querySelector(target);
                }.call(this, target, parent);
                if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) try {
                    styleTarget = styleTarget.contentDocument.head;
                } catch (e) {
                    styleTarget = null;
                }
                memo[target] = styleTarget;
            }
            return memo[target];
        };
    }();
    var singleton = null;
    var singletonCounter = 0;
    var stylesInsertedAtTop = [];
    var fixUrls = __webpack_require__(5);
    function addStylesToDom(styles, options) {
        for (var i = 0; i < styles.length; i++) {
            var item = styles[i];
            var domStyle = stylesInDom[item.id];
            if (domStyle) {
                domStyle.refs++;
                for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j](item.parts[j]);
                for (;j < item.parts.length; j++) domStyle.parts.push(addStyle(item.parts[j], options));
            } else {
                var parts = [];
                for (j = 0; j < item.parts.length; j++) parts.push(addStyle(item.parts[j], options));
                stylesInDom[item.id] = {
                    id: item.id,
                    refs: 1,
                    parts
                };
            }
        }
    }
    function listToStyles(list, options) {
        var styles = [];
        var newStyles = {};
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            var id = options.base ? item[0] + options.base : item[0];
            var part = {
                css: item[1],
                media: item[2],
                sourceMap: item[3]
            };
            newStyles[id] ? newStyles[id].parts.push(part) : styles.push(newStyles[id] = {
                id,
                parts: [ part ]
            });
        }
        return styles;
    }
    function insertStyleElement(options, style) {
        var target = getElement(options.insertInto);
        if (!target) throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
        var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];
        if ("top" === options.insertAt) lastStyleElementInsertedAtTop ? lastStyleElementInsertedAtTop.nextSibling ? target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling) : target.appendChild(style) : target.insertBefore(style, target.firstChild), 
        stylesInsertedAtTop.push(style); else if ("bottom" === options.insertAt) target.appendChild(style); else {
            if ("object" != typeof options.insertAt || !options.insertAt.before) throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
            var nextSibling = getElement(options.insertAt.before, target);
            target.insertBefore(style, nextSibling);
        }
    }
    function removeStyleElement(style) {
        if (null === style.parentNode) return !1;
        style.parentNode.removeChild(style);
        var idx = stylesInsertedAtTop.indexOf(style);
        idx >= 0 && stylesInsertedAtTop.splice(idx, 1);
    }
    function createStyleElement(options) {
        var style = document.createElement("style");
        if (void 0 === options.attrs.type && (options.attrs.type = "text/css"), void 0 === options.attrs.nonce) {
            var nonce = function() {
                0;
                return __webpack_require__.nc;
            }();
            nonce && (options.attrs.nonce = nonce);
        }
        return addAttrs(style, options.attrs), insertStyleElement(options, style), style;
    }
    function addAttrs(el, attrs) {
        Object.keys(attrs).forEach(function(key) {
            el.setAttribute(key, attrs[key]);
        });
    }
    function addStyle(obj, options) {
        var style, update, remove, result;
        if (options.transform && obj.css) {
            if (!(result = "function" == typeof options.transform ? options.transform(obj.css) : options.transform.default(obj.css))) return function() {};
            obj.css = result;
        }
        if (options.singleton) {
            var styleIndex = singletonCounter++;
            style = singleton || (singleton = createStyleElement(options)), update = applyToSingletonTag.bind(null, style, styleIndex, !1), 
            remove = applyToSingletonTag.bind(null, style, styleIndex, !0);
        } else obj.sourceMap && "function" == typeof URL && "function" == typeof URL.createObjectURL && "function" == typeof URL.revokeObjectURL && "function" == typeof Blob && "function" == typeof btoa ? (style = function(options) {
            var link = document.createElement("link");
            return void 0 === options.attrs.type && (options.attrs.type = "text/css"), options.attrs.rel = "stylesheet", 
            addAttrs(link, options.attrs), insertStyleElement(options, link), link;
        }(options), update = function(link, options, obj) {
            var css = obj.css;
            var sourceMap = obj.sourceMap;
            var autoFixUrls = void 0 === options.convertToAbsoluteUrls && sourceMap;
            (options.convertToAbsoluteUrls || autoFixUrls) && (css = fixUrls(css));
            sourceMap && (css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */");
            var blob = new Blob([ css ], {
                type: "text/css"
            });
            var oldSrc = link.href;
            link.href = URL.createObjectURL(blob), oldSrc && URL.revokeObjectURL(oldSrc);
        }.bind(null, style, options), remove = function() {
            removeStyleElement(style), style.href && URL.revokeObjectURL(style.href);
        }) : (style = createStyleElement(options), update = function(style, obj) {
            var css = obj.css;
            var media = obj.media;
            media && style.setAttribute("media", media);
            if (style.styleSheet) style.styleSheet.cssText = css; else {
                for (;style.firstChild; ) style.removeChild(style.firstChild);
                style.appendChild(document.createTextNode(css));
            }
        }.bind(null, style), remove = function() {
            removeStyleElement(style);
        });
        return update(obj), function(newObj) {
            if (newObj) {
                if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) return;
                update(obj = newObj);
            } else remove();
        };
    }
    module.exports = function(list, options) {
        if ("undefined" != typeof DEBUG && DEBUG && "object" != typeof document) throw new Error("The style-loader cannot be used in a non-browser environment");
        (options = options || {}).attrs = "object" == typeof options.attrs ? options.attrs : {}, 
        options.singleton || "boolean" == typeof options.singleton || (options.singleton = isOldIE()), 
        options.insertInto || (options.insertInto = "head"), options.insertAt || (options.insertAt = "bottom");
        var styles = listToStyles(list, options);
        return addStylesToDom(styles, options), function(newList) {
            var mayRemove = [];
            for (var i = 0; i < styles.length; i++) {
                var item = styles[i];
                (domStyle = stylesInDom[item.id]).refs--, mayRemove.push(domStyle);
            }
            newList && addStylesToDom(listToStyles(newList, options), options);
            for (i = 0; i < mayRemove.length; i++) {
                var domStyle;
                if (0 === (domStyle = mayRemove[i]).refs) {
                    for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();
                    delete stylesInDom[domStyle.id];
                }
            }
        };
    };
    var replaceText = (textStore = [], function(index, replacement) {
        return textStore[index] = replacement, textStore.filter(Boolean).join("\n");
    });
    var textStore;
    function applyToSingletonTag(style, index, remove, obj) {
        var css = remove ? "" : obj.css;
        if (style.styleSheet) style.styleSheet.cssText = replaceText(index, css); else {
            var cssNode = document.createTextNode(css);
            var childNodes = style.childNodes;
            childNodes[index] && style.removeChild(childNodes[index]), childNodes.length ? style.insertBefore(cssNode, childNodes[index]) : style.appendChild(cssNode);
        }
    }
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    __webpack_require__(3);
    __webpack_require__(6);
    function _defineProperty(obj, key, value) {
        return key in obj ? Object.defineProperty(obj, key, {
            value,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : obj[key] = value, obj;
    }
    const remapValue = (value, inMin, inMax, outMin, outMax) => value < inMin ? outMin : value > inMax ? outMax : (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    function hexToRgbA(hex, opacity) {
        let c;
        return 3 === (c = hex.substring(1).split("")).length && (c = [ c[0], c[0], c[1], c[1], c[2], c[2] ]), 
        `rgba(${[ (c = `0x4${c.join("")}`) >> 16 & 255, c >> 8 & 255, 255 & c ].join(",")}, ${opacity})`;
    }
    __webpack_exports__.default = class {
        constructor(props) {
            _defineProperty(this, "canvasEl", void 0), _defineProperty(this, "fontRenderEl", void 0), 
            _defineProperty(this, "renderStartedAt", void 0), _defineProperty(this, "state", {
                canvasWidth: 600,
                canvasHeight: 600,
                image: null,
                imageURL: "",
                text: "",
                textLines: [],
                textLettersFade: [],
                maxTextLines: 0,
                textFontFamily: "Kaushan Script",
                textFontSize: 12,
                textFontLineHeight: 0,
                textEffect: "fade",
                textFullyRendered: !1,
                textLastRenderedLetter: "",
                textFrame: 1,
                textFrameOpacity: .1,
                textFrameOpacityStep: .1,
                textLettersOpacity: 0,
                textLettersOpacityStep: .05,
                textFramePosition: 0,
                textFramePositionStep: .1,
                textAlign: "right",
                textVerticalAlign: "top",
                author: "",
                authorLines: [],
                authorFontFamily: "Nickainley",
                authorFontSize: 6,
                authorFontLineHeight: 0,
                authorEffect: "fade",
                authorFullyRendered: !1,
                authorLastRenderedLetter: "",
                authorFrame: 1,
                authorFrameOpacity: .1,
                authorFrameOpacityStep: .1,
                authorFramePosition: 0,
                authorFramePositionStep: .1,
                authorAlign: "left",
                authorVerticalAlign: "bottom",
                animate: !0,
                frameQuality: .93,
                overlay: "border",
                marginTop: 300,
                marginLeft: 50,
                color: "#FFF"
            }), _defineProperty(this, "setCanvasSize", () => {
                const {canvasWidth, canvasHeight} = this.state;
                this.canvasEl && (this.canvasEl.width = canvasWidth, this.canvasEl.height = canvasHeight);
            }), _defineProperty(this, "loadImage", () => new Promise((resolve, reject) => {
                const {imageURL} = this.state;
                const imageObj = new Image();
                imageObj.onload = (() => {
                    this.newState = {
                        image: imageObj
                    }, resolve();
                }), imageObj.onerror = (err => {
                    reject(err);
                }), imageObj.src = imageURL;
            })), _defineProperty(this, "renderImage", () => {
                if (!this.context) return;
                const {image, canvasWidth, canvasHeight} = this.state;
                if (image) {
                    let w = image.width;
                    let h = image.height;
                    let x;
                    let y;
                    const ratio = w / h;
                    w > h ? (h = canvasHeight, y = 0, x = -((w = canvasHeight * ratio) - canvasWidth) / 2) : (w = canvasWidth, 
                    x = 0, y = -((h = canvasWidth / ratio) - canvasHeight) / 2), this.context.drawImage(image, x, y, w, h);
                }
            }), _defineProperty(this, "renderOverlay", () => {
                if (!this.context) return;
                const {overlay, canvasWidth, canvasHeight, marginLeft, color} = this.state;
                this.context.shadowOffsetX = 0, this.context.shadowOffsetY = 0, this.context.shadowColor = 0, 
                this.context.shadowBlur = 0, "solid" === overlay && (this.context.fillStyle = hexToRgbA("#000", .5), 
                this.context.fillRect(marginLeft / 2, marginLeft / 2, canvasWidth - marginLeft, canvasHeight - marginLeft)), 
                "border" === overlay && (this.context.lineWidth = 4, this.context.strokeStyle = color, 
                this.context.rect(marginLeft / 2, marginLeft / 2, canvasWidth - marginLeft, canvasHeight - marginLeft), 
                this.context.stroke()), "lines" === overlay && (this.context.lineWidth = 4, this.context.strokeStyle = color, 
                this.context.beginPath(), this.context.moveTo(marginLeft / 2, marginLeft / 2), this.context.lineTo(canvasWidth - marginLeft / 2, marginLeft / 2), 
                this.context.stroke(), this.context.beginPath(), this.context.moveTo(marginLeft / 2, canvasHeight - marginLeft / 2), 
                this.context.lineTo(canvasWidth - marginLeft / 2, canvasHeight - marginLeft / 2), 
                this.context.stroke());
            }), _defineProperty(this, "getFont", (fontSize, fontFamily) => `${fontSize}rem "${fontFamily}"`), 
            _defineProperty(this, "getFontProps", (text, fontFamily, fontSize, splitToLines = !0) => {
                if (!this.fontRenderEl || !this.context) return {};
                const {marginTop, marginLeft, canvasWidth, canvasHeight} = this.state;
                const font = this.getFont(fontSize, fontFamily);
                this.context.font = font, this.fontRenderEl.style.font = font, this.fontRenderEl.innerText = text;
                const fontH = this.fontRenderEl.offsetHeight;
                const fontLineHeight = fontH + .2 * fontH;
                const maxTextLines = Math.floor((canvasHeight - marginTop) / fontLineHeight);
                if (splitToLines) {
                    const textLines = [];
                    let line = "";
                    const words = text.split(" ");
                    return words.forEach((word, index) => {
                        this.context.measureText(`${line} ${word}`).width > canvasWidth - marginLeft ? (textLines.push(line), 
                        line = word) : line += "" === line ? word : ` ${word}`, index === words.length - 1 && textLines.push(line);
                    }), textLines.length > maxTextLines ? this.getFontProps(text, fontFamily, fontSize - 1, splitToLines) : {
                        fontSize,
                        fontLineHeight,
                        maxTextLines,
                        textLines
                    };
                }
                return this.context.measureText(text).width > canvasWidth - marginLeft ? this.getFontProps(text, fontFamily, fontSize - 1, splitToLines) : {
                    fontSize,
                    fontLineHeight
                };
            }), _defineProperty(this, "loadText", () => new Promise(resolve => {
                if (!this.context) return;
                const {textFontFamily, textFontSize, authorFontFamily, authorFontSize} = this.state;
                const text = this.state.text.trim();
                const author = this.state.author.trim();
                this.context.textBaseline = "middle";
                const textProps = this.getFontProps(text, textFontFamily, textFontSize);
                const textLettersFade = [];
                textProps.textLines.forEach(line => {
                    const step = Math.ceil(line.length / (5 * Math.random() + 10));
                    const fadeLettersIndex = [];
                    for (let i = 0, l = line.length; i < l; i += step) fadeLettersIndex.push(i);
                    textLettersFade.push(fadeLettersIndex);
                });
                const authorProps = this.getFontProps(author, authorFontFamily, authorFontSize, !1);
                this.newState = {
                    text,
                    textLettersFade,
                    textFontSize: textProps.fontSize,
                    textFontLineHeight: textProps.fontLineHeight,
                    maxTextLines: textProps.maxTextLines,
                    textLines: textProps.textLines,
                    author,
                    authorFontSize: authorProps.fontSize,
                    authorFontLineHeight: authorProps.fontLineHeight
                }, resolve();
            })), _defineProperty(this, "fillText", (color, text, x, y, shadow = !0) => {
                this.context && (this.context.fillStyle = color, shadow && (this.context.shadowOffsetX = 3, 
                this.context.shadowOffsetY = 3, this.context.shadowColor = hexToRgbA("#000", .3), 
                this.context.shadowBlur = 4), this.context.fillText(text, x, y));
            }), _defineProperty(this, "animationType", (frame, line, renderedLettersCount, frameOpacity, x, y, multiline = !0) => {
                if (!this.context) return "";
                const {color} = this.state;
                let lastRenderedLetter;
                if (frame > renderedLettersCount + line.length) this.fillText(color, line, x, y); else {
                    let letterIndex = frame;
                    multiline && (letterIndex = frame - renderedLettersCount);
                    const currentText = line.substr(0, letterIndex - 1);
                    currentText.length && this.fillText(color, currentText, x, y);
                    const lineMetrics = this.context.measureText(currentText);
                    lastRenderedLetter = line.substr(letterIndex - 1, 1), this.fillText(hexToRgbA(color, frameOpacity), lastRenderedLetter, x + lineMetrics.width, y, !1);
                }
                return lastRenderedLetter;
            }), _defineProperty(this, "animationFade", (line, frameOpacity, x, y) => {
                if (!this.context) return;
                const {color} = this.state;
                this.fillText(hexToRgbA(color, frameOpacity), line, x, y);
            }), _defineProperty(this, "animationFadeLine", (frame, line, lineCount, frameOpacity, x, y) => {
                if (!this.context) return;
                const {color} = this.state;
                frame - 1 > lineCount && this.fillText(color, line, x, y), frame - 1 === lineCount && this.animationFade(line, frameOpacity, x, y);
            }), _defineProperty(this, "animationSlide", (line, frameOpacity, framePosition, x, y, direction) => {
                if (!this.context) return;
                const {color, marginLeft} = this.state;
                const margin = remapValue(framePosition, 0, 1, marginLeft, 0);
                let targetX = x;
                let targetY = y;
                "x" === direction ? targetX = x - margin : targetY = y - margin, this.fillText(hexToRgbA(color, frameOpacity), line, targetX, targetY);
            }), _defineProperty(this, "animationSlideLine", (frame, line, lineCount, frameOpacity, framePosition, x, y, direction) => {
                if (!this.context) return;
                const {color} = this.state;
                frame - 1 > lineCount && this.fillText(color, line, x, y), frame - 1 === lineCount && this.animationSlide(line, frameOpacity, framePosition, x, y, direction);
            }), _defineProperty(this, "renderText", () => {
                if (!this.context) return;
                const {animate, textEffect, textFontSize, textFontFamily, textFontLineHeight, textLines, maxTextLines, textLettersFade, textFrame, textFrameOpacity, textFrameOpacityStep, textLettersOpacity, textLettersOpacityStep, textFramePosition, textFramePositionStep, textFullyRendered, authorFontLineHeight, canvasWidth, canvasHeight, color, textAlign, textVerticalAlign, authorVerticalAlign, marginLeft} = this.state;
                this.context.font = this.getFont(textFontSize, textFontFamily);
                let j = 0;
                let renderedLettersCount = 0;
                let lastRenderedLetter = "";
                for (let i = (maxTextLines - textLines.length) / 2, l = i + textLines.length; i < l; i++) {
                    const line = textLines[j];
                    const lineMetrics = this.context.measureText(line);
                    let x = marginLeft / 2;
                    "center" === textAlign ? x = (canvasWidth - lineMetrics.width) / 2 : "right" === textAlign && (x = canvasWidth - lineMetrics.width - marginLeft / 2);
                    let yMargin = remapValue(textFontLineHeight, 40, 150, 30, 0);
                    const maxHeightArea = maxTextLines * textFontLineHeight;
                    "center" === textVerticalAlign ? yMargin = (canvasHeight - maxHeightArea) / 2 : "bottom" === textVerticalAlign && (yMargin = canvasHeight - maxHeightArea - authorFontLineHeight / 2);
                    let y = i * textFontLineHeight + textFontLineHeight / 2 + yMargin;
                    if ("center" !== textVerticalAlign && "bottom" !== textVerticalAlign || textVerticalAlign !== authorVerticalAlign || (y -= authorFontLineHeight), 
                    animate) {
                        if ("type" === textEffect && (lastRenderedLetter = this.animationType(textFrame, line, renderedLettersCount, textFrameOpacity, x, y))) break;
                        if ("fade lines" === textEffect && (this.animationFadeLine(textFrame, line, j, textFrameOpacity, x, y), 
                        textFrame - 1 === j)) break;
                        if ("fade letters" === textEffect) {
                            const lineLettersFade = textLettersFade[j];
                            for (let t = 1, tl = line.length; t <= tl; t++) {
                                const prevLetters = this.context.measureText(line.substr(0, t - 1));
                                const currentLetter = line.substr(t - 1, 1);
                                let letterColor;
                                letterColor = lineLettersFade.includes(t) ? hexToRgbA(color, textLettersOpacity) : hexToRgbA(color, textFrameOpacity), 
                                this.fillText(letterColor, currentLetter, x + prevLetters.width, y);
                            }
                        }
                        "fade" === textEffect && this.animationFade(line, textFrameOpacity, x, y), "slide lines" === textEffect && this.animationSlideLine(textFrame, line, j, textFrameOpacity, textFramePosition, x, y, "x"), 
                        "append lines" === textEffect && this.animationSlideLine(textFrame, line, j, textFrameOpacity, textFramePosition, x, y, "y");
                    } else this.fillText(color, line, x, y);
                    renderedLettersCount += line.length, j++;
                }
                if (!textFullyRendered) switch (textEffect) {
                  case "type":
                    {
                        const totalLettersCount = textLines.reduce((accumulator, currentValue) => accumulator + currentValue.length, 0);
                        const emptyLetterOrOpacityIsFull = " " === lastRenderedLetter || textFrameOpacity >= 1;
                        this.newState = {
                            textFullyRendered: !animate || renderedLettersCount === totalLettersCount,
                            textFrame: emptyLetterOrOpacityIsFull ? textFrame + 1 : textFrame,
                            textFrameOpacity: emptyLetterOrOpacityIsFull ? textFrameOpacityStep : textFrameOpacity + textFrameOpacityStep,
                            textLastRenderedLetter: lastRenderedLetter
                        };
                        break;
                    }

                  case "fade lines":
                    this.newState = {
                        textFullyRendered: !animate || textFrame > textLines.length,
                        textFrame: textFrameOpacity >= 1 ? textFrame + 1 : textFrame,
                        textFrameOpacity: textFrameOpacity >= 1 ? textFrameOpacityStep : textFrameOpacity + textFrameOpacityStep
                    };
                    break;

                  case "fade letters":
                    this.newState = {
                        textFullyRendered: !animate || 1 === textLettersOpacity,
                        textFrame: textLettersOpacity >= 1 ? textFrame + 1 : textFrame,
                        textFrameOpacity: textFrameOpacity >= 1 ? 1 : textFrameOpacity + textFrameOpacityStep,
                        textLettersOpacity: textLettersOpacity >= 1 ? 1 : textLettersOpacity + textLettersOpacityStep
                    };
                    break;

                  case "fade":
                    this.newState = {
                        textFullyRendered: !animate || 1 === textFrameOpacity,
                        textFrame: textFrameOpacity >= 1 ? textFrame + 1 : textFrame,
                        textFrameOpacity: textFrameOpacity >= 1 ? 1 : textFrameOpacity + textFrameOpacityStep
                    };
                    break;

                  case "slide lines":
                  case "append lines":
                    this.newState = {
                        textFullyRendered: !animate || textFrame > textLines.length,
                        textFrame: textFramePosition >= 1 ? textFrame + 1 : textFrame,
                        textFrameOpacity: textFrameOpacity >= 1 ? textFrameOpacityStep : textFrameOpacity + textFrameOpacityStep,
                        textFramePosition: textFramePosition >= 1 ? 0 : Number((textFramePosition + textFramePositionStep).toFixed(1))
                    };
                }
            }), _defineProperty(this, "renderAuthor", () => {
                if (!this.context) return;
                const {animate, authorEffect, canvasHeight, authorFontSize, authorFontFamily, authorFontLineHeight, author, textLines, maxTextLines, textFontLineHeight, textVerticalAlign, authorFrame, authorFrameOpacity, authorFrameOpacityStep, authorFramePosition, authorFramePositionStep, authorFullyRendered, canvasWidth, color, authorAlign, authorVerticalAlign, marginLeft} = this.state;
                this.context.font = this.getFont(authorFontSize, authorFontFamily);
                const lineMetrics = this.context.measureText(author);
                let x = marginLeft / 2;
                "center" === authorAlign ? x = (canvasWidth - lineMetrics.width) / 2 : "right" === authorAlign && (x = canvasWidth - lineMetrics.width - marginLeft / 2);
                let yMargin = 1.3 * authorFontLineHeight;
                const maxHeightArea = maxTextLines * textFontLineHeight;
                "center" === authorVerticalAlign && "center" === textVerticalAlign ? yMargin = (canvasHeight - maxHeightArea) / 2 : "bottom" === authorVerticalAlign && (yMargin = canvasHeight - maxHeightArea - authorFontLineHeight / 2);
                const y = ((maxTextLines - textLines.length) / 2 + textLines.length - 1) * textFontLineHeight + textFontLineHeight + yMargin;
                let lastRenderedLetter = "";
                if (animate ? ("type" === authorEffect && (lastRenderedLetter = this.animationType(authorFrame, author, authorFrame, authorFrameOpacity, x, y, !1)), 
                "fade" === authorEffect && this.animationFade(author, authorFrameOpacity, x, y), 
                "slide" === authorEffect && this.animationSlide(author, authorFrameOpacity, authorFramePosition, x, y, "x"), 
                "append" === authorEffect && this.animationSlide(author, authorFrameOpacity, authorFramePosition, x, y, "y")) : this.fillText(color, author, x, y), 
                !authorFullyRendered) switch (authorEffect) {
                  case "type":
                    {
                        const emptyLetterOrOpacityIsFull = " " === lastRenderedLetter || authorFrameOpacity >= 1;
                        this.newState = {
                            authorFullyRendered: !animate || authorFrame > author.length,
                            authorFrame: emptyLetterOrOpacityIsFull ? authorFrame + 1 : authorFrame,
                            authorFrameOpacity: emptyLetterOrOpacityIsFull ? authorFrameOpacityStep : authorFrameOpacity + authorFrameOpacityStep,
                            authorLastRenderedLetter: lastRenderedLetter
                        };
                        break;
                    }

                  case "fade":
                    this.newState = {
                        authorFullyRendered: !animate || authorFrameOpacity > 1,
                        authorFrame: authorFrameOpacity >= 1 ? authorFrame + 1 : authorFrame,
                        authorFrameOpacity: authorFrameOpacity >= 1 ? authorFrameOpacityStep : authorFrameOpacity + authorFrameOpacityStep
                    };
                    break;

                  case "slide":
                  case "append":
                    this.newState = {
                        authorFullyRendered: !animate || authorFramePosition >= 1,
                        authorFrame: authorFramePosition >= 1 ? authorFrame + 1 : authorFrame,
                        authorFrameOpacity: authorFrameOpacity >= 1 ? 1 : authorFrameOpacity + authorFrameOpacityStep,
                        authorFramePosition: authorFramePosition >= 1 ? 0 : authorFramePosition + authorFramePositionStep
                    };
                }
            }), _defineProperty(this, "render", () => {
                const {image, textFullyRendered} = this.state;
                if (!image) return Promise.all([ this.loadImage(), this.loadText() ]).then(() => {
                    this.render();
                }).catch(err => {
                    console.error(err);
                }), void (this.renderStartedAt = Date.now());
                this.renderImage(), this.renderText(), this.renderOverlay(), textFullyRendered && this.renderAuthor(), 
                this.postRender();
            }), _defineProperty(this, "postRender", () => {
                const {textEffect, textFullyRendered, textLastRenderedLetter, authorEffect, authorFullyRendered, authorLastRenderedLetter, frameQuality} = this.state;
                if (this.canvasEl && window.puppeteer && ("type" !== textEffect || "" !== textLastRenderedLetter && " " !== textLastRenderedLetter || "type" !== authorEffect || "" !== authorLastRenderedLetter && " " !== authorLastRenderedLetter)) {
                    const imgdata = this.canvasEl.toDataURL("image/jpeg", frameQuality);
                    console.log(imgdata);
                }
                textFullyRendered && authorFullyRendered ? (console.log("Render time: ", (Date.now() - this.renderStartedAt) / 1e3), 
                window.puppeteer && console.log("puppeteer: Finish")) : window.puppeteer ? this.render() : requestAnimationFrame(() => {
                    this.render();
                });
            }), _defineProperty(this, "rerender", () => {
                const textFullyRendered = this.state.textFullyRendered;
                const authorFullyRendered = this.state.authorFullyRendered;
                this.newState = {
                    textFullyRendered: !1,
                    textLastRenderedLetter: "",
                    textFrame: 1,
                    authorFullyRendered: !1,
                    authorLastRenderedLetter: "",
                    authorFrame: 1
                }, textFullyRendered && authorFullyRendered && (this.renderStartedAt = Date.now(), 
                this.render());
            }), _defineProperty(this, "stop", () => {
                this.newState = {
                    textFullyRendered: !0,
                    authorFullyRendered: !0
                };
            }), this.newState = props;
            let container = props.container;
            "string" == typeof props.container && (container = document.querySelector(props.container)), 
            container ? (this.canvasEl = document.createElement("canvas"), this.fontRenderEl = document.createElement("div"), 
            this.fontRenderEl.id = "canvas-font-renderer", container.appendChild(this.canvasEl), 
            container.appendChild(this.fontRenderEl), this.setCanvasSize()) : console.error("Wrong container selector");
        }
        set newState(props) {
            Object.keys(props).forEach(item => {
                this.state[item] = props[item];
            });
        }
        get context() {
            return this.canvasEl ? this.canvasEl.getContext("2d") : null;
        }
    };
}, function(module, exports, __webpack_require__) {
    var content = __webpack_require__(4);
    "string" == typeof content && (content = [ [ module.i, content, "" ] ]);
    var options = {
        hmr: !0
    };
    options.transform = void 0, options.insertInto = void 0;
    __webpack_require__(1)(content, options);
    content.locals && (module.exports = content.locals);
}, function(module, exports, __webpack_require__) {
    (module.exports = __webpack_require__(0)(!1)).push([ module.i, "html, body, form, fieldset, ul, dl, dt, dd, table, td, th, img, menu {\n    margin: 0;\n    padding: 0;\n    border: none;\n}\n\nhtml {\n    height: 100%;\n    width: 100%;\n    font-size: 10px;\n}\n\nbody {\n    background-color: #333;\n}\n\n#canvas-font-renderer {\n    position: absolute;\n    left: 0;\n    top: -1000rem;\n    white-space: nowrap;\n}\n\n.refresh-button {\n    display: block;\n    margin: 30px 0 0 20px;\n    font-size: 30px;\n}\n", "" ]);
}, function(module, exports) {
    module.exports = function(css) {
        var location = "undefined" != typeof window && window.location;
        if (!location) throw new Error("fixUrls requires window.location");
        if (!css || "string" != typeof css) return css;
        var baseUrl = location.protocol + "//" + location.host;
        var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");
        return css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
            var unquotedOrigUrl = origUrl.trim().replace(/^"(.*)"$/, function(o, $1) {
                return $1;
            }).replace(/^'(.*)'$/, function(o, $1) {
                return $1;
            });
            return /^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(unquotedOrigUrl) ? fullMatch : (newUrl = 0 === unquotedOrigUrl.indexOf("//") ? unquotedOrigUrl : 0 === unquotedOrigUrl.indexOf("/") ? baseUrl + unquotedOrigUrl : currentDir + unquotedOrigUrl.replace(/^\.\//, ""), 
            "url(" + JSON.stringify(newUrl) + ")");
            var newUrl;
        });
    };
}, function(module, exports, __webpack_require__) {
    var content = __webpack_require__(7);
    "string" == typeof content && (content = [ [ module.i, content, "" ] ]);
    var options = {
        hmr: !0
    };
    options.transform = void 0, options.insertInto = void 0;
    __webpack_require__(1)(content, options);
    content.locals && (module.exports = content.locals);
}, function(module, exports, __webpack_require__) {
    exports = module.exports = __webpack_require__(0)(!1);
    var urlEscape = __webpack_require__(8);
    var ___CSS_LOADER_URL___0___ = urlEscape(__webpack_require__(9));
    var ___CSS_LOADER_URL___1___ = urlEscape(__webpack_require__(10));
    exports.push([ module.i, "/* latin */\n@font-face {\n    font-family: 'Kaushan Script';\n    font-style: normal;\n    font-weight: 400;\n    src: url(" + ___CSS_LOADER_URL___0___ + ") format('woff2');\n    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n@font-face {\n    font-family: 'Nickainley';\n    font-style: normal;\n    font-weight: 400;\n    src: url(" + ___CSS_LOADER_URL___1___ + ") format('ttf');\n    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n", "" ]);
}, function(module, exports, __webpack_require__) {
    "use strict";
    module.exports = function(url, needQuotes) {
        return "string" != typeof url ? url : (/^['"].*['"]$/.test(url) && (url = url.slice(1, -1)), 
        /["'() \t\n]/.test(url) || needQuotes ? '"' + url.replace(/"/g, '\\"').replace(/\n/g, "\\n") + '"' : url);
    };
}, function(module, exports, __webpack_require__) {
    module.exports = __webpack_require__.p + "/fonts/KaushanScript-Regular.woff2";
}, function(module, exports, __webpack_require__) {
    module.exports = __webpack_require__.p + "/fonts/Nickainley.ttf";
} ]);
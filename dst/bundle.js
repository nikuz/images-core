module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function (useSourceMap) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item, useSourceMap);

      if (item[2]) {
        return '@media ' + item[2] + '{' + content + '}';
      } else {
        return content;
      }
    }).join('');
  }; // import a list of modules into the list


  list.i = function (modules, mediaQuery) {
    if (typeof modules === 'string') {
      modules = [[null, modules, '']];
    }

    var alreadyImportedModules = {};

    for (var i = 0; i < this.length; i++) {
      var id = this[i][0];

      if (id != null) {
        alreadyImportedModules[id] = true;
      }
    }

    for (i = 0; i < modules.length; i++) {
      var item = modules[i]; // skip already imported module
      // this implementation is not 100% perfect for weird media query combinations
      // when a module is imported multiple times with different media queries.
      // I hope this will never occur (Hey this way we have smaller bundles)

      if (item[0] == null || !alreadyImportedModules[item[0]]) {
        if (mediaQuery && !item[2]) {
          item[2] = mediaQuery;
        } else if (mediaQuery) {
          item[2] = '(' + item[2] + ') and (' + mediaQuery + ')';
        }

        list.push(item);
      }
    }
  };

  return list;
};

function cssWithMappingToString(item, useSourceMap) {
  var content = item[1] || '';
  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (useSourceMap && typeof btoa === 'function') {
    var sourceMapping = toComment(cssMapping);
    var sourceURLs = cssMapping.sources.map(function (source) {
      return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */';
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
  }

  return [content].join('\n');
} // Adapted from convert-source-map (MIT)


function toComment(sourceMap) {
  // eslint-disable-next-line no-undef
  var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
  var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;
  return '/*# ' + data + ' */';
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getTarget = function (target, parent) {
  if (parent){
    return parent.querySelector(target);
  }
  return document.querySelector(target);
};

var getElement = (function (fn) {
	var memo = {};

	return function(target, parent) {
                // If passing function in options, then use it for resolve "head" element.
                // Useful for Shadow Root style i.e
                // {
                //   insertInto: function () { return document.querySelector("#foo").shadowRoot }
                // }
                if (typeof target === 'function') {
                        return target();
                }
                if (typeof memo[target] === "undefined") {
			var styleTarget = getTarget.call(this, target, parent);
			// Special case to return head of iframe instead of iframe itself
			if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[target] = styleTarget;
		}
		return memo[target]
	};
})();

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(5);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
        if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertAt.before, target);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}

	if(options.attrs.nonce === undefined) {
		var nonce = getNonce();
		if (nonce) {
			options.attrs.nonce = nonce;
		}
	}

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function getNonce() {
	if (false) {}

	return __webpack_require__.nc;
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = typeof options.transform === 'function'
		 ? options.transform(obj.css) 
		 : options.transform.default(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _css_base_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _css_base_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_css_base_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _css_fonts_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6);
/* harmony import */ var _css_fonts_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_css_fonts_css__WEBPACK_IMPORTED_MODULE_1__);
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




const remapValue = (value, inMin, inMax, outMin, outMax) => {
  if (value < inMin) {
    return outMin;
  }

  if (value > inMax) {
    return outMax;
  }

  return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
};

function hexToRgbA(hex, opacity) {
  let c;
  c = hex.substring(1).split('');

  if (c.length === 3) {
    c = [c[0], c[0], c[1], c[1], c[2], c[2]];
  }

  c = `0x4${c.join('')}`;
  return `rgba(${[c >> 16 & 255, c >> 8 & 255, c & 255].join(',')}, ${opacity})`;
}

class Renderer {
  constructor(props) {
    _defineProperty(this, "canvasEl", void 0);

    _defineProperty(this, "fontRenderEl", void 0);

    _defineProperty(this, "renderStartedAt", void 0);

    _defineProperty(this, "state", {
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
      textFontSize: 12,
      // in rem
      textFontLineHeight: 0,
      // in px
      textEffect: 'fade',
      // type | fade lines | fade letters | slide lines | append lines | fade
      textFullyRendered: false,
      textLastRenderedLetter: '',
      textFrame: 1,
      textFrameOpacity: 0.1,
      textFrameOpacityStep: 0.1,
      textLettersOpacity: 0,
      textLettersOpacityStep: 0.05,
      textFramePosition: 0,
      textFramePositionStep: 0.1,
      textAlign: 'right',
      // left | center | right
      textVerticalAlign: 'top',
      // top | center | bottom
      // author
      author: '',
      authorLines: [],
      authorFontFamily: 'Nickainley',
      authorFontSize: 6,
      authorFontLineHeight: 0,
      authorEffect: 'fade',
      // type | slide | append | fade
      authorFullyRendered: false,
      authorLastRenderedLetter: '',
      authorFrame: 1,
      authorFrameOpacity: 0.1,
      authorFrameOpacityStep: 0.1,
      authorFramePosition: 0,
      authorFramePositionStep: 0.1,
      authorAlign: 'left',
      // left | center | right
      authorVerticalAlign: 'bottom',
      // top | center | bottom
      // common
      animate: true,
      frameQuality: 0.93,
      overlay: 'border',
      // solid | lines | border
      marginTop: 300,
      // in px
      marginLeft: 50,
      // in px
      color: '#FFF'
    });

    _defineProperty(this, "setCanvasSize", () => {
      const {
        canvasWidth,
        canvasHeight
      } = this.state;

      if (this.canvasEl) {
        this.canvasEl.width = canvasWidth;
        this.canvasEl.height = canvasHeight;
      }
    });

    _defineProperty(this, "loadImage", () => new Promise((resolve, reject) => {
      const {
        imageURL
      } = this.state;
      const imageObj = new Image();

      imageObj.onload = () => {
        this.newState = {
          image: imageObj
        };
        resolve();
      };

      imageObj.onerror = err => {
        reject(err);
      };

      imageObj.src = imageURL;
    }));

    _defineProperty(this, "renderImage", () => {
      if (!this.context) {
        return;
      }

      const {
        image,
        canvasWidth,
        canvasHeight
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
    });

    _defineProperty(this, "renderOverlay", () => {
      if (!this.context) {
        return;
      }

      const {
        overlay,
        canvasWidth,
        canvasHeight,
        marginLeft,
        color
      } = this.state;
      this.context.shadowOffsetX = 0;
      this.context.shadowOffsetY = 0;
      this.context.shadowColor = 0;
      this.context.shadowBlur = 0;

      if (overlay === 'solid') {
        this.context.fillStyle = hexToRgbA('#000', 0.5);
        this.context.fillRect(marginLeft / 2, marginLeft / 2, canvasWidth - marginLeft, canvasHeight - marginLeft);
      }

      if (overlay === 'border') {
        this.context.lineWidth = 4;
        this.context.strokeStyle = color;
        this.context.rect(marginLeft / 2, marginLeft / 2, canvasWidth - marginLeft, canvasHeight - marginLeft);
        this.context.stroke();
      }

      if (overlay === 'lines') {
        this.context.lineWidth = 4;
        this.context.strokeStyle = color;
        this.context.beginPath();
        this.context.moveTo(marginLeft / 2, marginLeft / 2);
        this.context.lineTo(canvasWidth - marginLeft / 2, marginLeft / 2);
        this.context.stroke();
        this.context.beginPath();
        this.context.moveTo(marginLeft / 2, canvasHeight - marginLeft / 2);
        this.context.lineTo(canvasWidth - marginLeft / 2, canvasHeight - marginLeft / 2);
        this.context.stroke();
      }
    });

    _defineProperty(this, "getFont", (fontSize, fontFamily) => `${fontSize}rem "${fontFamily}"`);

    _defineProperty(this, "getFontProps", (text, fontFamily, fontSize, splitToLines = true) => {
      if (!this.fontRenderEl || !this.context) {
        return {};
      }

      const {
        marginTop,
        marginLeft,
        canvasWidth,
        canvasHeight
      } = this.state;
      const font = this.getFont(fontSize, fontFamily);
      this.context.font = font;
      this.fontRenderEl.style.font = font;
      this.fontRenderEl.innerText = text;
      const fontH = this.fontRenderEl.offsetHeight;
      const fontLineHeight = fontH + fontH * 0.2;
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
          textLines
        };
      }

      const lineMetrics = this.context.measureText(text);

      if (lineMetrics.width > canvasWidth - marginLeft) {
        return this.getFontProps(text, fontFamily, fontSize - 1, splitToLines);
      }

      return {
        fontSize,
        fontLineHeight
      };
    });

    _defineProperty(this, "loadText", () => new Promise(resolve => {
      if (!this.context) {
        return;
      }

      const {
        textFontFamily,
        textFontSize,
        authorFontFamily,
        authorFontSize
      } = this.state;
      const text = this.state.text.trim();
      const author = this.state.author.trim();
      this.context.textBaseline = 'middle';
      const textProps = this.getFontProps(text, textFontFamily, textFontSize);
      const textLettersFade = [];
      textProps.textLines.forEach(line => {
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
        authorFontLineHeight: authorProps.fontLineHeight
      };
      resolve();
    }));

    _defineProperty(this, "fillText", (color, text, x, y, shadow = true) => {
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
    });

    _defineProperty(this, "animationType", (frame, line, renderedLettersCount, frameOpacity, x, y, multiline = true) => {
      if (!this.context) {
        return '';
      }

      const {
        color
      } = this.state;
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
        this.fillText(hexToRgbA(color, frameOpacity), lastRenderedLetter, x + lineMetrics.width, y, false);
      }

      return lastRenderedLetter;
    });

    _defineProperty(this, "animationFade", (line, frameOpacity, x, y) => {
      if (!this.context) {
        return;
      }

      const {
        color
      } = this.state;
      this.fillText(hexToRgbA(color, frameOpacity), line, x, y);
    });

    _defineProperty(this, "animationFadeLine", (frame, line, lineCount, frameOpacity, x, y) => {
      if (!this.context) {
        return;
      }

      const {
        color
      } = this.state;

      if (frame - 1 > lineCount) {
        this.fillText(color, line, x, y);
      }

      if (frame - 1 === lineCount) {
        this.animationFade(line, frameOpacity, x, y);
      }
    });

    _defineProperty(this, "animationSlide", (line, frameOpacity, framePosition, x, y, direction) => {
      if (!this.context) {
        return;
      }

      const {
        color,
        marginLeft
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
    });

    _defineProperty(this, "animationSlideLine", (frame, line, lineCount, frameOpacity, framePosition, x, y, direction) => {
      if (!this.context) {
        return;
      }

      const {
        color
      } = this.state;

      if (frame - 1 > lineCount) {
        this.fillText(color, line, x, y);
      }

      if (frame - 1 === lineCount) {
        this.animationSlide(line, frameOpacity, framePosition, x, y, direction);
      }
    });

    _defineProperty(this, "renderText", () => {
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
        authorFontLineHeight,
        canvasWidth,
        canvasHeight,
        color,
        textAlign,
        textVerticalAlign,
        authorVerticalAlign,
        marginLeft
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
          x = canvasWidth - lineMetrics.width - marginLeft / 2;
        }

        let yMargin = remapValue(textFontLineHeight, 40, 150, 30, 0);
        const maxHeightArea = maxTextLines * textFontLineHeight;

        if (textVerticalAlign === 'center') {
          yMargin = (canvasHeight - maxHeightArea) / 2;
        } else if (textVerticalAlign === 'bottom') {
          yMargin = canvasHeight - maxHeightArea - authorFontLineHeight / 2;
        }

        let y = i * textFontLineHeight + textFontLineHeight / 2 + yMargin;

        if ((textVerticalAlign === 'center' || textVerticalAlign === 'bottom') && textVerticalAlign === authorVerticalAlign) {
          y -= authorFontLineHeight;
        }

        if (animate) {
          if (textEffect === 'type') {
            lastRenderedLetter = this.animationType(textFrame, line, renderedLettersCount, textFrameOpacity, x, y);

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
            this.animationSlideLine(textFrame, line, j, textFrameOpacity, textFramePosition, x, y, 'x');
          }

          if (textEffect === 'append lines') {
            this.animationSlideLine(textFrame, line, j, textFrameOpacity, textFramePosition, x, y, 'y');
          }
        } else {
          this.fillText(color, line, x, y);
        }

        renderedLettersCount += line.length;
        j++;
      }

      if (textFullyRendered) {
        return;
      }

      switch (textEffect) {
        case 'type':
          {
            const totalLettersCount = textLines.reduce((accumulator, currentValue) => accumulator + currentValue.length, 0);
            const emptyLetterOrOpacityIsFull = lastRenderedLetter === ' ' || textFrameOpacity >= 1;
            this.newState = {
              textFullyRendered: animate ? renderedLettersCount === totalLettersCount : true,
              textFrame: emptyLetterOrOpacityIsFull ? textFrame + 1 : textFrame,
              textFrameOpacity: emptyLetterOrOpacityIsFull ? textFrameOpacityStep : textFrameOpacity + textFrameOpacityStep,
              textLastRenderedLetter: lastRenderedLetter
            };
            break;
          }

        case 'fade lines':
          this.newState = {
            textFullyRendered: animate ? textFrame > textLines.length : true,
            textFrame: textFrameOpacity >= 1 ? textFrame + 1 : textFrame,
            textFrameOpacity: textFrameOpacity >= 1 ? textFrameOpacityStep : textFrameOpacity + textFrameOpacityStep
          };
          break;

        case 'fade letters':
          this.newState = {
            textFullyRendered: animate ? textLettersOpacity === 1 : true,
            textFrame: textLettersOpacity >= 1 ? textFrame + 1 : textFrame,
            textFrameOpacity: textFrameOpacity >= 1 ? 1 : textFrameOpacity + textFrameOpacityStep,
            textLettersOpacity: textLettersOpacity >= 1 ? 1 : textLettersOpacity + textLettersOpacityStep
          };
          break;

        case 'fade':
          this.newState = {
            textFullyRendered: animate ? textFrameOpacity === 1 : true,
            textFrame: textFrameOpacity >= 1 ? textFrame + 1 : textFrame,
            textFrameOpacity: textFrameOpacity >= 1 ? 1 : textFrameOpacity + textFrameOpacityStep
          };
          break;

        case 'slide lines':
        case 'append lines':
          this.newState = {
            textFullyRendered: animate ? textFrame > textLines.length : true,
            textFrame: textFramePosition >= 1 ? textFrame + 1 : textFrame,
            textFrameOpacity: textFrameOpacity >= 1 ? textFrameOpacityStep : textFrameOpacity + textFrameOpacityStep,
            textFramePosition: textFramePosition >= 1 ? 0 : Number((textFramePosition + textFramePositionStep).toFixed(1))
          };
          break;

        default:
      }
    });

    _defineProperty(this, "renderAuthor", () => {
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
        authorFullyRendered,
        canvasWidth,
        color,
        authorAlign,
        authorVerticalAlign,
        marginLeft
      } = this.state;
      this.context.font = this.getFont(authorFontSize, authorFontFamily);
      const lineMetrics = this.context.measureText(author);
      let x = marginLeft / 2;

      if (authorAlign === 'center') {
        x = (canvasWidth - lineMetrics.width) / 2;
      } else if (authorAlign === 'right') {
        x = canvasWidth - lineMetrics.width - marginLeft / 2;
      }

      const textFirstLine = (maxTextLines - textLines.length) / 2;
      const textLastLine = textFirstLine + textLines.length - 1;
      let yMargin = authorFontLineHeight * 1.3;
      const maxHeightArea = maxTextLines * textFontLineHeight;

      if (authorVerticalAlign === 'center' && textVerticalAlign === 'center') {
        yMargin = (canvasHeight - maxHeightArea) / 2;
      } else if (authorVerticalAlign === 'bottom') {
        yMargin = canvasHeight - maxHeightArea - authorFontLineHeight / 2;
      }

      const y = textLastLine * textFontLineHeight + textFontLineHeight + yMargin;
      let lastRenderedLetter = '';

      if (animate) {
        if (authorEffect === 'type') {
          lastRenderedLetter = this.animationType(authorFrame, author, authorFrame, authorFrameOpacity, x, y, false);
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
        case 'type':
          {
            const emptyLetterOrOpacityIsFull = lastRenderedLetter === ' ' || authorFrameOpacity >= 1;
            this.newState = {
              authorFullyRendered: animate ? authorFrame > author.length : true,
              authorFrame: emptyLetterOrOpacityIsFull ? authorFrame + 1 : authorFrame,
              authorFrameOpacity: emptyLetterOrOpacityIsFull ? authorFrameOpacityStep : authorFrameOpacity + authorFrameOpacityStep,
              authorLastRenderedLetter: lastRenderedLetter
            };
            break;
          }

        case 'fade':
          this.newState = {
            authorFullyRendered: animate ? authorFrameOpacity > 1 : true,
            authorFrame: authorFrameOpacity >= 1 ? authorFrame + 1 : authorFrame,
            authorFrameOpacity: authorFrameOpacity >= 1 ? authorFrameOpacityStep : authorFrameOpacity + authorFrameOpacityStep
          };
          break;

        case 'slide':
        case 'append':
          this.newState = {
            authorFullyRendered: animate ? authorFramePosition >= 1 : true,
            authorFrame: authorFramePosition >= 1 ? authorFrame + 1 : authorFrame,
            authorFrameOpacity: authorFrameOpacity >= 1 ? 1 : authorFrameOpacity + authorFrameOpacityStep,
            authorFramePosition: authorFramePosition >= 1 ? 0 : authorFramePosition + authorFramePositionStep
          };
          break;

        default:
      }
    });

    _defineProperty(this, "render", () => {
      const {
        image,
        textFullyRendered
      } = this.state;

      if (!image) {
        Promise.all([this.loadImage(), this.loadText()]).then(() => {
          this.render();
        }).catch(err => {
          console.error(err); // eslint-disable-line
        });
        this.renderStartedAt = Date.now();
        return;
      }

      this.renderImage();
      this.renderText();
      this.renderOverlay();

      if (textFullyRendered) {
        this.renderAuthor();
      }

      this.postRender();
    });

    _defineProperty(this, "postRender", () => {
      const {
        textEffect,
        textFullyRendered,
        textLastRenderedLetter,
        authorEffect,
        authorFullyRendered,
        authorLastRenderedLetter,
        frameQuality
      } = this.state;

      if (this.canvasEl && window.puppeteer && (textEffect !== 'type' || textLastRenderedLetter !== '' && textLastRenderedLetter !== ' ' || authorEffect !== 'type' || authorLastRenderedLetter !== '' && authorLastRenderedLetter !== ' ')) {
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
          }); // }, 200);
        }
      } else {
        console.log('Render time: ', (Date.now() - this.renderStartedAt) / 1000); // eslint-disable-line

        if (window.puppeteer) {
          console.log('puppeteer: Finish'); // eslint-disable-line
        }
      }
    });

    _defineProperty(this, "rerender", () => {
      const textFullyRendered = this.state.textFullyRendered;
      const authorFullyRendered = this.state.authorFullyRendered;
      this.newState = {
        textFullyRendered: false,
        textLastRenderedLetter: '',
        textFrame: 1,
        authorFullyRendered: false,
        authorLastRenderedLetter: '',
        authorFrame: 1
      };

      if (textFullyRendered && authorFullyRendered) {
        this.renderStartedAt = Date.now();
        this.render();
      }
    });

    _defineProperty(this, "stop", () => {
      this.newState = {
        textFullyRendered: true,
        authorFullyRendered: true
      };
    });

    this.newState = props;
    let container = props.container;

    if (typeof props.container === 'string') {
      container = document.querySelector(props.container);
    }

    if (!container) {
      console.error('Wrong container selector'); // eslint-disable-line

      return;
    }

    this.canvasEl = document.createElement('canvas');
    this.fontRenderEl = document.createElement('div');
    this.fontRenderEl.id = 'canvas-font-renderer';
    container.appendChild(this.canvasEl);
    container.appendChild(this.fontRenderEl);
    this.setCanvasSize();
  }

  set newState(props) {
    Object.keys(props).forEach(item => {
      this.state[item] = props[item];
    });
  }

  get context() {
    if (this.canvasEl) {
      return this.canvasEl.getContext('2d');
    }

    return null;
  }

}

/* harmony default export */ __webpack_exports__["default"] = (Renderer);

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(4);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(1)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// Module
exports.push([module.i, "html, body, form, fieldset, ul, dl, dt, dd, table, td, th, img, menu {\n    margin: 0;\n    padding: 0;\n    border: none;\n}\n\nhtml {\n    height: 100%;\n    width: 100%;\n    font-size: 10px;\n}\n\nbody {\n    background-color: #333;\n}\n\n#canvas-font-renderer {\n    position: absolute;\n    left: 0;\n    top: -1000rem;\n    white-space: nowrap;\n}\n\n.refresh-button {\n    display: block;\n    margin: 30px 0 0 20px;\n    font-size: 30px;\n}\n", ""]);



/***/ }),
/* 5 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(7);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(1)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// Imports
var urlEscape = __webpack_require__(8);
var ___CSS_LOADER_URL___0___ = urlEscape(__webpack_require__(9));
var ___CSS_LOADER_URL___1___ = urlEscape(__webpack_require__(10));

// Module
exports.push([module.i, "/* latin */\n@font-face {\n    font-family: 'Kaushan Script';\n    font-style: normal;\n    font-weight: 400;\n    src: url(" + ___CSS_LOADER_URL___0___ + ") format('woff2');\n    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n@font-face {\n    font-family: 'Nickainley';\n    font-style: normal;\n    font-weight: 400;\n    src: url(" + ___CSS_LOADER_URL___1___ + ") format('ttf');\n    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n", ""]);



/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function escape(url, needQuotes) {
  if (typeof url !== 'string') {
    return url;
  } // If url is already wrapped in quotes, remove them


  if (/^['"].*['"]$/.test(url)) {
    url = url.slice(1, -1);
  } // Should url be wrapped?
  // See https://drafts.csswg.org/css-values-3/#urls


  if (/["'() \t\n]/.test(url) || needQuotes) {
    return '"' + url.replace(/"/g, '\\"').replace(/\n/g, '\\n') + '"';
  }

  return url;
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "/fonts/KaushanScript-Regular.woff2";

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "/fonts/Nickainley.ttf";

/***/ })
/******/ ]);
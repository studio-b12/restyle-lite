/*jslint forin: true, plusplus: true, indent: 2, browser: true, unparam: true */
/*!
Copyright (C) 2014 by Andrea Giammarchi - @WebReflection

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/
restyle.proxy = (function(){

var utils = function(){
  var
    angle = function (name) {
      return function (degrees) {
        return name + '(' + deg(degrees) + ')';
      };
    },
    camelCaseFind = /([a-z])([A-Z])/g,
    camelCaseReplace = function (m, $1, $2) {
      return $1 + '-' + $2.toLowerCase();
    },
    deg = function (degrees) {
      return typeof degrees === 'number' ?
        (degrees + 'deg') : degrees;
    },
    doubleQuoteFind = /"/g,
    doubleQuoteReplace = '\\"',
    hexToRgb = function (hex) {
      hex = hex.slice(1);
      if (hex.length < 6) {
        hex = [
          hex[0] + hex[0],
          hex[1] + hex[1],
          hex[2] + hex[2]
        ].join('');
      }
      return [
        parseInt(hex.slice(0, 2), 16),
        parseInt(hex.slice(2, 4), 16),
        parseInt(hex.slice(4, 6), 16),
        (parseInt(hex.slice(6, 8) || 'FF', 16) / 255).toFixed(3)
      ];
    },
    join = [].join,
    namedFunction = function (name, args) {
      return name + '(' + join.call(args, ',') + ')'
    },
    namedMethod = function (name) {
      return function () {
        return namedFunction(name, arguments);
      };
    },
    separatorFind = /([a-z])-([a-z])/g,
    separatorReplace = function (m, $1, $2) {
      return $1 + $2.toUpperCase();
    },
    utils = {
      $clash: /^(?:top|scroll)$/,
      $global: typeof window === 'undefined' ?
        global : window,
      $camel: function (str) {
        return str.replace(
          separatorFind,
          separatorReplace
        );
      },
      $unCamel: function (str) {
        return str.replace(
          camelCaseFind,
          camelCaseReplace
        );
      },
      cubicBezier: namedMethod('cubic-bezier'),
      group: function () {
        return join.call(arguments, ' ');
      },
      hex: function (r, g, b) {
        return '#'.concat(
          ('0' + r.toString(16)).slice(-2),
          ('0' + g.toString(16)).slice(-2),
          ('0' + b.toString(16)).slice(-2)
        );
      },
      matrix: namedMethod('matrix'),
      matrix3d: namedMethod('matrix3d'),
      rgb: function rgb(r, g, b) {
        return g == null ?
          rgb.apply(utils, hexToRgb(r)) :
          'rgb(' + [r, g, b] + ')';
      },
      rgba: function rgba(r, g, b, a) {
        return g == null ?
          rgba.apply(utils, hexToRgb(r)) :
          'rgba(' + [r, g, b, a] + ')';
      },
      rotate: angle('rotate'),
      rotate3d: function (x, y, z, degrees) {
        return namedFunction('rotate3d', [x, y, z, deg(degrees)]);
      },
      rotateX: angle('rotateX'),
      rotateY: angle('rotateY'),
      rotateZ: angle('rotateZ'),
      scale: namedMethod('scale'),
      scale3d: namedMethod('scale3d'),
      scaleX: namedMethod('scaleX'),
      scaleY: namedMethod('scaleY'),
      scaleZ: namedMethod('scaleZ'),
      skew: function (x, y) {
        return skew('rotate3d', [deg(x), deg(y)]);
      },
      skewX: angle('skewX'),
      skewY: angle('skewY'),
      perspective: namedMethod('perspective'),
      translate: namedMethod('translate'),
      translate3d: namedMethod('translate3d'),
      translateX: namedMethod('translateX'),
      translateY: namedMethod('translateY'),
      translateZ: namedMethod('translateZ'),
      url: function(src) {
        return 'url("' + src.replace(
          doubleQuoteFind,
          doubleQuoteReplace
        ) + '")'
      }
    }
  ;

  return utils;

}();

var proxyHandler = {
  has: function (target, name) {
    return  utils.$global.hasOwnProperty(name) ?
        utils.$clash.test(name) : true;
  },
  get: function (target, name, receiver) {
    return name[0] !== '$' && utils.hasOwnProperty(name) ?
      utils[name] :
      utils.$unCamel(name)
    ;
  }
};

return new Proxy(
  Object.create(null),
  proxyHandler
);

}());
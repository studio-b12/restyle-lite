/*jslint forin: true, plusplus: true, indent: 2, browser: true, unparam: true */
/*!
Copyright (C) 2014-2015 by Andrea Giammarchi - @WebReflection

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
module.exports = (function (O) {
  'use strict';

  var
    toString = O.toString,
    has = O.hasOwnProperty,
    camelFind = /([a-z])([A-Z])/g,
    ignoreSpecial = /^@(?:page|font-face)/,
    isMedia = /^@(?:media)/,
    isArray = Array.isArray || function (arr) {
      return toString.call(arr) === '[object Array]';
    },
    empty = [],
    restyle;

  function camelReplace(m, $1, $2) {
    return $1 + '-' + $2.toLowerCase();
  }

  function create(key, value) {
    var
      css = [],
      pixels = typeof value === 'number' ? 'px' : '',
      k = key.replace(camelFind, camelReplace),
      i;
    css.push(k, ':', value, pixels, ';');
    return css.join('');
  }

  function property(previous, key) {
    return previous.length ? previous + '-' + key : key;
  }

  function generate(css, previous, obj) {
    var key, value, i;
    for (key in obj) {
      if (has.call(obj, key)) {
        if (typeof obj[key] === 'object') {
          if (isArray(obj[key])) {
            value = obj[key];
            for (i = 0; i < value.length; i++) {
              css.push(
                create(property(previous, key), value[i])
              );
            }
          } else {
            generate(
              css,
              property(previous, key),
              obj[key]
            );
          }
        } else {
          css.push(
            create(property(previous, key), obj[key])
          );
        }
      }
    }
    return css.join('');
  }

  function parse(obj) {
    var
      css = [],
      component = '',
      at, cmp, special, k, v,
      same, key, value, i, j;
    for (key in obj) {
      if (has.call(obj, key)) {
        j = key.length;
        if (!j) key = component.slice(0, -1);
        at = key.charAt(0) === '@';
        same = at || !component.indexOf(key + ' ');
        cmp = at && isMedia.test(key) ? component : '';
        special = at && !ignoreSpecial.test(key);
        k = special ? key.slice(1) : key;
        value = empty.concat(obj[j ? key : '']);
        for (i = 0; i < value.length; i++) {
          v = value[i];
          if (special) {
            css.push(key, '{', parse(v), '}');
          } else {
            css.push(
              same ? key : component + key,
              '{', generate([], '', v), '}'
            );
          }
        }
      }
    }
    return css.join('');
  }

  return function restyle (obj) {
    return parse(obj);
  };
}({}))
;

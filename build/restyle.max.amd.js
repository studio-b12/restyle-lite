/*jslint forin: true, plusplus: true, indent: 2, browser: true */
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
define((function (has) {
  'use strict';

  var camelFind = /([a-z])([A-Z])/g,
      restyle;

  function ReStyle(node, css) {
    this.node = node;
    this.css = css;
  }

  ReStyle.prototype = {
    remove: function () {
      var node = this.node,
        parentNode = node.parentNode;
      if (parentNode) {
        parentNode.removeChild(node);
      }
    },
    valueOf: function () {
      return this.css;
    }
  };

  function camelReplace(m, $1, $2) {
    return $1 + '-' + $2.toLowerCase();
  }

  function create(key, value, prefixes) {
    var
      css = [],
      pixels = typeof value === 'number' ? 'px' : '',
      k = key.replace(camelFind, camelReplace),
      i = prefixes.length;
    while (i--) {
      css.push('-', prefixes[i], '-', k, ':', value, pixels, ';');
    }
    css.push(k, ':', value, pixels, ';');
    return css.join('');
  }

  function generate(obj, prefixes) {
    var
      css = [],
      key,
      value,
      k;
    for (key in obj) {
      if (has.call(obj, key)) {
        if (typeof obj[key] === 'object') {
          value = obj[key];
          for (k in value) {
            if (has.call(value, k)) {
              css.push(create(key + '-' + k, value[k], prefixes));
            }
          }
        } else {
          css.push(create(key, obj[key], prefixes));
        }
      }
    }
    return css.join('');
  }

  function parse(obj, prefixes) {
    var
      css = [],
      key,
      value,
      i;
    for (key in obj) {
      if (has.call(obj, key)) {
        value = obj[key];
        if (key.charAt(0) === '@') {
          key = key.slice(1);
          i = (prefixes || '').length;
          while (i--) {
            css.push('@-', prefixes[i], '-', key, '{',
              parse(value, [prefixes[i]]),
              '}');
          }
          css.push('@', key, '{', parse(value, prefixes), '}');
        } else {
          css.push(key, '{', generate(value, prefixes), '}');
        }
      }
    }
    return css.join('');
  }

  if (typeof document === 'undefined') {
    restyle = function (obj, prefixes) {
      return parse(obj, prefixes || restyle.prefixes);
    };
    // useful for different style of require
    restyle.restyle = restyle;
  } else {
    restyle = function (obj, prefixes, doc) {
      var d = doc || document,
        css = parse(obj, prefixes || restyle.prefixes),
        head = d.head ||
          d.getElementsByTagName('head')[0] ||
          d.documentElement,
        node = head.insertBefore(
          d.createElement('style'),
          head.lastChild
        );
      node.type = 'text/css';
      if ('styleSheet' in node) {
        node.styleSheet.cssText = css;
      } else {
        node.appendChild(d.createTextNode(css));
      }
      return new ReStyle(node, css);
    };
  }

  restyle.prefixes = [
    'o',
    'ms',
    'moz',
    'webkit'
  ];

  return restyle;

}({}.hasOwnProperty)));
(function (O) {
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

  function ReStyle(component, css, doc) {
    this.component = component;
    this.css = css;
    this.doc = doc;
  }

  function replace(substitute) {
    if (!(substitute instanceof ReStyle)) {
      substitute = restyle(
        this.component, substitute, this.doc
      );
    }
    ReStyle.call(
      this,
      substitute.component,
      substitute.css,
      substitute.doc
    );
  }

  ReStyle.prototype = {
    overwrite: replace,
    replace: replace,
    set: replace,
    valueOf: function () {
      return this.css;
    }
  };

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

  function parse(component, obj) {
    var
      css = [],
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
            css.push(key, '{', parse(cmp, v), '}');
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

  // hack to avoid JSLint shenanigans
  if ({undefined: true}[typeof document]) {
    restyle = function (component, obj) {
      if (typeof component === 'object') {
        obj = component;
        component = '';
      } else {
        component += ' ';
      }
      return parse(component, obj || empty);
    };
    // useful for different style of require
    restyle.restyle = restyle;
  } else {
    restyle = function (component, obj, doc) {
      if (typeof component === 'object') {
        obj = component;
        c = (component = '');
      } else {
        c = component + ' ';
      }
      var c, d = doc || (doc = document),
        css = parse(c, obj);
      return new ReStyle(component, css, doc);
    };
  }

  return restyle;

/**
 * not sure if TODO since this might be prependend regardless the parser
 *  @namespace url(http://www.w3.org/1999/xhtml);
 *  @charset "UTF-8";
 */

}({}))

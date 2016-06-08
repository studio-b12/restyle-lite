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

/*! (C) Andrea Giammarchi Mit Style License */
restyle.proxy=function(){var e=function(){var e=function(e){return function(t){return e+"("+r(t)+")"}},t=/([a-z])([A-Z])/g,n=function(e,t,n){return t+"-"+n.toLowerCase()},r=function(e){return typeof e=="number"?e+"deg":e},i=/"/g,s='\\"',o=function(e){return e=e.slice(1),e.length<6&&(e=[e[0]+e[0],e[1]+e[1],e[2]+e[2]].join("")),[parseInt(e.slice(0,2),16),parseInt(e.slice(2,4),16),parseInt(e.slice(4,6),16),(parseInt(e.slice(6,8)||"FF",16)/255).toFixed(3)]},u=[].join,a=function(e,t){return e+"("+u.call(t,",")+")"},f=function(e){return function(){return a(e,arguments)}},l=/([a-z])-([a-z])/g,c=function(e,t,n){return t+n.toUpperCase()},h={$clash:/^(?:top|scroll)$/,$global:typeof window=="undefined"?global:window,$camel:function(e){return e.replace(l,c)},$unCamel:function(e){return e.replace(t,n)},cubicBezier:f("cubic-bezier"),group:function(){return u.call(arguments," ")},hex:function(e,t,n){return"#".concat(("0"+e.toString(16)).slice(-2),("0"+t.toString(16)).slice(-2),("0"+n.toString(16)).slice(-2))},matrix:f("matrix"),matrix3d:f("matrix3d"),rgb:function p(e,t,n){return t==null?p.apply(h,o(e)):"rgb("+[e,t,n]+")"},rgba:function d(e,t,n,r){return t==null?d.apply(h,o(e)):"rgba("+[e,t,n,r]+")"},rotate:e("rotate"),rotate3d:function(e,t,n,i){return a("rotate3d",[e,t,n,r(i)])},rotateX:e("rotateX"),rotateY:e("rotateY"),rotateZ:e("rotateZ"),scale:f("scale"),scale3d:f("scale3d"),scaleX:f("scaleX"),scaleY:f("scaleY"),scaleZ:f("scaleZ"),skew:function(e,t){return skew("rotate3d",[r(e),r(t)])},skewX:e("skewX"),skewY:e("skewY"),perspective:f("perspective"),translate:f("translate"),translate3d:f("translate3d"),translateX:f("translateX"),translateY:f("translateY"),translateZ:f("translateZ"),url:function(e){return'url("'+e.replace(i,s)+'")'}};return h}(),t={has:function(t,n){return e.$global.hasOwnProperty(n)?e.$clash.test(n):!0},get:function(t,n,r){return n[0]!=="$"&&e.hasOwnProperty(n)?e[n]:e.$unCamel(n)}};return new Proxy(Object.create(null),t)}();
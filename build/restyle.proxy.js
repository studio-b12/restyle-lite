/*! (C) Andrea Giammarchi Mit Style License */
restyle.proxy=function(){var e=function(){function u(e){return e=e.slice(1),e.length<6&&(e=[e[0]+e[0],e[1]+e[1],e[2]+e[2]].join("")),[parseInt(e.slice(0,2),16),parseInt(e.slice(2,4),16),parseInt(e.slice(4,6),16),(parseInt(e.slice(6,8)||"FF",16)/255).toFixed(3)]}var e=/"/g,t='\\"',n=/([a-z])([A-Z])/g,r=function(e,t,n){return t+"-"+n.toLowerCase()},i=/([a-z])-([a-z])/g,s=function(e,t,n){return t+n.toUpperCase()},o={$clash:/^(?:top|scroll)$/,$global:typeof window=="undefined"?global:window,$camel:function(e){return e.replace(i,s)},$unCamel:function(e){return e.replace(n,r)},group:function(){return[].join.call(arguments," ")},hex:function(e,t,n){return"#".concat(("0"+e.toString(16)).slice(-2),("0"+t.toString(16)).slice(-2),("0"+n.toString(16)).slice(-2))},rgb:function a(e,t,n){return t==null?a.apply(o,u(e)):"rgb("+[e,t,n]+")"},rgba:function f(e,t,n,r){return t==null?f.apply(o,u(e)):"rgba("+[e,t,n,r]+")"},url:function(n){return'url("'+n.replace(e,t)+'")'}};return o}(),t={has:function(t,n){return e.$global.hasOwnProperty(n)?e.$clash.test(n):!0},get:function(t,n,r){return e.hasOwnProperty(n)?e[n]:e.$unCamel(n)}};return new Proxy(Object.create(null),t)}();
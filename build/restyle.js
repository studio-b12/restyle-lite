/*! (C) Andrea Giammarchi Mit Style License */
var restyle=function(e){"use strict";function r(e,t){this.node=e,this.css=t}function i(e,t,n){return t+"-"+n.toLowerCase()}function s(e,n,r){var s=[],o=typeof n=="number"?"px":"",u=e.replace(t,i),a=r.length;while(a--)s.push("-",r[a],"-",u,":",n,o,";");return s.push(u,":",n,o,";"),s.join("")}function o(t,n){var r=[],i,o,u;for(i in t)if(e.call(t,i))if(typeof t[i]=="object"){o=t[i];for(u in o)e.call(o,u)&&r.push(s(i+"-"+u,o[u],n))}else r.push(s(i,t[i],n));return r.join("")}function u(t,n){var r=[],i,s,a;for(i in t)if(e.call(t,i)){s=t[i];if(i.charAt(0)==="@"){i=i.slice(1),a=(n||"").length;while(a--)r.push("@-",n[a],"-",i,"{",u(s,[n[a]]),"}");r.push("@",i,"{",u(s,n),"}")}else r.push(i,"{",o(s,n),"}")}return r.join("")}var t=/([a-z])([A-Z])/g,n;return r.prototype={remove:function(){var e=this.node,t=e.parentNode;t&&t.removeChild(e)},valueOf:function(){return this.css}},typeof document=="undefined"?(n=function(e,t){return u(e,t||n.prefixes)},n.restyle=n):n=function(e,t,i){var s=i||document,o=u(e,t||n.prefixes),a=s.head||s.getElementsByTagName("head")[0]||s.documentElement,f=a.insertBefore(s.createElement("style"),a.lastChild);return f.type="text/css","styleSheet"in f?f.styleSheet.cssText=o:f.appendChild(s.createTextNode(o)),new r(f,o)},n.prefixes=["o","ms","moz","webkit"],n}({}.hasOwnProperty);
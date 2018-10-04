!function(t){var e={};function o(r){if(e[r])return e[r].exports;var n=e[r]={i:r,l:!1,exports:{}};return t[r].call(n.exports,n,n.exports,o),n.l=!0,n.exports}o.m=t,o.c=e,o.d=function(t,e,r){o.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:r})},o.r=function(t){Object.defineProperty(t,"__esModule",{value:!0})},o.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="/dist/",o(o.s=5)}([function(t,e,o){"use strict";var r;Object.defineProperty(e,"__esModule",{value:!0}),function(t){t[t.Yup=1]="Yup",t[t.Prolly=.75]="Prolly",t[t.Maybe=.5]="Maybe",t[t.Meh=.25]="Meh",t[t.Nah=0]="Nah"}(r=e.Score||(e.Score={}));var n=function(){function t(t,e,o,n,i){this.score=r.Nah,this.accepted=!1,this.query=t,this.pattern=e,this.text=o,this.position=n,this.matches=i}return t.prototype.before=function(){for(var t=this.query.results,e=[],o=0,r=t.length;o<r;o++){var n=t[o];if(this.position.from<=n.position.from)break;this.position.from<n.position.to||e.push(n)}return e.reverse()},t.prototype.after=function(){for(var t=this.query.results,e=[],o=t.length;0<o--;){var r=t[o];if(r.position.from<this.position.to)break;e.unshift(r)}return e},t.prototype.overlap=function(){for(var t=this.query.results,e=[],o=0,r=t.length;o<r;o++){var n=t[o];if(this.position.to<n.position.from)break;this===n||n.position.to<this.position.from||e.push(n)}return e},t}();e.Result=n},function(t,e,o){"use strict";var r,n=this&&this.__extends||(r=function(t,e){return(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o])})(t,e)},function(t,e){function o(){this.constructor=t}r(t,e),t.prototype=null===e?Object.create(e):(o.prototype=e.prototype,new o)});Object.defineProperty(e,"__esModule",{value:!0});var i=function(t){function e(e,o,r,n){var i=t.call(this,e,o,r,n,o.regex.exec(r))||this;return i.accepted=!0,i}return n(e,t),e}(o(0).Result);e.Tag=i},function(t,e,o){"use strict";var r,n=this&&this.__extends||(r=function(t,e){return(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o])})(t,e)},function(t,e){function o(){this.constructor=t}r(t,e),t.prototype=null===e?Object.create(e):(o.prototype=e.prototype,new o)});Object.defineProperty(e,"__esModule",{value:!0});var i=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return n(e,t),e}(o(0).Result);e.Suggestion=i},function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=o(2),n=o(1),i=function(){function t(t,e){var o=[];this.input=t,this.patterns=e||[],this.results=o;var i={};for(var s in e){i[(c=e[s]).tag]=c}for(var u in i)for(var c=i[u],f=new RegExp(c.tag+':(?:"([^"]+)"|([\\S]+))',"g"),a=void 0;null!==(a=f.exec(t));){var p=new n.Tag(this,c,a[1]||a[2],{from:a.index,to:a.index+a[0].length});o.push(p)}var l=t.replace(/[\S]+:(?:"[^"]+"|[\S]+)/g,function(t){return new Array(t.length+1).join(" ")});for(var u in i){var h=(c=i[u]).regex;for(a=void 0;null!==(a=h.exec(l));)if(0!==h.source.indexOf("\\b")||0===a.index||l.charAt(a.index-1).match(/[\s;,"]/))if(h.source.indexOf("\\b",h.source.length-2)!==h.source.length-2||a.index+a[0].length===l.length||l.charAt(a.index+a[0].length).match(/[\s;,"]/)){p=new r.Suggestion(this,c,a[0],{from:a.index,to:a.index+a[0].length},a);o.push(p),h.lastIndex=a.index+1}else h.lastIndex=a.index+1;else h.lastIndex=a.index+1}o.sort(function(t,e){return t.position.from-e.position.from||t.position.to-e.position.to}),o.forEach(function(t){t.score=t.pattern.score(t)||0})}return t.prototype.findAt=function(t){return void 0===t?[]:this.results.filter(function(e){return e.position.from<=t&&t<=e.position.to&&e.score>0}).sort(function(t,e){return e.score-t.score})},t.prototype.markup=function(t){void 0===t&&(t="mark");var e,o=this.input,r=[];this.results.forEach(function(t){t.accepted||t.score<=0||(!e||t.position.from>e.to?r.push(e={from:t.position.from,to:t.position.to}):t.position.to>e.to&&(e.to=t.position.to))});var n=0;return r.forEach(function(e){var r=e.from+n;o=o.slice(0,r)+"<"+t+">"+o.slice(r),n+=t.length+2;var i=e.to+n;o=o.slice(0,i)+"</"+t+">"+o.slice(i),n+=t.length+3}),o},t.prototype.unknown=function(){var t,e=this.input,o=[];if(e.length>0){var r=0;this.results.forEach(function(t){if(r<t.position.from){var n=e.substring(r,t.position.from);""!==n.trim()&&o.push(n)}(t.accepted||t.score>0)&&r<t.position.to&&(r=t.position.to)}),""!==(t=e.substring(r,e.length)).trim()&&o.push(t)}return o},t}();e.Query=i},function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=o(0),n=function(){return function(t,e,o,n){void 0===n&&(n=function(){return r.Score.Maybe}),this.name=t,this.tag=e,this.regex=o,this.score=n}}();e.Pattern=n},function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=o(4),n=o(3),i=o(0),s=function(t,e){return new n.Query(t,e)};s.Pattern=r.Pattern,s.Query=n.Query,s.Result=i.Result,s.Score=i.Score,window.TagEngine=s,e.default=s}]);
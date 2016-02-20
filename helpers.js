"use strict";

var h = (function(){
  return {
    el: el,
    forEach: forEach,
    is_a: is_a,
    collect: collect
  }
  function el(selector, ancestor){
    var out;
    selector = selector.trim();
    if(selector.substring(0,1) === "#") out = document.getElementById(selector);
    else out = (ancestor || document).querySelectorAll(selector);
    return (out.length === 1 ? out[0] : out);
  }
  function is_a(input, prototype){
    if(typeof prototype !== "undefined") return(input instanceof prototype);
    else return false;
  }
  function forEach(input, callback){
    var i, l;
    var isHTMLCollection = (h.is_a(input, NodeList) || h.is_a(input, HTMLCollection));
    if(typeof input == "number") input = new Array(input);
    else if(typeof input == "string") input = input.split("");
    if((input instanceof Array) || isHTMLCollection){
      l = input.length;
      for(i = 0; i < l; i++) callback(input[i], i);
    }else for(i in input){ callback(input[i], i); }
  }
  function collect(collection, callback){
    var output = [];
    if(!collection) return;
    if(h.is_a(collection, HTMLElement)) collection = collection.children;
    forEach(collection, function(item){
      output.push(callback(item));
    });
    return output;
  }
})();

if(typeof module !== "undefined") module.exports = h;

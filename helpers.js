"use strict";

var h = (function(){
  var is_browser = (typeof NodeList !== "undefined");
  return {
    el: el,
    forEach: forEach,
    is_a: is_a,
    collect: collect,
    is_browser: is_browser,
    has_html_children: has_html_children,
    is_html_collection: is_html_collection
  }
  function collect(collection, callback){
    var output = [];
    if(!collection) return;
    if(has_html_children(collection)) collection = collection.children;
    forEach(collection, function(item){
      output.push(callback(item));
    });
    return output;
  }
  function el(selector, ancestor){
    var out;
    selector = selector.trim();
    if(selector.substring(0,1) === "#") out = document.getElementById(selector);
    else out = (ancestor || document).querySelectorAll(selector);
    return (out.length === 1 ? out[0] : out);
  }
  function forEach(input, callback){
    var i, l;
    if(typeof input == "number") input = new Array(input);
    else if(typeof input == "string") input = input.split("");
    if((input instanceof Array) || is_html_collection(input)){
      l = input.length;
      for(i = 0; i < l; i++) callback(input[i], i);
    }else for(i in input){ callback(input[i], i); }
  }
  function has_html_children(input){
    if(!is_browser) return false;
    else return (is_a(input, HTMLElement));
  }
  function is_a(input, prototype){
    if(typeof prototype !== "undefined") return(input instanceof prototype);
    else return false;
  }
  function is_html_collection(input){
    if(!is_browser) return false;
    else return (is_a(input, NodeList) || is_a(input, HTMLCollection));
  }
})();

if(typeof module !== "undefined") module.exports = h;

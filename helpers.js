"use strict";

//https://github.com/RobertAKARobin/helpers-js

var h = (function(){
  var is_browser = (typeof NodeList !== "undefined");
  return {
    el: el,
    forEach: forEach,
    is_a: is_a,
    collect: collect,
    is_browser: is_browser,
    has_html_children: has_html_children,
    is_html_collection: is_html_collection,
    script_load: script_load,
    ajax: ajax
  }
  function ajax(options, callback){
    var request = new XMLHttpRequest();
    var url     = options.url;
    var method  = (options.method || "GET");
    var data    = (options.data ? objectToQuery(options.data) : "");
    var headers = (options.headers || {});
    request.open(method, url, true);
    if(!headers["Content-Type"]){
      headers["Content-Type"] = "application/x-www-form-urlencoded";
    }
    forEach(headers, function(value, key){
      request.setRequestHeader(key, value);
    });
    request.onreadystatechange = function(){
      var state     = request.readyState;
      var code      = request.status;
      var response  = try_json(request.responseText);
      if(state == 4 && code >= 200 && code < 400) callback(response, request);
    }
    request.send(data);
    return request;
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
    if(selector.substring(0,1) === "#"){
      out = document.getElementById(selector.substring(1));
    }else{
      out = (ancestor || document).querySelectorAll(selector);
    }
    return (out.length === 1 ? out[0] : out);
  }
  function forEach(input, callback, whenAsyncDone){
    var i = 0, l, keys, key;
    if(typeof input == "number") input = new Array(input);
    else if(typeof input == "string") input = input.split("");
    if(!(input instanceof Array) && !is_html_collection(input)){
      keys = Object.keys(input);
    }
    l = (keys || input).length;
    if(whenAsyncDone){
      function next(){
        key = keys ? keys[i] : i;
        if(i++ < l) callback(input[key], key, next);
        else if(typeof whenAsyncDone == "function") whenAsyncDone();
      }
      next();
    }else for(i; i < l; i++){
      key = keys ? keys[i] : i;
      callback(input[key], key);
    }
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
  function script_load(path){
    var script = document.createElement("SCRIPT");
    window.addEventListener("load", function(){
      script.setAttribute("src", path);
      document.head.appendChild(script);
    });
  }
  function try_json(string){
    try{
      string = JSON.parse(string);
    }catch(err){}
    return string;
  }
})();

if(typeof module !== "undefined") module.exports = h;

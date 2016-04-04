"use strict";

var h = (function(){
  var publics = {
    is_browser: (typeof NodeList !== "undefined"),
    source    : "https://github.com/RobertAKARobin/helpers-js"
  };
  var publicMethods = [
    ajax,
    capitalize,
    collect,
    el,
    extend,
    for_each,
    has_html_children,
    is_a,
    is_html_collection,
    load_static,
    query_stringify,
    select,
    serialize_form,
    try_json
  ];
  for_each(publicMethods, function(method){
    publics[method.name] = method;
  });
  return publics;

  function ajax(options, callback){
    var request = new XMLHttpRequest();
    var url     = ((typeof options == "string") ? options : options.url);
    var method  = (options.method   || "GET").toUpperCase();
    var typeIn  = (options.typeIn   || "json").toLowerCase();
    var typeOut = (options.typeOut  || "json").toLowerCase();
    var data    = (options.data     || "");
    request.open(method, url, true);
    request.setRequestHeader("Content-Type", "application/" + typeIn);
    request.onreadystatechange = function(){
      var complete  = (request.readyState == 4);
      var httpCode  = request.status;
      var response  = request.responseText;
      if(complete && 200 <= httpCode && httpCode < 400){
        callback((typeOut === "json" ? try_json(response) : response), request);
      }
    }
    request.send(typeIn === "json" ? JSON.stringify(data) : query_stringify(data));
    return request;
  }
  function capitalize(string){
     return string.substring(0,1).toUpperCase() + string.substring(1);
  }
  function collect(collection, callback){
    var output = [];
    if(!collection) return;
    if(has_html_children(collection)) collection = collection.children;
    for_each(collection, function(item){
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
  function extend(target, input){
    for_each(input, function(value, key){
      target[key] = value;
    });
  }
  function for_each(input, callback, whenAsyncDone){
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
    if(!publics.is_browser) return false;
    else return (is_a(input, HTMLElement));
  }
  function is_a(input, prototype){
    if(typeof prototype !== "undefined") return(input instanceof prototype);
    else return false;
  }
  function is_html_collection(input){
    if(!publics.is_browser) return false;
    else return (is_a(input, NodeList) || is_a(input, HTMLCollection));
  }
  function query_stringify(input){
    var output = [];
    for_each(input, function(param, key){
      output.push([key, encodeURIComponent(param)].join("="));
    });
    return output.join("&");
  }
  function load_static(input){
    if(!is_a(input, Array)) input = [input];
    for_each(input, function(path){
      if(path.indexOf(".js") > -1) script_load(path);
      else if(path.indexOf(".css") > -1) style_load(path);
    });
  }
  function select(input, callback){
    var output = [];
    for_each(input, function(item){
      if(callback(item)) output.push(item);
    });
    return output;
  }
  function serialize_form(form, flatten){
    var inputs  = h.el("input,textarea,option", form);
    var data    = {};
    h.for_each(inputs, function(el){
      var isValid = true;
      var name    = (el.name    || el.parentElement.name);
      var type    = (el.type    || "").toUpperCase();
      var tagName = (el.tagName || "").toUpperCase();
      if(type == "RADIO" || type == "CHECKBOX" || tagName == "OPTION"){
         if(!el.checked && !el.selected) isValid = false;
      }
      if(!data[name]) data[name] = [];
      if(isValid) data[name].push(el.value);
    });
    if(flatten) for_each(data, function(value, key){
      if(value instanceof Array && value.length == 1) data[key] = value[0];
    });
    return data;
  }
  function try_json(string){
    try{
      string = JSON.parse(string);
    }catch(err){}
    return string;
  }

  function style_load_one(path){
    var link = document.createElement("LINK");
    link.setAttribute("rel", "stylesheet");
    window.addEventListener("load", function(){
      link.setAttribute("href", path);
      document.head.appendChild(link);
    });
  }
  function script_load_one(path){
    var script = document.createElement("SCRIPT");
    window.addEventListener("load", function(){
      script.setAttribute("src", path);
      document.head.appendChild(script);
    });
  }
})();

if(typeof module !== "undefined") module.exports = h;

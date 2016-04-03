var h = require("../helpers");

describe("Helpers", function(){
  describe("is_browser", function(){
    it("is false when not run in a browser", function(){
      expect(h.is_browser).toBeFalsy();
    });
  });

  describe("#collect", function(){
    it("returns an array of subproperties", function(){
      var input = [
        {name: "Alice"},
        {name: "Bob"},
        {name: "Carol"}
      ];
      var output = h.collect(input, function(item){
        return item.name;
      });
      expect(output).toContain("Alice");
      expect(output).toContain("Bob");
      expect(output).toContain("Carol");
    });
  });

  describe("#extend", function(){
    it("applies all properties of one object to another", function(){
      var input = {
        name: "Alice",
        age: 12
      };
      var target = {
        gender: "female",
        nation: "UK"
      };
      h.extend(target, input);
      expect(target.name).toEqual("Alice");
      expect(target.age).toEqual(12);
    });
  });

  describe("#for_each", function(){
    it("when passed a number, iterates N times", function(){
      var output = "";
      h.for_each(3, function(){
        output += "a";
      });
      expect(output).toEqual("aaa");
    });
    it("when passed an array, iterates over each item in the array", function(){
      var output = "";
      var input = ["a", "b", "c"];
      h.for_each(input, function(item){
        output += item;
      });
      expect(output).toEqual("abc");
    });
    it("when pass an object, iterates over each property", function(){
      var output = "";
      var input = {
        name: "Alice",
        age: 12,
        gender: "female"
      };
      h.for_each(input, function(value, key){
        output += key + ": " + value + ", "
      });
      expect(output).toEqual("name: Alice, age: 12, gender: female, ");
    });
  });

  describe("#is_a", function(){
    it("returns true if an object's prototype has specified prototype as an ancestor", function(){
      function a(){};
      a.prototype = new Array();
      function b(){};
      b.prototype = new a();
      function c(){};
      c.prototype = new b();
      expect(h.is_a(new c(), a)).toBe(true);
      expect(h.is_a(new c(), Array)).toBe(true);
    });
  });

  describe("#queryStringify", function(){
    it("converts an object to a querystring", function(){
      var input = {
        name: "Alice",
        age: 12,
        gender: "female",
        location: "in Wonderland"
      };
      var output = h.query_stringify(input);
      expect(output).toBe("name=Alice&age=12&gender=female&location=in%20Wonderland");
    });
  });

  describe("#try_json", function(){
    it("does not throw an error when passed invalid JSON", function(){
      var input = "This is not JSON";
      expect(h.try_json(input)).toBe("This is not JSON");
    });
    it("parses JSON strings", function(){
      var object = {
        name: "Alice",
        age: 12
      };
      var input = JSON.stringify(object);
      var output = h.try_json(input);
      expect(output.name).toBe("Alice");
    });
  });
});

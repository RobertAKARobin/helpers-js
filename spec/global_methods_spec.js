var h = require("../helpers");

describe("Helpers", function(){
  describe("is_browser", function(){
    it("is false when not run in a browser", function(){
      expect(h.is_browser).toBeFalsy();
    });
  });

  describe("#capitalize", function(){
    it("returns a capitalized string", function(){
      var input = "alice";
      expect(h.capitalize(input)).toBe("Alice");
    });
  });

  describe("#chain", function(){
    it("runs functions in order", function(done){
      var output = "";
      h.chain([
        function(next){
          setTimeout(function(){
            output += "a";
            next();
          }, 10);
        },
        function(next){
          setTimeout(function(){
            output += "b";
            next();
          }, 10);
        },
        function(){
          output += "c";
          expect(output).toBe("abc");
          done();
        }
      ]);
    });
    it("lets data be passed down the chain", function(done){
      var output = "";
      h.chain([
        function(next){
          setTimeout(function(){
            next("a");
          }, 10);
        },
        function(next, args){
          output += args[0];
          setTimeout(function(){
            output += "b";
            next("c");
          }, 10);
        },
        function(next, args){
          output += args[0];
          expect(output).toBe("abc");
          done();
        }
      ]);
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
    it("when passed an object, iterates over each property", function(){
      var output = "";
      var input = {
        name: "Alice",
        age: 12,
        gender: "female"
      };
      h.for_each(input, function(value, key){
        output += key + ": " + value + ", ";
      });
      expect(output).toEqual("name: Alice, age: 12, gender: female, ");
    });
    it("is halted when a loop returns 'break'", function(){
      var output = 0;
      h.for_each(10, function(){
        if(output >= 5) return "break";
        output += 1;
      });
      expect(output).toEqual(5);
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
    it("works with primitives", function(){
      expect(h.is_a(42, Number)).toBe(true);
      expect(h.is_a("test", String)).toBe(true);
      expect(h.is_a("test", Number)).toBe(false);
      expect(h.is_a(true, Boolean)).toBe(true);
      expect(h.is_a({}, Object)).toBe(true);
    });
  });

  describe("#pad", function(){
    it("adds characters to the end of a string", function(){
      expect(h.pad("foo", 5, "-")).toBe("foo--");
    });
    it("can add characters to the beginning of a string", function(){
      expect(h.pad("foo", 5, "-", true)).toBe("--foo");
    });
    it("has a default padding character of space", function(){
      expect(h.pad("foo", 5)).toBe("foo  ");
    });
    it("accepts numbers", function(){
      expect(h.pad(3, 5)).toBe("3    ");
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

  describe("#replaceEntities", function(){
    it("replaces special characters with HTML entities", function(){
      var output = h.replaceEntities("<span>Alice & Bob</span>");
      expect(output).toBe("&lt;span&gt;Alice &amp; Bob&lt;/span&gt;");
    });
  });

  describe("#select", function(){
    it("returns an array of items for which the callback was true", function(){
      var input = ("Atti is one cute cat").split(" ");
      var output = h.select(input, function(item){
        if(item.length === 4) return true;
      });
      expect(output.join(" ")).toBe("Atti cute");
    });
  });

  describe("#tag", function(){
    it("returns an HTML tag", function(){
      var output  = h.tag("span", "Test");
      expect(output).toBe("<span>Test</span>");
    });
    it("works with replace's capturing groups and bind", function(){
      var output  = ("Test").replace(/^(.*)$/g, h.tag.bind("span"));
      expect(output).toBe("<span>Test</span>");
    });
    it("can add attributes via a string", function(){
      expect(h.tag(["p", "test='yes'"], "test")).toBe("<p test='yes'>test</p>")
    });
    it("can add attributes via an object", function(){
      var el = h.tag(["p", {test: "yes", foo: "bar"}], "test");
      expect(el).toBe("<p test=\"yes\" foo=\"bar\">test</p>");
    });
    it("doesn't give closing tags to inputs", function(){
      var el = h.tag(["input", {test: "yes", type: "text"}], "test");
      expect(el).toBe("<input test=\"yes\" type=\"text\" value=\"test\" />");
    });
    it("defaults to text input if no input type given", function(){
      var el = h.tag(["input", {test: "yes"}], "test");
      expect(el).toBe("<input test=\"yes\" type=\"text\" value=\"test\" />");
    });
  });

  describe("#templatify", function(){
    it("replaces variables in double-curlies with input strings", function(){
      var input = "<div>I like {{fruitA}}, {fruitA}, and {{fruitB}}.</div>";
      var output = h.templatify(input, {
        fruitA: "bananas",
        fruitB: "grapes"
      });
      expect(output).toBe("<div>I like bananas, {fruitA}, and grapes.</div>");
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
    it("parses 'relaxed' JSON strings", function(){
      var string = "\
      {\
        one: 1,\
        'foo': \"foo\",\
        \"bar\": \"bar\",\
        true: true,\
        array: [\
          \"alice\"\
        ]\
      }";
      var object = h.try_json(string);
      expect(object.one).toBe(1);
      expect(object.foo).toBe("foo");
      expect(object.bar).toBe("bar");
      expect(object.array).toContain("alice");
      expect(object.true).toBe(true);
    });
  });
});

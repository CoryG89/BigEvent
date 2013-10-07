JavaScript Resources
====================
JavaScript is arguably the most popular programming language. JavaScript is 
*definitely* the [most popular language on the net][web-pro-news]. In my
opinion JavaScript is a fantastic language with high productivity and high
expressiveness. You can program in many different styles in JavaScript.
You can do both object-oriented and functional programming with JavaScript.

To get started I would begin by reading over Mozilla's excellent
[JavaScript Overview][mdn-javascript-overview]. The MDN overview makes the
distinction between core JavaScript (defined by the ECMAScript specification)
and client-side extensions which allow JavaScript to interact with the browser
and the host page's Document Object Model (DOM). The overview also makes
a comparison of JavaScript and Java which is good for developers familiar with
Java, but relatively inexperienced with JavaScript. If you really want to get
a good solid foundation, the actual [ECMAScript Spec][ecmascript-5] is long, but
is actually rather readable if you're feeling up to it.

Core Overview
-------------
The [ECMAScript 5 Spec][ecmascript-5] gives an excellent overview of the core
language:

> ECMAScript is object-based: basic language and host facilities are provided by
> objects, and an ECMAScript program is a cluster of communicating objects. An
> ECMAScript object is a collection of properties each with zero or more
> attributes that determine how each property can be used—for example, when the
> Writable attribute for a property is set to false, any attempt by executed
> ECMAScript code to change the value of the property fails. Properties are
> containers that hold other objects, primitive values, or functions. A
> primitive value is a member of one of the following built-in types:
> Undefined, Null, Boolean, Number, and String; an object is a member of the
> remaining built-in type Object; and a function is a callable object. A
> function that is associated with an object via a property is a method.
> 
> ECMAScript defines a collection of built-in objects that round out the
> definition of ECMAScript entities. These built-in objects include the global
> object, the Object object, the Function object, the Array object, the String
> object, the Boolean object, the Number object, the Math object, the Date
> object, the RegExp object, the JSON object, and the Error objects Error,
> EvalError, RangeError, ReferenceError, SyntaxError, TypeError and URIError.

Classification
--------------
JavaScript is an interpreted, dynamically typed, programming language. This 
means that there is no compile step like in Java or C/C++. One benefit to this
is the ability to run arbitrary JavaScript commands within the context of the
current page through Chrome's console. When it comes to development I would
recommend using Chrome as the developer tools are probably the most widely used
and highly developed. You can open up the console by hitting `CTRL + SHIFT + J`.

Unlike Java, which is statically typed, JavaScript is dynamically typed. This
means that you do not have to specify types when declaring variables; they will
be determined by the interpreter on the fly.

    var myVariable = 'hello';
    typeof myVariable;    // returns "string"
    myVariable = 10;
    typeof myVariable;    // returns "number"

Client-Side JavaScript
----------------------
Node.JS uses an implementation of the CommonJS module 

Advanced Features and Techniques (TODO)
--------------------------------
 - [Prototypal Inheritance (MDN)][mdn-prototypal-inheritance]
 - [Closures][mdn-closures]
 - [JavaScript Scoping and Hoisting][javascript-scoping-hoisting]
 - [Currying and Partial Application][resig-partial-application]

References
-----------
 - [Eloquent JavaScript][eloquent-javascript]
 - [Mozilla JavaScript Guide][mozilla-javascript-guide]

[eloquent-javascript]: http://eloquentjavascript.net/
[mozilla-javascript-guide]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide
[web-pro-news]: http://www.webpronews.com/javascript-leads-the-pack-as-most-popular-programming-language-2012-09
[mdn-javascript-overview]: http://www.webpronews.com/javascript-leads-the-pack-as-most-popular-programming-language-2012-09
[mdn-prototypal-inheritance]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain
[mdn-closures]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain
[ecmascript-5]: http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf

[resig-tutorial]: http://ejohn.org/apps/learn/
[resig-partial-application]: http://ejohn.org/blog/partial-functions-in-javascript/

[javascript-scoping-hoisting]: http://www.adequatelygood.com/JavaScript-Scoping-and-Hoisting.html

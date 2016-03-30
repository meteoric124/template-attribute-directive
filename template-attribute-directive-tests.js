// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by template-attribute-directive.js.
import { name as packageName } from "meteor/template-attribute-directive";

// Write your tests here!
// Here is an example.
Tinytest.add('template-attribute-directive - example', function (test) {
  test.equal(packageName, "template-attribute-directive");
});

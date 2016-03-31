# jandres:template-attribute-directive

Enables _simple_ angular attribute directives. "Simple" because
this can only handle DOM attributes, not blaze attributes. This
rules out the possibility of handing down a function or any
reactive attributes. None the less, there is still a big
use case.

## Example:

The following is an example usage from *jandres:ionic@1.2.4.alpha.10*:

```javascript
import { TemplateAttributeDirectiveType } from 'meteor/jandres:template-attribute-directive';

let ionNavDirection = new TemplateAttributeDirectiveType('ionNavDirection', {
    $postLink($scope, $element, $attr) {
        $element.bind('click', function() {
            // Note: ionnavdirection instead of ionNavDirection due
            //       to Node.attributes lowercasing.
            $ionicViewSwitcher.nextDirection($attr.ionnavdirection);
        });
    }
});

export { ionNavDirection };
```

Then in somewhere in your template:

```handlebars
{{#ionContent}}
    <div class="padding" ionNavDirection="back">
        <a href="{{pathFor 'navigation'}}" class="button button-stable" data-nav-direction="back"><i class="icon ionic-ios-arrow-back"></i> Back</a>
        <a href="{{pathFor 'navigation.two'}}" class="button button-stable"><i class="icon ionic-ios-arrow-forward"></i> Forward</a>
    </div>
{{/ionContent}}
```

## Hooks:

During constructor of the `TemplateAttributeDirectiveType` you can pass:

1. *$preLink*: Called while traversing downwards the template from root template.
2. *$postLink*: Called while traversing upwards the template from leaf templates.

And in these, two hooks you are given:

1. *$scope*: From `jandres:template-scope` which emulates angular $scope.
2. *$element*: The element in which the attribute is attached.
3. *$attr*: The dictionary of attributes and their value (if any). This includes the current directive.
   There is only one problem, these will be lowercase. This will hopefully be addressed in the future.

That being said, you can emulate `onDestroyed` callback via:

```javascript
$scope.$on('$destroy', function() {
  // Destroy stuff and what not.
});
```
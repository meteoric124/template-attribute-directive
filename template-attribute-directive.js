let noop = () => undefined;

let TemplateAttributeDirectiveTypes = [];

export class TemplateAttributeType {
    constructor(name, options = {}) {
        this.name = name;
        this.$preLink = options.$preLink || noop;
        this.$postLink = options.$postLink || noop;

        TemplateAttributeDirectiveTypes.push(this);

        this._instances = [];
    }

    addInstance(instance) {
        // todo: Place this in $postLink, so we can access the state of element then.
        let $element = $(`[attribute_directive_element_id=${instance.$element_id}]`);
        let $attrs = {};
        for (var i = 0, atts = $element[0].attributes, n = atts.length; i < n; i++){
            $attrs[atts[i].nodeName] = atts[i].nodeValue;
        }
        $(instance).on('$preLink', this.$preLink.bind(instance, this.$scope, $element, $attrs));
        $(instance).on('$postLink', this.$postLink.bind(instance, this.$scope, $element, $attrs));
        this._instances.push(instance);
    }
}

Template.onCreated(function() {
});

Template.onRendered(function() {
    TemplateAttributeDirectiveTypes.forEach(directiveType => {
        let $element = this.$(`[${directiveType.name}]`);
        if ($element.length) {
            let attribute_directive_id = $element.attr('attribute_directive_element_id');
            if (!attribute_directive_id) {
                attribute_directive_id = _.uniqueId();
                $element.attr('attribute_directive_element_id', attribute_directive_id);
            }

            let directiveInstances = directiveType._instances.filter(d => d.$element_id === attribute_directive_id);

            if (directiveInstances.length) {
                directiveInstances.forEach(d => {
                    let directive$scopeIsParent = d.$scope.isPrototypeOf(this.$scope);
                    if (directive$scopeIsParent) {
                        d.$scope = this.$scope;
                        d._templateInstance = this;
                    }
                });
            } else {
                let directiveInstance = {
                    $element_id: attribute_directive_id,
                    $scope: this.$scope,
                    _templateInstance: this
                };

                directiveType.addInstance(directiveInstance);
            }
        }
    });

    $(this).on('$preLink', function() {
        TemplateAttributeDirectiveTypes.forEach(directiveType => {
            directiveType._instances.filter(d => d._templateInstance == this).forEach(d => {
                $(d).triggerHandler('$preLink');
            });
        });
    });

    $(this).on('$postLink', function() {
        TemplateAttributeDirectiveTypes.forEach(directiveType => {
            directiveType._instances.filter(d => d._templateInstance == this).forEach(d => {
                $(d).triggerHandler('$postLink');
            });
        });
    });
});

Template.onDestroyed(function() {
    TemplateAttributeDirectiveTypes.forEach(directiveType => {
        directiveType._instances = directiveType._instances.filter(d => d._templateInstance != this);
    });
});
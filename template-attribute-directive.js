import { Template } from 'meteor/templating';
import {
    resetTemplateAttributeDirectiveTypes,
    TemplateAttributeDirectiveTypes,
    TemplateAttributeDirectiveType
} from './lib/template-attribute-directive-type';

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
                let $element = $(`[attribute_directive_element_id=${d.$element_id}]`);
                let $attrs = {};
                for (var i = 0, atts = $element[0].attributes, n = atts.length; i < n; i++){
                    $attrs[atts[i].nodeName] = atts[i].nodeValue;
                }
                directiveType.$preLink.call(d, d.$scope, $element, $attrs);
            });
        });
    });

    $(this).on('$postLink', function() {
        TemplateAttributeDirectiveTypes.forEach(directiveType => {
            directiveType._instances.filter(d => d._templateInstance == this).forEach(d => {
                let $element = $(`[attribute_directive_element_id=${d.$element_id}]`);
                let $attrs = {};
                for (var i = 0, atts = $element[0].attributes, n = atts.length; i < n; i++){
                    $attrs[atts[i].nodeName] = atts[i].nodeValue;
                }
                directiveType.$postLink.call(d, d.$scope, $element, $attrs);
            });
        });
    });
});

Template.onDestroyed(function() {
    TemplateAttributeDirectiveTypes.forEach(directiveType => {
        directiveType._instances = directiveType._instances.filter(d => d._templateInstance != this);
    });
});

// Package exports.
export {
    resetTemplateAttributeDirectiveTypes,  // For tests.
    TemplateAttributeDirectiveTypes,  // For tests.
    TemplateAttributeDirectiveType
};
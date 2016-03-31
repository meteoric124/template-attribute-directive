import { Template } from 'meteor/templating';
import {
    resetTemplateAttributeDirectiveTypes,
    TemplateAttributeDirectiveTypes,
    TemplateAttributeDirectiveType
} from './lib/template-attribute-directive-type';
import {
    TemplateAttributeDirectiveInstance
} from './lib/template-attribute-directive-instance';

Template.onCreated(function() {
    this.$$attributeDirectivesHash = {};
});

Template.onRendered(function() {
    TemplateAttributeDirectiveTypes.forEach(directiveType => {
        let $element = this.$(`[${directiveType.name}]`);
        if ($element.length) {
            let attribute_directive_id = $element.attr('attribute_directive_id');
            if (!attribute_directive_id) {
                attribute_directive_id = _.uniqueId();
                $element.attr('attribute_directive_id', attribute_directive_id);
            }

            // One directive per DOM Node.
            // todo: throw error otherwise.
            let directiveInstance = directiveType._instances[attribute_directive_id];

            if (directiveInstance) {
                let directive$scopeIsParent = directiveInstance.$scope.isPrototypeOf(this.$scope);
                if (directive$scopeIsParent) {
                    directiveInstance.$scope = this.$scope;
                    directiveInstance.setTemplateInstance(this);
                }
            } else {
                directiveInstance = new TemplateAttributeDirectiveInstance({
                    id: attribute_directive_id,  // Note: This will also act as the directiveInstanceID.
                    $scope: this.$scope,
                    templateInstance: this,
                    type: directiveType
                });
                this.$$attributeDirectivesHash[attribute_directive_id] = directiveInstance;
                directiveType.addInstance(directiveInstance);
            };
        }
    });

    $(this).on('$preLink', function() {
        for (let attributeDirectiveId in this.$$attributeDirectivesHash) {
            let d = this.$$attributeDirectivesHash[attributeDirectiveId];

            let $element = $(`[attribute_directive_id=${d.id}]`);
            let $attrs = {};
            for (var i = 0, atts = $element[0].attributes, n = atts.length; i < n; i++){
                $attrs[atts[i].nodeName] = atts[i].nodeValue;
            }
            d.type.$preLink.call(d, d.$scope, $element, $attrs);
        }
    });

    $(this).on('$postLink', function() {
        for (let attributeDirectiveId in this.$$attributeDirectivesHash) {
            let d = this.$$attributeDirectivesHash[attributeDirectiveId];

            let $element = $(`[attribute_directive_id=${d.id}]`);
            let $attrs = {};
            for (var i = 0, atts = $element[0].attributes, n = atts.length; i < n; i++) {
                $attrs[atts[i].nodeName] = atts[i].nodeValue;
            }
            d.type.$postLink.call(d, d.$scope, $element, $attrs);
        }
    });
});

Template.onDestroyed(function() {
    for (let attributeDirectiveId in this.$$attributeDirectivesHash) {
        let d = this.$$attributeDirectivesHash[attributeDirectiveId];
        delete d.type._instances[attributeDirectiveId];
    }

    delete this.$$attributeDirectivesHash;
});

// Package exports.
export {
    resetTemplateAttributeDirectiveTypes,  // For tests.
    TemplateAttributeDirectiveTypes,  // For tests.
    TemplateAttributeDirectiveType
};
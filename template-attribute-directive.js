import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';
import { _ } from 'meteor/underscore';
import {
    resetTemplateAttributeDirectiveTypes,
    TemplateAttributeDirectiveTypes,
    TemplateAttributeDirectiveType
} from './lib/template-attribute-directive-type';
import {
    TemplateAttributeDirectiveInstance
} from './lib/template-attribute-directive-instance';
import { toSnakeCase } from './lib/utility';

Template.onCreated(function() {
    this.$$attributeDirectivesHash = {};
    this.forEachAttributeDirective = fn => {
        for (let attributeDirectiveId in this.$$attributeDirectivesHash) {
            for (let d of this.$$attributeDirectivesHash[attributeDirectiveId]) {
                fn(d, attributeDirectiveId);
            }
        }
    }
});

Template.onRenderedFirst(function() {
    TemplateAttributeDirectiveTypes.forEach(directiveType => {
        let directiveNameSnakeCase = toSnakeCase(directiveType.name);  // Assumed that directiveType.name is camelCase.
        let $element = this.$(`[${directiveNameSnakeCase}]`);
        if ($element.length) {
            let attribute_directive_id = $element.attr('uid');
            if (!attribute_directive_id) {
                attribute_directive_id = _.uniqueId();
                $element.attr('uid', attribute_directive_id);
            }

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

                if (_.isArray(this.$$attributeDirectivesHash[attribute_directive_id])) {
                    this.$$attributeDirectivesHash[attribute_directive_id].push(directiveInstance);
                } else {
                    this.$$attributeDirectivesHash[attribute_directive_id] = [ directiveInstance ];
                }
                directiveType.addInstance(directiveInstance);
            }
        }
    });

    $(this).on('$preLink', function() {
        this.forEachAttributeDirective(d => {
            let $element = $(`[uid="${d.id}"]`);
            let $attrs = d.$attrs();
            d.type.$preLink.call(d, d.$scope, $element, $attrs);
        });
    });

    $(this).on('$postLink', function() {
        this.forEachAttributeDirective(d => {
            let $element = $(`[uid="${d.id}"]`);
            let $attrs = d.$attrs();
            d.type.$postLink.call(d, d.$scope, $element, $attrs);
        });
    });
});

Template.onDestroyed(function() {
    this.forEachAttributeDirective((d, attributeDirectiveId) => {
        delete d.type._instances[attributeDirectiveId];
    });

    delete this.$$attributeDirectivesHash;
});

// Package exports.
export {
    resetTemplateAttributeDirectiveTypes,  // For tests.
    TemplateAttributeDirectiveTypes,  // For tests.
    TemplateAttributeDirectiveType
};
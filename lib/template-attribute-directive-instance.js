import { _ } from 'meteor/underscore';
import { toCamelCase, toSnakeCase } from './utility';

class TemplateAttributeDirectiveInstance {
    constructor(options) {
        _.extend(this, options);

        if (_.isUndefined(this.id)) throw "TemplateAttributeDirectiveInstance given no id.";
        if (_.isUndefined(this.$scope)) throw "TemplateAttributeDirectiveInstance given no $scope.";
        if (_.isUndefined(this.templateInstance)) throw "TemplateAttributeDirectiveInstance given no templateInstance.";
        if (_.isUndefined(this.type)) throw "TemplateAttributeDirectiveInstance given no type.";
    }

    $attrs() {
        let $attrs = {};
        if (this.$element()[0]) {
            for (var i = 0, atts = this.$element()[0].attributes, n = atts.length; i < n; i++) {
                $attrs[toCamelCase(atts[i].nodeName)] = atts[i].nodeValue;
            }
        }

        return $attrs;
    }
    
    $elementSelector() {
        return `[attribute_directive_id="${this.id}"]`;
    }

    $element() {
        return $(this.$elementSelector())
    }

    setTemplateInstance(newTemplateInstance) {
        delete this.templateInstance.$$attributeDirectivesHash[this.id];  // Erase it from the other template's hash.
        this.templateInstance = newTemplateInstance;
        this.templateInstance.$$attributeDirectivesHash[this.id] = this;
    }
}

export { TemplateAttributeDirectiveInstance };
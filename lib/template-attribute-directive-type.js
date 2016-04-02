import { toCamelCase, toSnakeCase, noop } from './utility';
import {
    TemplateAttributeDirectiveInstance
} from './template-attribute-directive-instance';

let TemplateAttributeDirectiveTypes = [];

function resetTemplateAttributeDirectiveTypes () {
    TemplateAttributeDirectiveTypes = [];
}

class TemplateAttributeDirectiveType {
    constructor(name, options = {}) {
        if (_.isUndefined(name)) throw "TemplateAttributeDirectiveType must be given a name.";

        this.name = name;
        this.$preLink = options.$preLink || noop;
        this.$postLink = options.$postLink || noop;
        
        this._instances = {};

        TemplateAttributeDirectiveTypes.push(this);

        let self = this;
        Template.registerHelper(this.name, function() {
            let t = Template.instance();
            let attributeDirectiveId = _.uniqueId();

            Meteor.setTimeout(() => {
                let $element = t.$(`[attribute-directive-id=${attributeDirectiveId}]`);
                let $attrs = {};

                // DOM attrs.
                if ($element[0]) {
                    for (var i = 0, atts = $element[0].attributes, n = atts.length; i < n; i++) {
                        $attrs[toCamelCase(atts[i].nodeName)] = atts[i].nodeValue;
                    }
                }

                // helper positional attrs.
                for (var i = 0; i < (arguments.length - 1); i++) {
                    $attrs[i] = arguments[i];
                }

                // helper hash attrs.
                let helperArgHash = arguments[arguments.length - 1].hash;
                for (let attr in helperArgHash) {
                    $attrs[attr] = helperArgHash[attr];
                }

                let thisContext = {
                    id: attributeDirectiveId,
                    _templateInstance: t
                }

                let $preLinkHandler =
                    () => self.$preLink.call(
                        thisContext,
                        t.$scope,
                        $element,
                        $attrs
                    );

                let $postLinkHandler =
                    () => self.$postLink.call(
                        thisContext,
                        t.$scope,
                        $element,
                        $attrs
                    );

                if (t.$preLinked) {
                    $preLinkHandler();
                } else {
                    $(t).on('$preLink', $preLinkHandler);
                }

                if (t.$postLinked) {
                    $postLinkHandler();
                } else {
                    $(t).on('$postLink', $postLinkHandler);
                }
            });

            return {
                'attribute-directive-id': attributeDirectiveId
            };
        });
    }

    addInstance(instance) {
        this._instances[instance.id] = instance;
    }

    removeInstance(instance) {
        delete this._instances[instance.id];
    }
}

export {
    TemplateAttributeDirectiveTypes,
    resetTemplateAttributeDirectiveTypes,
    TemplateAttributeDirectiveType 
};
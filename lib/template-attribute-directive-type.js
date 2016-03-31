import { noop } from './utility.js';

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

        TemplateAttributeDirectiveTypes.push(this);

        this._instances = [];
    }

    addInstance(instance) {
        this._instances.push(instance);
    }
}

export {
    TemplateAttributeDirectiveTypes,
    resetTemplateAttributeDirectiveTypes,
    TemplateAttributeDirectiveType 
};
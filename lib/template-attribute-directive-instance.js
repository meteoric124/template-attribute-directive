import { _ } from 'meteor/underscore';

class TemplateAttributeDirectiveInstance {
    constructor(options) {
        _.extend(this, options);

        if (_.isUndefined(this.id)) throw "TemplateAttributeDirectiveInstance given no id.";
        if (_.isUndefined(this.$scope)) throw "TemplateAttributeDirectiveInstance given no $scope.";
        if (_.isUndefined(this._templateInstance)) throw "TemplateAttributeDirectiveInstance given no templateInstance.";
        if (_.isUndefined(this.type)) throw "TemplateAttributeDirectiveInstance given no type.";
    }
}

export { TemplateAttributeDirectiveInstance };
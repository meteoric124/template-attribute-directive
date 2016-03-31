import { noop } from "./utility";
import {
    TemplateAttributeDirectiveTypes,
    resetTemplateAttributeDirectiveTypes,
    TemplateAttributeDirectiveType } from "./template-attribute-directive-type";

describe('TemplateAttributeDirectiveType class test', function() {
    describe('constructor test', function() {
        beforeEach(function() {
            // Reset TemplateAttributeDirectiveTypes.
            resetTemplateAttributeDirectiveTypes();
        });

        it ('prior to any creation, TemplateAttributeDirectiveTypes will be empty', function() {
            expect(TemplateAttributeDirectiveTypes.length).toBe(0);
        });

        it ('no options sets the appropriate default', function() {
            let tadt = new TemplateAttributeDirectiveType('fooDirective');
            expect(tadt.name).toBe('fooDirective');
            expect(tadt.$preLink).toBe(noop);
            expect(tadt.$postLink).toBe(noop);
            expect(tadt._instances).toEqual([]);

            expect(TemplateAttributeDirectiveTypes.length).toBe(1);
            expect(TemplateAttributeDirectiveTypes[0]).toBe(tadt);
        });

        it ('no name throws an error', function() {
            expect(function() { new TemplateAttributeDirectiveType() }).toThrow();
        });

        it ('$preLink/$postLink provided in options', function() {
            let $preLink = () => console.log('$preLink');
            let $postLink = () => console.log('$postLink');
            let tat = new TemplateAttributeDirectiveType('fooDirective', { $preLink, $postLink });
            expect(tat.$preLink).toBe($preLink);
            expect(tat.$postLink).toBe($postLink);
        });
    });

    describe('addInstance', function() {
        beforeEach(function() {
            // Reset TemplateAttributeDirectiveTypes.
            resetTemplateAttributeDirectiveTypes();
            this.tadt =  new TemplateAttributeDirectiveType('fooDirective');
        });

        it ("adds a new instance.", function() {
            let directiveInstance = {};
            this.tadt.addInstance(directiveInstance);
            expect(this.tadt._instances.length).toBe(1);
            expect(this.tadt._instances[0]).toBe(directiveInstance);
        });

        it ("throws an error if directive with a given name already exist", function() {

        });
    });
});
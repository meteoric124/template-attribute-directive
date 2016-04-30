import { Blaze } from 'meteor/blaze';
import { $ } from 'meteor/jquery';
import {
    resetTemplateAttributeDirectiveTypes,
    TemplateAttributeDirectiveType
} from './../template-attribute-directive';

import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';

// Create new $scope so we can differentiate.
Template.SingleTemplate1.onCreated(function() {
    this.new_scope = true;
});
Template.SingleTemplate2.onCreated(function() {
    this.new_scope = true;
});
Template.DirectiveAtTop.onCreated(function() {
    this.new_scope = true;
});

describe('template-attribute-directive', function() {
    describe('Single template which contains attribute-directive', function() {
        beforeEach(function() {
            resetTemplateAttributeDirectiveTypes();
            this.tadt = new TemplateAttributeDirectiveType('fooDirective');
            this.view = Blaze.render(Template.SingleTemplate1, $('body').get(0));
            Tracker.flush();
        });

        it ('will be the template in which attribute-directive will be nested', function() {
            expect(Object.keys(this.tadt._instances).length).toBe(1, 'No fooDirective instance was created.');
            expect(this.tadt._instances[Object.keys(this.tadt._instances)[0]].$scope).toBe(this.view._templateInstance.$scope);
        });

        afterEach(function() {
            Blaze.remove(this.view);
            delete this.tadt;
        });
    });

    describe('Single template which does NOT contains attribute-directive', function() {
        beforeEach(function() {
            resetTemplateAttributeDirectiveTypes();
            this.tadtFoo = new TemplateAttributeDirectiveType('fooDirective');
            this.tadtNotFoo = new TemplateAttributeDirectiveType('notFooDirective');
            this.view = Blaze.render(Template.SingleTemplate2, document.body);
            Tracker.flush();
        });

        it ('will be attached by attribute-directive', function() {
            expect(Object.keys(this.tadtFoo._instances).length).toBe(0);

            expect(Object.keys(this.tadtNotFoo._instances).length).toBe(1);
            expect(this.tadtNotFoo._instances[Object.keys(this.tadtNotFoo._instances)[0]].$scope).toBe(this.view._templateInstance.$scope);
        });

        afterEach(function() {
            Blaze.remove(this.view);
            delete this.tadtFoo;
            delete this.tadtNotFoo;
        });
    });

    describe('Directive is at bottom of nested template. Root template have a root DOM element.', function() {
        beforeEach(function() {
            resetTemplateAttributeDirectiveTypes();
            this.tadtFoo = new TemplateAttributeDirectiveType('fooDirective');
            this.tadtNotFoo = new TemplateAttributeDirectiveType('notFooDirective');
            this.view = Blaze.render(Template.DirectiveAtBottom_TopHaveRootDOMElement, document.body);
            Tracker.flush();
        });

        it ('will be attached to the bottom of nested template', function() {
            let SingleTemplate1Instance =
                this.view._templateInstance.children().filter(t => t.view.name === 'Template.SingleTemplate1')[0];
            let SingleTemplate2Instance =
                this.view._templateInstance.children().filter(t => t.view.name === 'Template.SingleTemplate2')[0];

            // Sanity checks.
            expect(SingleTemplate1Instance).toBeTruthy('SingleTemplate1 was not rendered.');
            expect(SingleTemplate2Instance).toBeTruthy('SingleTemplate2 was not rendered.');

            expect(Object.keys(this.tadtFoo._instances).length).toBe(1);
            expect(this.tadtFoo._instances[Object.keys(this.tadtFoo._instances)[0]].$scope).toBe(SingleTemplate1Instance.$scope);

            expect(Object.keys(this.tadtNotFoo._instances).length).toBe(1);
            expect(this.tadtNotFoo._instances[Object.keys(this.tadtNotFoo._instances)[0]].$scope).toBe(SingleTemplate2Instance.$scope);
        });

        afterEach(function() {
            Blaze.remove(this.view);
            delete this.tadtFoo;
            delete this.tadtNotFoo;
        });
    });

    describe('Directive is at bottom of nested template. Root template have NO root DOM element.', function() {
        beforeEach(function() {
            resetTemplateAttributeDirectiveTypes();
            this.tadtFoo = new TemplateAttributeDirectiveType('fooDirective');
            this.tadtNotFoo = new TemplateAttributeDirectiveType('notFooDirective');
            this.view = Blaze.render(Template.DirectiveAtBottom_TopHaveNORootDOMElement, document.body);
            Tracker.flush();
        });

        it ('will be attached to the bottom of nested template', function() {
            let SingleTemplate1Instance =
                this.view._templateInstance.children().filter(t => t.view.name === 'Template.SingleTemplate1')[0];
            let SingleTemplate2Instance =
                this.view._templateInstance.children().filter(t => t.view.name === 'Template.SingleTemplate2')[0];

            // Sanity checks.
            expect(SingleTemplate1Instance).toBeTruthy('SingleTemplate1 was not rendered.');
            expect(SingleTemplate2Instance).toBeTruthy('SingleTemplate2 was not rendered.');

            expect(Object.keys(this.tadtFoo._instances).length).toBe(1);
            expect(this.tadtFoo._instances[Object.keys(this.tadtFoo._instances)[0]].$scope).toBe(SingleTemplate1Instance.$scope);

            expect(Object.keys(this.tadtNotFoo._instances).length).toBe(1);
            expect(this.tadtNotFoo._instances[Object.keys(this.tadtNotFoo._instances)[0]].$scope).toBe(SingleTemplate2Instance.$scope);
        });

        afterEach(function() {
            Blaze.remove(this.view);
            delete this.tadtFoo;
            delete this.tadtNotFoo;
        });
    });

    describe('Directive is at bottom of nested template. The tree have one same scope.', function() {
        beforeEach(function() {
            resetTemplateAttributeDirectiveTypes();
            this.tadtNotFoo = new TemplateAttributeDirectiveType('notFooDirective');
            this.view = Blaze.render(Template.DirectiveAtBottomAllSameScope, document.body);
            Tracker.flush();
        });

        it ('will be attached to the bottom of nested template', function() {
            let NoNewScopeTemplates =
                this.view._templateInstance.children().filter(t => t.view.name === 'Template.NoNewScopeTemplate');

            // Sanity checks.
            expect(NoNewScopeTemplates[0]).toBeTruthy('SingleTemplate1 was not rendered.');
            expect(NoNewScopeTemplates[1]).toBeTruthy('SingleTemplate2 was not rendered.');

            expect(Object.keys(this.tadtNotFoo._instances).length).toBe(2);
            expect(this.tadtNotFoo._instances[Object.keys(this.tadtNotFoo._instances)[0]].templateInstance).not.toBe(this.view.templateInstance);
            expect(this.tadtNotFoo._instances[Object.keys(this.tadtNotFoo._instances)[1]].templateInstance).not.toBe(this.view.templateInstance);
            expect(this.tadtNotFoo._instances[Object.keys(this.tadtNotFoo._instances)[0]].templateInstance).toBe(NoNewScopeTemplates[0]);
            expect(this.tadtNotFoo._instances[Object.keys(this.tadtNotFoo._instances)[0]].$scope).toBe(NoNewScopeTemplates[0].$scope);
            expect(this.tadtNotFoo._instances[Object.keys(this.tadtNotFoo._instances)[1]].templateInstance).toBe(NoNewScopeTemplates[1]);
            expect(this.tadtNotFoo._instances[Object.keys(this.tadtNotFoo._instances)[1]].$scope).toBe(NoNewScopeTemplates[1].$scope);
        });

        afterEach(function() {
            Blaze.remove(this.view);
            delete this.tadtNotFoo;
        });
    });

    describe('Top of nested template', function() {
        beforeEach(function() {
            resetTemplateAttributeDirectiveTypes();
            this.tadtasdf = new TemplateAttributeDirectiveType('asdfDirective');
            this.view = Blaze.render(Template.DirectiveAtTop, document.body);
            Tracker.flush();
        });

        it ('will be attached to the top of nested template', function() {
            let SingleTemplate1Instance =
                this.view._templateInstance.children().filter(t => t.view.name === 'Template.SingleTemplate1')[0];
            let SingleTemplate2Instance =
                this.view._templateInstance.children().filter(t => t.view.name === 'Template.SingleTemplate2')[0];

            // Sanity checks.
            expect(SingleTemplate1Instance).toBeTruthy('SingleTemplate1 was not rendered.');
            expect(SingleTemplate2Instance).toBeTruthy('SingleTemplate2 was not rendered.');

            expect(Object.keys(this.tadtasdf._instances).length).toBe(1);
            expect(this.tadtasdf._instances[Object.keys(this.tadtasdf._instances)[0]].$scope).not.toBe(SingleTemplate1Instance.$scope);
            expect(this.tadtasdf._instances[Object.keys(this.tadtasdf._instances)[0]].$scope).not.toBe(SingleTemplate2Instance.$scope);
            expect(this.tadtasdf._instances[Object.keys(this.tadtasdf._instances)[0]].$scope).toBe(this.view._templateInstance.$scope);
        });

        afterEach(function() {
            Blaze.remove(this.view);
            delete this.tadtasdf;
        });
    });

    describe('Multiple template attributes in a single template.', function() {
        beforeEach(function() {
            resetTemplateAttributeDirectiveTypes();
            let self = this;
            this.tadt_directiveOne_preLinked = false;
            this.tadt_directiveOne_postLinked = false;
            this.tadt_directiveTwo_preLinked = false;
            this.tadt_directiveTwo_postLinked = false;
            this.tadt_directiveOne = new TemplateAttributeDirectiveType('directiveOne', {
                $preLink($scope, $element, $attrs) {
                    self.tadt_directiveOne_preLinked = true;
                },
                $postLink($scope, $element, $attrs) {
                    self.tadt_directiveOne_postLinked = true;
                }
            });
            this.tadt_directiveTwo = new TemplateAttributeDirectiveType('directiveTwo', {
                $preLink($scope, $element, $attrs) {
                    self.tadt_directiveTwo_preLinked = true;
                },
                $postLink($scope, $element, $attrs) {
                    self.tadt_directiveTwo_postLinked = true;
                }
            });
            this.view = Blaze.render(Template.MultipleAttributeDirective, document.body);
            Tracker.flush();
        });

        it ('both will be attach to the top template', function() {
            let directiveOneInstance = this.tadt_directiveOne._instances[Object.keys(this.tadt_directiveOne._instances)[0]];
            let directiveTwoInstance = this.tadt_directiveTwo._instances[Object.keys(this.tadt_directiveTwo._instances)[0]];
            expect(directiveOneInstance.$scope).toBe(this.view._templateInstance.$scope);
            expect(directiveTwoInstance.$scope).toBe(this.view._templateInstance.$scope);
        });

        it ('will call $preLink for both template attributes.', function() {
            expect(this.tadt_directiveOne_preLinked).toBeTruthy('directive one did not call $preLink');
            expect(this.tadt_directiveTwo_preLinked).toBeTruthy('directive two did not call $preLink');
        });

        it ('will call $postLink for both template attributes.', function() {
            expect(this.tadt_directiveOne_postLinked).toBeTruthy('directive one did not call $postLink');
            expect(this.tadt_directiveTwo_postLinked).toBeTruthy('directive two did not call $postLink');
        });

        afterEach(function() {
            Blaze.remove(this.view);
            delete this.tadt_directiveOne;
            delete this.tadt_directiveTwo;
        });
    });
});
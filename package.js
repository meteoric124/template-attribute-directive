Package.describe({
  name: 'jandres:template-attribute-directive',
  version: '0.1.0-beta.2',
  // Brief, one-line summary of the package.
  summary: 'Basic implementation of angular template-attribute-directive in blaze.',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/meteoric124/template-attribute-directive.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

var package_client_dependencies = [
  "meteoric124:template-scope@=0.1.0-beta.4",
  'underscore',
  'templating',
  'jquery'
];

Package.onUse(function(api) {
  api.versionsFrom('1.3.2.4');
  api.use([
    'ecmascript'
  ]);

  api.use(package_client_dependencies, 'client');

  api.mainModule('template-attribute-directive.js', 'client');
});

Package.onTest(function(api) {
  api.use('jandres:template-attribute-directive', 'client');

  // Testing packages.
  api.use([
    'sanjo:jasmine@1.0.1',
    'velocity:html-reporter'
  ]);

  api.use(package_client_dependencies, 'client');

  api.use([
    'ecmascript',
    'tracker'
  ], 'client');

  api.addFiles([
    'tests/templates.html',
    'tests/template-attribute-directive-type.test.js',
    'tests/template-attribute-directive.test.js'
  ], 'client');
});

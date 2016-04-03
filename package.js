Package.describe({
  name: 'jandres:template-attribute-directive',
  version: '0.1.0-alpha3',
  // Brief, one-line summary of the package.
  summary: 'Basic implementation of angular template-attribute-directive in blaze.',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/meteoric124/template-attribute-directive.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3');
  api.use([
    'ecmascript'
  ]);

  api.use([
    "jandres:template-scope@0.1.0-alpha14",
    'underscore',
    'templating',
    'jquery'
  ], 'client');

  api.mainModule('template-attribute-directive.js', 'client');
});

Package.onTest(function(api) {
  api.use([
    'ecmascript',
    'sanjo:jasmine@1.0.0-rc.3',
    'templating',
    'tracker',
    'underscore'
  ]);
  api.use('jandres:template-attribute-directive');

  api.addFiles([
      'tests/templates.html'
  ], 'client');
  api.mainModule('template-attribute-directive-tests.js', 'client');
});

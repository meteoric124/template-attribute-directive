Package.describe({
  name: 'jandres:template-attribute-directive',
  version: '0.1.0-alpha1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
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
    "jandres:template-scope@0.1.0-alpha11",
    'underscore',
    'templating',
    'jquery'
  ], 'client');

  api.mainModule('template-attribute-directive.js', 'client');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('sanjo:jasmine@0.20.3');
  api.use('jandres:template-attribute-directive');
  api.mainModule('template-attribute-directive-tests.js');
});

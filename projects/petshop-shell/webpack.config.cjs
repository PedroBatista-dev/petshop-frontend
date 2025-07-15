const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({

  name: 'petshop-shell',

  remotes: {
    'petshop-auth': 'http://localhost:4201/remoteEntry.js',
    'petshop-financeiro': 'http://localhost:4202/remoteEntry.js',
  },

  shared: shareAll({
    singleton: true,
    strictVersion: true,
    requiredVersion: 'auto',
  }),

});
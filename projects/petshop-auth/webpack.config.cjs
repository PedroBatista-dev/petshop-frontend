const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({

  name: 'petshop-auth',

  exposes: {
    // A linha mais importante: expõe as rotas para serem consumidas
    './routes': './projects/petshop-auth/src/app/app.routes.ts',
  },

  shared: shareAll({
    singleton: true,
    strictVersion: true,
    requiredVersion: 'auto',
  }),

});
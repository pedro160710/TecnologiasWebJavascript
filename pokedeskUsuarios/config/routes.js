/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

    /***************************************************************************
     *                                                                          *
     * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
     * etc. depending on your default view engine) your home page.              *
     *                                                                          *
     * (Alternatively, remove this and add an `index.html` file in your         *
     * `assets` directory)                                                      *
     *                                                                          *
     ***************************************************************************/
    /*no es necesario que vayan en orden las declaraciones de las vistas, es decir 
    homepage puede esta al final*/

    '/': {
        view: 'homepage'
    },
    '/login': {
        view: 'login'
    },
    '/cuenta': {
        //view: 'cuenta',
        controller: 'UserController',
        action: 'homeUsuario',
        policy: 'esUser'
    },
    //tomado del proyecto ArchivosSesion
    '/pokemon': {
        view: 'pokemon'
    },
    '/batman': {
        view: 'batman',
        policy: 'soyBatman'
    },
    '/formCrearUsuario': {
        controller: 'UserController',
        action: 'formCrearUsuario'
    },
    '/crearUsuario': {
        controller: 'UserController',
        action: 'crearUsuario'
    },
    '/subirFoto': {
        controller: 'UserController',
        action: 'subirFoto'
    },
    '/formCrearPokemon': {
        view: 'registroPokemon',
        policy: 'esSesion'
    },
    '/crearPokemon': {
        controller: 'PokemonsController',
        action: 'crearPokemon', //, action:'subirFoto'  
        policy: 'esSesion'
    },
    '/mostrarInfoUsuarios': {
        controller: 'UserController',
        action: 'home'
    },
    'post /doLogin': 'UserController.logIn',
    'get /logout': 'UserController.logOut',
    'get /cuentaAdmin': 'UserController.adminCuenta'

    /***************************************************************************
     *                                                                          *
     * Custom routes here...                                                    *
     *                                                                          *
     *  If a request to a URL doesn't match any of the custom routes above, it  *
     * is matched against Sails route blueprints. See `config/blueprints.js`    *
     * for configuration options and examples.                                  *
     *                                                                          *
     ***************************************************************************/

};
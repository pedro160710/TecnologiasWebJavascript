/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    formCrearUsuario: function (req, res) {
        console.log('entre al formulario de registro');
        res.view("registroUsuario"); // cuando se llame a esta accion,, esta redigira la vista al formulario de registro en html
    },
    crearUsuario: function (req, res) {
        var userObj = {
            nombre: req.param('nombre'), //el nombre del objeto html
            usuario: req.param('usuario'),
            password: req.param('password')
        }
        User.create(userObj, function (err, user) {
            res.redirect('/')
        })
    },
    
    logIn: function (req, res) {
        var params = req.allParams();
        sails.log.info('Usuario: ', params.usuario, ' Password: ', params.password);
        if (params.usuario === undefined || params.password === undefined) {
            sails.log.warn('Envio incorrecto de parametros.');
            return res.view('error', {
                mensaje: 'Envio incorrecto de parametros, no envia password ni usuario.',
                solucion: 'Envie parametros, usuario y password.'
            });
        } else {
            User.findOne()
                .where({
                    usuario: params.usuario
                })
                .exec(function (err, results) {
                    if (err) return res.negotiate();

                    if (results) {
                        sails.log.info('Se encontro el usuario: ', results.usuario);
                        if (params.password == results.password) {
                            sails.log.info('Login correcto');
                            req.session.user = results;
                            req.session.authenticated = true;
                            if (req.session.user.nivelAcceso == 1) {
                                return res.redirect('/cuentaAdmin');
                            } else {
                                return res.redirect('/cuenta');
                            }

                        } else {
                            sails.log.warn('Ingreso mal el password');
                            return res.view('error', {
                                mensaje: 'Envio incorrecto de parametros, password invalido.',
                                solucion: 'Envia correctamente tu password'
                            });
                        }

                    } else {
                        sails.log.warn('No se encontro ese usuario', params.usuario);
                        return res.view('error', {
                            mensaje: 'Envio incorrecto de parametros, no se encontro el usuario.',
                            solucion: 'Ingresar bien el usuario.'
                        });
                    }

                });
        }

    },
    logOut: function (req, res) {
        delete req.session.user;
        //delete req.session.me;
        delete req.session.authenticated;
        //sails.log.info('se ha deslogueado')
        return res.redirect('/');
    },
    adminCuenta: function (req, res) {
        return res.view('cuentaAdmin');
    },
    //copia de UsuariosController del proyecto ArchivosSesion
   /* subirFoto: function (req, res) {
        var params = req.allParams();
        var deleteFd = 'C:\\Users\\Pedro\\Downloads\\TecWebJav_2015_B-Permisos\\Permisos\\assets\\images\\';
        sails.log.info('Perfil: ', params.perfil); //solo muestra los datos de la imagen

        req.file('perfil').upload({
            // don't allow the total upload size to exceed ~10MB
            dirname: '../../assets/images',
            maxBytes: 10000000
        }, function whenDone(err, uploadedFiles) {
            if (err) {
                return res.negotiate(err);
            }

            // If no files were uploaded, respond with an error.
            if (uploadedFiles.length === 0) {
                return res.badRequest('No file was uploaded');
            }

            console.log(uploadedFiles[0]);
            var urlImagen = uploadedFiles[0].fd.replace(deleteFd, "");
            // Save the "fd" and the url where the avatar for a user can be accessed
            User.update(req.session.me, {

                    // Generate a unique URL where the avatar can be downloaded.
                    //avatarUrl es un tributo de la coleccion Usuarios
                    avatarUrl: require('util').format('%s/user/avatar/%s', sails.getBaseUrl(), req.session.me),
                    // Grab the first file and use it's `fd` (file descriptor)
                    //avatarFd es un tributo de la coleccion Usuarios
                    avatarFd: uploadedFiles[0].fd,
                    url: urlImagen
                })
                .exec(function (err) {
                    if (err) return res.negotiate(err);
                    req.session.user.url = urlImagen;
                    return res.redirect('/cuenta');
                });
        });
    },

*/
        subirFoto: function (req, res) {
        var params = req.allParams();
        var deleteFd = 'C:\\Users\\Pedro\\Downloads\\TecWebJav_2015_B-Permisos\\Permisos\\assets\\images\\';
        sails.log.info('Perfil: ', params.perfil);

        req.file('perfil').upload({
            // don't allow the total upload size to exceed ~10MB
            dirname: '../../assets/images',
            maxBytes: 10000000
        }, function whenDone(err, uploadedFiles) {
            if (err) {
                return res.negotiate(err);
            }

            // If no files were uploaded, respond with an error.
            if (uploadedFiles.length === 0) {
                return res.badRequest('No file was uploaded');
            }

            console.log(uploadedFiles[0]);
            var urlImagen = uploadedFiles[0].fd.replace(deleteFd, "");
            // Save the "fd" and the url where the avatar for a user can be accessed
            sails.log.info(urlImagen);
            
            User.update(req.session.me, {

                    // Generate a unique URL where the avatar can be downloaded.
                    avatarUrl: require('util').format('%s/user/avatar/%s', sails.getBaseUrl(), req.session.me),

                    // Grab the first file and use it's `fd` (file descriptor)
                    avatarFd: uploadedFiles[0].fd,

                    url: urlImagen
                })
                .exec(function (err) {
                    if (err) return res.negotiate(err);
                    req.session.user.url = urlImagen;
                    return res.redirect('/cuenta');
                });
        });
    },

    /**
     * Download avatar of the user with the specified id
     *
     * (GET /user/avatar/:id)
     */
    descargarFoto: function (req, res) {

        req.validate({
            id: 'string'
        });

        User.findOne(req.param('id')).exec(function (err, user) {
            if (err) return res.negotiate(err);
            if (!user) return res.notFound();

            // User has no avatar image uploaded.
            // (should have never have hit this endpoint and used the default image)
            if (!user.avatarFd) {
                return res.notFound();
            }

            var SkipperDisk = require('skipper-disk');
            var fileAdapter = SkipperDisk( /* optional opts */ );

            // Stream the file down
            fileAdapter.read(user.avatarFd)
                .on('error', function (err) {
                    return res.serverError(err);
                })
                .pipe(res);
        });
    },
    home: function (req, res) {
        var user;
        var pokemon;
        User.find().populate('misPokemon')
            .exec(function (err, results) {
                if (err) return res.negotiate();
                user = results;
                return res.view('infoUsuarios', {
                    cuentas: user,
                    
                });
            });



    },
    homeUsuario: function (req, res) {
        var user;
        var pokemon;
        User.find().populate('misPokemon')
            .exec(function (err, results) {
                if (err) return res.negotiate();
                user = results;
                return res.view('cuenta', {
                    cuentas: user,
                    
                });
            });



    }


};
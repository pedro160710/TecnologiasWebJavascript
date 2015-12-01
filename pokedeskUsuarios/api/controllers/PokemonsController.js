/**
 * PokemonsController
 *
 * @description :: Server-side logic for managing Pokemons
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    /*crearPokemon: function (req, res) {
        var pokeObjeto = {
            nombre: req.param('nombre'),
            tipo: req.param('tipo'),
            habilidadEspecial: req.param('habilidadEspecial'),
            numeroPokemon: req.param('numeroPokemon'),
            owner: req.param('owner')
        }

        Pokemons.create(pokeObjeto, function (err, pokemon) {
            if (err) {
                console.log(err)
                return res.redirect('/formCrearPokemon');

            }

            return res.badRequest('Pokemon creado correctamente');
            res.redirect('/formCrearPokemon')
        })

    },*/
    crearPokemon: function (req, res) {
        var params = req.allParams();
        sails.log.info('Nombre: ', params.nombre, ' FotoPokemon: ', params.fotoPokemon, ' Usuario:', req.session.user);

        if (params.nombre === undefined) {
            sails.log.warn('Envio incorrecto de parametros.');
            return res.badRequest('Envio incorrecto de parametros.');

        } else {
            var deleteFd = 'C:\\Users\\Pedro\\Downloads\\TecWebJav_2015_B-Permisos\\Permisos\\assets\\images\\';
            sails.log.info('FotoPokemon: ', params.fotoPokemon);

            req.file('fotoPokemon').upload({
                // don't allow the total upload size to exceed ~10MB
                dirname: '../../assets/images/',
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
                sails.log.info(urlImagen);
                // Save the "fd" and the url where the avatar for a user can be accessed
                // Generate a unique URL where the avatar can be downloaded.
                var fotoUrl = require('util').format('%s/pokemon/%s/%s', sails.getBaseUrl(), req.session.user.id, req.session.me);
                // Grab the first file and use it's `fd` (file descriptor)
                var fotoUrlFd = uploadedFiles[0].fd;
                var url = urlImagen;

                sails.log.info("urlImagen ", url);

                Pokemons.create({
                        nombre: params.nombre, //req.param('nombre'),
                        tipo: params.tipo, //req.param('tipo'),
                        habilidadEspecial: params.habilidadEspecial, //req.param('habilidadEspecial'),
                        numeroPokemon: params.numeroPokemon, //req.param('numeroPokemon'),
                        owner: req.session.user.id, //req.param('owner')
                        //dueno: req.session.user.id,
                        fotoUrl: fotoUrl,
                        fotoUrlFd: fotoUrlFd,
                        url: urlImagen
                    })
                    .exec(function (err, createdPokemon) {
                        if (err) {
                            return res.negotiate(err);
                        }
                        //sails.log.info('Pokemon creado: ', createdPokemon);
                        // Response code 200
                        //return res.ok('Satisfactorio :)');
                        //  return res.ok('Pokemon creado correctamente');
                        return res.redirect('/cuenta')
                    });
            });
        }
    },
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
    }

};
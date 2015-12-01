/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        nombre: {
            type: 'string'
        },
        usuario: {
            type: 'string'
        },
        password: {
            type: 'string',
            defaultsTo: '123456'
        },
        nivelAcceso:{
            type:'integer',
            defaultsTo: 0
        },
        //copia de Usuarios del Proyecto ArchivoSesion
        avatarUrl: {
            type:'string',
            unique: true
            //defaultsTo: ''
        },
        avatarFd: {
            type: 'string',
            unique: true
            //defaultsTo: ''
        },
        url: {
            type: 'string',
            unique: true
           // defaultsTo: ''
        },
        misPokemon: {
            collection: 'Pokemons',//con lla tabl auqe esta relacionado
            via: 'owner'//campo con el que esta relacionado 
        }
    }
};
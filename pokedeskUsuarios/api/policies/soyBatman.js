/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
/*The keyword require is used in Node.js to import modules.
module.exports permite que las funciones dentro se puedan importar para otros archivos 
en el futuro
*/
module.exports = function(req, res, next) {

  // User is allowed, proceed to the next policy, 
  // or if this is the last policy, the controller
    
    //Returns the value of all parameters sent in the request, merged together into a  single object. Includes parameters parsed from the url path, the query string, and the request body
    var params=req.allParams();
    console.log("es batman: "+ params.nuevaPolitica);
    
  if (params.nuevaPolitica) {
    return next();
  }

  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
  return res.badRequest('NO ERES BATMAN');
};

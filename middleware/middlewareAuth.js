const jwt = require('jsonwebtoken');
const config = require('config');

function auth(req,res,next) {

 const token = req.header('x-auth-token');
 if(!token) return res.status(401).send('invalid token');

 try{
 const decode = jwt.verify(token,config.get('jwtPrivateKey')); // verify will remove the auth headers and extract the payload
    
 req.user = decode; // res.user can use accessed in other routers,now req.user has _id property and time of writing 
            
 next();
 }
 catch(error){
    res.status(400).send('token varification failed, u have no permission to access the resourses');
 }
}
module.exports = auth;


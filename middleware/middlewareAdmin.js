module.exports = function(req,res,next){

if(!req.user.isAdmin) return res.status(403).send('user not authorised to perform this action'); 
if(req.user.isAdmin==false) return res.status(403).send('not authorised-only admin have rights'); 
next();
  //403 forbidden, 402 un-authorised
}
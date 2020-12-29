const User = require('../../../models/users');


module.exports.create =  function(req, res)
{
    User.findOne({email: req.body.email}, function(err, user)
    {
        if(err)
        {
            console.log(err);
            return;
        }    
        if(!user)
        {
            User.create(req.body, function(err, user)
            {
                if(err)
                {
                    return;
                }
                return res.json({
                    user
                })
            });
        }
    });
    console.log(req.body);
}
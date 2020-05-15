module.exports.setFlash=function(req,res,next)
{
    res.locals.flash={
        'success_message':req.flash('success'),
        'error_message':req.flash('error')
    }
    next();
}
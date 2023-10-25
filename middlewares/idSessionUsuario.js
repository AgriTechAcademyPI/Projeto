function idSessionUsuario(req, res, next){
    if(req.session.user != undefined){
        return res.json(req.session.user.id)
    }
    next()
}

module.exports = idSessionUsuario
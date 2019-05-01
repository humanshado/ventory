exports.onlyAuthorized = (req, res, next) => {
    console.log('req.user in onlyAuthorized function: ', req.user);
    console.log('req.isAuthenticated: ', req.isAuthenticated());
    console.log('req originalUrl in onlyAuthorized function: ', req.originalUrl);

    req.session.returnTo = req.originalUrl;
    if(req.isAuthenticated()){ return next(); }
    req.flash('error_msg', 'Access denied! Please login');
    res.redirect('/login');
}

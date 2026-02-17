exports.profile = (req, res) => { res.send('user profile ' + req.params.id); };
exports.follow = (req, res) => { res.send('follow ' + req.params.id); };
exports.unfollow = (req, res) => { res.send('unfollow ' + req.params.id); };

const jwt = require('jsonwebtoken');

const MiddlewareController = {

    verifyToken: (req, res, next) => {
        try {
            const token = req.header('authorization');
            if (token) {
                // 'Beaer [token]'
                const accessToken = token.split(" ")[1];
                jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
                    if (err) {
                        return res.status(403).json({
                            message: "Token is not valid",
                            statusCode: 4003
                        });
                    }
                    // Trả về user
                    req.user = user;
                    next();
                });
            }
            else {
                return res.status(401).json({
                    message: "You're not authenticated",
                    statusCode: 4001
                });
            }
        }
        catch (err) {
            next(err);
        }
    },

    verifyTokenByMySelf: (req, res, next) => {
        try {
            MiddlewareController.verifyToken(req, res, () => {
                if (req.user.id === req.params.id || req.user.username === req.body.username || req.user.id === req.body.id) {
                    next();
                }
                else {
                    return res.status(403).json({
                        message: 'You are not allowed to do this action',
                        statusCode: 4004
                    });
                }
            })
        }
        catch (err) {
            next(err);
        }
    },

    verifySecurity: (req, res, next) => {
        try {
            const appKey = req.query.appKey;
            const appId = req.query.appId;
            if (appKey && appId && appKey === process.env.APP_KEY && appId === process.env.APP_ID) {
                req.isAuthenticated = true;
                next();
            }
            else {
                return res.status(401).json({
                    message: "You do not have permission to access this app",
                    statusCode: 9000
                });
            }
        }
        catch (err) {
            next(err);
        }
    }

}

module.exports = MiddlewareController;
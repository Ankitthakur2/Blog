const { validateToken } = require("../services/authentication");

function checkForAuthenticationCookie(cookiesName){
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookiesName];

        if(!tokenCookieValue){
            return next();
        }

        try {
            const userPayload = validateToken(tokenCookieValue);
             req.user = userPayload;
        } catch (error) {}
       return next();
    };
}

module.exports = {
  checkForAuthenticationCookie,
};
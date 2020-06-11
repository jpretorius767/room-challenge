const basicAuth = () => {
    return (req, res, next) => {
      if (req.headers['content-type'] !== 'application/json') {
        return res.status(400).send('Server requires application/json')
      } else {
        if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
          return res.status(403).json({ message: 'Missing Authorization Header' });
        }
      }
      next();
    }
}

module.exports = basicAuth;
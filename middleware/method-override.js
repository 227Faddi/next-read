export default {
  get: function (req, res, next) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      let method = req.body._method
      delete req.body._method
      req.method = method.toUpperCase();
    }
    next()
  },
}
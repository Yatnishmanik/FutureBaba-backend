module.exports = (req, res, next) => {
    const { name, dob, country } = req.body;
  
    if (!name || !dob || !country) {
      return res.status(400).json({ message: 'Invalid request parameters' });
    }
  
    next();
  };
  
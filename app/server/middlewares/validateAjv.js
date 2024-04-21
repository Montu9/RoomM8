const validateAjv = (ajvValidate) => {
    return (req, res, next) => {
        const valid = ajvValidate(req.body);
        if (!valid) {
            const errors = ajvValidate.errors;
            return res.status(400).json({ message: errors[0]?.message });
        }
        next();
    };
};

module.exports = validateAjv;

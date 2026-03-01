import jwt from 'jsonwebtoken';

const generateToken = (id) => {
    // Falls back to a default secret if JWT_SECRET is not set in .env
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_healthymotive123', {
        expiresIn: '30d',
    });
};

export default generateToken;

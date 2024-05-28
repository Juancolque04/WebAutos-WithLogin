import jwt from 'jsonwebtoken';

export const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Extracción del token después de 'Bearer'
        jwt.verify(token, 'your_secret_key', (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Token inválido' });
            }
            req.user = decoded;
            next();
        });
    } else {
        res.status(401).json({ message: 'Token de acceso no proporcionado' });
    }
};
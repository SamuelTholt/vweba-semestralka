import jwt from 'jsonwebtoken';

export const adminMiddleware = (req, res, next) => {
    const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(401).send({ message: "Chyba overenia totoznosti." });
  }

    try {
        const decoded = jwt.verify(token, process.env.API_KEY);
        req.user = decoded; 
        if (req.user.userRole !== 'admin') {
            return res.status(403).json({ error: 'Nemáte oprávnenie na túto akciu!' });
        }

        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ error: 'Token nie je platný alebo vypršaný' });
    }
};

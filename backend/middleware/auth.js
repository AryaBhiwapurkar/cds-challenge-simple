const admin = require('firebase-admin');
const User = require('../models/User');  // ⬅️ new line

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

// Middleware: verify Firebase ID token from Authorization header
async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const match = authHeader.match(/^Bearer (.*)$/);
  if (!match) return res.status(401).json({ message: 'No token provided' });

  const idToken = match[1];
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);

    // Check user in MongoDB
    let user = await User.findOne({ uid: decoded.uid });
    if (!user) {
      // create new entry if first login
      user = await User.create({
        uid: decoded.uid,
        email: decoded.email,
        isAdmin: false
      });
    }

    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      role: user.isAdmin ? 'admin' : 'user',
      claims: decoded
    };

    next();
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = { verifyToken, admin };

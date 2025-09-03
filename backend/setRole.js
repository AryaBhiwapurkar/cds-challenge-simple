require('dotenv').config();
const admin = require('firebase-admin');

const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const uid = process.argv[2];
const role = process.argv[3] || 'user';

if (!uid) {
  console.error('Usage: node setRole.js <uid> [role]');
  process.exit(1);
}

admin.auth().setCustomUserClaims(uid, { role })
  .then(() => {
    console.log(`Set role=${role} for user ${uid}`);
    process.exit(0);
  })
  .catch(err => {
    console.error('Error setting custom claims', err);
    process.exit(1);
  });

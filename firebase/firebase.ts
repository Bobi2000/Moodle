import admin from "firebase-admin";

const serviceAccount = require("./moodle-c38f9-ff99201326e2.json");

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error: any) {
    console.log("Firebase admin initialization error", error.stack);
  }
}
export default admin.firestore();

// const { initializeApp, cert } = require("firebase-admin/app");
// const { getFirestore } = require("firebase-admin/firestore");

// const serviceAccount = require("./moodle-c38f9-ff99201326e2.json");

// function StartFirebase() {

//   const app = initializeApp({
//     credential: cert(serviceAccount),
//   });

//   return getFirestore(app);
// }

// export default StartFirebase;
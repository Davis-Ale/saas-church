import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyCexwrdSMZkqeQByLzGoKZeBw2sAVGGm70",
  authDomain: "saas-church.firebaseapp.com",
  projectId: "saas-church",
};

// Use a real user that exists in Firebase Auth
const EMAIL = "test@saaschurch.com";
const PASSWORD = "123456";

async function main() {
  const app = initializeApp(firebaseConfig);

  const auth = getAuth(app);
  await signInWithEmailAndPassword(auth, EMAIL, PASSWORD);

  const functions = getFunctions(app, "us-central1");
  const createChurch = httpsCallable(functions, "createChurch");

  const response = await createChurch({
    name: "Igreja Teste MVP",
    country: "BR",
  });

  console.log("Function response:", response.data);
}

main().catch((err) => {
  console.error("TEST ERROR:", err);
  process.exit(1);
});

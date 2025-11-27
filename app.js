// ==================== CONFIGURAZIONE FIREBASE ====================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyClWax8u93Vd7zrl72cv2KCK6VvcXRmPwY",
  authDomain: "sitoweb-mattia.firebaseapp.com",
  projectId: "sitoweb-mattia",
  storageBucket: "sitoweb-mattia.firebasestorage.app",
  messagingSenderId: "399052456390",
  appId: "1:399052456390:web:ce725538e9fc7b1af572c7"
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ==================== LOGIN ====================
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Salva login su Firestore
      await addDoc(collection(db, "logins"), {
        userId: user.uid,
        email: user.email,
        timestamp: new Date(),
        action: "login"
      });

      window.location.href = "sito.html";

    } catch (error) {
      document.getElementById("message").innerText = error.message;
    }
  });
}

// ==================== REGISTRAZIONE ====================
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await addDoc(collection(db, "logins"), {
        userId: user.uid,
        email: user.email,
        timestamp: new Date(),
        action: "registrazione"
      });

      window.location.href = "sito.html";

    } catch (error) {
      document.getElementById("regMessage").innerText = error.message;
    }
  });
}

// ==================== MENU PROFILO ====================
const userProfile = document.getElementById("userProfile");
const profileMenu = document.getElementById("profileMenu");

if (userProfile) {
  userProfile.addEventListener("click", (e) => {
    e.stopPropagation(); // evita chiusura immediata
    profileMenu.style.display = profileMenu.style.display === "block" ? "none" : "block";
  });
}

// Chiudi menu cliccando fuori
document.addEventListener("click", () => {
  if(profileMenu) profileMenu.style.display = "none";
});

// Mostra nome utente loggato
onAuthStateChanged(auth, (user) => {
  const profileName = document.getElementById("profileName");
  if(user && profileName){
    profileName.innerText = `Ciao, ${user.email}`;
  }
});

// ==================== LOGOUT ====================
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async (e) => {
    e.stopPropagation(); // evita problemi con il toggle
    await signOut(auth);
    window.location.href = "login.html"; // o index.html
  });
}

// ==================== CONTROLLO SESSIONE ====================
onAuthStateChanged(auth, (user) => {
  const currentPage = window.location.pathname;
  if (!user && currentPage.includes("sito.html")) {
    window.location.href = "login.html";
  }
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


/* =========================
   FIREBASE
========================= */

const firebaseConfig = {
  apiKey: "AIzaSyBJleOE7G-_-6_9pyoYFKMVUrFOxJwseVE",
  authDomain: "cinezo-1d2ad.firebaseapp.com",
  projectId: "cinezo-1d2ad",
  storageBucket: "cinezo-1d2ad.firebasestorage.app",
  messagingSenderId: "581701323761",
  appId: "1:581701323761:web:da70c2de46c438af021250",
  measurementId: "G-LSM6CLHTG5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


/* =========================
   VARIABLES
========================= */

let myList = [];
let selectedMovie = "";


/* =========================
   MOVIE CATALOGUE
========================= */

const movieData = {

  "Dark World": {
    category: "Thriller",
    info: "⭐ 8.4 • 2026 • 2h 10m",
    description:
      "A mysterious world hides secrets waiting to be discovered. Follow the journey into a world full of mystery and unexpected moments.",
    poster: "posters/dark-world-poster.png",
    video: "videos/dark-world.mp4"
  },

  "Action Hero": {
    category: "Action",
    info: "⭐ 8.7 • 2026 • 1h 55m",
    description:
      "An action-packed adventure filled with challenges, speed and exciting moments.",
    poster: "posters/action-hero-poster.png",
    video: "videos/action-hero.mp4"
  },

  "Night Mystery": {
    category: "Thriller",
    info: "⭐ 8.1 • 2026 • 2h 05m",
    description:
      "A mysterious night begins an unforgettable journey where every moment brings a new secret.",
    poster: "posters/night-mystery-poster.png",
    video: "videos/night-mystery.mp4"
  },

  "Last Warrior": {
    category: "Action",
    info: "⭐ 8.6 • 2026 • 2h 02m",
    description:
      "A warrior faces his biggest challenge and must find the courage to move forward.",
    poster: "",
    video: "videos/demo.mp4"
  },

  "Speed Force": {
    category: "Action",
    info: "⭐ 8.3 • 2026 • 1h 48m",
    description:
      "Speed, competition and adventure come together in an exciting journey.",
    poster: "",
    video: "videos/demo.mp4"
  },

  "Broken Dreams": {
    category: "Drama",
    info: "⭐ 8.8 • 2026 • 2h 15m",
    description:
      "A powerful story about dreams, determination and finding a way forward.",
    poster: "",
    video: "videos/demo.mp4"
  },

  "The Journey": {
    category: "Drama",
    info: "⭐ 8.5 • 2026 • 1h 52m",
    description:
      "Every journey has a story. A simple beginning leads to an unforgettable adventure.",
    poster: "",
    video: "videos/demo.mp4"
  },

  "Crazy Friends": {
    category: "Comedy",
    info: "⭐ 8.2 • 2026 • 1h 40m",
    description:
      "A group of friends gets into hilarious situations and creates unforgettable memories.",
    poster: "",
    video: "videos/demo.mp4"
  },

  "Funny Night": {
    category: "Comedy",
    info: "⭐ 8.0 • 2026 • 1h 35m",
    description:
      "One crazy night turns into a collection of funny and unexpected moments.",
    poster: "",
    video: "videos/demo.mp4"
  },

  "Cinezo Originals": {
    category: "Original",
    info: "⭐ 9.0 • 2026 • HD",
    description:
      "Exclusive original stories made for Cinezo. Discover your next story.",
    poster: "",
    video: "videos/demo.mp4"
  }

};


/* =========================
   OPEN MOVIE
========================= */

function openMovie(name) {

  selectedMovie = name;

  const movie = movieData[name] || {};

  const title =
    document.getElementById("movieTitle");

  const info =
    document.getElementById("movieInfo");

  const description =
    document.getElementById("movieDescription");

  const detailPoster =
    document.getElementById("detailPoster");

  const player =
    document.getElementById("videoPlayer");

  if (title) {
    title.textContent = name;
  }

  if (info) {
    info.textContent =
      movie.info || "2026 • HD";
  }

  if (description) {
    description.textContent =
      movie.description ||
      "Welcome to Cinezo. Your world of stories.";
  }

  if (detailPoster) {

    if (movie.poster) {

      detailPoster.style.backgroundImage =
        `url("${movie.poster}")`;

      detailPoster.style.backgroundSize =
        "cover";

      detailPoster.style.backgroundPosition =
        "center";

      detailPoster.textContent = "";

    } else {

      detailPoster.style.backgroundImage = "";

      detailPoster.textContent = "🎬";

    }
  }

  if (player) {

    player.pause();

    player.removeAttribute("src");

    player.load();

    player.style.display = "none";

  }

  const modal =
    document.getElementById("modal");

  if (modal) {
    modal.style.display = "flex";
  }
}


/* =========================
   CLOSE MOVIE
========================= */

function closeMovie() {

  const modal =
    document.getElementById("modal");

  const player =
    document.getElementById("videoPlayer");

  if (player) {

    player.pause();

    player.removeAttribute("src");

    player.load();

    player.style.display = "none";
  }

  if (modal) {
    modal.style.display = "none";
  }
}


/* =========================
   PLAY MOVIE
========================= */

function playSelectedMovie() {

  const player =
    document.getElementById("videoPlayer");

  if (!player) {

    alert("Video player nahi mila.");

    return;
  }

  const movie =
    movieData[selectedMovie];

  const videoPath =
    movie && movie.video
      ? movie.video
      : "videos/demo.mp4";

  console.log(
    "Cinezo playing:",
    selectedMovie,
    videoPath
  );

  player.style.display = "block";

  player.controls = true;

  player.playsInline = true;

  player.src = videoPath;

  player.load();

  player.play()
    .then(() => {

      console.log(
        "Video started successfully."
      );

    })
    .catch(error => {

      console.log(
        "Autoplay blocked:",
        error
      );

      alert(
        "Video ready hai. ▶ Play button dabao."
      );

    });
}


/* =========================
   SEARCH
========================= */

function searchMovies() {

  const inputElement =
    document.getElementById("searchInput");

  if (!inputElement) return;

  const input =
    inputElement.value
      .toLowerCase()
      .trim();

  const cards =
    document.querySelectorAll(".movie-card");

  cards.forEach(card => {

    const name =
      (card.dataset.name || "")
        .toLowerCase();

    const category =
      (card.dataset.category || "")
        .toLowerCase();

    const match =
      input === "" ||
      name.includes(input) ||
      category.includes(input);

    card.style.display =
      match ? "" : "none";
  });
}


/* =========================
   CATEGORY FILTER
========================= */

function filterCategory(category) {

  const cards =
    document.querySelectorAll(".movie-card");

  const selected =
    category.toLowerCase();

  cards.forEach(card => {

    const cardCategory =
      (card.dataset.category || "")
        .toLowerCase();

    if (
      selected === "all" ||
      cardCategory === selected
    ) {

      card.style.display = "";

    } else {

      card.style.display = "none";

    }
  });
}


/* =========================
   FIRESTORE SAVE
========================= */

async function saveMyList() {

  const user =
    auth.currentUser;

  if (!user) return;

  try {

    await setDoc(
      doc(db, "users", user.uid),
      {
        myList: myList
      },
      {
        merge: true
      }
    );

    console.log(
      "My List saved successfully."
    );

  } catch (error) {

    console.error(
      "My List save error:",
      error
    );

  }
}


/* =========================
   FIRESTORE LOAD
========================= */

async function loadMyList() {

  const user =
    auth.currentUser;

  if (!user) {

    myList = [];

    displayMyList();

    return;
  }

  try {

    const userDoc =
      await getDoc(
        doc(db, "users", user.uid)
      );

    if (userDoc.exists()) {

      const data =
        userDoc.data();

      myList =
        Array.isArray(data.myList)
          ? data.myList
          : [];

    } else {

      myList = [];

    }

    displayMyList();

  } catch (error) {

    console.error(
      "My List load error:",
      error
    );

  }
}


/* =========================
   ADD TO MY LIST
========================= */

async function addToList(name) {

  if (!auth.currentUser) {

    alert(
      "Please login first 🔐"
    );

    openAuth();

    return;
  }

  if (!myList.includes(name)) {

    myList.push(name);

    await saveMyList();

    alert(
      name +
      " added to My List ❤️"
    );

  } else {

    alert(
      name +
      " is already in My List ❤️"
    );
  }

  displayMyList();
}


/* =========================
   REMOVE FROM MY LIST
========================= */

async function removeFromList(name) {

  myList =
    myList.filter(
      movie => movie !== name
    );

  await saveMyList();

  displayMyList();
}


/* =========================
   DISPLAY MY LIST
========================= */

function displayMyList() {

  const section =
    document.getElementById(
      "myListSection"
    );

  const container =
    document.getElementById(
      "myListContainer"
    );

  if (!section || !container) {
    return;
  }

  section.style.display = "block";

  container.innerHTML = "";

  if (myList.length === 0) {

    container.innerHTML = `
      <div class="card">
        <h3>My List is Empty ❤️</h3>
        <p>Add movies to watch later.</p>
      </div>
    `;

    section.scrollIntoView({
      behavior: "smooth"
    });

    return;
  }

  myList.forEach(name => {

    const movie =
      movieData[name] || {};

    const card =
      document.createElement("div");

    card.className =
      "card movie-card";

    let posterHTML = "";

    if (movie.poster) {

      posterHTML = `
        <div
          class="poster poster-image"
          style="background-image:url('${movie.poster}');">
        </div>
      `;

    } else {

      posterHTML = `
        <div class="poster poster2">
          🎬
        </div>
      `;
    }

    card.innerHTML = `
      ${posterHTML}

      <h3>${name}</h3>

      <p>${movie.info || "2026 • HD"}</p>

      <small>
        ${movie.category || "Entertainment"}
      </small>

      <button onclick="openMovie('${name}')">
        ▶ Play
      </button>

      <button onclick="removeFromList('${name}')">
        ❌ Remove
      </button>
    `;

    container.appendChild(card);

  });

  section.scrollIntoView({
    behavior: "smooth"
  });
}


/* =========================
   PROFILE
========================= */

function showProfile() {

  const profile =
    document.getElementById(
      "profileSection"
    );

  if (profile) {

    profile.scrollIntoView({
      behavior: "smooth"
    });

  }
}


function editProfile() {

  const name =
    prompt(
      "Enter your Cinezo profile name:"
    );

  if (!name) return;

  const cleanName =
    name.trim();

  if (!cleanName) return;

  const profileName =
    document.getElementById(
      "profileName"
    );

  if (profileName) {

    profileName.textContent =
      cleanName;

  }

  localStorage.setItem(
    "cinezoProfileName",
    cleanName
  );
}


/* =========================
   AUTH MODAL
========================= */

function openAuth() {

  const modal =
    document.getElementById(
      "authModal"
    );

  if (modal) {

    modal.style.display =
      "flex";

  }

  showLogin();
}


function closeAuth() {

  const modal =
    document.getElementById(
      "authModal"
    );

  if (modal) {

    modal.style.display =
      "none";

  }
}


function showSignup() {

  const title =
    document.getElementById(
      "authTitle"
    );

  const message =
    document.getElementById(
      "authMessage"
    );

  if (title) {

    title.textContent =
      "Create Cinezo Account";

  }

  if (message) {

    message.textContent =
      "Create your account 🎬";

  }

  const button =
    document.querySelector(
      ".auth-button"
    );

  const switchButton =
    document.querySelector(
      ".switch-auth"
    );

  if (button) {

    button.textContent =
      "📝 Sign Up";

    button.onclick =
      signupUser;

  }

  if (switchButton) {

    switchButton.textContent =
      "Already have an account? Login";

    switchButton.onclick =
      showLogin;

  }
}


function showLogin() {

  const title =
    document.getElementById(
      "authTitle"
    );

  const message =
    document.getElementById(
      "authMessage"
    );

  if (title) {

    title.textContent =
      "Login to Cinezo";

  }

  if (message) {

    message.textContent =
      "Welcome back! 🎬";

  }

  const button =
    document.querySelector(
      ".auth-button"
    );

  const switchButton =
    document.querySelector(
      ".switch-auth"
    );

  if (button) {

    button.textContent =
      "🔐 Login";

    button.onclick =
      loginUser;

  }

  if (switchButton) {

    switchButton.textContent =
      "New user? Create account";

    switchButton.onclick =
      showSignup;

  }
}


/* =========================
   SIGN UP
========================= */

async function signupUser() {

  const email =
    document.getElementById(
      "authEmail"
    ).value.trim();

  const password =
    document.getElementById(
      "authPassword"
    ).value;

  if (!email || !password) {

    alert(
      "Email aur password enter karo."
    );

    return;
  }

  try {

    await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    alert(
      "Account successfully created 🎉"
    );

    closeAuth();

  } catch (error) {

    alert(
      "Signup error: " +
      error.message
    );
  }
}


/* =========================
   LOGIN
========================= */

async function loginUser() {

  const email =
    document.getElementById(
      "authEmail"
    ).value.trim();

  const password =
    document.getElementById(
      "authPassword"
    ).value;

  if (!email || !password) {

    alert(
      "Email aur password enter karo."
    );

    return;
  }

  try {

    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    alert(
      "Login successful 🎉"
    );

    closeAuth();

  } catch (error) {

    alert(
      "Login error: " +
      error.message
    );
  }
}


/* =========================
   LOGOUT
========================= */

async function logoutUser() {

  try {

    await signOut(auth);

    myList = [];

    alert(
      "Logged out successfully 👋"
    );

  } catch (error) {

    alert(
      "Logout error: " +
      error.message
    );
  }
}


/* =========================
   AUTH STATE
========================= */

onAuthStateChanged(
  auth,
  async user => {

    if (user) {

      console.log(
        "Logged in:",
        user.email
      );

      await loadMyList();

      const profileName =
        document.getElementById(
          "profileName"
        );

      if (profileName) {

        const savedName =
          localStorage.getItem(
            "cinezoProfileName"
          );

        profileName.textContent =
          savedName ||
          user.email.split("@")[0];

      }

    } else {

      console.log(
        "User not logged in"
      );

      myList = [];

      displayMyList();
    }

  }
);


/* =========================
   LOAD PROFILE NAME
========================= */

window.addEventListener(
  "DOMContentLoaded",
  () => {

    const savedName =
      localStorage.getItem(
        "cinezoProfileName"
      );

    if (savedName) {

      const profileName =
        document.getElementById(
          "profileName"
        );

      if (profileName) {

        profileName.textContent =
          savedName;

      }
    }
  }
);


/* =========================
   MODAL CLICK
========================= */

window.addEventListener(
  "click",
  event => {

    const movieModal =
      document.getElementById(
        "modal"
      );

    const authModal =
      document.getElementById(
        "authModal"
      );

    if (
      movieModal &&
      event.target === movieModal
    ) {

      closeMovie();

    }

    if (
      authModal &&
      event.target === authModal
    ) {

      closeAuth();

    }

  }
);


/* =========================
   WINDOW FUNCTIONS
========================= */

window.openMovie =
  openMovie;

window.closeMovie =
  closeMovie;

window.playSelectedMovie =
  playSelectedMovie;

window.searchMovies =
  searchMovies;

window.filterCategory =
  filterCategory;

window.addToList =
  addToList;

window.removeFromList =
  removeFromList;

window.displayMyList =
  displayMyList;

window.showProfile =
  showProfile;

window.editProfile =
  editProfile;

window.openAuth =
  openAuth;

window.closeAuth =
  closeAuth;

window.showSignup =
  showSignup;

window.showLogin =
  showLogin;

window.signupUser =
  signupUser;

window.loginUser =
  loginUser;

window.logoutUser =
  logoutUser;

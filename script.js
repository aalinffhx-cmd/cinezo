// ===============================
// CINEZO - FINAL SCRIPT
// Firebase + Login Required + My List + Movies
// ===============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ===============================
// FIREBASE CONFIG
// ===============================

const firebaseConfig = {
  apiKey: "AIzaSyBJleOE7G_-6_9pyoYFKMVUrFOxJwseVE",
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


// ===============================
// MOVIE DATA
// ===============================

let movieData = {

  "Dark World": {
    category: "Thriller",
    year: "2026",
    duration: "2h 10m",
    poster: "posters/dark-world-poster.png",
    video: "videos/dark-world.mp4",
    description: "A mysterious world filled with secrets and unexpected twists."
  },

  "Action Hero": {
    category: "Action",
    year: "2026",
    duration: "1h 55m",
    poster: "posters/action-hero-poster.png",
    video: "videos/action-hero.mp4",
    description: "An action-packed journey full of danger and adventure."
  },

  "Night Mystery": {
    category: "Thriller",
    year: "2026",
    duration: "2h 05m",
    poster: "posters/night-mystery-poster.png",
    video: "videos/night-mystery.mp4",
    description: "One night. One mystery. And a secret waiting to be discovered."
  },

  "Last Warrior": {
    category: "Action",
    year: "2026",
    duration: "2h 00m",
    poster: "posters/last-warrior-poster.png",
    video: "videos/last-warrior.mp4",
    description: "A warrior returns for one final mission."
  },

  "Speed Force": {
    category: "Action",
    year: "2026",
    duration: "1h 48m",
    poster: "posters/speed-force-poster.png",
    video: "videos/speed-force.mp4",
    description: "Speed, power and a race against time."
  },

  "Broken Dreams": {
    category: "Drama",
    year: "2026",
    duration: "1h 52m",
    poster: "posters/broken-dreams-poster.png",
    video: "videos/broken-dreams.mp4",
    description: "A story about dreams, struggles and new beginnings."
  },

  "The Journey": {
    category: "Drama",
    year: "2026",
    duration: "1h 45m",
    poster: "posters/the-journey-poster.png",
    video: "videos/the-journey.mp4",
    description: "Every journey has a story."
  },

  "Crazy Friends": {
    category: "Comedy",
    year: "2026",
    duration: "1h 35m",
    poster: "posters/crazy-friends-poster.png",
    video: "videos/crazy-friends.mp4",
    description: "Four friends. Unlimited madness."
  },

  "Funny Night": {
    category: "Comedy",
    year: "2026",
    duration: "1h 30m",
    poster: "posters/funny-night-poster.png",
    video: "videos/funny-night.mp4",
    description: "A crazy night full of laughter."
  },

  "Cinezo Originals": {
    category: "Originals",
    year: "2026",
    duration: "HD",
    poster: "posters/cinezo-originals-poster.png",
    video: "videos/demo.mp4",
    description: "Original entertainment made for Cinezo."
  }

};


// ===============================
// VARIABLES
// ===============================

let selectedMovie = null;
let pendingMovie = null;
let myList = [];


// ===============================
// LOAD ADMIN MOVIES
// ===============================

async function loadAdminMovies() {

  const container =
    document.getElementById("adminMoviesContainer");

  if (!container) return;

  // Firestore movies require login
  if (!auth.currentUser) {
    container.innerHTML = "";
    return;
  }

  try {

    const snapshot =
      await getDocs(collection(db, "movies"));

    container.innerHTML = "";

    snapshot.forEach((movieDoc) => {

      const data = movieDoc.data();

      if (!data.title) return;

      movieData[data.title] = {

        category: data.category || "Other",

        year: data.year || "2026",

        duration: data.duration || "",

        poster: data.poster || "",

        video: data.video || "",

        description:
          data.description ||
          "Watch this movie on Cinezo."

      };

      const card =
        document.createElement("div");

      card.className = "movie-card";

      card.innerHTML = `
        <img
          src="${data.poster || "posters/dark-world-poster.png"}"
          alt="${data.title}"
          onerror="this.style.display='none'"
        >

        <div class="movie-card-info">

          <h3>${data.title}</h3>

          <p>
            ${data.category || "Movie"}
            •
            ${data.year || ""}
          </p>

          <button
            onclick="openMovie('${escapeQuotes(data.title)}')"
          >
            ▶ Play
          </button>

        </div>
      `;

      container.appendChild(card);

    });

  } catch (error) {

    console.log(
      "Admin movies error:",
      error
    );

  }

}


// ===============================
// ESCAPE QUOTES
// ===============================

function escapeQuotes(text) {

  return String(text)
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'");

}


// ===============================
// OPEN MOVIE
// LOGIN REQUIRED
// ===============================

window.openMovie = function(name) {

  // 🔐 LOGIN REQUIRED
  if (!auth.currentUser) {

    pendingMovie = name;

    alert(
      "Movie dekhne ke liye pehle Login karo 🔐"
    );

    window.openAuth();

    return;
  }


  const movie = movieData[name];

  if (!movie) {

    alert("Movie nahi mili.");

    return;
  }


  selectedMovie = name;


  const title =
    document.getElementById("movieTitle");

  const poster =
    document.getElementById("moviePoster");

  const description =
    document.getElementById("movieDescription");

  const details =
    document.getElementById("movieDetails");


  if (title) {

    title.textContent = name;

  }


  if (poster) {

    poster.src = movie.poster || "";

    poster.style.display =
      movie.poster ? "block" : "none";

  }


  if (description) {

    description.textContent =
      movie.description ||
      "Watch this movie on Cinezo.";

  }


  if (details) {

    details.innerHTML = `
      <span>${movie.category || ""}</span>
      <span>${movie.year || ""}</span>
      <span>${movie.duration || ""}</span>
    `;

  }


  const modal =
    document.getElementById("movieModal");


  if (modal) {

    modal.style.display = "flex";

  }

};


// ===============================
// CLOSE MOVIE
// ===============================

window.closeMovie = function() {

  const modal =
    document.getElementById("movieModal");

  if (modal) {

    modal.style.display = "none";

  }


  const video =
    document.getElementById("movieVideo");


  if (video) {

    video.pause();

    video.removeAttribute("src");

    video.load();

  }


  selectedMovie = null;

};


// ===============================
// PLAY SELECTED MOVIE
// ===============================

window.playSelectedMovie = function() {

  if (!selectedMovie) return;


  // 🔐 LOGIN REQUIRED
  if (!auth.currentUser) {

    pendingMovie = selectedMovie;

    window.closeMovie();

    alert(
      "Movie play karne ke liye pehle Login karo 🔐"
    );

    window.openAuth();

    return;

  }


  const movie =
    movieData[selectedMovie];


  if (!movie || !movie.video) {

    alert(
      "Is movie ka video available nahi hai."
    );

    return;

  }


  const video =
    document.getElementById("movieVideo");


  if (!video) {

    alert("Video player nahi mila.");

    return;

  }


  video.src = movie.video;

  video.style.display = "block";

  video.load();


  video.play().catch(() => {

    alert(
      "Video play karne ke liye Play button dabao."
    );

  });

};


// ===============================
// AUTH MODAL
// ===============================

window.openAuth = function() {

  const modal =
    document.getElementById("authModal");


  if (modal) {

    modal.style.display = "flex";

  }


  window.showLogin();

};


window.closeAuth = function() {

  const modal =
    document.getElementById("authModal");


  if (modal) {

    modal.style.display = "none";

  }

};


// ===============================
// SHOW LOGIN
// ===============================

window.showLogin = function() {

  const login =
    document.getElementById("loginForm");

  const signup =
    document.getElementById("signupForm");


  if (login) {

    login.style.display = "block";

  }


  if (signup) {

    signup.style.display = "none";

  }

};


// ===============================
// SHOW SIGNUP
// ===============================

window.showSignup = function() {

  const login =
    document.getElementById("loginForm");

  const signup =
    document.getElementById("signupForm");


  if (login) {

    login.style.display = "none";

  }


  if (signup) {

    signup.style.display = "block";

  }

};


// ===============================
// SIGN UP
// ===============================

window.signupUser = async function() {

  const email =
    document
      .getElementById("signupEmail")
      ?.value
      .trim();


  const password =
    document
      .getElementById("signupPassword")
      ?.value;


  if (!email || !password) {

    alert(
      "Email aur password dono bharo."
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
      "Account successfully create ho gaya 🎉"
    );


    window.closeAuth();


  } catch (error) {

    console.log(error);

    alert(
      getAuthError(error)
    );

  }

};


// ===============================
// LOGIN
// ===============================

window.loginUser = async function() {

  const email =
    document
      .getElementById("loginEmail")
      ?.value
      .trim();


  const password =
    document
      .getElementById("loginPassword")
      ?.value;


  if (!email || !password) {

    alert(
      "Email aur password dono bharo."
    );

    return;

  }


  try {

    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );


    window.closeAuth();


    alert(
      "Login successful 🔐"
    );


    // Login ke baad wahi movie open hogi
    if (pendingMovie) {

      const movieName =
        pendingMovie;

      pendingMovie = null;


      setTimeout(() => {

        window.openMovie(
          movieName
        );

      }, 300);

    }


  } catch (error) {

    console.log(error);

    alert(
      getAuthError(error)
    );

  }

};


// ===============================
// LOGOUT
// ===============================

window.logoutUser = async function() {

  try {

    await signOut(auth);

    alert(
      "Logout ho gaya."
    );

  } catch (error) {

    console.log(error);

  }

};


// ===============================
// FIREBASE ERROR
// ===============================

function getAuthError(error) {

  if (!error || !error.code) {

    return "Kuch error aa gaya.";

  }


  switch (error.code) {

    case "auth/invalid-email":

      return "Email galat hai.";


    case "auth/user-not-found":

      return "Is email ka account nahi mila.";


    case "auth/wrong-password":

      return "Password galat hai.";


    case "auth/invalid-credential":

      return "Email ya password galat hai.";


    case "auth/email-already-in-use":

      return "Is email se account pehle se bana hua hai.";


    case "auth/weak-password":

      return "Password kam se kam 6 characters ka rakho.";


    default:

      return (
        error.message ||
        "Authentication error."
      );

  }

}


// ===============================
// LOAD MY LIST
// ===============================

async function loadMyList() {

  if (!auth.currentUser) {

    myList = [];

    displayMyList();

    return;

  }


  try {

    const ref =
      doc(
        db,
        "users",
        auth.currentUser.uid
      );


    const snap =
      await getDoc(ref);


    if (snap.exists()) {

      myList =
        snap.data().myList || [];

    } else {

      myList = [];

    }


    displayMyList();


  } catch (error) {

    console.log(
      "My List error:",
      error
    );

  }

}


// ===============================
// SAVE MY LIST
// ===============================

async function saveMyList() {

  if (!auth.currentUser) return;


  try {

    await setDoc(

      doc(
        db,
        "users",
        auth.currentUser.uid
      ),

      {
        myList: myList
      },

      {
        merge: true
      }

    );

  } catch (error) {

    console.log(
      "Save My List error:",
      error
    );

  }

}


// ===============================
// ADD TO MY LIST
// ===============================

window.addToMyList = async function(name) {

  if (!auth.currentUser) {

    alert(
      "My List use karne ke liye Login karo 🔐"
    );

    window.openAuth();

    return;

  }


  if (!myList.includes(name)) {

    myList.push(name);

    await saveMyList();

    displayMyList();


    alert(
      "My List me add ho gaya ❤️"
    );


  } else {

    alert(
      "Ye movie already My List me hai."
    );

  }

};


// ===============================
// REMOVE FROM MY LIST
// ===============================

window.removeFromMyList = async function(name) {

  myList =
    myList.filter(
      item => item !== name
    );


  await saveMyList();

  displayMyList();

};


// ===============================
// DISPLAY MY LIST
// ===============================

function displayMyList() {

  const container =
    document.getElementById(
      "myListContainer"
    );


  if (!container) return;


  container.innerHTML = "";


  if (!myList.length) {

    container.innerHTML =
      `<p class="empty-list">
        Your List is empty ❤️
      </p>`;

    return;

  }


  myList.forEach(name => {

    const movie =
      movieData[name];


    if (!movie) return;


    const card =
      document.createElement("div");


    card.className =
      "movie-card";


    card.innerHTML = `
      <img
        src="${movie.poster || ""}"
        alt="${name}"
      >

      <div class="movie-card-info">

        <h3>${name}</h3>

        <p>${movie.category || ""}</p>

        <button
          onclick="openMovie('${escapeQuotes(name)}')"
        >
          ▶ Play
        </button>

        <button
          onclick="removeFromMyList('${escapeQuotes(name)}')"
        >
          Remove
        </button>

      </div>
    `;


    container.appendChild(card);

  });

}


// ===============================
// SEARCH
// ===============================

window.searchMovies = function() {

  const input =
    document.getElementById(
      "searchInput"
    );


  if (!input) return;


  const query =
    input.value
      .trim()
      .toLowerCase();


  const cards =
    document.querySelectorAll(
      ".movie-card"
    );


  cards.forEach(card => {

    const text =
      card.innerText
        .toLowerCase();


    card.style.display =
      text.includes(query)
        ? ""
        : "none";

  });

};


// ===============================
// CATEGORY FILTER
// ===============================

window.filterCategory = function(category) {

  const cards =
    document.querySelectorAll(
      ".movie-card"
    );


  cards.forEach(card => {

    const text =
      card.innerText
        .toLowerCase();


    if (
      category === "All" ||
      text.includes(
        category.toLowerCase()
      )
    ) {

      card.style.display = "";

    } else {

      card.style.display = "none";

    }

  });

};


// ===============================
// PROFILE
// ===============================

window.openProfile = function() {

  const profile =
    document.getElementById(
      "profileSection"
    );


  if (profile) {

    profile.style.display = "block";


    profile.scrollIntoView({
      behavior: "smooth"
    });

  }

};


// ===============================
// AUTH STATE
// ===============================

onAuthStateChanged(
  auth,
  async (user) => {

    const loginButton =
      document.getElementById(
        "loginButton"
      );


    if (user) {

      console.log(
        "Logged in:",
        user.email
      );


      if (loginButton) {

        loginButton.textContent =
          "👤 Logout";


        loginButton.onclick =
          window.logoutUser;

      }


      await loadMyList();

      await loadAdminMovies();


    } else {

      console.log(
        "User logged out"
      );


      if (loginButton) {

        loginButton.textContent =
          "👤 Login";


        loginButton.onclick =
          window.openAuth;

      }


      myList = [];

      displayMyList();

    }

  }
);


// ===============================
// CLOSE MODALS ON OUTSIDE CLICK
// ===============================

window.addEventListener(
  "click",
  function(event) {

    const movieModal =
      document.getElementById(
        "movieModal"
      );


    const authModal =
      document.getElementById(
        "authModal"
      );


    if (
      movieModal &&
      event.target === movieModal
    ) {

      window.closeMovie();

    }


    if (
      authModal &&
      event.target === authModal
    ) {

      window.closeAuth();

    }

  }
);


// ===============================
// START
// ===============================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    displayMyList();

    console.log(
      "🎬 CINEZO READY"
    );

  }
);

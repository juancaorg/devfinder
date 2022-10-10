// NOTE: Unauthorized users (user is determined by his IP)
// can make up to 60 requests per hour, give or take.
// Keep this in mind when fetching data from the GH API.
// Credit to @adamstafa's answer in this GH issue:
// https://github.com/Cloud-CV/EvalAI/issues/1373

// To be rendered selectors.
const devPic = document.querySelector(".main__result--pfp");
const devName = document.querySelector(".main__result--name");
const devUsername = document.querySelector(".main__result--username");
const devJoinDate = document.querySelector(".main__result--date");
const devBio = document.querySelector(".main__result--bio");
const devRepos = document.getElementById("main__result--stats-repos");
const devFollowers = document.getElementById("main__result--stats-followers");
const devFollowing = document.getElementById("main__result--stats-following");
const devLocation = document.querySelector(".main__result--data-location>span");
const devWebsite = document.querySelector(".main__result--data-website>a");
const devTwitter = document.querySelector(".main__result--data-twitter>a");
const devCompany = document.querySelector(".main__result--data-company>a");

// To listen and receive data selectors.
const searchInput = document.getElementById("main__search--input");
const searchSubmitButton = document.getElementById("main__search--submit");
const errorMessage = document.getElementById("main__search--error");

// Light / Dark mode buttons and variables.
const toggleButtons = document.querySelectorAll(".header__theme");
const darkModeButton = toggleButtons[0];
const lightModeButton = toggleButtons[1];
const rootElement = document.querySelector(":root");
const headerElement = document.querySelector(".header__theme");
const mainResult = document.querySelector(".main__result");
// Boolean if already set in the browser, otherwise null.
const localPreference = JSON.parse(localStorage.getItem("dark-theme"));
// Boolean, check OS dark mode.
const defaultDarkMode = window.matchMedia(
  "(prefers-color-scheme: dark)"
).matches;
// The nullish coalescing operator (??) is a logical
// operator that returns its right-hand side operand
// when its left-hand side operand is null or undefined,
// and otherwise returns its left-hand side operand.
// boolean; if this evaluates to true, darkMode should be turned on.
let isDarkMode = localPreference ?? defaultDarkMode;

function handleDarkmode(isDark) {
  if (isDark) {
    rootElement.classList.add("dark");
    headerElement.classList.add("dark");
    searchInput.classList.add("dark");
    mainResult.classList.add("dark");
    darkModeButton.classList.add("hidden");
    lightModeButton.classList.remove("hidden");
    localStorage.setItem("dark-theme", true);
  } else {
    rootElement.classList.remove("dark");
    headerElement.classList.remove("dark");
    searchInput.classList.remove("dark");
    mainResult.classList.remove("dark");
    lightModeButton.classList.add("hidden");
    darkModeButton.classList.remove("hidden");
    localStorage.setItem("dark-theme", false);
  }
}

// Dark mode toggle.
darkModeButton.addEventListener("click", () => {
  handleDarkmode(true);
});

// Light mode toggle.
lightModeButton.addEventListener("click", () => {
  handleDarkmode(false);
});

// On first run, detect OS light/dark preference.
handleDarkmode(isDarkMode);

// If a GitHub user hasn't added their name,
// show their username where the name would be
// without the '@' symbol.
function renderName(userDataObj) {
  if (userDataObj.name === null) {
    devName.textContent = userDataObj.login;
  } else {
    devName.textContent = userDataObj.name;
  }
}

// If a GitHub user bio is empty, show the text
// "This profile has no bio" with transparency added.
function renderBio(userDataObj) {
  if (userDataObj.bio === null) {
    devBio.style.opacity = 0.75;
    devBio.textContent = "This profile has no bio";
  } else {
    devBio.style.opacity = 1;
    devBio.textContent = userDataObj.bio;
  }
}

// If location is empty, show the text
// "Not Available" with transparency added.
function renderLocation(userDataObj) {
  if (userDataObj.location === null) {
    devLocation.style.opacity = 0.5;
    devLocation.textContent = "Not Available";
  } else {
    devLocation.style.opacity = 1;
    devLocation.textContent = userDataObj.location.trim();
  }
}

// If website is empty, show the text
// "Not Available" with transparency added.
function renderWebsite(userDataObj) {
  if (userDataObj.blog === "") {
    devWebsite.style.opacity = 0.5;
    devWebsite.href = "javascript:void(0)";
    devWebsite.textContent = "Not Available";
  } else {
    // With a long website string like
    // https://www.freecodecamp.org, the card struggles
    // because of narrow card width and "big" font size.
    // So, string longer than 19 chars, we trim
    // the link render and add an ellipsis (...) at the end.
    if (userDataObj.blog.trim().length > 19) {
      devWebsite.textContent = userDataObj.blog.trim().slice(0, 16) + "...";
    } else {
      devWebsite.textContent = userDataObj.blog.trim();
    }
    devWebsite.style.opacity = 1;
    devWebsite.href = userDataObj.blog.trim();
  }
}

// If twitter is empty, show the text
// "Not Available" with transparency added.
function renderTwitter(userDataObj) {
  if (userDataObj.twitter_username === null) {
    devTwitter.style.opacity = 0.5;
    devTwitter.href = "javascript:void(0)";
    devTwitter.textContent = "Not Available";
  } else {
    devTwitter.style.opacity = 1;
    devTwitter.href = `https://twitter.com/${userDataObj.twitter_username.trim()}`;
    devTwitter.textContent = `@${userDataObj.twitter_username.trim()}`;
  }
}

// If company is empty, show the text
// "Not Available" with transparency added.
function renderCompany(userDataObj) {
  if (userDataObj.company === null) {
    devCompany.style.opacity = 0.5;
    devCompany.href = "javascript:void(0)";
    devCompany.textContent = "Not Available";
  } else {
    // If userDataObj.company starts with an "@" character,
    // surely the GitHub company site exists.
    // Link the corresponding URL.
    if (userDataObj.company[0] === "@") {
      devCompany.href = `https://github.com/${userDataObj.company
        .trim()
        .toLowerCase()
        .substring(1)}`;
    } else {
      // Otherwise, we ignore if it exists or not.
      // Rather not redirect to an non-existent GitHub site (404).
      devCompany.href = "javascript:void(0)";
    }
    devCompany.style.opacity = 1;
    devCompany.textContent = userDataObj.company.trim();
  }
}

// Render user's data in the result card.
function renderUserData(userDataObj) {
  renderName(userDataObj);
  devUsername.textContent = `@${userDataObj.login}`;
  devJoinDate.textContent = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date(userDataObj.created_at));
  renderBio(userDataObj);
  devRepos.textContent = userDataObj.public_repos;
  devFollowers.textContent = userDataObj.followers;
  devFollowing.textContent = userDataObj.following;
  renderLocation(userDataObj);
  renderWebsite(userDataObj);
  renderTwitter(userDataObj);
  renderCompany(userDataObj);
  devPic.src = userDataObj.avatar_url;
}

// Filter the user search query to get
// a githubUser that can be searched.
function filterQuery(userQuery) {
  let githubUser = "";
  const trimmedQuery = userQuery.trim();
  if (trimmedQuery[0] === "@") {
    githubUser = trimmedQuery.toLowerCase().substring(1);
  } else {
    githubUser = trimmedQuery.trim().toLowerCase();
  }
  return githubUser;
}

// Display error message if user is not found.
function displayErrorMessage() {
  // Display 'No results' messages in search box.
  errorMessage.classList.remove("hidden");
  // 'Hide' (increase search box padding-left)
  // temporarily the search query if it's too long.
  searchInput.classList.add("error");
}

// Clear error message if there's any.
function clearErrorMessage() {
  // Hide 'No results' messages in search box.
  errorMessage.classList.add("hidden");
  // Display the search query again.
  searchInput.classList.remove("error");
}

// Fetch a user from the GitHub API.
async function fetchUser(userQuery) {
  try {
    const githubUser = filterQuery(userQuery);
    // The GitHub API may require the headers option
    // for a successful request.
    // Right now it doesn't need, but just in case.
    // Credit:
    // https://stackoverflow.com/questions/39907742/github-api-is-responding-with-a-403-when-using-requests-request-function
    const response = await fetch(`https://api.github.com/users/${githubUser}`, {
      headers: {
        "User-Agent": "request",
      },
    });
    const userDataObj = await response.json();
    const userStatus = response.status;
    if (userStatus === 404) {
      displayErrorMessage();
    } else {
      clearErrorMessage();
      renderUserData(userDataObj);
    }
  } catch (error) {
    console.log(error);
  }
}

// Check if any key is pressed (including backspace)
// to clear error message.
searchInput.addEventListener("keydown", () => {
  clearErrorMessage();
});

// Look up for a user and render info after
// typing your search query when pressing the
// "enter" button on your keyboard.
searchInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    fetchUser(searchInput.value);
  }
});

// Use search query after pressing the search submit
// button to look up for a user and render info.
searchSubmitButton.addEventListener("click", () =>
  fetchUser(searchInput.value)
);

// On load, fetch @octocat GitHub user.
fetchUser("octocat");

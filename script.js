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
    devBio.textContent = "This profile has no bio";
    devBio.style.opacity = 0.75;
  } else {
    devBio.textContent = userDataObj.bio;
  }
}

// If location is empty, show the text
// "Not Available" with transparency added.
function renderLocation(userDataObj) {
  if (userDataObj.location === null) {
    devLocation.textContent = "Not Available";
    devLocation.style.opacity = 0.5;
  } else {
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

// Fetch a user from the GitHub API.
async function fetchUser(githubUser) {
  try {
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
    renderUserData(userDataObj);
  } catch (error) {
    console.log(error);
  }
}

searchSubmitButton.addEventListener("click", () =>
  fetchUser(searchInput.value)
);

// On load, fetch @octocat GitHub user.
fetchUser("octocat");

// NOTE: Unauthorized users (user is determined by his IP)
// can make up to 60 requests per hour, give or take.
// Keep this in mind when fetching data from the GH API.
// Credit to @adamstafa's answer in this GH issue:
// https://github.com/Cloud-CV/EvalAI/issues/1373

const API_URL = "https://api.github.com/users/octocat";
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
const devCompany = document.querySelector(".main__result--data-company>span");

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
    devLocation.textContent = userDataObj.location;
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
    devWebsite.href = userDataObj.blog;
    devWebsite.textContent = userDataObj.blog;
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
    devTwitter.href = `https://twitter.com/${userDataObj.twitter_username}`;
    devTwitter.textContent = `@${userDataObj.twitter_username}`;
  }
}

// If company is empty, show the text
// "Not Available" with transparency added.
function renderCompany(userDataObj) {
  if (userDataObj.company === null) {
    devCompany.textContent = "Not Available";
    devCompany.style.opacity = 0.5;
  } else {
    devCompany.textContent = userDataObj.company;
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
async function fetchUser() {
  try {
    // The GitHub API may require the headers option
    // for a successful request.
    // Right now it doesn't need, but just in case.
    // Credit:
    // https://stackoverflow.com/questions/39907742/github-api-is-responding-with-a-403-when-using-requests-request-function
    const response = await fetch(API_URL, {
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

// On load, fetch a user.
fetchUser();

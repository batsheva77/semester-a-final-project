window.addEventListener("pageshow", () => sessionStorage.clear());
sessionStorage.clear();

const login = document.getElementById("login");
const signUp = document.getElementById("signUp");
const toggleForms = (e) => {
  e.preventDefault();
  login.style.display = login.style.display === "none" ? "block" : "none";
  signUp.style.display = signUp.style.display === "block" ? "none" : "block";
  document.getElementById("alertLogin").innerText = "";
  document.getElementById("alertSign").innerText = "";
  login.reset();
  signUp.reset();
};
document.getElementById("signLink").onclick = toggleForms;
document.getElementById("loginLink").onclick = toggleForms;

signUp.addEventListener("submit", signUpUser);

function signUpUser(e) {
  e.preventDefault();
  const email = document.getElementById("signEmail").value;
  const pass = btoa(document.getElementById("signPass").value);
  const userName = document.getElementById("name").value;
  let users = JSON.parse(localStorage.getItem("allUsers")) || [];
  if (pass !== btoa(document.getElementById("confirmPass").value)) {
    return (document.getElementById("alertSign").innerText =
      "Passwords don't match!");
  } else if (users.find((u) => u.email === email)) {
    e.target.reset(); 
    toggleForms(e);
    return alert("The user already exists, please log in");
  } 
  else {
    users.push({
      email: email,
      pass: pass,
      name: userName,
      bestScore: [3599, 3599, 3599],
    });
    localStorage.setItem("allUsers", JSON.stringify(users));

    sessionStorage.setItem("isLoggedIn", "true");

    e.target.reset();
    localStorage.setItem("currentUserEmail", email);
    window.location.href = "home.html";
  }
}

login.addEventListener("submit", logInUser);

function logInUser(e) {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const pass = btoa(document.getElementById("loginPass").value);

  let users = JSON.parse(localStorage.getItem("allUsers")) || [];

  const userFound = users.find((u) => u.email === email && u.pass === pass);

  if (userFound) {
    sessionStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("currentUserEmail", email);
    e.target.reset();
    window.location.href = "home.html";
  } else {
    e.target.reset();
    toggleForms(e);
    return alert("Wrong details or user doesn't exist!");
  }
}

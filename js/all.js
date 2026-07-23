window.addEventListener("pageshow", goToLogin);
window.addEventListener('DOMContentLoaded', createLogoutButton);

function goToLogin() {
    const isLoginPage = window.location.pathname.includes("login.html");
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');

    if (isLoginPage) {
        sessionStorage.clear();
    } 
    else if (!isLoggedIn) {
        window.location.href = "login.html";
          sessionStorage.clear();
    }
}

function handleLogout() {
    sessionStorage.clear();
    window.location.href = "login.html";
}

function createLogoutButton() {
    const btn = document.createElement('a');
    btn.textContent = 'LOG OUT';
    btn.onclick = handleLogout;
    document.getElementById('all').appendChild(btn);
}
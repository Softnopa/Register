const BASE_API = location.hostname === "127.0.0.1" || location.hostname === "localhost"
    ? "http://127.0.0.1:5000"
    : "";

const LOGIN = "/api/auth/login";
const REGISTER = "/api/auth/register";
localStorage.clear()

const token = localStorage.getItem("token");

if (token) {
    window.location.href = "index.html";
}

const elLoginTab = document.querySelector(".js-login-tab");
const elRegisterTab = document.querySelector(".js-register-tab");
const elTitle = document.querySelector(".js-title");

const elLoginForm = document.querySelector(".js-login-form");
const elRegisterForm = document.querySelector(".js-register-form");

const elUsername = document.querySelector(".js-username");
const elPassword = document.querySelector(".js-password");
const elMessage = document.querySelector(".js-message");

const elRegisterUsername = document.querySelector(".js-register-username");
const elRegisterPassword = document.querySelector(".js-register-password");
const elRegisterMessage = document.querySelector(".js-register-message");

elLoginTab.addEventListener("click", () => {
    elLoginTab.classList.add("active");
    elRegisterTab.classList.remove("active");

    elLoginForm.classList.remove("hidden");
    elRegisterForm.classList.add("hidden");

    elTitle.textContent = "Welcome Back";
});

elRegisterTab.addEventListener("click", () => {
    elRegisterTab.classList.add("active");
    elLoginTab.classList.remove("active");

    elRegisterForm.classList.remove("hidden");
    elLoginForm.classList.add("hidden");

    elTitle.textContent = "Create Account";
});

elLoginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = elUsername.value.trim();
    const password = elPassword.value.trim();

    try {
        const res = await fetch(`${BASE_API}${LOGIN}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const data = await res.json();

        if (data.token) {
            localStorage.setItem("token", data.token);
            window.location.href = "index.html";
        } else {
            elMessage.textContent = "Login failed!";
            elMessage.style.color = "red";
        }

    } catch (err) {
        console.log(err);
        elMessage.textContent = "Server connection failed!";
        elMessage.style.color = "red";
    }
});

elRegisterForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = elRegisterUsername.value.trim();
    const password = elRegisterPassword.value.trim();

    try {
        const res = await fetch(`${BASE_API}${REGISTER}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const data = await res.json();

        if (res.ok) {
            elRegisterMessage.textContent = "Register success!";
            elRegisterMessage.style.color = "green";

            elRegisterUsername.value = "";
            elRegisterPassword.value = "";
        } else {
            elRegisterMessage.textContent = data.message || "Register failed!";
            elRegisterMessage.style.color = "red";
        }

    } catch (err) {
        console.log(err);
        elRegisterMessage.textContent = "Server connection failed!";
        elRegisterMessage.style.color = "red";
    }
});
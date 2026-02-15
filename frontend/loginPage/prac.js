const API_URL = "http://localhost:3000";
const signupForm = document.getElementById("sign-up");
const loginForm = document.getElementById("login-form");
const statusDiv = document.getElementById("status");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("em").value;
    const password = document.getElementById("pass").value;

    const btn = loginForm.querySelector("button");
    btn.disabled = true;

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userEmail", email); 

      statusDiv.innerText = "Logged in as " + email;
      window.location.href = "../appPage/app.html";

    } catch (error) {
      console.error(error);
      statusDiv.innerText = "Login Error: " + error.message;
      
      setTimeout(() => {
        document.getElementById("em").value = "";
        document.getElementById("pass").value = "";
        document.getElementById("em").focus();
      }, 1000);
    } finally {
      btn.disabled = false;
    }
  });
}

if (signupForm) {
  signupForm.addEventListener("submit", async (f) => {
    f.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const btn = signupForm.querySelector("button");
    btn.disabled = true;

    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      document.getElementById("status").innerText = "Signup successful! Please login.";
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1000);

    } catch (error) {
      console.error(error);
      document.getElementById("status").innerText = "Signup Error: " + error.message;
      document.getElementById("email").value = "";
      document.getElementById("password").value = "";
      document.getElementById("name").value = "";
      document.getElementById("email").focus();
    } finally {
      btn.disabled = false;
    }
  });
}

/* ======================
   LOGOUT LOGIC (Optional)
====================== */
// const logoutBtn = document.getElementById("logout");
// if (logoutBtn) {
//   logoutBtn.addEventListener("click", () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("userEmail");
//     statusDiv.innerText = "Logged out";
//     window.location.href = "index.html";
//   });
// }

/* ======================
   CHECK AUTH ON LOAD
====================== */
// async function checkUser() {
//   const token = localStorage.getItem("token");
//   const email = localStorage.getItem("userEmail");
//   if (token && email) {
//     statusDiv.innerText = "Already logged in as " + email;
//   }
// }
// checkUser();
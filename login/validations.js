function validateLogin(event) {
    event.preventDefault(); // Prevent form from submitting

    let email = document.getElementById("email");
    let password = document.getElementById("password");
    let emailValue = email.value.trim();
    let passwordValue = password.value.trim();
    let isValid = true;

    // Clear previous messages
    clearError(email);
    clearError(password);

    // Email validation
    if (emailValue === "") {
        setError(email, "Email is required");
        isValid = false;
    } else if (!isValidEmail(emailValue)) {
        setError(email, "Enter a valid email address");
        isValid = false;
    }

    // Password validation
    if (passwordValue === "") {
        setError(password, "Password is required");
        isValid = false;
    } else if (passwordValue.length < 6) {
        setError(password, "Password must be at least 6 characters");
        isValid = false;
    }

    if (isValid) {
        Login();
    }

    return isValid;
}

function setError(input, message) {
    let small = input.nextElementSibling;
    small.innerText = message;
    small.style.color = "red";
}

function clearError(input) {
    let small = input.nextElementSibling;
    small.innerText = "";
}

function isValidEmail(email) {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

async function Login() {
    var email = document.getElementById('email').value;
    var pwd = document.getElementById('password').value;
    var loginBtn = document.getElementById('login');

    loginBtn.innerText = "Processing...";
    loginBtn.disabled = true;

    var url = 'http://localhost:8086/user/auth/login';
    var user = {
        email: email,
        password: pwd
    };

    var options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    };

    try {
        var response = await fetch(url, options);
        var body = await response.json();

        if (response.ok && body.token) {
            // Store token in localStorage
            localStorage.setItem("authToken", body.token);
            localStorage.setItem("tokenType", body.tokenType);

            let authorized = await checking();
            if (authorized) {
                alert("Login Successful!");
                window.location.href = "/admin/dashboard.html"; // Redirects to correct dashboard path
            } else {
                alert("Authenticated but not authorized");
            }
        } else {
            alert("Invalid Credentials: " + (body.message || "Please try again"));
        }
    } catch (error) {
        console.error("Network Error:", error);
        alert("Network Error. Please try again later.");
    }

    loginBtn.innerText = "Login";
    loginBtn.disabled = false;
}

async function checking() {
    var url = 'http://localhost:8086/api/admin';
    var token = localStorage.getItem("authToken");

    console.log("Token:", token); // Debugging token retrieval

    if (!token) {
        alert("No authentication token found. Please log in again.");
        window.location.href="/login/admin_login.html";
        return false;
    }

    var options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    };

    try {
        var response = await fetch(url, options);
        if(response.ok)
        {
        return response.ok;
        }
        else
        {
            window.location.href="/login/admin_login.html";

        }
    } catch (error) {
        console.error("Network Error:", error);
        alert("Network Error. Please try again later.");
        return false;
    }
}


async function tokenChecking() {
    const loadingElement = document.getElementById("loading");
    const mainContent = document.querySelector("main");

    // Show loading, hide main content
    loadingElement.style.display = "block";
    mainContent.style.display = "none";

    const url = 'http://localhost:8086/api/admin';
    const token = localStorage.getItem("authToken");

    console.log("Token:", token); // Debugging

    if (!token) {
        alert("No authentication token found. Please log in.");
        window.location.href = "/login/admin_login.html";
        return;
    }

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });

        if (response.ok) {
            console.log("Login verified, redirecting...");
            window.location.href = "/admin/dashboard.html";
        } else if (response.status === 401 || response.status === 403) {
            alert("Session expired. Please log in again.");
            localStorage.removeItem("authToken");
            window.location.href = "/login/admin_login.html";
        } else {
            alert("Token there but not authorized....");
            window.location.href = "/login/admin_login.html";
        }
    } catch (error) {
        console.error("Network Error:", error);
        alert("Network Error. Please check your connection.");
    } finally {
        // Hide loading indicator after checking
        loadingElement.style.display = "none";
        mainContent.style.display = "block";
    }
}

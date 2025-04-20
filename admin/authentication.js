async function data() {
    var url = 'http://localhost:8086/api/admin';

    var token = localStorage.getItem("authToken"); // Retrieve token from local storage

    console.log("Token:", token); // Debugging token retrieval

    if (!token) {
        alert("No authentication token found. Please log in again.");
        window.location.href="/login/admin_login.html";
        return;
    }

    var options = {
        method: 'GET', // Changed from 'POST' to 'GET' if just fetching data
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token // Passing token in the request header
        }
    };

    try {
        var response = await fetch(url, options);
        var body = await response.json();

        if (response.ok) {
            console.log("Admin Data:", body); // Log the fetched admin data
        } else {
            alert("Invalid Credentials: " + (body.message || "Please try again"));
            window.location.href="/login/admin_login.html";

        }
    } catch (error) {
        console.error("Network Error:", error);
        alert("Network Error. Please try again later.");
    }
}

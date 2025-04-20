async function data() {
    var url = 'http://localhost:8086/api/user';

    var token = localStorage.getItem("authToken"); // Retrieve token from local storage

    console.log("Token:", token); // Debugging token retrieval

    if (!token) {
        alert("No authentication token found. Please log in again.");
        window.location.href="/login/user_login.html";
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
            console.log("User Data:", body); // Log the fetched admin data
            viewEvents();

        } else {
            alert("Invalid Credentials: " + (body.message || "Please try again"));
            window.location.href="/login/user_login.html";

        }
    } catch (error) {
        console.error("Network Error:", error);
        alert("Network Error. Please try again later.");

    }
}

 // Function to fetch and display events
 async function viewEvents() {
    var url = 'http://localhost:8086/api/events';
    var token = localStorage.getItem("authToken");

    console.log("Token:", token); // Debugging token retrieval

    if (!token) {
        alert("No authentication token found. Please log in again.");
        return;
    }

    var options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    };

    try {
        var container = document.getElementById("eventsContainer");
        container.innerHTML = "<h3 class='text-center mt-4'>Loading...</h3>";

        var response = await fetch(url, options);

        console.log(response);

        if (response.status === 204) {
            container.innerHTML = `
                <div class="container-fluid">
                    <h1 class="text-center text-danger">No Events data found...</h1>
                </div>
            `;
        } else {
            if (response.ok) {
                var body = await response.json();
                console.log("API Response:", body);

                if (body.events && body.events.length > 0) {
                    displayEvents(body.events);
                } else {
                    container.innerHTML = `
                        <div class="container-fluid">
                            <h1 class="text-center text-danger">No Events data found...</h1>
                        </div>
                    `;
                }
            } else {
                console.error("Fetch error:", response.status, response.statusText);
                alert("Failed to fetch events. Please check your authentication.");
                container.innerHTML = "<h3 class='text-center text-danger'>Failed to load events.</h3>";
            }
        }
    } catch (error) {
        console.error("Network Error:", error);
        alert("Network Error. Please try again later.");
    }
}

// Function to display events as cards
function displayEvents(events) {
    var container = document.getElementById("eventsContainer");
    container.innerHTML = ""; // Clear previous data

    let row = document.createElement("div");
    row.className = "row"; // Bootstrap row for responsive layout

    events.forEach(event => {
        let col = document.createElement("div");
        col.className = "col-md-4 mb-4"; // 3 columns in a row on medium+ screens

        col.innerHTML = `
            <div class="card shadow">
    <img src="http://localhost:8086/uploads/${event.imageName}" class="card-img-top" alt="${event.eventName}" style="height: 230px; object-fit: cover;">
    <div class="card-body">
        <h5 class="card-title">${event.eventName}</h5>
        <p class="card-text"><b>From:</b> ${event.startDate} <br><b>To:</b> ${event.endDate}</p>
        <p class="card-text">${event.description}</p>
        
       <!-- <input type="text" id="tid_${event.id}" placeholder="Transaction ID" required/><br><br>-->
        
        <a href="${event.applyLink}" target="_blank" class="btn btn-success">Apply</a>
        <!--<a href="#" onclick="registerForEvent(${event.id})" class="btn btn-secondary" disabled>Register</a>-->
    </div>
</div>

        `;

        row.appendChild(col);
    });

    container.appendChild(row);
}
async function registerForEvent(eventId) {
    var tidInput = document.getElementById(`tid_${eventId}`).value.trim(); // Get the transaction ID
    
    if (!tidInput) {
        alert("Please enter a valid Transaction ID before registering.");
        return;
    }

    var token = localStorage.getItem("authToken"); // Get authentication token

    if (!token) {
        alert("You must be logged in to register.");
        return;
    }

    try {
        // Step 1: Fetch user ID from token
        var authResponse = await fetch("http://localhost:8086/user/auth/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ token: token })
        });

        var authResult = await authResponse.json();

        if (!authResponse.ok) {
            alert("Authentication failed: " + authResult.message);
            return;
        }

        console.log("User details:", authResult);
        var userId = authResult.userId; // Extract user ID from the response

        // Step 2: Register the event with eventId, transactionId, and userId
        var registerData = {
            eventId: eventId,
            transactionId: tidInput,
            userId: userId // Include user ID
        };

        var registerResponse = await fetch("http://localhost:8086/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(registerData)
        });

        var registerResult = await registerResponse.json();

        if (registerResponse.ok) {
            alert("Registration successful!");
        } else {
            alert("Registration failed: " + registerResult.message);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred. Please try again later.");
    }
}

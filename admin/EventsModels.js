// Viewing Events
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
        var eventsSection = document.getElementById('eventsSection');
        var container = document.getElementById("eventsTableContainer");

        var addEvent = document.getElementById('add_event');
        addEvent.style.display = "none";

        eventsSection.style.display = "block";
        document.getElementById("edit_event").style.display = "none";

        container.style.display="block";

        container.innerHTML = "<b>Loading...</b>";

        var response = await fetch(url, options);

        console.log(response)

        if(response.status===204)
        {
            container.innerHTML = "<b>No Events...............</b>";
        }
        else
        {

        if (response.ok) {
            var body = await response.json();
            console.log("API Response:", body);

            if (body.events) {
                alert('Data loaded successfully');
                displayEvents(body.events);
            } else {
                alert("Unexpected response format.");
                container.innerHTML = "<b>No events found.</b>";
            }
        } else {
            console.error("Fetch error:", response.status, response.statusText);
            alert("Failed to fetch events. Please check your authentication.");
            container.innerHTML = "<b>Failed to load events.</b>";
        }
    }
    } catch (error) {
        console.error("Network Error:", error);
        alert("Network Error. Please try again later.");
    }
}

// Display Events in Table
function displayEvents(events) {
    var container = document.getElementById("eventsTableContainer");
    container.innerHTML = ""; // Clear previous data
    var table = document.createElement("table");
    table.className = "table table-striped"; // Bootstrap styling

    table.innerHTML = `
        <thead>
            <tr>
                <th>ID</th>
                <th>Event Name</th>
                <th>From</th>
                <th>End</th>
                <th>Description</th>
                <th>Image</th>
                <th>Edit</th>
                <th>Delete</th>
            </tr>
        </thead>
        <tbody>
            ${events.map(event => `
                <tr>
                    <td>${event.id}</td>
                    <td>${event.eventName}</td>
                    <td>${event.startDate}</td>
                    <td>${event.endDate}</td>
                    <td>${event.description}</td>
                    <td><img src="http://localhost:8086/uploads/${event.imageName}" width="100px" height="100px"/></td>
                    <td><button onclick="fetchEventDetails(${event.id})" class="btn btn-warning">Update</button></td>
                    <td><button onclick="deleteEvent(${event.id})" class="btn btn-danger">Delete</button></td>
                </tr>
            `).join("")}
        </tbody>
    `;

    container.appendChild(table);
}

// Show Add Event Form
async function add() {
    var eventsSection = document.getElementById('eventsSection');
    var addEvent = document.getElementById('add_event');
    eventsSection.style.display = "none";
    addEvent.style.display = "block";
}

// Add Event Logic
async function eventAdd() {
    var url = 'http://localhost:8086/api/events';
    var token = localStorage.getItem("authToken");

    if (!token) {
        alert("No authentication token found. Please log in again.");
        return;
    }

    var eventName = document.getElementById("eventName").value;
    var imageFile = document.getElementById("imageFile").files[0];
    var startDate = document.getElementById("startDate").value;
    var endDate = document.getElementById("endDate").value;
    var description = document.getElementById("description").value;
    var messageDiv = document.getElementById("message");
    var apply=document.getElementById("applyLink").value;

    alert(apply)

    if (!eventName || !startDate || !endDate || !description || !imageFile || !apply) {
        alert("Please fill all fields.");
        return;
    }

    var allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(imageFile.type)) {
        alert("Invalid file type! Only JPG, JPEG, and PNG are allowed.");
        return;
    }

    if (imageFile.size > 2 * 1024 * 1024) {
        alert("File is too large! Maximum allowed size is 2MB.");
        return;
    }

    var formData = new FormData();
    formData.append("eventName", eventName);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    formData.append("description", description);
    formData.append("file", imageFile);
    formData.append("applyLink",apply);

    var options = {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        body: formData
    };

    try {
        messageDiv.innerHTML = `<div class="alert alert-info">Uploading...</div>`;
        var response = await fetch(url, options);

        if (response.ok) {
            alert("Event added successfully!");
            messageDiv.innerHTML = `<div class="alert alert-success">Event added successfully!</div>`;
            document.getElementById("eventForm").reset();
        } else {
            messageDiv.innerHTML = `<div class="alert alert-danger">Failed to add event. Please try again.</div>`;
        }
    } catch (error) {
        console.error("Network Error:", error);
        alert("Network Error. Please try again later.");
    }
}

// Delete Event Logic
async function deleteEvent(eventId) {
    var url = `http://localhost:8086/api/events/${eventId}`;
    var token = localStorage.getItem("authToken");

    if (!token) {
        alert("No authentication token found. Please log in again.");
        return;
    }

    var confirmDelete = confirm("Are you sure you want to delete this event?");
    if (!confirmDelete) {
        return;
    }

    var options = {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    };

    try {
        var response = await fetch(url, options);

        if (response.ok) {
            alert("Event deleted successfully!");
            location.reload(); // Reload the page to refresh the event list
        } else {
            alert("Failed to delete event. Please try again.");
        }
    } catch (error) {
        console.error("Network Error:", error);
        alert("Network Error. Please try again later.");
    }
}

// Fetch the event details and display them in the form
async function fetchEventDetails(eventId) {
    alert(eventId);
    const url = `http://localhost:8086/api/events/${eventId}`;
    const token = localStorage.getItem("authToken");

    if (!token) {
        alert("No authentication token found. Please log in again.");
        return;
    }

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        console.log(response)

        if (response.ok) {
            const data = await response.json();
            console.log(data);

            document.getElementById('eventsSection').style.display = "none";
            document.getElementById("eventsTableContainer").style.display = "none";
            document.getElementById('add_event').style.display = "none";
            document.getElementById("edit_event").style.display = "block";

            if (data) {
                // Populate the form fields with the event data
                const formattedStartDate = data.event.startDate.split('T')[0]; // Getting only the date part
                const formattedEndDate = data.event.endDate.split('T')[0]; // Getting only the date part

                alert(formattedStartDate);

                document.getElementById("eventNames").value = data.event.eventName;
                document.getElementById("startDates").value = formattedStartDate;
                document.getElementById("endDates").value = formattedEndDate;
                document.getElementById("descriptions").value = data.event.description;
                document.getElementById("eventId").value = data.event.id;
                document.getElementById("applyLinks").value = data.event.applyLink;

                
            } else {
                alert("Event not found.");
            }
        } else {
            alert("Failed to fetch event details. Please try again.");
        }
    } catch (error) {
        console.error("Error fetching event:", error);
        alert("Error fetching event details. Please try again.");
    }
}
async function submitUpdateEvent() {
    var eventId = document.getElementById("eventId").value;
    var eventName = document.getElementById("eventNames").value;
    var startDate = document.getElementById("startDates").value;
    var endDate = document.getElementById("endDates").value;
    var description = document.getElementById("descriptions").value;
    var applyLink = document.getElementById("applyLinks").value;
    var imageFile = document.getElementById("imageFiles").files[0];
    
    if (!eventId || !eventName || !startDate || !endDate || !description || !applyLink) {
        alert("All fields are required.");
        return;
    }

    if (imageFile) {
        const allowedExtensions = ["image/jpeg", "image/jpg", "image/png"];
        if (!allowedExtensions.includes(imageFile.type)) {
            alert("Invalid file type. Only JPG, JPEG, and PNG are allowed.");
            return;
        }
        if (imageFile.size > 2 * 1024 * 1024) {
            alert("File size exceeds 2MB.");
            return;
        }
    }

    var formData = new FormData();
    formData.append("eventId", eventId);
    formData.append("eventName", eventName);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    formData.append("description", description);
    formData.append("file", imageFile);
    formData.append("applyLink", applyLink);
    if (imageFile) {
        formData.append("imageFile", imageFile);
    }

    const url = `http://localhost:8086/api/events`;
    const token = localStorage.getItem("authToken");

    if (!token) {
        alert("No authentication token found. Please log in again.");
        return;
    }

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Authorization': 'Bearer ' + token },
            body: formData
        });


        if (response.ok) {
            const data = await response.json();
            alert("Event updated successfully!");
        } else {
            alert("Failed to update event: ");
        
        }
    } catch (error) {
        console.error("Network Error:", error);
        alert("Network Error. Please try again later.");
    }
}

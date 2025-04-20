function validate() {
    var email = document.getElementById('email').value;
    var pwd = document.getElementById('password').value;
    var rollNumber = document.getElementById('roll_number').value;
    var small = document.getElementsByTagName('small');
    var indicator = 0;

    // Clear previous error messages
    for (var i = 0; i < small.length; i++) {
        small[i].textContent = '';
    }

    // Email validation
    if (email === "") {
        small[0].textContent = "Enter Email";
        indicator += 1;
    }

    // Password validation
    if (pwd === "") {
        small[1].textContent = "Enter Password";
        indicator += 1;
    } else if (pwd.length < 6) {
        small[1].textContent = "Password must be greater than 6 characters";
        indicator += 1;
    } else if (!/[!@#$%^&*()_+]/.test(pwd)) {
        small[1].textContent = "Password must contain at least one special character";
        indicator += 1;
    }

    // Roll Number validation
    if (rollNumber === "") {
        small[2].textContent = "Enter Roll Number";
        indicator += 1;
    } else if (rollNumber.length !== 10) {
        small[2].textContent = "Roll Number must be exactly 10 characters";
        indicator += 1;
    }

    if (indicator > 0) {
        return false;  // Prevent form submission if errors exist
    }

    register();  // Call register only if validation passes
    return false;  // Prevent default form submission
}



 
async function register() {
    var email = document.getElementById('email').value;
    var pwd = document.getElementById('password').value;
    var rollNumber = document.getElementById('roll_number').value;

    var register=document.getElementById('register');

    register.innerText="wait..";

    var url = 'https://ems-springboot-rest-api.onrender.com/user/auth/register';

    var user = {
        email: email,
        password: pwd,
        rollNumber: rollNumber
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
        if (response.ok) 
        {
            var body = await response.json();

            if(body.status==201)
            {
            console.log("Registration Successful:", body);
            alert("Registration Successful!");

            }
            else
            {
              alert("Registration Failed: " + body.message);
            }
        } 
        else {
            var errorBody = await response.json();
            console.error("Error:", errorBody);
            alert("Registration Failed: " + errorBody.message);
        }
    } catch (error) {
        console.error("Network Error:", error);
        alert("Network Error. Please try again later.");
    }

    register.innerText="Register";

}
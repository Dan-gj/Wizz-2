/* ==========================================
   PAGE NAVIGATION
========================================== */

function showPage(pageId, clickedButton) {

    const pages = document.querySelectorAll(".page");

    pages.forEach(function(page) {
        page.classList.remove("active-page");
    });

    const selectedPage = document.getElementById(pageId);
    
    if (selectedPage) {
        selectedPage.classList.add("active-page");
    }

    const navButtons = document.querySelectorAll(".nav-link");

    navButtons.forEach(function(button) {
        button.classList.remove("active");
    });

    if (clickedButton) {
        clickedButton.classList.add("active");
    }

    const navigation = document.getElementById("navigation");
    if (navigation) {
        navigation.classList.remove("show-menu");
    }

    window.scrollTo(0, 0);
}


function showPageById(pageId) {

    const buttons = document.querySelectorAll(".nav-link");

    let correctButton = null;

    buttons.forEach(function(button) {

        if (button.textContent
            .trim()
            .toLowerCase()
            .startsWith(pageId)) {

            correctButton = button;
        }

    });

    showPage(pageId, correctButton);
}


/* ==========================================
   MOBILE MENU
========================================== */

function toggleMenu() {

    const navigation = document.getElementById("navigation");
    
    if (navigation) {
        navigation.classList.toggle("show-menu");
    }

}


/* ==========================================
   DIGITAL CLOCK
========================================== */

function updateClock() {

    const now = new Date();

    let hours = now.getHours();

    let minutes = now.getMinutes();

    let seconds = now.getSeconds();

    let period = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;

    hours = hours ? hours : 12;

    hours = hours < 10 ? "0" + hours : hours;

    minutes = minutes < 10 ? "0" + minutes : minutes;

    seconds = seconds < 10 ? "0" + seconds : seconds;

    const clockElement = document.getElementById("clock");
    
    if (clockElement) {
        clockElement.textContent =
            hours + ":" +
            minutes + ":" +
            seconds + " " +
            period;
    }

    const dateElement = document.getElementById("dateDisplay");
    
    if (dateElement) {
        dateElement.textContent =
            now.toLocaleDateString(
                "en-US",
                {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }
            );
    }

}


setInterval(updateClock, 1000);

updateClock();


/* ==========================================
   SHOW / HIDE INFORMATION
========================================== */

function toggleInformation() {

    const information = document.getElementById("moreInfo");

    if (information) {
        if (information.style.display === "none") {
            information.style.display = "block";
        } else {
            information.style.display = "none";
        }
    }

}


/* ==========================================
   STUDENT FORM VALIDATION
========================================== */

function saveStudent(event) {

    event.preventDefault();

    const name = document.getElementById("studentName").value.trim();

    const matric = document.getElementById("matricNumber").value.trim();

    const department = document.getElementById("department").value.trim();

    const level = document.getElementById("level").value;

    const message = document.getElementById("studentMessage");

    if (!name || !matric || !department || !level) {

        message.className = "message error-message";
        message.style.display = "block";
        message.textContent = "Please complete all student information fields.";
        return;
    }

    message.className = "message success-message";
    message.style.display = "block";
    message.textContent = "Student information for " + name + " has been successfully saved.";

    // Clear form after successful save
    document.getElementById("studentForm").reset();
}


/* ==========================================
   RESULT MANAGEMENT
========================================== */

let results = [];


function addResult(event) {

    event.preventDefault();

    const courseCode = document.getElementById("courseCode")
        .value.trim()
        .toUpperCase();

    const courseTitle = document.getElementById("courseTitle")
        .value.trim();

    const creditUnit = Number(
        document.getElementById("creditUnit").value
    );

    const ca = Number(
        document.getElementById("caScore").value
    );

    const exam = Number(
        document.getElementById("examScore").value
    );

    const message = document.getElementById("resultMessage");

    /* Validate CA */
    if (ca < 0 || ca > 40) {
        showResultError("CA/Test score must be between 0 and 40.");
        return;
    }

    /* Validate Examination */
    if (exam < 0 || exam > 60) {
        showResultError("Examination score must be between 0 and 60.");
        return;
    }

    /* Validate Credit Unit */
    if (creditUnit < 1 || creditUnit > 10) {
        showResultError("Credit unit must be between 1 and 10.");
        return;
    }

    /* Calculate total */
    const total = ca + exam;

    /* Calculate grade */
    const gradeData = calculateGrade(total);

    const result = {
        code: courseCode,
        title: courseTitle,
        unit: creditUnit,
        ca: ca,
        exam: exam,
        total: total,
        grade: gradeData.grade,
        point: gradeData.point
    };

    results.push(result);

    displayResults();
    calculateGPA();

    message.className = "message success-message";
    message.style.display = "block";
    message.textContent = courseCode + " has been successfully added.";

    document.getElementById("resultForm").reset();
}


function showResultError(text) {

    const message = document.getElementById("resultMessage");

    message.className = "message error-message";
    message.style.display = "block";
    message.textContent = text;
}


/* ==========================================
   GRADE CALCULATION
========================================== */

function calculateGrade(total) {

    if (total >= 70) {
        return {
            grade: "A",
            point: 5
        };
    } else if (total >= 60) {
        return {
            grade: "B",
            point: 4
        };
    } else if (total >= 50) {
        return {
            grade: "C",
            point: 3
        };
    } else if (total >= 45) {
        return {
            grade: "D",
            point: 2
        };
    } else if (total >= 40) {
        return {
            grade: "E",
            point: 1
        };
    } else {
        return {
            grade: "F",
            point: 0
        };
    }

}


/* ==========================================
   DISPLAY RESULTS
========================================== */

function displayResults() {

    const table = document.getElementById("resultTable");

    table.innerHTML = "";

    results.forEach(function(result) {

        const row = document.createElement("tr");

        row.innerHTML =
            "<td>" + result.code + "</td>" +
            "<td>" + result.title + "</td>" +
            "<td>" + result.unit + "</td>" +
            "<td>" + result.ca + "</td>" +
            "<td>" + result.exam + "</td>" +
            "<td>" + result.total + "</td>" +
            "<td>" + result.grade + "</td>" +
            "<td>" + result.point + "</td>";

        table.appendChild(row);

    });

}


/* ==========================================
   GPA CALCULATION
========================================== */

function calculateGPA() {

    const gpaElement = document.getElementById("gpaValue");

    if (results.length === 0) {
        gpaElement.textContent = "0.00";
        return;
    }

    let totalQualityPoints = 0;
    let totalCreditUnits = 0;

    results.forEach(function(result) {
        totalQualityPoints += result.point * result.unit;
        totalCreditUnits += result.unit;
    });

    const gpa = totalQualityPoints / totalCreditUnits;

    gpaElement.textContent = gpa.toFixed(2);

}


/* ==========================================
   SEARCH / FILTER RESULTS
========================================== */

function searchResults() {

    const search = document.getElementById("resultSearch")
        .value
        .toLowerCase();

    const rows = document.querySelectorAll("#resultTable tr");

    rows.forEach(function(row) {

        const text = row.textContent.toLowerCase();

        if (text.includes(search)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }

    });

}


/* ==========================================
   CLEAR RESULTS
========================================== */

function clearResults() {

    if (results.length === 0) {
        alert("There are no results to clear.");
        return;
    }

    const confirmClear = confirm("Are you sure you want to clear all results?");

    if (confirmClear) {
        results = [];
        displayResults();
        calculateGPA();
        
        // Show success message
        const message = document.getElementById("resultMessage");
        message.className = "message success-message";
        message.style.display = "block";
        message.textContent = "All results have been cleared successfully.";
    }

}


/* ==========================================
   GALLERY MESSAGE
========================================== */

let galleryChanged = false;


function changeGalleryMessage() {

    const message = document.getElementById("galleryMessage");

    if (!galleryChanged) {
        message.textContent = "StudentHub promotes learning, collaboration and academic excellence.";
        galleryChanged = true;
    } else {
        message.textContent = "Welcome to the StudentHub Gallery.";
        galleryChanged = false;
    }

}


/* ==========================================
   CONTACT FORM VALIDATION
========================================== */

function submitContact(event) {

    event.preventDefault();

    const name = document.getElementById("contactName").value.trim();

    const email = document.getElementById("contactEmail").value.trim();

    const subject = document.getElementById("contactSubject").value.trim();

    const messageText = document.getElementById("contactMessage").value.trim();

    const result = document.getElementById("contactResult");

    if (!name || !email || !subject || !messageText) {
        result.className = "message error-message";
        result.style.display = "block";
        result.textContent = "Please fill in all contact form fields.";
        return;
    }

    // Simple email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        result.className = "message error-message";
        result.style.display = "block";
        result.textContent = "Please enter a valid email address.";
        return;
    }

    result.className = "message success-message";
    result.style.display = "block";
    result.textContent = "Thank you, " + name + ". Your message has been received.";

    document.getElementById("contactForm").reset();
}


/* ==========================================
   DARK MODE TOGGLE
========================================== */

function toggleDarkMode() {

    document.body.classList.toggle("dark-mode");

    const button = document.querySelector(".theme-btn");

    if (document.body.classList.contains("dark-mode")) {
        button.textContent = "☀️";
        button.title = "Switch to Light Mode";
    } else {
        button.textContent = "🌙";
        button.title = "Switch to Dark Mode";
    }

}


/* ==========================================
   KEYBOARD SHORTCUTS (Bonus Feature)
========================================== */

document.addEventListener("keydown", function(event) {
    
    // Press "D" to toggle dark mode
    if (event.key === "d" || event.key === "D") {
        toggleDarkMode();
    }
    
    // Press "H" to go to Home
    if (event.key === "h" || event.key === "H") {
        showPageById("home");
    }
    
    // Press "A" to go to About
    if (event.key === "a" || event.key === "A") {
        showPageById("about");
    }
    
    // Press "S" to go to Services
    if (event.key === "s" || event.key === "S") {
        showPageById("services");
    }
    
    // Press "G" to go to Gallery
    if (event.key === "g" || event.key === "G") {
        showPageById("gallery");
    }
    
    // Press "C" to go to Contact
    if (event.key === "c" || event.key === "C") {
        showPageById("contact");
    }
    
});


/* ==========================================
   INITIALIZATION
========================================== */

// Set initial theme button text
document.addEventListener("DOMContentLoaded", function() {
    
    const themeBtn = document.querySelector(".theme-btn");
    
    if (themeBtn) {
        if (document.body.classList.contains("dark-mode")) {
            themeBtn.textContent = "☀️";
        } else {
            themeBtn.textContent = "🌙";
        }
    }
    
    console.log("StudentHub Cyber Management System initialized successfully!");
    console.log("Keyboard Shortcuts:");
    console.log("D - Toggle Dark Mode");
    console.log("H - Home Page");
    console.log("A - About Page");
    console.log("S - Services Page");
    console.log("G - Gallery Page");
    console.log("C - Contact Page");
    
});

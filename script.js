const backendURL = 'http://localhost:5000';

$('#studentForm').on('submit', async function (e) {
    e.preventDefault();
    const name = $('#studentName').val();
    const email = $('#studentEmail').val();
    const mobile = $('#studentMobile').val();
    const course = $('#course').val();

    try {
        const response = await fetch(`${backendURL}/addStudent`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, mobile, course }),
        });
        const result = await response.json();
        alert(result.message);
        this.reset();
    } catch (error) {
        alert('Failed to add student.');
    }
});

$('#searchButton').on('click', async function () {
    const query = $('#searchQuery').val();

    try {
        const response = await fetch(`${backendURL}/searchStudent?query=${query}`);
        const students = await response.json();

        const studentList = $('#studentList');
        studentList.empty();

        students.forEach(student => {
            studentList.append(`<li class="list-group-item">${student.name} - ${student.email} (${student.course})</li>`);
        });
    } catch (error) {
        alert('Failed to search students.');
    }
});

function calculateDuration() {
    const startDate = new Date(document.getElementById("start-date").value);
    const endDate = new Date(document.getElementById("end-date").value);

    if (startDate && endDate && endDate >= startDate) {
        const durationInDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
        document.getElementById("duration").value = durationInDays;
    } else {
        document.getElementById("duration").value = "";
    }
}

function generateNumbers() {
    const year = document.getElementById("year").value;
    const department = document.getElementById("department").value;
    const serial = parseInt(document.getElementById("serial").value, 10);

    if (!year || !department || isNaN(serial)) {
        alert("Please fill in all fields correctly.");
        return;
    }

    const rollNumber = `${year}-${department}-${serial.toString().padStart(2, '0')}`;
    const certificateNumber = `CERT-${year}-${department}-${serial.toString().padStart(3, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;

    document.getElementById("roll").value = rollNumber;
    document.getElementById("certification").value = certificateNumber;
}

document.getElementById("start-date").addEventListener("change", calculateDuration);
document.getElementById("end-date").addEventListener("change", calculateDuration);
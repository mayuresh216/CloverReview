$(document).ready(function() {
    let studentId = 0;
    let students = [];

    // Initialize datepicker for DOB
    $('#dob').datepicker({
        dateFormat: 'yy-mm-dd',
        changeYear: true,
        changeMonth: true,
        yearRange: "-100:+0",
        onSelect: function(dateText) {
            const dob = new Date(dateText);
            const age = calculateAge(dob);
            $('#age').val(age);
        }
    });

    // Function to calculate age from DOB
    function calculateAge(dob) {
        const diffMs = Date.now() - dob.getTime();
        const ageDate = new Date(diffMs);
        const age = Math.abs(ageDate.getUTCFullYear() - 1970);
        return age;
    }

    // Function to mask Aadhaar number
    function maskAadhaar(aadhaar) {
        return aadhaar.replace(/^(\d{8})(\d{4})$/, 'XXXXXXXX$2');
    }

    // Function to display the list of students
    function displayStudents() {
        const studentTableBody = $('#studentTable tbody');
        studentTableBody.empty();

        students.forEach((student, index) => {
            const studentRow = `
                <tr>
                    <td>${student.id}</td>
                    <td>${student.name}</td>
                    <td>${student.dob}</td>
                    <td>${student.age}</td>
                    <td>${student.gender}</td>
                    <td>${maskAadhaar(student.aadhaar)}</td>
                    <td>${student.phone}</td>
                    <td>${student.address}</td>
                    <td>
                        <button class="editButton" data-index="${index}">Edit</button>
                        <button class="deleteButton" data-index="${index}">Delete</button>
                    </td>
                </tr>
            `;
            studentTableBody.append(studentRow);
        });
    }

    // Function to reset the form
    function resetForm() {
        $('#studentForm')[0].reset();
        $('#studentId').val('');
        $('#addButton').show();
        $('#updateButton').hide();
    }

    // Form submission handler for adding or updating a student
    $('#studentForm').on('submit', function(event) {
        event.preventDefault();
        const name = $('#name').val();
        const dob = $('#dob').val();
        const age = $('#age').val();
        const gender = $('input[name="gender"]:checked').val();
        const aadhaar = $('#aadhaar').val();
        const phone = $('#phone').val();
        const address = $('#address').val();

        // Validation
        if (!gender) {
            alert('Please select a gender');
            return;
        }
        if (!/^\d{12}$/.test(aadhaar)) {
            alert('Aadhaar number must be 12 digits');
            return;
        }
        if (!/^\d{10}$/.test(phone)) {
            alert('Phone number must be 10 digits');
            return;
        }
        if (age < 6) {
            alert('Age must be at least 6 years');
            return;
        }

        if ($('#addButton').is(':visible')) {
            students.push({ id: ++studentId, name, dob, age, gender, aadhaar, phone, address });
        } else {
            const index = $('#studentId').val();
            students[index] = { id: students[index].id, name, dob, age, gender, aadhaar, phone, address };
        }

        resetForm();
        displayStudents();
    });

    // Edit button click handler
    $(document).on('click', '.editButton', function() {
        const index = $(this).data('index');
        const student = students[index];
        $('#name').val(student.name);
        $('#dob').val(student.dob);
        $('#age').val(student.age);
        $(`input[name="gender"][value="${student.gender}"]`).prop('checked', true);
        $('#aadhaar').val(student.aadhaar);
        $('#phone').val(student.phone);
        $('#address').val(student.address);
        $('#studentId').val(index);
        $('#addButton').hide();
        $('#updateButton').show();
    });

    // Delete button click handler
    $(document).on('click', '.deleteButton', function() {
        const index = $(this).data('index');
        students.splice(index, 1);
        displayStudents();
    });

    // Update button click handler
    $('#updateButton').on('click', function() {
        $('#studentForm').submit();
    });
});

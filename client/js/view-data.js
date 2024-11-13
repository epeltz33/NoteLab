async function populateTable() {
    const tableBody = document.querySelector("#dataTable tbody");
    tableBody.innerHTML = '';

    try {
        const response = await fetch('http://localhost:3000/notes');
        const notes = await response.json();

        notes.forEach(note => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${note.id}</td>
                <td>${note.title}</td>
                <td>${note.content}</td>
                <td>${note.dateCreated}</td>
                <td>${note.tags.join(", ")}</td>
                <td>
                    <button class="delete-btn" data-id="${note.id}">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Activate delete button listeners after adding them to the DOM
        activateDeleteButtons();
    } catch (err) {
        console.error('Error fetching notes:', err);
    }
}

function activateDeleteButtons() {
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', handleDelete);
    });
}

async function handleDelete(event) {
    const deleteId = this.getAttribute("data-id");

    if (confirm('Are you sure you want to delete this note?')) {
        try {
            const response = await fetch(`http://localhost:3000/notes/${deleteId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                // Refresh the table after successful deletion
                populateTable();
            } else {
                alert('Error deleting note');
            }
        } catch (err) {
            console.error('Error:', err);
            alert('Error connecting to server');
        }
    }
}

document.addEventListener('DOMContentLoaded', populateTable);
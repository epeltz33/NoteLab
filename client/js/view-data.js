async function populateTable() {
    const tableBody = document.querySelector("#dataTable tbody");
    tableBody.innerHTML = '';

    try {
        const response = await fetch('http://localhost:3000/notes');
        const data = await response.json();
        // Get the notes array from the paginated response
        const notes = data.notes || [];

        notes.forEach(note => {
            const row = document.createElement("tr");
            // Format the date to be more readable
            const formattedDate = new Date(note.dateCreated).toLocaleDateString();

            row.innerHTML = `
                <td>${note._id}</td>
                <td>${note.title}</td>
                <td>${note.content}</td>
                <td>${formattedDate}</td>
                <td>${note.tags.join(", ")}</td>
                <td>
                    <button class="delete-btn" data-id="${note._id}">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Optionally, you could display pagination info
        const paginationInfo = `Page ${data.currentPage} of ${data.totalPages} (${data.totalNotes} total notes)`;
        // Add pagination info to your UI if desired

    } catch (err) {
        console.error('Error fetching notes:', err);
    }
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
                const errorData = await response.json();
                alert(errorData.error || 'Error deleting note');
            }
        } catch (err) {
            console.error('Error:', err);
            alert('Error connecting to server');
        }
    }
}

function activateDeleteButtons() {
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', handleDelete);
    });
}

document.addEventListener('DOMContentLoaded', populateTable);
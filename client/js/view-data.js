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
            `;
            tableBody.appendChild(row);
        });
    } catch (err) {
        console.error('Error fetching notes:', err);
    }
}

document.addEventListener('DOMContentLoaded', populateTable);
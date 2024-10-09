// Sample JSON data (simulating database)
const notesData = [
    {
        id: 1,
        title: "Meeting Notes",
        content: "Discussed project timeline and milestones.",
        dateCreated: "2024-05-01",
        tags: ["work", "project"]
    },
    {
        id: 2,
        title: "Shopping List",
        content: "Milk, eggs, bread, fruits",
        dateCreated: "2024-05-03",
        tags: ["personal", "shopping"]
    },
    {
        id: 3,
        title: "Book Recommendations",
        content: "1. The Alchemist 2. To Kill a Mockingbird 3. 1984",
        dateCreated: "2024-05-05",
        tags: ["books", "personal"]
    },
    {
        id: 4,
        title: "Workout Plan",
        content: "Monday: Cardio, Tuesday: Upper body, Wednesday: Lower body",
        dateCreated: "2023-05-07",
        tags: ["health", "fitness"]
    },
    {
        id: 5,
        title: "Recipe: Chocolate Cake",
        content: "Ingredients: flour, sugar, cocoa powder, eggs, milk, oil",
        dateCreated: "2024-05-10",
        tags: ["cooking", "dessert"]
    }
];

// Function to populate the table
function populateTable() {
    const tableBody = document.querySelector("#dataTable tbody");

    notesData.forEach(note => {
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
}

// Add event listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', populateTable);
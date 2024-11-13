document.getElementById('data-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = {
        title: document.getElementById('title').value,
        content: document.getElementById('content').value,
        tags: document.getElementById('tags').value
    };

    try {
        const response = await fetch('http://localhost:3000/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert('Note saved successfully!');
            document.getElementById('data-form').reset();
        } else {
            alert('Error saving note');
        }
    } catch (err) {
        alert('Error connecting to server');
    }
});

document.getElementById('clear-btn').addEventListener('click', function() {
    document.getElementById('data-form').reset();
});
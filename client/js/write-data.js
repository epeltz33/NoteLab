document.getElementById('submit-btn').addEventListener('click', function(e) {
            e.preventDefault();
            alert('Submit button was pressed!');
        });

        document.getElementById('clear-btn').addEventListener('click', function() {
            document.getElementById('data-form').reset();
        });
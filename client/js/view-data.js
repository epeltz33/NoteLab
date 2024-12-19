var app = angular.module('noteLab', []);

app.controller('ViewDataController', function($scope, $http) {
    // Initialize scope variables
    $scope.notes = [];
    $scope.types = [];
    $scope.selectedType = '';
    $scope.editingNote = null;

    // Function to load all notes
    $scope.loadNotes = function() {
        console.log('Loading notes...'); // Debug log
        $http({
            method: 'GET',
            url: 'http://localhost:3000/notes'
        }).then(function(response) {
            console.log('Response received:', response.data); // Debug log
            if (response.data.msg === "SUCCESS") {
                $scope.notes = response.data.notes;
                // Extract unique types
                $scope.types = [...new Set($scope.notes
                    .filter(note => note.type)
                    .map(note => note.type))];
                console.log('Notes loaded:', $scope.notes); // Debug log
            }
        }).catch(function(error) {
            console.error('Error loading notes:', error);
        });
    };

    // Function to filter notes by type
    $scope.filterByType = function() {
        console.log('Filtering by type:', $scope.selectedType); // Debug log
        const url = $scope.selectedType ?
            `http://localhost:3000/notes/type/${$scope.selectedType}` :
            'http://localhost:3000/notes';

        $http.get(url).then(function(response) {
            if (response.data.msg === "SUCCESS") {
                $scope.notes = response.data.notes;
                console.log('Filtered notes:', $scope.notes); // Debug log
            }
        }).catch(function(error) {
            console.error('Error filtering notes:', error);
        });
    };

    // Function to open edit modal
    $scope.editNote = function(note) {
        console.log('Editing note:', note); // Debug log
        $scope.editingNote = {
            _id: note._id,
            title: note.title,
            type: note.type,
            content: note.content,
            tags: Array.isArray(note.tags) ? note.tags.join(', ') : note.tags
        };
        document.querySelector('.edit-modal').style.display = 'flex';
    };

    // Function to update note
    $scope.updateNote = function() {
        if (!$scope.editingNote) return;

        // Prepare the note data
        const updatedNote = {
            title: $scope.editingNote.title,
            type: $scope.editingNote.type,
            content: $scope.editingNote.content,
            tags: $scope.editingNote.tags ?
                  $scope.editingNote.tags.split(',').map(tag => tag.trim()) :
                  []
        };

        console.log('Updating note:', updatedNote); // Debug log

        $http({
            method: 'PUT',
            url: `http://localhost:3000/notes/${$scope.editingNote._id}`,
            data: updatedNote
        }).then(function(response) {
            console.log('Update response:', response); // Debug log
            if (response.data.msg === "SUCCESS") {
                $scope.loadNotes();
                $scope.cancelEdit();
            }
        }).catch(function(error) {
            console.error('Error updating note:', error);
        });
    };

    // Function to cancel edit
    $scope.cancelEdit = function() {
        $scope.editingNote = null;
        document.querySelector('.edit-modal').style.display = 'none';
    };

    // Function to delete note
    $scope.deleteNote = function(noteId) {
        if (confirm('Are you sure you want to delete this note?')) {
            $http({
                method: 'DELETE',
                url: `http://localhost:3000/notes/${noteId}`
            }).then(function(response) {
                if (response.data.msg === "SUCCESS") {
                    $scope.loadNotes();
                }
            }).catch(function(error) {
                console.error('Error deleting note:', error);
            });
        }
    };

    // Load notes when controller initializes
    $scope.loadNotes();
});
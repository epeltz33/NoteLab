angular.module('noteLab', [])
    .controller('ViewDataController', function($scope, $http) {
        $scope.notes = [];
        $scope.types = [];
        $scope.selectedType = '';

        // Debug log function
        function logDebug(message, data) {
            console.log(`[Debug] ${message}`, data || '');
        }

        // Fetch all notes
        $scope.loadNotes = function() {
            logDebug('Attempting to load notes...');

            $http({
                method: 'GET',
                url: 'http://localhost:3000/notes',
                headers: {
                    'Accept': 'application/json'
                }
            }).then(function(response) {
                logDebug('Server response:', response);

                if (response.data && response.data.msg === "SUCCESS") {
                    $scope.notes = response.data.notes;
                    logDebug('Notes loaded:', $scope.notes);

                    // Extract unique types
                    $scope.types = [...new Set($scope.notes
                        .map(note => note.type)
                        .filter(type => type))];
                    logDebug('Types extracted:', $scope.types);
                } else {
                    console.error('Server returned error:', response.data);
                }
            }).catch(function(error) {
                console.error('Error fetching notes:', error);
                if (error.data) {
                    console.error('Error details:', error.data);
                }
            });
        };

        // Filter notes by type
        $scope.filterByType = function() {
            logDebug('Filtering by type:', $scope.selectedType);

            if (!$scope.selectedType) {
                $scope.loadNotes();
                return;
            }

            $http({
                method: 'GET',
                url: `http://localhost:3000/notes/type/${$scope.selectedType}`,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(function(response) {
                logDebug('Filter response:', response);

                if (response.data && response.data.msg === "SUCCESS") {
                    $scope.notes = response.data.notes;
                } else {
                    console.error('Filter error:', response.data);
                }
            }).catch(function(error) {
                console.error('Error filtering notes:', error);
            });
        };

        // Delete note
        $scope.deleteNote = function(noteId) {
            if (!noteId) {
                console.error('No note ID provided for deletion');
                return;
            }

            if (confirm('Are you sure you want to delete this note?')) {
                logDebug('Attempting to delete note:', noteId);

                $http({
                    method: 'DELETE',
                    url: `http://localhost:3000/notes/${noteId}`,
                    headers: {
                        'Accept': 'application/json'
                    }
                }).then(function(response) {
                    logDebug('Delete response:', response);

                    if (response.data && response.data.msg === "SUCCESS") {
                        $scope.loadNotes();
                    }
                }).catch(function(error) {
                    console.error('Error deleting note:', error);
                });
            }
        };

        // Initialize
        logDebug('Initializing controller...');
        $scope.loadNotes();
    });
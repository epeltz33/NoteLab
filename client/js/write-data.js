// Initialize the Angular module
angular.module('noteLab', [])
    .controller('WriteController', function($scope, $http) {
        // Initialize the note object
        $scope.note = {
            title: '',
            content: '',
            tags: ''
        };

        // Form submission handler
        $scope.submitForm = function() {
            const formData = {
                title: $scope.note.title,
                content: $scope.note.content,
                tags: $scope.note.tags || ''  // Ensure tags is never undefined
            };

            $http.post('http://localhost:3000/notes', formData)
                .then(function(response) {
                    alert('Note saved successfully!');
                    $scope.clearForm();
                })
                .catch(function(error) {
                    console.error('Error:', error);
                    alert('Error saving note');
                });
        };

        // Clear form handler
        $scope.clearForm = function() {
            $scope.note = {
                title: '',
                content: '',
                tags: ''
            };
        };
    });
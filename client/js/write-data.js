angular.module('noteLab', [])
    .controller('WriteController', function($scope, $http, $timeout) {
        // Initialize the note object
        $scope.note = {
            title: '',
            type: '',
            content: '',
            tags: ''
        };

        $scope.feedbackMessage = '';
        $scope.isSuccess = false;

        // Submit form function
        $scope.submitForm = function(isValid) {
            if (!isValid) {
                $scope.showFeedback('Please fill in all required fields', false);
                return;
            }

            // Prepare the note data
            const noteData = {
                title: $scope.note.title,
                type: $scope.note.type,
                content: $scope.note.content,
                tags: $scope.note.tags ? $scope.note.tags.split(',').map(tag => tag.trim()) : []
            };

            console.log('Sending note data:', noteData); // Debug log

            // Send the data to the server
            $http({
                method: 'POST',
                url: 'http://localhost:3000/notes',
                data: noteData,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function(response) {
                console.log('Server response:', response); // Debug log
                if (response.data.msg === "SUCCESS") {
                    $scope.showFeedback('Note saved successfully!', true);
                    $scope.clearForm();
                } else {
                    $scope.showFeedback(response.data.msg || 'Error saving note', false);
                }
            }).catch(function(error) {
                console.error('Error details:', error); // Detailed error log
                $scope.showFeedback('Error saving note. Please try again.', false);
            });
        };

        // Clear form function
        $scope.clearForm = function() {
            $scope.note = {
                title: '',
                type: '',
                content: '',
                tags: ''
            };

            if ($scope.noteForm) {
                $scope.noteForm.$setPristine();
                $scope.noteForm.$setUntouched();
            }
        };

        // Show feedback message
        $scope.showFeedback = function(message, success) {
            $scope.feedbackMessage = message;
            $scope.isSuccess = success;

            $timeout(function() {
                $scope.feedbackMessage = '';
            }, 3000);
        };
    });
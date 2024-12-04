// Create a new module for browse functionality
var noteLabBrowse = angular.module('noteLab', []);

// Add the controller to the module
noteLabBrowse.controller('BrowseController', function($scope, $http) {
    // Initialize variables
    $scope.records = [];
    $scope.currentIndex = 0;
    $scope.currentRecord = null;

    // Fetch records from the server
    function loadRecords() {
        $http.get('http://localhost:3000/notes')
            .then(function(response) {
                $scope.records = response.data;
                if ($scope.records.length > 0) {
                    $scope.currentRecord = $scope.records[0];
                }
            })
            .catch(function(error) {
                console.error('Error fetching records:', error);
                alert('Error loading records. Please try again.');
            });
    }

    // Load records when controller initializes
    loadRecords();

    // Navigate to the next record
    $scope.nextRecord = function() {
        if ($scope.currentIndex < $scope.records.length - 1) {
            $scope.currentIndex++;
            $scope.currentRecord = $scope.records[$scope.currentIndex];
        }
    };

    // Navigate to the previous record
    $scope.previousRecord = function() {
        if ($scope.currentIndex > 0) {
            $scope.currentIndex--;
            $scope.currentRecord = $scope.records[$scope.currentIndex];
        }
    };
});
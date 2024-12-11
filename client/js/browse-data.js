// Create a new module for browse functionality
var noteLabBrowse = angular.module('noteLab', []);

// Add the controller to the module
noteLabBrowse.controller('BrowseController', function($scope, $http) {
    // Initialize variables
    $scope.records = [];
    $scope.currentIndex = 0;
    $scope.currentRecord = null;
    $scope.pagination = {
        currentPage: 1,
        totalPages: 0,
        totalRecords: 0
    };

    // Fetch records from the server
    function loadRecords() {
        $http.get('http://localhost:3000/notes')
            .then(function(response) {
                // Get the notes array from the paginated response
                $scope.records = response.data.notes || [];
                $scope.pagination.currentPage = response.data.currentPage;
                $scope.pagination.totalPages = response.data.totalPages;
                $scope.pagination.totalRecords = response.data.totalNotes;

                if ($scope.records.length > 0) {
                    $scope.currentRecord = $scope.records[0];

                    // Format the date for display
                    if ($scope.currentRecord.dateCreated) {
                        $scope.currentRecord.dateCreated = new Date($scope.currentRecord.dateCreated).toLocaleDateString();
                    }
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

            // Format the date for display
            if ($scope.currentRecord.dateCreated) {
                $scope.currentRecord.dateCreated = new Date($scope.currentRecord.dateCreated).toLocaleDateString();
            }
        }
    };

    // Navigate to the previous record
    $scope.previousRecord = function() {
        if ($scope.currentIndex > 0) {
            $scope.currentIndex--;
            $scope.currentRecord = $scope.records[$scope.currentIndex];

            // Format the date for display
            if ($scope.currentRecord.dateCreated) {
                $scope.currentRecord.dateCreated = new Date($scope.currentRecord.dateCreated).toLocaleDateString();
            }
        }
    };
});
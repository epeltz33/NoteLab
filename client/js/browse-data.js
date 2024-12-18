var noteLabBrowse = angular.module('noteLab', []);

noteLabBrowse.controller('BrowseController', function($scope, $http) {
    $scope.records = [];
    $scope.currentIndex = 0;
    $scope.currentRecord = null;

    function loadRecords() {
        $http.get('http://localhost:3000/notes')
            .then(function(response) {
                if (response.data.msg === "SUCCESS") {
                    $scope.records = response.data.notes;

                    if ($scope.records.length > 0) {
                        $scope.currentRecord = $scope.records[0];

                        // Format the date for display
                        if ($scope.currentRecord.dateCreated) {
                            $scope.currentRecord.dateCreated = new Date($scope.currentRecord.dateCreated).toLocaleDateString();
                        }
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

    $scope.nextRecord = function() {
        if ($scope.currentIndex < $scope.records.length - 1) {
            $scope.currentIndex++;
            $scope.currentRecord = $scope.records[$scope.currentIndex];

            if ($scope.currentRecord.dateCreated) {
                $scope.currentRecord.dateCreated = new Date($scope.currentRecord.dateCreated).toLocaleDateString();
            }
        }
    };

    $scope.previousRecord = function() {
        if ($scope.currentIndex > 0) {
            $scope.currentIndex--;
            $scope.currentRecord = $scope.records[$scope.currentIndex];

            if ($scope.currentRecord.dateCreated) {
                $scope.currentRecord.dateCreated = new Date($scope.currentRecord.dateCreated).toLocaleDateString();
            }
        }
    };
});
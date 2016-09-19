/* global carComparisonApp */

carComparisonApp.controller('ModelCtrl', ['$uibModal', function($uibModal) {
    var modalCtrl = this;
    modalCtrl.open = function() {
        var modalInstance = $uibModal.open({
            templateUrl: 'templates/aboutPopUp.html',
            controller: 'ModelInstanceCtrl',
            controllerAs: 'mdInCtrl'
        });
    };
}]);

carComparisonApp.controller('ModelInstanceCtrl', ['$uibModalInstance', function($uibModalInstance) {
    var mdCtrlInstance = this;
        
    mdCtrlInstance.close = function() {
        $uibModalInstance.dismiss('cancel');
    };
}]);

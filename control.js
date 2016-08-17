var carComparisonApp = angular.module('myCarApp',[]);

carComparisonApp.controller('MonthlyCost', ['$scope', "carUserValues", function($scope, carUserValues) {
    var monthlyCost = this;    
        
    monthlyCost.paymentCost = 0;
    monthlyCost.gasCost = 0;
    monthlyCost.totalCost = 0;
    monthlyCost.costAfterSomeYears = 0;
    monthlyCost.mpg;
    monthlyCost.price;
    
    monthlyCost.calculateMonthlyCost = function() {
        monthlyCost.paymentCost = ((monthlyCost.price - carUserValues.getDownPayment())*(carUserValues.getRate()/12))/(1-Math.pow((1+(carUserValues.getRate()/12)),(-carUserValues.getTime())));
        monthlyCost.updateTotalCost();
        monthlyCost.calculateCostAfterNumberOfYears();
    };
    
    monthlyCost.calculateGasCost = function() {
        monthlyCost.gasCost = (carUserValues.getMiles()/monthlyCost.mpg)*carUserValues.getPPG();
        monthlyCost.updateTotalCost();
        monthlyCost.calculateCostAfterNumberOfYears();
    };
    
    monthlyCost.updateTotalCost = function() {
        monthlyCost.totalCost = monthlyCost.gasCost + monthlyCost.paymentCost;
    };
    
    monthlyCost.calculateCostAfterNumberOfYears = function() {
        var timeLengthInMonths = carUserValues.getTimeLengthSelected() * 12;
        var timeLengthInMonthsForPayments = carUserValues.getTime();
        
        if (carUserValues.getTime() > timeLengthInMonths) 
            timeLengthInMonthsForPayments = timeLengthInMonths;
        
        var totalGasCost = monthlyCost.gasCost * timeLengthInMonths;
        var totalPaymentCost = monthlyCost.paymentCost *  timeLengthInMonthsForPayments;
        monthlyCost.costAfterSomeYears = totalGasCost + totalPaymentCost;
    };
    
    monthlyCost.getTimeLengthSelected = function() {
        return carUserValues.getTimeLengthSelected();
    }
    
    $scope.$on("updateUserSettings", function(event, args) {        
        monthlyCost.calculateMonthlyCost();
        monthlyCost.calculateGasCost();
        monthlyCost.calculateCostAfterNumberOfYears();
    });
}]); 

carComparisonApp.controller('TimeComparision', ['$scope', "carUserValues", function($scope, carUserValues) {
    var timeCompare = this;
    timeCompare.timeLengthInYears = [1,2,5,10,15,20];
    timeCompare.timeLengthSelected = 0;
    
    //new vars from other controller
    timeCompare.miles;
    timeCompare.ppg;
    timeCompare.time;
    timeCompare.rate;
    timeCompare.payment;
    
    timeCompare.updateSettings = function () {
        var userValues = {
            timeSelected: timeCompare.timeLengthSelected,
            miles: timeCompare.miles, 
            ppg: timeCompare.ppg,
            time: timeCompare.time,
            rate: timeCompare.rate,
            payment: timeCompare.payment
        };
        
        carUserValues.setUserValues(userValues);
        $scope.$broadcast("updateUserSettings");
    };
}]);

carComparisonApp.directive('rtCarInfo', function() {
    return {
        restrict: 'E',
        templateUrl: 'carInfo.html'
    };
});

carComparisonApp.directive("addcar", [ "$compile",function($compile) {
    return function(scope, element, attrs) {
        element.bind("click", function() {
            var linkFn = $compile("<rt-car-info></rt-car-info>");
            var newContent = linkFn(scope);
            angular.element(document.getElementById('cars')).append(newContent);
        });
    };
}]);

carComparisonApp.factory("carUserValues", function() {
    var service = {};
    var payment;
    var time;
    var miles;
    var rate;
    var ppg;
    var timeLengthSelected;
    
    service.setUserValues = function(userValues) {
        payment = userValues.payment;
        time = userValues.time;
        miles = userValues.miles;
        rate = userValues.rate; 
        ppg = userValues.ppg;
        timeLengthSelected = userValues.timeSelected;
    }
    
    service.getDownPayment = function() {
        return payment;
    };
    
    service.getTime = function() {
        return time;
    };
    
    service.getMiles = function() {
        return miles;
    };
    
    service.getRate = function() {
        return rate;
    };
    
    service.getPPG = function() {
        return ppg;
    };
    
    service.getTimeLengthSelected = function() {
        return timeLengthSelected;
    };
    
    return service;
});
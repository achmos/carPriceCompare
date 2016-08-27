var carComparisonApp = angular.module('myCarApp',[]);

carComparisonApp.controller('MonthlyCost', ['$scope', "carUserValues", function($scope, carUserValues) {
    var monthlyCost = this;    
    
    var MONTHS_IN_A_YEAR = 12;
    var gasCostAfterSomeYears; 
    var paymentCostAfterSomeYears;
    
    monthlyCost.paymentCost = 0;
    monthlyCost.gasCost = 0;
    monthlyCost.mpg;
    monthlyCost.carPrice;
    
    monthlyCost.calculateMonthlyPaymentCost = function() {
        var paymentNumerator = ( (monthlyCost.carPrice - carUserValues.getDownPayment()) * (carUserValues.getRate()/12) );
        var paymentDenominator = ( 1 - Math.pow( (1 + (carUserValues.getRate()/12) ) , ( 0 - carUserValues.getTime()) ) );
        monthlyCost.paymentCost = paymentNumerator/paymentDenominator; 
        
        if (isNaN(monthlyCost.paymentCost)) {
            monthlyCost.paymentCost = 0;
        } else if (parseInt(monthlyCost.carPrice) < parseInt(carUserValues.getDownPayment()) ) {
            monthlyCost.paymentCost = 0;
        }
        
        monthlyCost.calculatePaymentCostAfterSomeYears();
    };
    
    monthlyCost.calculatePaymentCostAfterSomeYears = function() {
        var timeLengthInMonths = carUserValues.getTimeLengthSelected() * MONTHS_IN_A_YEAR;
        var timeLengthInMonthsForPayments = carUserValues.getTime();
        if (timeLengthInMonthsForPayments > timeLengthInMonths) 
            timeLengthInMonthsForPayments = timeLengthInMonths;
        
        var totalPaymentCost = monthlyCost.paymentCost *  timeLengthInMonthsForPayments;
        paymentCostAfterSomeYears = totalPaymentCost;
    };
    
    monthlyCost.calculateMonthlyGasCost = function() {
        monthlyCost.gasCost = (carUserValues.getMiles()/monthlyCost.mpg)*carUserValues.getPPG();
        
        if (!isFinite(monthlyCost.gasCost)) {
            monthlyCost.gasCost = 0;
        }
        
        monthlyCost.calculateGasCostAfterSomeYears();
    };
    
    monthlyCost.calculateGasCostAfterSomeYears = function() {
        gasCostAfterSomeYears = monthlyCost.gasCost * carUserValues.getTimeLengthSelected() * MONTHS_IN_A_YEAR;
    };
    
    monthlyCost.totalMonthlyCost = function() {
        return monthlyCost.gasCost + monthlyCost.paymentCost;
    };
    
    monthlyCost.totalCostAfterSomeYears = function() {
        return gasCostAfterSomeYears + paymentCostAfterSomeYears;
    };
    
    monthlyCost.getTimeLengthSelected = function() {
        return carUserValues.getTimeLengthSelected();
    };
    
    $scope.$on("updateUserSettings", function(event, args) {        
        monthlyCost.calculateMonthlyPaymentCost();
        monthlyCost.calculateMonthlyGasCost();
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
    var timeLengthSelected = 0;
    
    service.setUserValues = function(userValues) {
        payment = userValues.payment;
        time = userValues.time;
        miles = userValues.miles;
        rate = userValues.rate; 
        ppg = userValues.ppg;
        timeLengthSelected = userValues.timeSelected;
    };
    
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
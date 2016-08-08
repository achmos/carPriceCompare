var mord = angular.module('myCarApp',[]);

mord.controller('MonthlyCost', ['$scope', function($scope) {
    var payment;
    var time;
    var miles;
    var rate; 
    var ppg;
    var monthlyCost = this;    
        
    monthlyCost.paymentCost = 0;
    monthlyCost.gasCost = 0;
    monthlyCost.totalCost = 0;
    monthlyCost.costAfterSomeYears = 0;
    monthlyCost.timeLengthSelected = 0;
    monthlyCost.mpg;
    monthlyCost.price;
    
    monthlyCost.calculateMonthlyCost = function() {
        monthlyCost.paymentCost = ((monthlyCost.price - payment)*(rate/12))/(1-Math.pow((1+(rate/12)),(-time)));
        monthlyCost.updateTotalCost();
        monthlyCost.calculateCostAfterNumberOfYears();
    };
    
    monthlyCost.calculateGasCost = function() {
        monthlyCost.gasCost = (miles/monthlyCost.mpg)*ppg;
        monthlyCost.updateTotalCost();
        monthlyCost.calculateCostAfterNumberOfYears();
    };
    
    monthlyCost.updateTotalCost = function() {
        monthlyCost.totalCost = monthlyCost.gasCost + monthlyCost.paymentCost;
    };
    
    monthlyCost.calculateCostAfterNumberOfYears = function() {
        var timeLengthInMonths = monthlyCost.timeLengthSelected * 12;
        var timeLengthInMonthsForPayments = time;
        
        if (time > timeLengthInMonths) 
            timeLengthInMonthsForPayments = timeLengthInMonths;
        
        var totalGasCost = monthlyCost.gasCost * timeLengthInMonths;
        var totalPaymentCost = monthlyCost.paymentCost *  timeLengthInMonthsForPayments;
        monthlyCost.costAfterSomeYears = totalGasCost + totalPaymentCost;
    };
    
    $scope.$on("updateUserSettings", function(event, args) {
        payment = args.payment;
        time = args.time;
        miles = args.miles;
        rate = args.rate; 
        ppg = args.ppg;
        
        monthlyCost.timeLengthSelected = args.timeSelected;
        
        monthlyCost.calculateMonthlyCost();
        monthlyCost.calculateGasCost();
        monthlyCost.calculateCostAfterNumberOfYears();
    });
}]); 

mord.controller('TimeComparision', ['$scope', function($scope) {
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
        $scope.$broadcast("updateUserSettings", 
        {
            timeSelected: timeCompare.timeLengthSelected,
            miles: timeCompare.miles, 
            ppg: timeCompare.ppg,
            time: timeCompare.time,
            rate: timeCompare.rate,
            payment: timeCompare.payment
        });
    };
}]);

mord.directive('rtCarInfo', function() {
    return {
        restrict: 'E',
        templateUrl: 'carInfo.html'
    };
});

mord.directive("addcar", [ "$compile" ,function($compile) {
    return function(scope, element, attrs) {
        element.bind("click", function() {
            var linkFn = $compile("<rt-car-info></rt-car-info>");
            var newContent = linkFn(scope);
            angular.element(document.getElementById('cars')).append(newContent);
            scope[atrrs.ctrlr][attrs.update]();
        });
    };
}]);

mord.factory("car", function() {
    var service = {};
    var payment;
    var time;
    var miles;
    var rate;
    var ppg;
    var timeLengthSelected;
    
    service.setValues = function() {
        
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
    
    return service;
});
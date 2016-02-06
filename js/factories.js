var app=angular.module("appFactory",[]);

app.factory('$fnc',["$interval","$document",function($interval,$document){
	return{
		interval: function(callback,delay,count){
	        delay=delay || 100;
	        count=count!=undefined?count:1;
	        var _flag_=1;
	        var _timer_=$interval(function(){
	            if(angular.isFunction(callback))
	                callback();
	            else
	                console.log("Interval: Callback no is a function");
	        },delay,count);

	        return _timer_;
	    },
	    clearInterval: function(timer){
	        $interval.cancel(timer);
	    }
	}
}]);
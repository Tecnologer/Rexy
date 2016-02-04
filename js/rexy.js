var app=angular.module("appRexy",["appFactory"]);

app.controller('ctrlRexy',['$scope',"$fnc","$window",function($scope,$fnc,$window){
	$window.speed=20;

	$scope.keypress=function(e){
		$window.speed+=20;
		console.log($window.speed);
	};
}]);

app.directive("ground",["$fnc","$window",function($fnc,$window){
	return{
		restrict:"C",//E=Element, A=Attribute, C=Class
		scope: false,
		link: function(scope, elem, attrs){
			/*$fnc.interval(function(){
				var currentX=Number(elem.css("background-position-x").replace(/px/gi,""));

				if(currentX<=-1890){
					currentX=0;
				}
				else
					currentX-=$window.speed;

				elem.css("background-position-x",currentX+"px");
				// console.log(currentX+100);
			},100,0);*/
		}
	}
}]);

/*app.directive("body",["$fnc","$window",function($fnc,$window){
	return{
		restrict:"E",//E=Element, A=Attribute, C=Class
		scope: false,
		link: function(scope, elem, attrs){
			$fnc.e(elem).keyup(function(e){
				console.log(e.keyCode);
			});
		}
	}
}]);*/
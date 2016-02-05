var app=angular.module("appRexy",["appFactory"]);

app.controller('ctrlRexy',['$scope',"$fnc","$window","$document",function($scope,$fnc,$window,$document){
	$scope.speed=20;

	$scope.$watch("speed",function(a){
		if(!$scope.running)$scope.start();
	});

	$scope.keypress=function(e){
		if(e.which==13)
			$scope.stop();
		else if(e.which==32){
			if(!$scope.running)
				$scope.start();
			$scope.rexyJump();
		}

	};

	// $document.bind('keypress',$scope.keypress);
	angular.element(document).bind("keyup",$scope.keypress);
}]);

app.directive("ground",["$fnc","$window",function($fnc,$window){
	return{
		restrict:"C",//E=Element, A=Attribute, C=Class
		scope: false,
		link: function(scope, elem, attrs){
			var t;
			scope.stop=function(){
				$fnc.clearInterval(t);
				scope.rexyStop();
			};

			scope.start=function(){
				scope.stop();
				scope.walk();
				t=$fnc.interval(function(){
					var currentX=Number(elem.css("background-position-x").replace(/px/gi,""));

					if(currentX<=-2399){
						currentX=0;
					}
					else
						currentX-=scope.speed;

					elem.css("background-position-x",currentX+"px");
				},100,0);
			};
		}
	}
}]);

app.directive("rexy",["$fnc","$window",function($fnc,$window){
	return{
		restrict:"C",//E=Element, A=Attribute, C=Class
		scope: false,
		link: function(scope, elem, attrs){
			scope.running;
			scope.walk=function(){
				scope.running=$fnc.interval(function(){
					if(elem.hasClass("stay") || elem.hasClass("step-left")){
						elem.removeClass("stay").removeClass("step-left").addClass("step-right");
					}
					else
						elem.removeClass("step-right").addClass("step-left");
				},100,0);
			}

			scope.rexyStop=function(){
				elem.removeClass("step-right").removeClass("step-left").addClass("stay");
				$fnc.clearInterval(scope.running);
				scope.running=undefined;
			};

			scope.rexyJump=function(){
				var jumpVel=10;
				var top=309-jumpVel;
				var maxTop=false;
				var jump=$fnc.interval(function(){
					if(!maxTop)
						elem.css("top",top+"px");
					else
						elem.css("top",top+"px");

					if((top<=170 || maxTop) && top<309){
						top+=jumpVel;
						maxTop=true;
					}
					else if(top>=309){
						elem.css("top","309px");
						$fnc.clearInterval(jump);
					}
					else if(!maxTop)
						top-=jumpVel;
						
				},25,0);
			};
		}
	}
}]);
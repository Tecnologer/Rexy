var app=angular.module("appRexy",["appFactory"]);

app.controller('ctrlRexy',['$scope',"$fnc",function($scope,$fnc){
	$scope.speed=400;
	var start=false;

	$scope.$watch("speed",function(a){
		if(!$scope.rexy.running && start)$scope.ground.start();
	});

	$scope.keypress=function(e){
		if(e.which==13)
			$scope.ground.stop();
		else if(e.which==32){
			if(!$scope.rexy.running){
				$scope.ground.start();
				start=true;
			}

			$scope.rexy.jump();
		}

	};

	angular.element(document).bind("keyup",$scope.keypress);

	$(document).ready(function(){
		var temp=$fnc.interval(function(){
			var width=$(".ground").parent("div").width();

			if(width){
				$(".ground").width($(".ground").parent("div").width());
				$(".ground").css("margin-top",(($(document).height()/2)-30)+"px");
				var top=Number($(".ground").css("margin-top").replace(/px/gi,""));
				$scope.rexy.top=top-46;

				$(".rexy").css("top",(top-46)+"px");
				$fnc.clearInterval(temp);
			}
		},100,0);
		
	});
}]);

app.directive("ground",["$fnc",function($fnc){
	return{
		restrict:"C",//E=Element, A=Attribute, C=Class
		scope: false,
		link: function(scope, elem, attrs){
			scope.ground={timer: undefined};

			/** Autor: Rey David Dominguez
				Fecha: 02/04/2016
				Detiene el movimiento del suelo y ejecuta la funcion para detener a rexy tambien*/
			scope.ground.stop=function(){
				$fnc.clearInterval(scope.ground.timer);
				scope.rexy.stop();
			};
			/** Autor: Rey David Dominguez
				Fecha: 02/04/2016
				Mueve el suelo y ejecuta la funcion para hacer correr a rexy*/
			scope.ground.start=function(){
				scope.ground.stop();
				scope.rexy.run();
				scope.ground.timer=$fnc.interval(function(){
					var currentX=Number(elem.css("background-position-x").replace(/px/gi,""));

					if(currentX<=-2399){
						currentX=0;
					}
					else
						currentX-=(scope.speed/20);

					elem.css("background-position-x",currentX+"px");
				},50,0);
			};
		}
	}
}]);

app.directive("rexy",["$fnc",function($fnc){
	return{
		restrict:"C",//E=Element, A=Attribute, C=Class
		scope: false,
		link: function(scope, elem, attrs){
			scope.rexy={running: undefined};
			// console.log($fnc.e(".ground").getBoundingClientRect());
			/** Autor: Rey David Dominguez
				Fecha: 02/05/2016
				Hace caminar a Rexy*/
			scope.rexy.run=function(){
				scope.running=$fnc.interval(function(){
					if(elem.hasClass("stay") || elem.hasClass("step-left")){
						elem.removeClass("stay").removeClass("step-left").addClass("step-right");
					}
					else
						elem.removeClass("step-right").addClass("step-left");
				},100,0);
			}

			/** Autor: Rey David Dominguez
				Fecha: 02/05/2016
				Rexy deja de caminar*/
			scope.rexy.stop=function(){
				// elem.removeClass("step-right").removeClass("step-left").addClass("stay");
				$fnc.clearInterval(scope.running);
				scope.running=undefined;
			};

			//bandera para controlar un brinco a la vez
			scope.rexy.isJumping=false;
			/** Autor: Rey David Dominguez
				Fecha: 02/05/2016
				Hace brincar a Rexy*/
			scope.rexy.jump=function(){
				if(scope.rexy.isJumping)return;

				var jumpVel=13;
				var top=scope.rexy.top-jumpVel;
				var maxTop=false;
				scope.rexy.isJumping=true;
				var timerJump=$fnc.interval(function(){
					if(!maxTop)
						elem.css("top",top+"px");
					else
						elem.css("top",top+"px");

					if((top<=170 || maxTop) && top<scope.rexy.top){
						top+=jumpVel;
						maxTop=true;
					}
					else if(top>=scope.rexy.top){
						elem.css("top",scope.rexy.top+"px");
						$fnc.clearInterval(timerJump);
						scope.rexy.isJumping=false;
					}
					else if(!maxTop)
						top-=jumpVel;
						
				},25,0);
			};
		}
	}
}]);

app.directive("cactus",["$fnc",function($fnc){
	return{
		restrict:"C",//E=Element, A=Attribute, C=Class
		scope: false,
		link: function(scope, elem, attrs){
			scope.cactus={};
		}
	}
}]);

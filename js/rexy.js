var app=angular.module("appRexy",["ngTouch","appFactory"]);

app.controller('ctrlRexy',['$scope',"$fnc",function($scope,$fnc){
	$scope.speed=400;
	var start=false;

	$scope.isMobile=isMobile();
	$scope.$watch("speed",function(a){
		if(!$scope.rexy.running && start)$scope.ground.start();
	});

	$scope.keypress=function(e){
		if(e.type==="click" && !isMobile()){
			return;
		}

		if(e.which==13)
			$scope.ground.stop(true);
		else if(e.which==32 || isTap(e)){
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

				var docWidth=isMobile()?$(document).width()/6:$(document).width()/4;
				var op=isMobile()?5:3;
				$(".frameIzq").width(docWidth);
				$(".frameIzq").height($(document).height());

				$(".frameDerecho").width(docWidth);
				$(".frameDerecho").height($(document).height());
				$(".frameDerecho").css("left",((docWidth)*op)+"px");

				$(".rexy").css("top",(top-46)+"px");
				$(".rexy").css("left",(docWidth)+"px");
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
			scope.ground.stop=function(stopCloud){
				$fnc.clearInterval(scope.ground.timer);
				scope.rexy.stop();

				if(stopCloud)
					scope.clouds.stop();
			};
			/** Autor: Rey David Dominguez
				Fecha: 02/04/2016
				Mueve el suelo y ejecuta la funcion para hacer correr a rexy*/
			scope.ground.start=function(){
				scope.environment.makeClouds();
				scope.clouds.move();
				scope.ground.stop(false);
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
				var maxTopPx=isMobile()?60:170;

				var timerJump=$fnc.interval(function(){
					if(!maxTop)
						elem.css("top",top+"px");
					else
						elem.css("top",top+"px");

					if((top<=maxTopPx || maxTop) && top<scope.rexy.top){
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

app.directive("cloud",["$fnc",function($fnc){
	return{
		restrict:"C",//E=Element, A=Attribute, C=Class
		scope: false,
		link: function(scope, elem, attrs){
			if(!scope.clouds){
				scope.clouds={};
				scope.clouds.elems=[];
			}

			var cloud={
				isMoving: undefined,
				currentLeft: 965
			};

			var initialLeft=cloud.currentLeft;

			cloud.move=function(i){
				scope.clouds.elems[i].isMoving=$fnc.interval(function(){
					$(elem).css("left",cloud.currentLeft+"px");

					if(cloud.currentLeft<200){
						// cloud.currentLeft=initialLeft;
						$fnc.clearInterval(scope.clouds.elems[i].isMoving)
						$(".cloud#"+i).remove();
					}
					else
						cloud.currentLeft-=(1);
				},35,0);
			};

			if(scope.ground && scope.ground.timer)
				scope.clouds.move();

			scope.clouds.elems.push(angular.copy(cloud));

			scope.clouds.stop=function(){
				for(var i in scope.clouds.elems){
					$fnc.clearInterval(scope.clouds.elems[i].isMoving);
					scope.clouds.elems[i].isMoving=undefined;
				}
			}

			scope.clouds.move=function(){
				for(var i in scope.clouds.elems){
					if(!scope.clouds.elems[i].isMoving)
						scope.clouds.elems[i].move(i);
				}
			};
		}
	}
}]);

app.directive('environmentGeneral', ["$fnc","factory",function ($fnc,factory) {
	return {
		restrict: 'A',
		link: function (scope, iElement, iAttrs) {
			scope.environment={};

			scope.environment.makeClouds=function(){
				scope.environment.makingClouds=$fnc.interval(function(){
					if($fnc.random(0,1)==1)
						$fnc.interval(factory.newCloud,$fnc.random(12,30)*1000);
				},6000,0)	
			};			
		}
	};
}]);

//factory
app.factory('factory', ["$compile",function ($compile) {
	return {
		newCloud: function(){
			var scope=angular.element($(".frameCentral")).scope();
			var nextId=scope.clouds.elems.length?scope.clouds.elems.length+1:1;
			var newCloud=$("<div/>").addClass("environment cloud").prop("id",nextId);
			$(".frameCentral").append($compile(newCloud)(scope));
		},
		newCactus: function(){

		}
	};
}]);


function isMobile(){
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);		   
}

function isTap(e){
	return isMobile && /click/gi.test(e.type);
}
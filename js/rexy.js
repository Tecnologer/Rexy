var app=angular.module("appRexy",["ngTouch","appFactory"]);
var currentLeft=965;
var score=9990;
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

	angular.element(document).bind("keypress",$scope.keypress);

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

				$(".rexy").css("top",$scope.rexy.top+"px");
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

				if(stopCloud){
					scope.clouds.stop();
					scope.environment.stop();
				}

				if(stopCloud)
					scope.clouds.stop();
			};
			/** Autor: Rey David Dominguez
				Fecha: 02/04/2016
				Mueve el suelo y ejecuta la funcion para hacer correr a rexy*/
			scope.ground.start=function(){
				scope.environment.makeClouds();
				scope.environment.makeCactuses();
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
				scope.rexy.running=$fnc.interval(function(){
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
				var maxTopPx=isMobile()?20:150;

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

app.directive("cactusRight",["$fnc",function($fnc){
	return{
		restrict:"C",//E=Element, A=Attribute, C=Class
		scope: false,
		link: function(scope, elem, attrs){
			if(!scope.cactuses){
				scope.cactuses={};
				scope.cactuses.elems=[];
			}
			var cactus={
				isMoving: undefined,
				currentLeft: currentLeft
			};

			var initialLeft=cactus.currentLeft;
			var catusTop=scope.rexy && scope.rexy.top?scope.rexy.top:200;
			$(elem).css("top",catusTop+"px");

			cactus.move=function(i){
				scope.cactuses.elems[i].isMoving=$fnc.interval(function(){
					$(elem).css("left",scope.cactuses.elems[i].currentLeft+"px");

					if(scope.cactuses.elems[i].currentLeft<200){
						// cactus.currentLeft=initialLeft;
						$fnc.clearInterval(scope.cactuses.elems[i].isMoving)
						$(".cactus-right#"+i).remove();
					}
					else
						scope.cactuses.elems[i].currentLeft-=(scope.speed/20);
				},35,0);
			};

			if(scope.ground && scope.ground.timer)
				scope.cactuses.move();

			scope.cactuses.elems.push(angular.copy(cactus));

			scope.cactuses.stop=function(){
				for(var i in scope.cactuses.elems){
					$fnc.clearInterval(scope.cactuses.elems[i].isMoving);
					scope.cactuses.elems[i].isMoving=undefined;
				}
			}

			scope.cactuses.move=function(){
				for(var i in scope.cactuses.elems){
					if(!scope.cactuses.elems[i].isMoving)
						scope.cactuses.elems[i].move(i);
				}
			};
		}
	}
}]);

/*Directiva de nubes*/
app.directive("cloud",["$fnc",function($fnc){
	return{
		restrict:"C",//E=Element, A=Attribute, C=Class
		scope: false,
		link: function(scope, elem, attrs){
			/*Si el objeto nubes no ha sido creado, lo creamos*/
			if(!scope.clouds){
				scope.clouds={
					// arreglo de nubes
					elems: [],
					// detine el movimiento de nubes
					stop: function(){
						for(var i in scope.clouds.elems){
							$fnc.clearInterval(scope.clouds.elems[i].isMoving);
							scope.clouds.elems[i].isMoving=undefined;
						}
					},
					// mueve todas las nubes
					move: function(){
						for(var i in scope.clouds.elems){
							if(!scope.clouds.elems[i].isMoving)
								scope.clouds.moveCloud(i);
						}
					},
					// mueve la nube especificada
					moveCloud: function(i){
						/*i corresponde al numero de nube que se movera, guardamos el ID del interval,
						esto nos permite detener el movimiento*/
						scope.clouds.elems[i].isMoving=$fnc.interval(function(){
							// deplazamos la nube con al valor actual de la posicion x
							$("div.cloud#"+(Number(i)+1)).css("left",scope.clouds.elems[i].currentLeft+"px");

							/*si la posicion en x, es menor a los 200 pixeles, quiere decir que ya no es visible,
							por lo tanto se detiene su movimiento y se destruye el elemento del DOM*/
							if(scope.clouds.elems[i].currentLeft<200){
								// detenemos el interval
								$fnc.clearInterval(scope.clouds.elems[i].isMoving)
								// destruimos el elemento
								$("div.cloud#"+(Number(i)+1)).remove();
							}
							// si aun esta por arriba de los 200 pixeles, desplazamos la nube un pixel a la izquierda
							else
								scope.clouds.elems[i].currentLeft-=(1);
						},35,0);
					}
				};
			}

			/*sea crea el objeto nube, e inicializamos las variables basicas*/
			var cloud={
				isMoving: undefined,
				currentLeft: currentLeft
			};

			// colocamos la nube a una altura random, entre 240 y 280 pixeles
			$(elem).css("top",$fnc.random(240,280)+"px");
			// agregamos la nube junto con las demas
			scope.clouds.elems.push(angular.copy(cloud));
			// si el suelo esta en movimiento, ejecutamos el movimiento para la nueva nube
			if(scope.ground && scope.ground.timer)
				scope.clouds.moveCloud(Number(attrs.id)-1)

						
		}
	}
}]);

/*Directiva para el ambiente en general*/
app.directive('environmentGeneral', ["$fnc","factory",function ($fnc,factory) {
	return {
		restrict: 'A',
		link: function (scope, iElement, iAttrs) {
			scope.environment={};

			/*Esta funcion se ejecuta cada 6 segundos, en cada ejecucion genera un random de 0 y 1,
			si es 1, crea un interval con un random de 12 a 30 segundos para ejecutar la funcion de
			generar una nueva nube (newCloud)*/
			scope.environment.makeClouds=function(){
				scope.environment.makingClouds=$fnc.interval(function(){
					if($fnc.random(0,1)==1)
						$fnc.interval(factory.newCloud,$fnc.random(12,30)*1000);
				},6000,0)	
			};

			/*Esta funcion se ejecuta cada 4 segundos, en cada ejecucion genera un random de 0 y 1,
			si es 1, crea un interval con un random de 5 a 20 segundos para ejecutar la funcion de
			generar un nuevo cactus (newCactus)*/
			scope.environment.makeCactuses=function(){
				scope.environment.makingCactuses=$fnc.interval(function(){
					if($fnc.random(0,1)==1)
						$fnc.interval(factory.newCactus,$fnc.random(5,20)*1000);
				},4000,0)	
			};

			/*Practicamente detiene la fabricacion de nuevas nubes y cactus, esto lo hace destruyendo
			los intervals de ejecucion*/
			scope.environment.stop=function(){
				$fnc.clearInterval(scope.environment.makingClouds);
				$fnc.clearInterval(scope.environment.makingCactuses);
			};

			$fnc.interval(function(){
				factory.newScore($fnc.random(1,12));
			},10,0);
		}
	};
}]);

//factory nos ayudara con la fabricacion de elementos
app.factory('factory', ["$compile",function ($compile) {
	return {
		newCloud: function(){
			// obtenemos $scope del elemento 
			var scope=angular.element($(".frameCentral")).scope();
			//calculamos el siguiente id
			var nextId=scope.clouds.elems.length?scope.clouds.elems.length+1:1;
			//creamos un div con la clase cloud y le asignamos el id correspondiente
			var newCloud=$("<div/>").addClass("environment cloud").prop("id",nextId);
			//compilamos el nuevo elemento, esto es para que la directiva "cloud" se ejecute y se cree el nuevo elemento cloud
			//una vez compilado, agregamos el elemento al DOM, en el div "frameCentral"
			$(".frameCentral").append($compile(newCloud)(scope));
		},
		newCactus: function(){
			// Esta funcion hace practicamente lo mismo que newCloud, solo que en vez de crear "cloud", crea cactus
			var scope=angular.element($(".frameCentral")).scope();
			var nextId=scope.cactuses.elems.length?scope.cactuses.elems.length+1:1;
			var newCactus=$("<div/>").addClass("environment cactus-right").prop("id",nextId);
			$(".frameCentral").append($compile(newCactus)(scope));
		},
		newScore: function(inc){
			/*incrementamos el valor del score actual, si el incremento esta indefinido, se asigna
			por default un incremento de 1*/
			score+=inc || 1;
			/*Obtenemos los contenedores de numeros del dom, estos contenedores son divs dentro del div
			con clase "score"*/
			var numbers=$(".score").find("div");
			/*separamos en digitos el valor numerico del score*/
			var digits=(score+"").split("");

			/*Si la cantidad de digitos del score es mayor a la cantidad de contenedores (divs); se crea
			un nuevo div y se agrega al contenedor "score"*/
			if(digits.length>numbers.length){
				//creamos el nuevo div
				var newNumber=$("<div/>").addClass("environment number0")[0];
				//lo agregamos al arreglo de numeros
				numbers.push(newNumber);
				//lo agregamos al DOM (al div con clase "score")
				$(".score").append(newNumber);
			}

			//div sera una bandera para recorrer de manera independiente los divs
			var div=numbers.length-1;
			//recorremos los digitos del score
			for(var i=digits.length-1;i>=0;i--){
				//quitamos el valor anterior, esto es quitando cualquier clase que contenga number
				//las clases number estan declaradas en el archivo "trex.css"
				$(numbers[div]).removeClass(function (index, css) {
				    return (css.match (/number\d/g) || []).join(' ');
				});

				//añadimos la nueva clase number + el digito que le corresponda
				$(numbers[div]).addClass("number"+digits[i]);

				//decrementamos el contador de divs asignados
				div--;
			}
		}
	};
}]);


function isMobile(){
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);		   
}

function isTap(e){
	return isMobile && /click/gi.test(e.type);
}
$(document).ready(function(){
	// Still under construction
	// checking if the search was not found
	if($('.searchlink').text() === '' || $('.searchlink').text() === null){
		$('.notting').html('Noting Found' + $('#mongoSearch').val());
		$('.notting').css({
			"textAlign":"center"
		});
	};
	// Removing the flash message sent from the server
	// if($("#flashmsg").style.display == "none"){
	// 	console.log("it worked");
	// }

	// $('.removemsg').on('click', function(){
	// 	$("#flashmsg").hide();
	// });
	$('.comments').hide();
	$('#comment-btn').on('click', function(){
		$('.comments').show(1000);
	});
	$('.delete-article').on('click', function(e){
		$target = $(e.target);
		const id = ($target.attr('data-id'));
		$.ajax({
			type:'DELETE',
			url: '/article/'+id,
			success: function(response){
				alert('Deleting Article');
				window.location.href='/';
			},
			error: function(err){
				console.log(err);
			}
		});
	});
	$('.like-article').on('click', function(e){
		$target = $(e.target);
		const id = ($target.attr('data-id'));
		let check = $('.like-article').text();
		if(check == 'Like'){
			$.ajax({
				type: 'POST',
				url: '/article/like/'+id,
				success: function(response){
					$('.like-article').html('Unlike');
				},
				error: function(response){
					window.location.href='/users/login';
				}
			});
		} else if(check == 'Unlike'){
			$.ajax({
				type: 'POST',
				url: '/article/unlike/'+id,
				success: function(response){
					$('.like-article').html('Like');
				}
			});
		}
		setTimeout(function(){
			$.ajax({
				type: 'GET',
				url: '/article/like/'+id,
				success: function(data){
					$('#data').html(data.like);
				}
			});
		}, 500);
	});

	
	$('.commentbtn').on('click', function(e){
		$target = $(e.target);
		const id = ($target.attr('data-id'));
		setTimeout(function(){
			$.ajax({
				type: 'GET',
				url: '/article/comment/'+id,
				success: function(data){
					console.log(data);
				},
				error: function(error){
					console.log(error);
				}
			});
		}, 1000);
		$('.comments').hide(1000);
	});
});


			/*var canvas = document.getElementById('follow');
			var c = canvas.getContext('2d');
			//console.log(c);
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			
			window.addEventListener('resize',function(){
				canvas.width = window.innerWidth;
				canvas.height = window.innerHeight;
				init();

			})
			//ooo my almighty classass
			var mouse = {
				x:undefined,
				y:undefined
			}
			
			window.addEventListener('mousemove',function(event){
				mouse.x = event.x;
				mouse.y = event.y;
				init();
				/*playPauseUpdate();
			})
			
			// here the programming begeings
			
			function Circle(x, y, r, dr){
				this.x = x;
				this.y = y;
				this.r = r;
				this.dr = dr;
				
				this.draw = function(){
					c.beginPath();
					c.arc(this.x,this.y,this.r,0,Math.PI*2,false);
					c.fillStyle = 'rgba(0,0,0,0.7)';
					c.fill();
				}
				
				
				this.update = function(){
					this.draw();
				}
				
			}
			var circleArray = [];
			function init(){
				circleArray =[];
			
				for(i=0;i<1;i++){
					var r = 20,
						dr = 0.5;
						circleArray.push(new Circle(mouse.x,mouse.y,r,dr));
				}
			}
			// verry impotant!!
			init();
			
			
			function animate(){
				requestAnimationFrame(animate);
				c.clearRect(0,0,innerWidth,innerHeight);
				for(i=0;i<circleArray.length;i++){
					circleArray[i].update();
				}
			}
            animate();
            
            //this is the script for my openning and closing of the navigation bar
            var ogah = document.getElementById('ogah'),
				topman = document.getElementById('top'),
				nash = document.getElementById('bottom'),
				middle = document.getElementById('center'),
				author = middle.style.backgroundColor,
				come = document.getElementById('come'),
				box1 = document.getElementById('box1'),
                wrapper = document.getElementById('wrapper');
            //Open the nav HERE!    
            ogah.addEventListener('click', function(){
                topman.style.animation = 'times 0.3s ease 1 forwards';
                nash.style.animation = 'times1 0.3s ease 1 forwards';
                center.style.backgroundColor = 'transparent';
                ogah.style.zIndex = '98';
                come.style.zIndex = '99';
            });

            //And we close the nav HERE!
            come.addEventListener('click', function(){
                topman.style.animation = 'rev 0.3s ease 1 forwards';
                nash.style.animation = 'rev1 0.3s ease 1 forwards';
                center.style.backgroundColor = '#eac117';
                ogah.style.zIndex = '99';
                come.style.zIndex = '98';
            });
           /* function openNav(){
                topman.style.animation = 'times 0.3s ease 1 forwards';
                nash.style.animation = 'times1 0.3s ease 1 forwards';
                center.style.backgroundColor = 'transparent';
                ogah.style.zIndex = '98';
                come.style.zIndex = '99';
            if(window.innerWidth <= '991'){
                box1.style.display = 'grid';
            }
            else if(window.innerWidth >= '992'){
                wrapper.style.gridTemplateColumns = '1fr 4fr 1fr';
                box1.style.display = 'grid';
            }
      	    }
        
	        function closeNav(){
	            topman.style.animation = 'rev 0.3s ease 1 forwards';
	            nash.style.animation = 'rev1 0.3s ease 1 forwards';
	            center.style.backgroundColor = '#eac117';
	            ogah.style.zIndex = '99';
	            come.style.zIndex = '98';
	            if(window.innerWidth <= '991'){
	                box1.style.display = 'none';
	            }
	            else if(window.innerWidth >= '992'){
	                wrapper.style.gridTemplateColumns = '0fr 5fr 1fr';
	                box1.style.display = 'none';
	            }
	        } */
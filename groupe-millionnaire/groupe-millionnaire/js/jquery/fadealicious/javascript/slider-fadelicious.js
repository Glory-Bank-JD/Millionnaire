/*
 * http://www.codesscripts.fr/demos/fadealicious/index.html
 * Modifié par Julien
 * Correction bug navigation par pagination
 */
var pause = 6000;
var speed = 500;
var start_after_nav = false;
var pause_on_hover = false;
var show_pagination = true;
var show_next_prev = true;


function init_slider(){

	if( $('#slider-container .slide').length > 1 ) 
	{
		show_pagination = true;
		show_next_prev = true;
	}
	else{
		show_pagination = false;
		show_next_prev = false;
	}
	
	if (show_pagination){
		var slides_no = $('#slider-container .slide').length;
		$("#slider-container").append('\n<ul class="pagination"></ul>\n');
		$("ul.pagination").append("<li class='current'><a href='#1' title='1'>1</a></li>");
		for( var i = 2; i <= slides_no ; i++)
		{
			$("ul.pagination").append("<li><a href='#" + i + "' title='" + i + "'>" + i + "</a></li>");	
		}
		// centering navigation
		var container_width = $('#slider-container').width();
		var pagination_width = $('ul.pagination').outerWidth(true);
		var margin_left = parseInt(container_width / 2 - pagination_width / 2);
		margin_left = margin_left + "px";
		$('ul.pagination').css("margin-left", margin_left);
	}
	
	if (show_next_prev){
		$("#slider-container").append('\n<span class="next"></span>\n<span class="prev"></span>\n');
	}

	$("#slider-container .slide:first").addClass("current");
	$('#slider-container .slide .info .title').css({top: -200});
	$('#slider-container .slide .info .description').css({bottom: -200});
	
	var title_h = $("#slider-container .slide.current .info .title").height();
	var description_h = $("#slider-container .slide.current .info .description").height();
	var description_pos = 270 - title_h - description_h;
	
	$("#slider-container .slide.current .info .title").animate({top: 0}, speed, function(){
		$("#slider-container .slide.current .info .description").animate({bottom: description_pos}, speed);
	});

}


function next_slide(step) {
	var is_animated = $("div:animated").length;
	if (!is_animated){
		var CurSlide = $('#slider-container .slide.current');
		var NxtSlide = CurSlide.next('div');
			
		if (NxtSlide.length == 0) NxtSlide = $("#slider-container .slide:first");
		if (step > 1)
		{
			for(var i = 2 ; i <= step ; i++){
				NxtSlide = NxtSlide.next();
				if (NxtSlide.length == 0) NxtSlide = $("#slider-container .slide:first");
			}
		}		
	
		CurSlide.removeClass('current').addClass('previous');
/*		CurSlide.find(".info .title").animate({top: 0}, speed, function(){
			CurSlide.find(".info .description").animate({bottom: 0}, speed);
		});*/
		
		NxtSlide.find(".info .title").animate({top: 0}, speed, function(){
			var title_h = NxtSlide.find(".info .title").height();
			var description_h = $(".slide.current .info .description").height();
			var description_pos = 270 - title_h - description_h;																
			NxtSlide.find(".info .description").animate({bottom: description_pos}, speed);
			
			CurSlide.find(".info .description").css("bottom", "-200px");
			CurSlide.find(".info .title").css("top", "-200px");
		});
		
		NxtSlide.css({ opacity: 0.0 }).addClass('current').animate({ opacity: 1.0 }, 1000, function() {
				CurSlide.removeClass('previous');
		});
		
		if (show_pagination) pagination();
	}
	
	
}

function prev_slide(step) {
	var is_animated = $("div:animated").length;
	if (!is_animated){
		var CurSlide = $('#slider-container .slide.current');
		var NxtSlide = CurSlide.prev();
			
		if (NxtSlide.length == 0) NxtSlide = $("#slider-container .slide:last");
		step = -1*step;
		
		if (step > 1)
		{
			for(var i = 2; i <= step ; i++){
				NxtSlide = NxtSlide.prev();
				if (NxtSlide.length == 0) NxtSlide = $("#slider-container .slide:last");
			}
		}		
	
		CurSlide.removeClass('current').addClass('previous');
		
		NxtSlide.find(".info .title").animate({top: 0}, speed, function(){
			var title_h = NxtSlide.find(".info .title").height();
			var description_h = $(".slide.current .info .description").height();
			var description_pos = 270 - title_h - description_h;																	
			NxtSlide.find(".info .description").animate({bottom: description_pos}, speed);
			
			CurSlide.find(".info .description").css("bottom", "-200px");
			CurSlide.find(".info .title").css("top", "-200px");
		});
		
		NxtSlide.css({ opacity: 0.0 }).addClass('current').animate({ opacity: 1.0 }, 1000, function() {
				CurSlide.removeClass('previous');
		});
		
		if (show_pagination) pagination();
	}
	
	
}

function pagination(){
	var ord = $('#slider-container .slide.current').prevAll().length + 1;
	$("ul.pagination li").removeClass("current");
	$("ul.pagination li:nth-child(" + ord + ")").addClass("current");
}




var intval = "";
function start_int(pause){
	if(intval == ""){
	  intval = window.setInterval("next_slide(1)", pause);
  }else{
	  stop_int();
  }
}

function stop_int(){
	if(intval != ""){
	  window.clearInterval(intval);
	  intval = "";
  }
}

			
jQuery(document).ready(function($){
	init_slider();	
	start_int(pause);
	
	$("span.next").click(function(){
		next_slide(1); 
		stop_int(); 
		if (start_after_nav) start_int(pause);
	});
	$("span.prev").click(function(){
		prev_slide(1); 
		stop_int(); 
		if (start_after_nav) start_int(pause);
	});
	
	$(document).keydown(function(e){
		if (e.keyCode == 39) { 
		   next_slide(1);
		   stop_int();
		   if (start_after_nav) start_int(pause);
		   return false;
		}
	});
	
	$(document).keydown(function(e){
		if (e.keyCode == 37) { 
		   prev_slide(1);
		   stop_int();
		   if (start_after_nav) start_int(pause);
		   return false;
		}
	});
	
	$("ul.pagination li a").click(function(){	
		
		var title = parseInt($(this).attr("title"));
		var cur_title = parseInt($("ul.pagination li.current a").attr("title"));
		var steps = title - cur_title;
		
		if (steps > 0)
		{
			next_slide(steps);
			stop_int();
		   	if (start_after_nav) start_int(pause);
		}
		if (steps < 0)
		{
			prev_slide(steps);
			stop_int();
		   	if (start_after_nav) start_int(pause);			
		}
	});
	
	if (pause_on_hover){
		$("#slider-container").hover(function(){stop_int()}, function(){start_int(pause)});
	}
	
	


	stop_int();


	var settings1 = {
    	sensitivity: 5,
    	interval: 20,
    	over: function(){$('#slider-container .prev').animate({opacity: 1}, 200 )},
    	out: function(){$('#slider-container .prev').animate({opacity: 0.3}, 200 )}
	}; 
	var settings2 = {
    	sensitivity: 5,
    	interval: 20,
    	over: function(){$('#slider-container .next').animate({opacity: 1}, 200 )},
    	out: function(){$('#slider-container .next').animate({opacity: 0.3}, 200 )}
	}; 
	
	//$("#slider-container .prev").hoverIntent(settings1);
	//$("#slider-container .next").hoverIntent(settings2);
	
	
	
	

});
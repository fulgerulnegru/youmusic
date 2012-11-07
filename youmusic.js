var autorepeat = false;
var next_url = null;
jQuery.noConflict();

function getPlayerType() {
  var flash = getFlashPlayer();
  if (flash)
    return 1;
  else
    return 0;
}

function getFlashPlayer() {
  return flash = document.getElementById("movie_player");
}

function getHtmlPlayer() {
  return html5 = document.querySelector('video.video-stream');
}

function check_completion() {
  var html5 = getHtmlPlayer();
  var flash = getFlashPlayer();

 if (flash) {
   if(flash.getCurrentTime() == flash.getDuration()) {
     playNext();
     return 1;
  }
 } else if(html5) {
   if(html5.currentTime == html5.duration) {
     playNext();
     //setTimeout(playNext, 0);
     return 1;
   }
 }
 return 0;
}

function doPoll() {
  if (!autorepeat && !next_url) return;
  if (check_completion()) {
  } else {
    setTimeout(doPoll, 420);
  }
}

function playNext() {
  console.log("Play next");
  if (autorepeat) {
    if (getPlayerType()) {
      getFlashPlayer().playVideo();
    } else {
      getHtmlPlayer().play();
    }
    setTimeout(doPoll, 420);
  } else if (next_url) {
    window.location.href = next_url;
  }
}

function createUI(){
  var label = document.createElement('span');
  label.setAttribute('for', 'youmusic-checkbox');
  label.setAttribute('class', 'yt-uix-button-content');
  label.innerHTML = 'Repeat';
  var checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.onchange = function(){
    if(autorepeat = checkbox.checked){
      doPoll();
    }
  }
  checkbox.id = 'youmusic-checkbox';

  var container = jQuery("#watch-like-dislike-buttons").prepend('<button title="Repeat" type="button" class=" yt-uix-button yt-uix-button-text yt-uix-tooltip" id="repeat" data-button-toggle="true" role="button" data-tooltip-text="Repeat"></button>');;
  /*var container = jQuery("#watch-like-dislike-buttons").prepend('<button title="Repeat" type="button" class=" yt-uix-button yt-uix-button-text yt-uix-tooltip" id="watch-like" data-button-toggle="true" role="button" data-tooltip-text="Apreciez"><span class="yt-valign-trick"></span></span><span class="yt-uix-button-content">Repeat</span></button>');;*/
  container = document.getElementById("repeat");
  console.log(container);
  container.appendChild(checkbox);
  container.appendChild(label);
  jQuery('#watch-like-dislike-buttons').prependTO(container);
  return container
}


function appendUI(){
  var sidebar = document.getElementById('watch-sidebar');
  var ui = createUI();
  if(sidebar){ //insert before sidebar
    ui.className = 'watch-module';
    sidebar.insertBefore(ui, sidebar.firstChild);
  }else{ //PlanB
    ui.style.position = 'absolute';
    ui.style.top = '10px';
    ui.style.left = '10px';
    document.body.appendChild(ui);
  }
}

function addNext(evt) {
  next_url = jQuery(evt.currentTarget).parent().find('.related-video').attr('href');
  console.log(next_url, "next_url");
  evt.preventDefault();
  setTimeout(doPoll, 1);
}

jQuery(document).ready(function () {
  setTimeout(appendUI, 1000);
  jQuery(".video-list-item").mouseenter(function(evt) {
    console.log(jQuery(evt.currentTarget), "enter")
    var d = jQuery('<a href="#" class="ym-play_next">Play next</a>');
    jQuery(d).css({
      position: "static",
      right: -35,
      top: -100,
      padding: "4px 8px",
      background: "#003366",
      color: "#FFF"
    });
    jQuery(d).bind('click', addNext);
    jQuery(evt.currentTarget).append(d);
  }).mouseleave(function (evt) {
    console.log(jQuery(evt.currentTarget), "leave")
    jQuery(evt.currentTarget).find('.ym-play_next').remove();
  });
});

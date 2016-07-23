// ==UserScript==
// @name            Enhanced Pokevision
// @namespace       pokevision.com
// @author          Justus
// @include         https://pokevision*
// 
// @run-at              document-ready
// @include-jquery      true
// @version             1.0.1
// ==/UserScript==


// This part removes the cooldown disable so you can refresh more often, please do not abuse this!
var btn = $('button.home-map-scan.btn').click(function () {
    cleanBtn();
});

function cleanBtn() {
    if ( !btn.attr('disabled') ) {
        window.setTimeout(cleanBtn, 500);
        return;
    }
    btn.removeAttr('disabled');
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

// On to the part that allows you to filter stuff:
$('#style_helper').remove();
$('#togglecontainer').remove();

$('<style id="style_helper" type="text/css">').appendTo(document.head);
$('<div id="togglecontainer">').appendTo(document.body);

// Load Pokemon from Cookies if possible.
var preloaded_pokemon = getCookie('pokevision_stored_filters');
var pokemon = [];
if (preloaded_pokemon) {
  pokemon = JSON.parse(preloaded_pokemon);
  preloaded_pokemon = true;
} else {
  preloaded_pokemon = false;
}

var pre_hidden = [10, 11, 13, 14, 16, 19, 20, 21, 41];

for (var i = 1; i <= 150; i += 1) {
  $(
    '<img data-id="' + i + '" id="pokemon_' + i + '" title="Pokemon: ' + i + '" src="//ugc.pokevision.com/images/pokemon/' + i + '.png">'
  ).appendTo('#togglecontainer')
  .click(function () {
    var pid = $(this).attr('data-id');
    pokemon[pid-1].active = !pokemon[pid-1].active;
    updateCss();
    setCookie('pokevision_stored_filters', JSON.stringify(pokemon), 365);
  });
  var state = true;
  if (pre_hidden.indexOf(i) > -1) {
    state = false;
  }
  if (!preloaded_pokemon) {
    pokemon.push({pid: i, active: state});
  }
}


function replacer(pid, display) {
  if (display) {
    return '';
  }
  display = 'none';
  var border = 'border: 1px solid grey; border-radius: 20px;';
  return `.home-map img.leaflet-marker-icon[src$='pokemon/{{id}}.png'] ~ *,
.home-map img.leaflet-marker-icon[src$='pokemon/{{id}}.png'] {
  display: {{display}};
}
#togglecontainer img#pokemon_{{id}} {
{{border}}
}`
    .replace(new RegExp('{{id}}', 'g'), pid)
    .replace(new RegExp('{{display}}', 'g'), display)
    .replace(new RegExp('{{border}}', 'g'), border);
}

function updateCss() {
  var css = `
#togglecontainer {
  position: absolute;
  top: 0; left: 0;
  width: 40px;
  height: 40px;
  background: white;
  overflow: hidden;
  z-index: 9999999999999;
  border: 1px solid black;
  border-radius: 5px;
}
#togglecontainer:hover, #togglecontainer:focus {
  width: 240px;
  height: 480px;
  overflow: auto;
}
#togglecontainer img {
  float: left; width: 40px; height: 40px;
}`;
  pokemon.forEach(function (obj) {
    css += replacer(obj.pid, obj.active);
  });
  $('#style_helper').empty().append(
    css
  );
}

updateCss();
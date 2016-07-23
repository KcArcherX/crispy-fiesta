// ==UserScript==
// @name            Enhanced Pokevision
// @namespace       pokevision.com
// @author          Justus
// @include         https://pokevision*
// 
// @run-at              document-ready
// @include-jquery      true
// @version             1.0.0
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


// On to the part that allows you to filter stuff:
$('#style_helper').remove();
$('#togglecontainer').remove();

$('<style id="style_helper" type="text/css">').appendTo(document.head);
$('<div id="togglecontainer">').appendTo(document.body);

var pokemon = [];
var pre_hidden = [
  10, 11, 13, 14, 16, 19, 20, 21, 41];

for (var i = 1; i <= 150; i += 1) {
  $(
    '<img data-id="' + i + '" title="Pokemon: ' + i + '" src="//ugc.pokevision.com/images/pokemon/' + i + '.png">'
  ).appendTo('#togglecontainer')
  .click(function () {
    var pid = $(this).attr('data-id');
    pokemon[pid-1].active = !pokemon[pid-1].active;
    updateCss();
  });
  var state = true;
  if (pre_hidden.indexOf(i) > -1) {
    state = false;
  }
  pokemon.push({pid: i, active: state});
}


function replacer(pid, display) {
  var border = '';
  if (!display) {
    display = 'none';
    border = 'border: 1px dashed black; ';
  }
  else {
    display = 'block';
  }
  return `.home-map img[src$='pokemon/{{id}}.png'] ~ *, .home-map img[src$='pokemon/{{id}}.png'] {
  display: {{display}};
}
#togglecontainer img[src$='pokemon/{{id}}.png'] {
{{border}}
}`
    .replace(new RegExp('{{id}}', 'g'), pid)
    .replace(new RegExp('{{display}}', 'g'), display)
    .replace(new RegExp('{{border}}', 'g'), border);
}

function updateCss() {
  var css = '';
  pokemon.forEach(function (obj) {
    css += replacer(obj.pid, obj.active);
  });
  $('#style_helper').empty().append(
    `
#togglecontainer {
  position: absolute;
  top: 0; left: 0;
  width: 40px;
  height: 40px;
  background: white;
  overflow: hidden;
  z-index: 9999999999999;
}
#togglecontainer:hover {
  width: 240px;
  height: 480px;
  overflow: auto;
}
#togglecontainer img {
  float: left; width: 40px; height: 40px;
}` +
    css
  );
}

updateCss();
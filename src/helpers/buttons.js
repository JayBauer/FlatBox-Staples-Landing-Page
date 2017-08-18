module.exports = function(type,target,options) {
  var markup = '<a href="' + options.fn(this) + '" ';
  if (target == 'blank') {
    markup += 'target="_blank" ';
  }
  if (type == 'buy') {
    markup += `class="yellow-button" onclick="ga('send', 'event', 'Staples', 'Click', 'Buy Online', '1'); console.log('click');"><h4>Buy Online!</h4></a>`;
  }
  if (type == 'find') {
    markup += `class="green-button" onclick="ga('send', 'event', 'Staples', 'Click', 'Find a Store', '1'); console.log('click');"><h4>Find a Store!</h4></a>`;
  }
  return markup;
}

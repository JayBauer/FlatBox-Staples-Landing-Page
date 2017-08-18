function getData(url) {
  var locations;
  $.ajax({
    url: url,
    dataType: 'text',
    async: false,
    success: function(data) {
      locations = parseCSV(data);
    }
  });
  return locations;
}

function parseCSV(csv) {
  var stores = [];
  var rows = csv.split('\n');
  for (var i=1, row; row=rows[i]; i++) {
    row = parseRow(row);
    stores.push(row);
  }
  return stores;
};

function parseRow(row) {
  if (row.charAt(0) == '"') {
    row = row.substring(1);
  }
  if (row.charAt(row.length - 2) == '"') {
    row = row.substring(0, row.length - 2);
  }
  row = row.split(',');
  return row;
};

window.getData = getData;

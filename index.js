var express = require('express');
var app = express();
var mysqlGateway = require('mysql-gateway');
var gateways = mysqlGateway.gateways;
var table = mysqlGateway.table;
var cp = require('child_process');
var bodyParser = require('body-parser');

var child = null;

app.use(bodyParser.urlencoded());
app.use(express.static('/home/alex/launcher/docroot'));

app.post('/apps/get', function (req, res) {
  gateways.apps.get({}, function (err, data) {
    res.json({
      code: 200,
      data: data
    });
  });
});

app.post('/app/run', function (req, res) {
  var id = req.body.id;
  gateways.apps.get({ id: id }, function (err, data) {
    if (data.length > 0) {
      var args = data[0].app_path.split(' ');
      var command = args.shift();
      if (child != null) {
        child.kill('SIGINT');
      }
      child = cp.spawn(command, args);
      child.on('close', function () {
        child = null;
      });
    }
  });
  res.end('blarg');
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

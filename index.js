var moment = require('moment');
var http = require('https');
var fs = require('fs');
var unzipper = require('unzipper');
var dir = './data';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

var startDate = moment(process.argv[2] || '2020-01-01');
var endDate = moment(process.argv[3] || '2020-01-02');

const extractData = 'extract';

for (var m = moment(startDate); m.isBefore(endDate); m.add(1, 'days')) {
    var i = m.format('DDMMYY');
    var Result = 'https://www.bseindia.com/download/BhavCopy/Equity/EQ' + i + '_CSV.ZIP';
    const path = `data/${i}.zip`;
    download(Result, path, () => {
        console.log('Saved! ' + path);
        fs.createReadStream(path)
            .pipe(unzipper.Extract({
                path: `${extractData}`
            }));
    });
}

function download(url, dest, cb) {
    var file = fs.createWriteStream(dest);
    http.get(url, function (response) {
        response.pipe(file);
        file.on('finish', function () {
            file.close(cb);
        });
    }).on('error', function (err) {
        fs.unlink(dest);
        if (cb) cb(err.message);
    });
};
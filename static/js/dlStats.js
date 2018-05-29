var Downloader = require('mt-files-downloader');

module.exports = function ( num,downloads,win) {
  num = num || 1;
  var frontData={}
  var it = setInterval(function () {

    var speed = 0;
    var eta = 0;
    var progress = 0;
    console.clear();
    var dls = downloads
    var curDls=downloads['curDls']
    console.log(dls.length + ' // ' + curDls)

    dls.forEach(function (item) {

		//	console.log(item.status + ' // ' + item.name +
				//(item.status == 3 ? '\t✅  \tfinished' : '') +
				//(item.status == 1 ? '\t〽️  \tdownload in progress...' : '') +
			//	(item.status == 0 ? '\t💬  \twait for download' : '') +
			//	(item.status == 2 ? '\t⚠️  \terror, retrying ' : '') +
			//	(item.status == -1 ? '\t❌  \terror ' : ''));

			// Check if item can start downloaded
			//if (item.status == 0 && curDls < simultaneousDownload) {
				//	item.start()
				//curDls++;
		//	}

			// Calcul speed / eta / progress of all current download
			var stats = item.getStats()
			speed += stats.present.speed
      !isNaN(stats.future.eta) && isFinite(stats.future.eta) ? eta += stats.future.eta : eta += 0  
      progress += stats.total.completed
      //console.log('eta', eta)
		});

		// Check if we have finished to download all files
		if (curDls == 0) {
      console.log('done')
      //win.webContents.send('doneLoading', frontData);
			clearInterval(it);
			return;
		}

		progress = progress / (dls.length +1); // I don't know why +1 but it is needed x)
		eta = eta / dls.length;
    frontData.progress=progress
    frontData.eta=eta
		console.log('Download progress: ' + progress + ' %');
		//console.log('Download speed: ' + Downloader.Formatters.speed(speed));
    console.log('Download ETA: ' + Math.floor( eta)+'s' + Downloader.Formatters.remainingTime(eta));
    win.webContents.send('loading', frontData);
	}, 250);
};

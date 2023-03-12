var express = require('express');
var router = express.Router();

const { open } = require('node:fs/promises');

let stocksData = [];

(async () => {
    const file = await open('stocks-data.csv');
    
    for await (const line of file.readLines()) {
	stocksData.push(line);
    }
})();



/*Get stock listing. */
router.get('/', function(req, res, next) {
    const pageNumber = Number(req.query.page);
    const pageSize = Number(req.query.pageSize);
    const invalidParam = !isNaN(pageNumber) && !isNaN(pageSize);
    
    if(!invalidParam) {
	res.status(400).send('Bad query param: page=' + req.query.page
			     + ' pageSize=' + req.query.pageSize)
    } else {
	const start = pageNumber * pageSize;
	const end = pageSize;
	console.log('Getting stock data from start index: ' + start + 'to end index: ' + end);
	const headers = stocksData.at(0).split(",");
	console.log(typeof headers);
	const result = stocksData.slice(start+1, start + end+1);
	const jsonArray = [];
	
	result.map((item) => {
	    const secData = item.split(",");
	    let stockItem = {};
	    try {
		headers.map((h, idx) => {
		    //console.log(h + ' yo ');//+ idx);
		    if(h === 'SC_CODE') {
			stockItem['id'] = secData[idx];
		    } else {
			stockItem[h] = secData[idx];
		    }
		});

	    } catch (error) {
		console.error(error);
		// Expected output: ReferenceError: nonExistentFunction is not defined
		// (Note: the exact output may be browser-dependent)
	    }
	    jsonArray.push(stockItem);
	});
	res.send(jsonArray);
    }
});

module.exports = router;

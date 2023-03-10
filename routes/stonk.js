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
	res.send(stocksData.slice(start, start + end));
    }
});

module.exports = router;

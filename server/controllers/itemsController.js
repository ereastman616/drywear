const { pool } = require('../config')


const itemsController = {};


itemsController.getItems = (req, res, next) => {

  pool.query('SELECT * FROM items', (err, results) => {
    if (err) {
      res.send(err)
      throw err
    }
    res.status(200).json(results.rows)
  })
}

// sends back an items object stored on res.locals that has shoes, tops and bottoms properties
// all shoes are selected, and tops and bottoms that haven't been worn in the last 7 days are selected
itemsController.availableItems = (req, res, next) => {

  pool.query(`SELECT * FROM items WHERE type='shoes'`)
    .then(results => {
      res.locals.items = {};
      res.locals.items.shoes = results.rows;
      return pool.query(`SELECT * FROM items WHERE type = 'top' AND date < NOW() - INTERVAL '7 days'`)
    })
    .then(results => {
      res.locals.items.tops = results.rows;
      return pool.query(`SELECT * FROM items WHERE type = 'bottom' AND date < NOW() - INTERVAL '7 days'`)
    })
    .then(results => {
      res.locals.items.bottoms = results.rows;
      next();
    })
    .catch(e => console.error(e))
}

itemsController.filterOutfits = (req, res, next) => {

  let filter = '';

  // when the whether option is selected, add the condition to the query
  if (req.body.weather) {
    filter = ` AND weather = '${req.body.weather.value}' `;
  }

  // create items object to store the filtered shoes, bottoms, and tops
  // and stores in res.locals then pass to the next midware
  pool.query(`SELECT * FROM items WHERE type='shoes'${filter}`)
    .then(results => {
      // results contains all the shoes that has same whether value with passed one
      res.locals.items = {};
      res.locals.items.shoes = results.rows;
      return pool.query(`SELECT * FROM items WHERE type = 'top'${filter}AND date < NOW() - INTERVAL '7 days'`)
    })
    .then(results => {
      // results contains all the tops that has same whether value with passed one
      res.locals.items.tops = results.rows;
      return pool.query(`SELECT * FROM items WHERE type = 'bottom'${filter}AND date < NOW() - INTERVAL '7 days'`)
    })
    .then(results => {
      // results contains all the bottoms that has same whether value with passed one
      res.locals.items.bottoms = results.rows;
      next();
    })
    .catch(e => console.error(e))
}

// changes date of items that were selected
itemsController.updateItemsDate = (req, res, next) => {

  const { top, bottom, shoes } = req.body;

    pool.query(`UPDATE items SET date=NOW() WHERE id IN ( ${top}, ${bottom}, ${shoes} )`)
    .then(results => {
      next();
    })
    .catch(e => console.error(e))
}

// updates dates of items for deleted outfit in history
itemsController.updateItemDates  = (req, res, next) => {

  const { topId, bottomId, shoesId } = req.body;

  // TODO: Change date to 8 days ago, dynamically
  pool.query(`UPDATE items SET date='2019-09-05' WHERE id IN (${topId}, ${bottomId}, ${shoesId})`, (err, results) => {
    if (err) {
      console.log(err - ' outfitsController.removeOutfit');
    }
    console.log('Outfit successfully removed!');
    next();
  })
}

// properties sent from the client in req.body are inserted into database
itemsController.addItem = (req, res, next) => {
  const { secure_url } = req.file;
  res.locals.imageUrl = secure_url;
  const {color, type, weather, isFormal} = req.body;


  pool.query(`INSERT INTO items (image, file, type, weather, formal, color, date) VALUES('${secure_url}', '${req.file.filename}', '${type}', '${weather}', '${isFormal}', '${color}', (to_timestamp(${Date.now()} / 1000.0)))`)
    .then(resp =>{
      return next();
    })
    .catch(e => console.error('unsuccessful img insertion to db', e));
}


itemsController.getUploads = (req, res, next) => {

  pool.query(`SELECT image FROM items`, (err, results) => {
    if (err) return next({log: 'Error getting images from DB', message: 'Error in getUploads'});
    console.log('results is', results)
    res.locals.uploads = results.rows[2].imgfile_name;
    next();
  })
}


module.exports = itemsController;

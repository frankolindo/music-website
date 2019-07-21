const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
let Article = require('../modules/articleModule');
let User = require('../modules/user');

//Get single article
//Set stroage engine
const storage = multer.diskStorage({
	destination: './public/uploads/',
	filename: function(req, file, cb){
		cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
	}
});

//init upload viarable
const upload = multer({
	storage: storage,
	limits: {fileSize: 1000000},
	fileFilter: function(req, file, cb){
		checkFileType(file, cb);
	}
}).single('Avartar');

//check file type
function checkFileType(file, cb){
	// Allowed extentions
	const filetypes = /jpeg|jpg|png|gif/;
	// Check extention
	const extname = filetypes.test(path.extname(file.originalname).toLocaleLowerCase());
	// Check mime
	const mimetype = filetypes.test(file.mimetype);

	if(mimetype && extname){
		return cb(null, true);
	} else{
		console.log(extname);
	}
}

// Get upload
router.get('/upload/:id', ensureAuthenticated, function(req, res){
	Article.findById(req.params.id, function(err, article){
		if(article.author != req.user._id){
			req.flash('danger', 'Not authorized');
			res.redirect('/');
		} else{
			res.render('image', {
				title:'Images Upload',
				article:article
			});
		}
	});
});

// router.get('/upload/:id', function(req, res){
// 	res.render('image');
// });

// Posting the user image
router.post('/upload/:id', function(req, res){
	upload(req, res, function(err){
		if(err){
			req.flash('danger','Image too large');
			res.redirect('/');
		} else{
			if(req.file == undefined){
				req.flash('danger','please add an image');
				res.redirect('/');
			} else{
				let file = `/uploads/${req.file.filename}`;
				let articles = {};
				articles.image = file;
				let query = {_id:req.params.id}
				Article.updateOne(query, articles, function(err){
					if(err){
						console.log(err);
						return;
					}
					else{
						req.flash('success', 'Image Updated');
						res.redirect('/');
					}
				});			
				// res.render('image', {
				// 	file: `/uploads/${req.file.filename}`
				// });
			}
		}
	})
});
router.get('/articles/add', ensureAuthenticated, function(req, res){
	res.render('add_article', {
		title:'Add article'
	});
});

router.post('/articles/add', function(req, res){
	upload(req, res, function(err){
		req.checkBody('title','Title is requried').notEmpty();
		req.checkBody('body','Body is requried').notEmpty();
		//req.checkBody('Avartar','Please add image').notEmpty();
		//Get Error is they are not required
		let errors = req.validationErrors();

		if(errors){
			res.render('add_article', {
				title:'Add article',
				errors:errors
			});
		} 
		else{
			if(err){
				req.flash('danger','Image too large');
				res.redirect('/');
			} else{
				let file = `/uploads/${req.file.filename}`;
				let articles = new Article();
				articles.title = req.body.title;
				articles.author = req.user._id;
				articles.body = req.body.body;
				articles.image = file;
				articles.like = 0;
				articles.save(function(err){
					if(err){
						console.log(err);
						return;
					}
					else{
						req.flash('success','Article Added');
						res.redirect('/');
					}
				});		
			}
		}
	})
});

//Editing of articles
router.get('/article/edit/:id', ensureAuthenticated, function(req, res){
	Article.findById(req.params.id, function(err, article){
		if(article.author != req.user._id){
			req.flash('danger', 'Not authorized');
			res.redirect('/');
		} else{
			res.render('edit_article', {
				title:'Edit Article',
				article:article
			});
		}
	});
});

//Post edited aarticles or Update 
router.post('/articles/edit/:id', function(req, res){
	let articles = {};
	articles.title = req.body.title;
	articles.author = req.user._id;
	articles.body = req.body.body;
	
	let query = {_id:req.params.id};
	Article.updateOne(query, articles, function(err){
		if(err){
			console.log(err);
			return;
		}
		else{
			req.flash('success', 'Article Updated');
			res.redirect('/');
		}
	});
});
// Liking article
router.get('/article/like/:id', function(req, res){

	Article.findById(req.params.id, function(err, article){
		if(err){
			console.log(err);
			req.flash('danger', 'Please Login');
			res.redirect('/');
		} else{
			res.send(article);
			//console.log(article.like + 1);
		}
	});
});

//Posting the likes
router.post('/article/like/:id', function(req, res){
	let query = {_id:req.params.id};
	let articles = {};
	articles.like = 1;
	Article.updateOne(query, {$inc:articles}, function(err){
		if(err){
			console.log(err);
		} else{
			//console.log(articles.like);
			res.send(articles);
		}
	});
});
//Unlike article
router.post('/article/unlike/:id', function(req, res){
	let query = {_id:req.params.id};
	let articles = {};
	articles.like = -1;
	Article.updateOne(query, {$inc:articles}, function(err){
		if(err){
			console.log(err);
		} else{
			//console.log(articles.like);
			res.send(articles);
		}
	});
});


//Deleting article
router.delete('/article/:id', function(req, res){
	if(!req.user._id){
		res.status(500).send();
	}

	let query = {_id:req.params.id}

	Article.findById(req.params.id, function(err, article){
		if(article.author != req.user._id){
			res.status(500).send();
		} else{
			Article.deleteOne(query, function(err){
				if(err){
					console.log(err);
				}
				res.send('success');
			});
		}
	});
});

router.get('/article/:id', ensureAuthenticated, function(req, res){
	Article.findById(req.params.id, function(err, article){
		User.findById(article.author, function(err, user){
			res.render('article', {
				article:article, 
				author:user.name
			});
		});
	});
});

// Searching for Articles
router.post('/article/search', function(req, res){
	let search = req.body.mongoSearch;
	//res.render('search', {title:search});
	Article.find({$text: {$search: search}}, function(err, article){
		if(err){
			console.log(err);
		} else{
			res.render('search', {articles:article})
		}
	});
});

//Access control
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else{
		req.flash('danger', 'Please Login');
		res.redirect('/users/login');
	}
}

module.exports = router;

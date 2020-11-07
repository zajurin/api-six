require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');



const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
	extended:true
}));

app.use(express.static('public'));

// MONGOOSE

const URI = process.env.MONGODB_URI;

mongoose.connect(URI, {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = {
	title: String,
	content: String
};

const Article = mongoose.model('Article', articleSchema);

/////////////////////////Requests Targetting all Articles/////////////////

app.route('/articles')
    .get(function(req, res){
    	Article.find((err, foundArticles)=>{
    		if(!err){
    			res.send(foundArticles);
    		}else{
    			res.send(err);
    		}
    	});
    })
    .post(function(req, res){
    	const newArticle = new Article({
    		title: req.body.title,
    		content: req.body.content    		
    	});
    	newArticle.save(function(err){
    		if(!err){
    			res.send("Successfully ADDED a new article!");
    		}else{
    			res.send(err);
    		}
    	});
    })
    .delete(function(req, res){
	Article.deleteMany(function(err){
		if(!err){
			res.send('Successfully Deleted');
		}else{
			res.send(err);
		}
	});
});

//////////Requests Targetting a Specific Article/////////////// 

app.route('/articles/:articleTitle')
.get(function(req, res){
	Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
		if (foundArticle){
			res.send(foundArticle);
		}else{
			res.send("No articles matching that title was found")
		}
	});
})
.put(function(req, res){
	Article.update(
		{title: req.params.articleTitle},
		{title: req.body.title, content: req.body.content},
		{overwrite: true},
		function(err){
			if(!err){
				res.send('Successfully UPDATED');
			}else{
				res.send(err);
			}
		}
	);
})
.patch(function(req, res){
	Article.update(
		{title: req.params.articleTitle},
		{$set: req.body},
		function(err){
			if (!err) {
				res.send('UPDATED with PATCH');
			}else{
				res.send(err);
			}
		});
})
.delete(function(req, res){
	Article.deleteOne(
		{ title: req.params.articleTitle},
		function (err){
			if(!err){
				res.send('Successfully DELETED');
			}else{
				res.send(err);
			}
		}
	);
});	

app.listen(port, function(){
	console.log(`Server started on port: ${port}`);
});


//EMAMPLEEEE
//EXPRESS
// app.delete('/', function (req, res) {
//   res.send('DELETE request to homepage')
// })

//MONGOOSE
// Character.deleteOne({ name: 'Eddard Stark' }, function (err) {});


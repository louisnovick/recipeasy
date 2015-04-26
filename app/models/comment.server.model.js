var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CommentSchema = new Schema({
	recipeId: { type: String },
	comment: { type: String },
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	timestamp: { type: Date, 'default': Date.now }
});

module.exports = mongoose.model('Comment', CommentSchema);
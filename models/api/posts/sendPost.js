const mongoose = require('mongoose')
const Posts = mongoose.model('posts')
const Users = mongoose.model('users')
const Likes = mongoose.model('likes')
var Notifications = require('../classNotifications.js')
var tools = require('../../tools.js')

const sendPost = (req, res) => {
	var alias = req.body.created_by ? req.body.created_by.toLowerCase() : undefined;
	if(!alias){
		return res.send({message: "Empty alias"});
	}
	var photo = req.body.photo || undefined;
	var text = compileText(req.body.text);

	Users.findOne({alias: alias}, function(err, user){
		if(err) throw err;
		if(!user){
			return res.send({error: 1, message: "User not found."});
		}
			if(photo){

			} else {
				if(!text || text == ''){
					return res.send({error:1, message: "пустое сообщение отправить нельзя"});
				}
			}
			
			if(text.length > 400){
				return res.send({error:1, message: "Максимальная длина поста — 299 символов"});
			}
			// Check if this post not equals to the previous one
			// If it is -> Error message
			// Otherwise continue
			
			Posts.findOne({}).sort({_id: -1}).exec(function(err, post){
				if(post){
					if(post.text == text){
						return res.send({message: "Вы не можете отправить две одинаковые записи подряд."});
					}
				}
				// Check user profile type
				// If 1 send to wall.
				// If 2 send to moderating
				var newPost = new Posts();

				if(user.profileType == 2){
					newPost.type = 2;
					user.stats.unpublishedPosts += 1;
					user.save();
				} else {
					newPost.type = 1;
				}
				newPost.text = text;
				newPost.created_by = user._id;

				if(photo && photo !== 'undefined'){
					newPost.attachments.photo = photo;	
				}
				
				newPost.save(function(err, post){
					if(err) throw err;

					var message = (user.profileType == 1) ? "" : "Запись появится в блоге, как только "+ user.username + " её одобрит.";

					//Count the value of user's posts after publishing.
					tools.countUserPosts(user._id);
					Notifications.notifyWhenPost(user._id);
					Notifications.createNotification({
						user_id: user._id,
						keyCode: 1,
						item_id: post._id
					});


					return res.send({status: 1, message: message});
				});
			});
	});

	function compileText(text){
			var text = text;
			if(!text){
				return "";
			}
			// Replace all method
			String.prototype.replaceAll = function(search, replace){
			  return this.split(search).join(replace);
			}

			// Parse smile images into symbols

			// Symbols ## mean that is smile
			// Parse smile images into symbols
			var fReg = /<img[^>]*>/ig;
			var sReg = /tag=\"(.{0,10})\"/ig;


			var fArr = text.match(fReg); //Array with html codes of images
			var sArr = text.match(sReg); //Array with smile codes from html

			if(fArr && sArr){
				for(var i=0; i<fArr.length; i++){
					var smile = sArr[i].toString().slice(5, sArr[i].length -1);;
					text = text.replace(fArr[i], smile);
				}
			}

			console.log(text);
			
			text = escapeHtml(text);
			text = makeLinks(text);
			text = makeSmiles(text);


			console.log(text);
			return text;

			function escapeHtml(text) {
				var text = text
					// .replace(/\&nbsp;/g, " ")
					// .replace(/<div>/g, "\n")
					// .replace(/<\/div>/g, "\n")
					// .replace(/<br>/g, "\r\n")

					// .replace(/&/g, "&amp;")
					// .replace(/</g, "&lt;")
					// .replace(/>/g, "&gt;")
					// .replace(/"/g, "&quot;")
					// .replace(/'/g, "&#039;")
					// .replace(/^\s|\s$/g, '');
				return text;
			}

			function makeLinks(text){
				return text
					.replace(/http:\/\/[\S]{0,}/g, '<a href=\'$&\'>$&</a>')
					.replace(/^[a-zA-Z0-9.]{0,30}\.(org|ru|com|co)[.^\/]?.{0,70}/g, '<a href=\'http://$&\'>$&</a>)')
					.replace(/^[^http\/\/][a-zA-Z0-9.]{0,30}\.(org|ru|com)[.^\/]?.{0,70}/g, '<a href=\'http://$&\'>$&</a>');
			}

			function makeSmiles(text){
				var text = text;
				var emoji = {
					1:  {title: ':)', source: "D83DDE0A"},
					2:  {title: ':-D', source: "D83DDE03"},
					3:  {title: ';-)', source: "D83DDE09"},
					4:  {title: 'xD',  source: "D83DDE06"},
					5:  {title: ';-P', source: "D83DDE1C"},
					6:  {title: ':-p', source: "D83DDE0B"},
					7:  {title: '8-)', source: "D83DDE0D"},
					8:  {title: 'B-)', source: "D83DDE0E"},
					9:  {title: ':-(', source: "D83DDE12"},
					10: {title: ';-]', source: "D83DDE0F"},
					11: {title: '3(',  source: "D83DDE14"},
					12: {title: ":'(", source: "D83DDE22"},
					13: {title: ':_(', source: "D83DDE2D"},
					14: {title: ':((', source: "D83DDE29"},
					15: {title: ':o',  source: "D83DDE28"},
					16: {title: ':|',  source: "D83DDE10"},
					17: {title: '3-)',  source: "D83DDE0C"},
					18: {title: 'O:)',  source: "D83DDE07"},
					19: {title: '8|',  source: "D83DDE33"},
					20: {title: '<3',  source: "2764"},
					21: {title: ':<3',  source: "D83DDE18"},
					22: {title: ':))',  source: "D83DDE02"},
					23: {title: ';o',  source: "D83DDE30"},
					24: {title: ':-]',  source: "263A"},
					25: {title: '}:)',  source: "D83DDE08"},
					26: {title: ':like:',  source: "D83DDC4D"},
					27: {title: ':dislike:',  source: "D83DDC4E"},
					28: {title: ':applouse:',  source: "D83DDC4F"},
					29: {title: ':shit:',  source: "D83DDCA9"},
					30: {title: ':kappa:', source: "kappa"},
					31: {title: ':moon:', source: "D83CDF1D"},
					32: {title: ':darkmoon:', source: "D83CDF1A"},
					33: {title: ':bird:', source: "D83DDC26"},
					34: {title: ':18:', source: "D83DDD1E"},
					35: {title: ':sun:', source: "D83CDF1E"},
					36: {title: ':panda:', source: "D83DDC3C"},
					37: {title: ':ufo:', source: "D83DDC7D"}
				}
				
				for(var i=1; i<=37; i++){
					// Pictured Smiles
					// text = text.replaceAll("/" + emoji[i].title + "/", " <img src='images/emoji/"+ emoji[i].source +".png' width='18'> ");

					// Usual text smiles
					text = text.replaceAll(emoji[i].title, " <img src='images/emoji/"+ emoji[i].source +".png' width='18'> ");
				}
				return text;
			}
	}
}

module.exports = sendPost
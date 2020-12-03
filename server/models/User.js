const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
	name: {
		type: String,
		maxlength: 100,
	},
	email: {
		type: String,
		trim: true,
		unique: 1,
	},
	password: {
		type: String,
		minlength: 4,
	},
	lastname: {
		type: String,
		maxlength: 50,
	},
	role: {
		type: Number,
		default: 0,
	},
	image: String,
	token: {
		type: String,
	},
	tokenExp: {
		type: Number,
	},
});

userSchema.pre('save', function (next) {
	var user = this;
	if (user.isModified('password')) {
		// 비밀번호를 암호화시킴.
		bcrypt.genSalt(saltRounds, (err, salt) => {
			if (err) return next(err);

			bcrypt.hash(user.password, salt, (err, hash) => {
				if (err) return next(err);
				user.password = hash;
				next();
			});
		});
	} else {
		next();
	}
});

userSchema.methods.checkPassword = function (plainPassword, callback) {
	// plain password를 암호화 해서 기존에 암호화됐던 password와 일치하는지 CHECK
	bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
		if (err) return callback(err);
		callback(null, isMatch);
	});
};

userSchema.methods.generateToken = function (callback) {
	var user = this;
	// jsonwebtoken을 이용해서 Token 생성
	var token = jwt.sign(user._id.toHexString(), 'secretToken');

	user.token = token;
	user.save(function (err, user) {
		if (err) return callback(err);
		callback(null, user);
	});
};

userSchema.statics.findByToken = function (token, callback) {
	var user = this;
	// 토큰을 복호화한다.
	jwt.verify(token, 'secretToken', function (err, decoded) {
		// 유저 아이디를 이용해서 유저를 찾은 후,
		// Client Token = DB Token 인지 확인

		user.findOne({ '_id': decoded, 'token': token }, function (err, user) {
			if (err) return callback(err);
			callback(null, user);
		});
	});
};

const User = mongoose.model('User', userSchema);

module.exports = { User };

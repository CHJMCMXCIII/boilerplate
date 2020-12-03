const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const { auth } = require('./middleware/auth');
const { User } = require('./models/User');

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// application//json
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose');
mongoose
	.connect(config.mongoURI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false,
	})
	.then(() => console.log('MongoDB connected...'))
	.catch((err) => {
		console.log(err);
	});

app.get('/', (req, res) => {
	res.send('Hello World! 안녕하세요!');
});

app.get('/api/hello', (req, res) => {
	res.send('안녕하세요');
});

app.post('/api/users/register', (req, res) => {
	// 회원가입할때 필요한 정보들을 Client에서 가져오면
	// 그것들을 데이터베이스에 넣어준다.

	const user = new User(req.body);

	user.save((err, userInfo) => {
		if (err) return res.json({ success: false, err });
		return res.status(200).json({
			success: true,
		});
	});
});

app.post('/api/users/login', (req, res) => {
	// 요청된 이메일을 DB에 있는지 찾음
	User.findOne({ email: req.body.email }, (err, user) => {
		if (!user) {
			return res.json({
				loginSuccess: false,
				message: '이메일 아이디가 존재하지 않습니다.',
			});
		}
		// 입력된 비밀번호가 맞는지 확인
		user.checkPassword(req.body.password, (err, isMatch) => {
			if (!isMatch)
				return res.json({
					loginSuccess: false,
					message: '비밀번호가 틀렸습니다.',
				});

			// 비밀번호까지 맞다면 토큰 생성
			user.generateToken((err, user) => {
				if (err) return res.status(400).send(err);

				// 토큰을 쿠키에 저장.
				res
					.cookie('x_auth', user.token)
					.status(200)
					.json({ loginSuccess: true, userId: user._id });
			});
		});
	});
});

app.get('/api/users/auth', auth, (req, res) => {
	// Authentication이 True가 되어 미들웨어를 통과됨.
	res.status(200).json({
		_id: req.user._id,
		isAdmin: req.user.role === 0 ? false : true,
		isAuth: true,
		email: req.user.email,
		name: req.user.name,
		lastname: req.user.lastname,
		role: req.user.role,
		image: req.user.image,
	});
});

app.get('/api/users/logout', auth, (req, res) => {
	User.findOneAndUpdate({ _id: req.user._id }, { token: '' }, (err, user) => {
		if (err) return res.json({ success: false, err });
		return res.status(200).send({ success: true });
	});
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
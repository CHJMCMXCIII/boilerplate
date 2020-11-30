const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');

mongoose
	.connect(
		'mongodb+srv://chjmcmxciii:2166@boilerplate.kdf3m.mongodb.net/bolierplate?retryWrites=true&w=majority',
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false,
		},
	)
	.then(() => console.log('MongoDB connected...'))
	.catch((err) => {
		console.log(err);
	});

app.get('/', (req, res) => {
	res.send('Hello World! asdasd');
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});

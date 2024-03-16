const express = require('express');
const jwt = require('jsonwebtoken');
const settings = require('./settings.json');
const client = require('twilio')(settings.twilioAccountSid, settings.twilioAuthToken);
const verifySid = "VA89265de040257e529fbe693eafc50e8f";

const app = express();

app.post('/api/text', function(req, res) {
	client.verify.v2
	.services(verifySid)
	.verifications.create({ to: "+18053126420", channel: "sms" })
	.then((verification) => console.log(verification.status))
	.then(() => {
	    const readline = require("readline").createInterface({
	      input: process.stdin,
	      output: process.stdout,
	    });
	    readline.question("Please enter the OTP:", (otpCode) => {
	      client.verify.v2
         	.services(verifySid)
		.verificationChecks.create({ to: "+18053126420", code: otpCode })
		.then((verification_check) => console.log(verification_check.status))
  		.then(() => readline.close());
	   });
	});
	res.json(settings);
});

app.get('/api', function(req, res) {
	res.json({
		text: 'my api!'
	});
});

app.post('/api/login', function(req, res) {
	const user = { id: 3 };
	const token = jwt.sign({ user }, 'my_secret_key');
	res.json({
		token: token
	});
});

app.get('/api/protected', ensureToken, function(req, res) {
	jwt.verify(req.token, 'my_secret_key', function(err, data) {
		if (err) {
			res.sendStatus(403);
		} else {
			res.json({
				text: 'this is protected',
				data: data
			});
		}
	})
	res.json({
		text: 'this is protected route'
	});
});

function ensureToken(req, res, next) {
	const bearerHeader = req.headers["authorization"];
	if (typeof bearerHeader !== 'undefined') {
		const bearer = bearerHeader.split(" ");
		const bearerToken = bearer[1]
		req.token = bearerToken;
		next();
	} else {
		res.sendStatus(403);
	}
}

app.listen(3000, function () {
	console.log('App listening on port 3000!')
});

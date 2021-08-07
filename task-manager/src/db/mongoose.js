import mongoose from 'mongoose';
import validator from 'validator';

const { isEmail } = validator;

const url = 'mongodb://localhost:27017';
const dbName = 'task-manager-api';

mongoose.connect(`${url}/${dbName}`, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
});

const db = mongoose.connection;

db.on('error', () => console.error('connection error'));
db.once('open', async () => {
	const userSchema = new mongoose.Schema({
		name: {
			type: String,
			required: [true, 'Name not provided'],
			minLength: [2, 'Name too short'],
			trim: true,
			lowercase: true,
		},
		email: {
			type: String,
			required: [true, 'Email not provided'],
			trum: true,
			lowercase: true,
			validate(value) {
				if (!isEmail(value)) {
					throw new Error('Email not valid');
				}
			},
		},
		password: {
			type: String,
			required: true,
			trim: true,
			validate(value) {
				if (value.includes('password')) {
					throw new Error(`Password can't contain word 'password'`);
				}
			},
		},
		age: {
			type: Number,
			validate(value) {
				if (value < 0) {
					throw new Error('Age must be positive number');
				}
				if (!Number.isInteger(value)) {
					throw new Error('Age must be a whole number');
				}
			},
			max: [120, 'Too old'],
			default: 0,
		},
		nickname: {
			type: String,
			default: 'genericky',
		},
	});

	const User = new mongoose.model('User', userSchema);

	const user = new User({
		name: 'marian',
		email: 'marian.code@zm.eu',
		password: 'vueisbetter',
		age: 21,
		nickname: 'bill gates',
	});

	try {
		const res = await user.save();
		console.log(res);
	} catch (error) {
		console.log(error.message);
	}

	mongoose.disconnect();
});

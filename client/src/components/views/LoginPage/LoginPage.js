import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../_actions/user_action';
import { withRouter } from 'react-router-dom';

function LoginPage(props) {
	console.log(props);
	const dispatch = useDispatch();

	// value에 변화를 주기 위해 state 추가
	const [Email, setEmail] = useState('');
	const [Password, setPassword] = useState('');

	const onEmailHandler = (event) => {
		setEmail(event.currentTarget.value);
	};

	const onPasswordHandler = (event) => {
		setPassword(event.currentTarget.value);
	};

	const onSubmitHandler = (event) => {
		event.preventDefault();

		let body = {
			email: Email,
			password: Password,
		};

		dispatch(loginUser(body)).then((response) => {
			if (response.payload.loginSuccess) {
				return props.history.push('/');
			} else {
				return alert('Error');
			}
		});
	};

	const onClickHandler = (event) => {
		event.preventDefault();
		return props.history.push('./register');
	};

	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				width: '100%',
				height: '100vh',
			}}
		>
			<form
				style={{ display: 'flex', flexDirection: 'column' }}
				onSubmit={onSubmitHandler}
			>
				<label>Email</label>
				<input type="email" value={Email} onChange={onEmailHandler} />
				<label>Password</label>
				<input type="password" value={Password} onChange={onPasswordHandler} />

				<br />
				<button type="submit">Login</button>
				<button onClick={onClickHandler}>회원가입</button>
			</form>
		</div>
	);
}

export default withRouter(LoginPage);

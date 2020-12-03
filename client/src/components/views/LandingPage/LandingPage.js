import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../../_actions/user_action';
import { withRouter } from 'react-router-dom';

function LandingPage(props) {
	useEffect(() => {
		axios.get('/api/hello').then((response) => console.log(response.data));
	}, []);

	const dispatch = useDispatch();

	const onClickHandler = (event) => {
		event.preventDefault();

		dispatch(logoutUser()).then((response) => {
			if (response.payload.success) {
				return props.history.push('/login');
			} else {
				alert('로그아웃을 실패했어요!');
			}
		});
	};
	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				width: '100%',
				height: '100vh',
				flexDirection: 'column',
			}}
		>
			<h2>시작페이지</h2>
			<button onClick={onClickHandler}>LOGOUT</button>
		</div>
	);
}

export default withRouter(LandingPage);

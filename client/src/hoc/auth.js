import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_action';

export default function Auth(SpecificComponent, option, adminRoute = null) {
	// option = null(아무나) / true(로그인유저만) / false(로그아웃유저만)
	const AuthenticationCheck = (props) => {
		const dispatch = useDispatch();

		useEffect(() => {
			dispatch(auth()).then((response) => {
				console.log(response);

				// Auth 상태에 따른 분기처리.

				if (!response.payload.isAuth) {
					// 로그인 하지 않은 상태
					if (option) {
						props.history.push('/login');
					}
				} else {
					//로그인 된 상태
					if (adminRoute && !response.payload.isAdmin) {
						props.history.push('/');
					} else {
						if (option === false) props.history.push('/');
					}
				}
			});
		});

		return <SpecificComponent />;
	};

	return AuthenticationCheck;
}

import React from 'react';

class RegisterAndLogin extends React.Component {
	constructor(){
		super();
		this.state = {
			email: '',
			password: '',
			showRegister: false,
		}
	}

	handleChange = (e) => {
		this.setState({[e.target.name]: e.target.value});
	}

	clearForm = () => {
		this.setState({
			email: '',
			password: '',
		})
	}

	showRegisterForm = () => {
		this.clearForm();
		this.setState({
			showRegister: true
		})
	}

	hideRegisterForm = () => {
		this.clearForm();
		this.setState({
			showRegister: false
		})
	}

	handleLogin = async (e) => {
		e.preventDefault();
		console.log('--handleLogin() initiated--');
		try {

			const bodyToSend = {
				email: this.state.email,
				password: this.state.password
			}

		  	const loginResponse = await fetch(process.env.REACT_APP_BACKEND_URL + 'auth/login', {
				method: 'POST',
				credentials: 'include',
				body: JSON.stringify(bodyToSend),
				headers: {
				  	'Content-Type': 'application/json'
				}
		  	});
		  	this.clearForm();
		  	console.log(loginResponse, "<<--- loginResponse");
		  	const parsedResponse = await loginResponse.json();
		  	console.log(parsedResponse, "<=-=-= parsedResponse");
		  	if(parsedResponse.status === 200) {
				console.log(parsedResponse.data, '<<< parsedResponse.data in handleLogin()');
				this.props.setActiveUserEmailAndLogged(parsedResponse.data.email);
				this.props.setActiveUserId(parsedResponse.data._id);

		  	}
		} catch(err) {
		  	console.log(err);
		}
  	}

	handleRegister = async (e) => {
		e.preventDefault();
		console.log('--handleRegister() has been initiated--');
		try {
			const registerResponse = await fetch(process.env.REACT_APP_BACKEND_URL + 'auth/register',  {
				method: 'POST',
				credentials: 'include',
				body: JSON.stringify(this.state),
				headers: {
					'Content-Type': 'application/json'
				}
			})
			this.clearForm();
			const parsedResponse = await registerResponse.json();
			console.log(parsedResponse, "<----  parsedResponse");
			if(parsedResponse.status === 200) {
				console.log(parsedResponse.data, '<<< parsedResponse.data in handleRegister()');
				await this.createDefaultCats(parsedResponse.data._id);
				this.props.setActiveUserEmailAndLogged(parsedResponse.data.email);
				this.props.setActiveUserId(parsedResponse.data._id);
			}
		} catch (err) {
			console.log(err);
		}
	}

	createDefaultCats = async (id) => {
		const cats = [{
			name: 'Groceries'
			}, {
			name: "Eating out"
			}, {
			name: "Gasoline"
		}]
		const catsResponse = await fetch(process.env.REACT_APP_BACKEND_URL + "category/user/" + id, {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify(cats),
			headers: {
				'Content-Type': 'application/json'
			}
		})

		const parsedCatsResponse = await catsResponse.json()
		console.log(parsedCatsResponse, "<<<< parsedCats");

	}

	render() {

		const Login = (
			<div>
				<h3> Login </h3>
				<form id="login-form" onSubmit={this.handleLogin}>
					Email:
					<input type='text' name='email' value={this.state.email} onChange={this.handleChange}/>
					Password:
					<input type='password' name='password' value={this.state.password} onChange={this.handleChange}/>
					<button type='sumbit'> Log in </button>
				</form>
				<p> Don't have an account? Set one up now! It's free and easy. </p>
				<button onClick={this.showRegisterForm}> Sign up </button>
			</div>
		)

		const Registration = (
			<div>
				<h3 >Registration </h3>
				<form id="register-form" onSubmit={this.handleRegister}>
					Email:
					<input type='text' name='email' value={this.state.email} onChange={this.handleChange}/>
					Password:
					<input type='password' name='password' value={this.state.password} onChange={this.handleChange}/>
					<button type='sumbit'>Register</button>
				</form>
				<p> You have an account after all? </p>
				<button onClick={this.hideRegisterForm}> Login </button>
			</div>
		)

		return (
			<div>
				{ this.state.showRegister ? Registration : Login }
			</div>
		);
	}
}



export default RegisterAndLogin;
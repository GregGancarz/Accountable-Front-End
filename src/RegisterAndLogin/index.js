import React from 'react';
import './index.css';

class RegisterAndLogin extends React.Component {
	constructor(){
		super();
		this.state = {
			email: '',
			password: '',
			showRegister: false,
			message: '',
			loadingCounter: 1,
			messageText: '',		
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
			showRegister: true,
			message:'',
		})
	}

	hideRegisterForm = () => {
		this.clearForm();
		this.setState({
			showRegister: false,
			message: '',
		})
	}

	loadingPeriods = () => {
		if (this.state.loadingCounter === 6) {
			this.setState({
				loadingCounter: 1
			})
		}
		let dots = ".".repeat(this.state.loadingCounter);
		let message = this.state.messageText;
		let messageToSet = message + dots;
		let counter = this.state.loadingCounter;
		counter++
		this.setState({
			message: messageToSet,
			loadingCounter: counter,
		})
	}

	handleLogin = async (e) => {
		e.preventDefault();
		console.log('--handleLogin() initiated--');
		if (this.state.password === '' || this.state.email === '') {
			this.setState({
				message: "You must input an email and password to login"
			})
		} else {
			await this.setState({
				messageText: "Logging in"
			})
			setInterval(this.loadingPeriods, 200)
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
			  	const parsedResponse = await loginResponse.json();
			  	if (parsedResponse.status === 200) {
					await this.props.setActiveUser(parsedResponse.data.email, parsedResponse.data._id);
				} else if (parsedResponse.status === 404) {
					this.setState({
						message: parsedResponse.message
					})
			  	}
			} catch(err) {
			  	console.log(err);
			}
		}
  	}

	handleRegister = async (e) => {
		e.preventDefault();
		console.log('--handleRegister() has been initiated--');
		if (this.state.password.length >= 6) {
			try {
				await this.setState({
					messageText: "Creating account...",
				})
				setInterval(this.loadingPeriods, 200)
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
				if(parsedResponse.status === 200) {
					await this.createDefaultCats(parsedResponse.data._id);
					this.props.setActiveUser(parsedResponse.data.email, parsedResponse.data._id);
				}
			} catch (err) {
				console.log(err);
			}
		} else {
			console.log("--password was too short--");
			this.setState({
				message: "You're password must be six characters in length or more"
			})
		}
	}

	createDefaultCats = async (id) => {
		const cats = [
			{
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
	}

	render() {
		const Message = (
			<p className="message">
				{this.state.message}
			</p>
		)

		const noMessage = (
			<p className="noMessage"/>
		)

		const Dash = (
			<header>
				<h1> ACCOUNTABLE </h1>
				<h2> Personal finance simplified </h2>
			</header>	
		)

		const Login = (
			<div className="logReg">
				<h3> Login </h3>
				<form onSubmit={this.handleLogin}>
					<div className="formInput">
						<p>Email:</p>
						<input type='text' name='email' value={this.state.email} onChange={this.handleChange}/>
						<p>Password:</p>
						<input type='password' name='password' value={this.state.password} onChange={this.handleChange}/>
					</div>
					<br/>
					<br/>
					<br/>
					<button> Log in </button>
					{this.state.message === '' ? noMessage : Message}
				</form>
				<p> Don't have an account? Set one up now! <br/> It's free and easy. </p>
				<button onClick={this.showRegisterForm}> Sign up </button>
			</div>
		)

		const Registration = (
			<div className="logReg">
				<h3 >Registration </h3>
				<form onSubmit={this.handleRegister}>
					<div className="formInput">
						<p>Email:</p>
						<input type='email' name='email' value={this.state.email} onChange={this.handleChange}/>
						<p>Password:</p>
						<input type='password' name='password' value={this.state.password} onChange={this.handleChange}/>
					</div>		
					<br/>
					<br/>
					<br/>
					<button>Register</button>
					{this.state.message === '' ? noMessage : Message}
					<br/>
				</form>
				<div className="logRegSwap">
					<p> You have an account after all? </p>
					<button onClick={this.hideRegisterForm} > Login </button>
				</div>
			</div>
		)

		const Note = (
			<h4> Use <i>"email@test.com"</i> and <i>"password"</i> to login to an account with some already established data!</h4>
		)

		return (
			<div>
				{ Dash }
				{ this.state.showRegister ? Registration : Login }
				{ Note }
			</div>
		);
	}
}



export default RegisterAndLogin;
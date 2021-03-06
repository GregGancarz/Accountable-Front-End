import React from 'react';
import './index.css';
import { Modal, Form, Button, Label, Header, Tab } from 'semantic-ui-react';
import image from './arrows.png';
import UpdateExpenseModal from '../UpdateExpenseModal/index'




class Expenses extends React.Component {
	constructor(props) {
		super();
		this.state = {
			catIterator: '0',
			date: '',
			amount: '',
			Message: '',
			expenses: [],
			amountSortMode: 'unsorted',

		}
	}

	handleChange = (e) => {
		this.setState({[e.target.name]: e.target.value});
	}

	handleSelectChange = async (e) => {
		this.setState({catIterator: e.target.value});
	}

	clearForm = () => {
		this.setState({
			amount: '',
		})
	}

	deleteExpense = async (e) => {
		try {
			const deleteResponse = await fetch(process.env.REACT_APP_BACKEND_URL + 'expense/expense/' + e.currentTarget.dataset.id, {
				method: 'DELETE',
				credentials: 'include',
			});
			const parsedResponse = await deleteResponse.json();
			await this.props.retrieveExpensesAndCategories();
			this.props.loadTotal();
		} catch(err) {
			console.log(err);
		}
	}


	createExpense = async (e) => {
		e.preventDefault()
		if (this.state.date.length !== 8) {
			this.setState({
				Message: "Please format the date correctly (yy-mm-dd)"
			})
		} else {
			this.setState({
				Message: ''
			})
			const properDate = '20'.concat(this.state.date)
			console.log(this.state.date, properDate)
			const bodyToSend = {
				amount: this.state.amount,
				date: properDate,
				category: this.props.categories[this.state.catIterator],
			}
			console.log("--Expense entry creation has been initiated--");
			try {
				const entryResponse = await fetch(process.env.REACT_APP_BACKEND_URL + 'expense/user/' + this.props.activeUserId,  {
					method: 'POST',
					credentials: 'include',
					body: JSON.stringify(bodyToSend),
					headers: {
						'Content-Type': 'application/json'
					}
				})
				this.clearForm();
				const parsedResponse = await entryResponse.json();
				await this.props.retrieveExpensesAndCategories();
				this.props.loadTotal();
				
			} catch(err) {
				console.log(err);
			}
		}
	}


	sortAmount = async () => {
		if (this.state.amountSortMode === 'unsorted') {
			this.props.expenses.sort(
					function(a, b) {
						return b.amount - a.amount;
					}
				);
			this.setState({
				amountSortMode: 'ascending'
			})
		} else if (this.state.amountSortMode === 'ascending') {
			this.props.expenses.sort(
					function(a, b) {
						return a.amount - b.amount;
					}
				);
			this.setState({
				amountSortMode: 'descending'
			})
		} else {
			await this.props.retrieveExpensesAndCategories();
			this.setState({
				amountSortMode: 'unsorted'
			})
		}
	}





	render() {
		const optionsToInsert = this.props.categories.map((op, i) => {
			return (
				<option key={i} value={i} > {op.name} </option>
			)
		})

		const Message = (
			<p className="message">
				{this.state.Message}
			</p>
		)

		const noMessage = (
			<p className="noMessage"/>
		)

		const ExpenseForm = (
			<div>
				{this.state.Message === '' ? noMessage : Message}
				<form id="expense-form" onSubmit={this.createExpense}>
					Date:
					<input type='text' name='date' value={this.state.date} placeholder='yy-mm-dd' onChange={this.handleChange}/>

					Category:
					<select name='catIterator' onChange={this.handleChange}>
						{optionsToInsert}
					</select>

					Amount: $
					<input type='text' name='amount' value={this.state.amount} placeholder='' onChange={this.handleChange}/>

					<button>Post the expense</button>
				</form>
			</div>
		)

		

		const ExpenseLog = this.props.expenses.map((entry) => {
			const fullDate = entry.date;
			const cutDate = [];
			for (let i = 2; i < 10; i++) {
				cutDate.push(fullDate.charAt(i))
			}
			const cutDateSring = cutDate.join('');
			const float = entry.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 } ) 
			if (entry.category.name === this.props.queryCategory || this.props.queryCategory === 'All') {
			return (
				 <tr key={entry._id}> 
					<td className="dateBox"> {cutDateSring} </td> 
					<td> {entry.category.name} </td> 
					<td> {float} </td> 
					<td className="editButton"> <UpdateExpenseModal loadTotal={this.props.loadTotal} retrieveExpensesAndCategories={this.props.retrieveExpensesAndCategories} categories={this.props.categories} id={entry._id} date={fullDate} amount={float} cat={entry.category.name} />{/* <button data-id={entry._id} data-date={entry.date} data-amount={float} data-cat={entry.category.name} onClick={this.openUpdateFunction}> Edit </button> */} </td>
					<td className="editButton"> <button data-id={entry._id} onClick={this.deleteExpense}> Delete </button> </td>
				 </tr>
			)
			}
		})

		return (
			<div>
				{ExpenseForm}
				<div className="table-wrapper">
					<table>
						<thead>
							<tr>
								<th onClick={this.props.sortDate}>DATE  <img src={image} className="sortArrows"/> </th>
								<th className="catBox">CATEGORY</th>
								<th onClick={this.sortAmount}>AMOUNT  <img src={image} className="sortArrows"/> </th>
								<th colSpan="2"> Editing </th>
							</tr>
						</thead>
						<tbody>
							{ExpenseLog}
						</tbody>
					</table>
				</div>
			</div>
		)
	}
}



export default Expenses;
import React from 'react';
import './index.css';
import { Modal, Form, Button, Label, Header } from 'semantic-ui-react';


class Expenses extends React.Component {
	constructor(props) {
		super();
		this.state = {
			catIterator: '0',
			date: '',
			amount: '',
			showCatCreateModal: false,
		}
	}

	handleChange = (e) => {
		this.setState({[e.target.name]: e.target.value});
	}


	handleSelectChange = async (e) => {
		console.log("--handleSelectChange initiated--");
		this.setState({
			catIterator: e.target.value
		});
	}


	clearForm = () => {
		this.setState({
			amount: '',
			date: '',
			catIterator: '0',
		})
	}

	deleteExpense = async (e) => {
		try {

			console.log("entry id hopefully:")
			console.log(e.currentTarget.dataset.id);

			const deleteResponse = await fetch(process.env.REACT_APP_BACKEND_URL + 'expense/expense/' + e.currentTarget.dataset.id, {
				method: 'DELETE',
				credentials: 'include',
			});
			const parsedResponse = await deleteResponse.json();
			this.props.retrieveExpensesAndCategories();
		} catch(err) {
			console.log(err);
		}
	}


	createExpense = async (e) => {
		e.preventDefault()
		const bodyToSend = {
			amount: this.state.amount,
			date: this.state.date,
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
			console.log(parsedResponse, "<<< parsed entry resposne <<<");
			this.props.retrieveExpensesAndCategories();
		} catch(err) {
			console.log(err);
		}
	}





	render() {
		console.log(this.state)
		const optionsToInsert = this.props.categories.map((op, i) => {
			return (
				<option key={i} value={i} > {op.name} </option>
			)
		})

		const expenseForm = (
			<div>
				<form id="expense-form" onSubmit={this.createExpense}>
					Date:
					<input type='text' name='date' value={this.state.date} placeholder='XXXX - XX - XX' onChange={this.handleChange}/>

					Category:
					<select onChange={this.handleSelectChange}>
						{optionsToInsert}
					</select>

					Amount: $
					<input type='text' name='amount' value={this.state.amount} placeholder='' onChange={this.handleChange}/>

					<button> Post the expense </button>
				</form>
			</div>
		)

		const expenseLog = this.props.expenses.map((entry) => {
			const fullDate = entry.date;
			const cutDate = [];
			for (let i = 2; i < 10; i++) {
				cutDate.push(fullDate.charAt(i))
			}
			const cutDateSring = cutDate.join('');
			const float = entry.amount.toFixed(2)
			return (
				 <tr key={entry._id}> 
					<td> {cutDateSring} </td> 
					<td> {entry.category.name} </td> 
					<td> ${float} </td> 
					<td> <button> Edit </button> </td>
					<td> <button data-id={entry._id} onClick={this.deleteExpense}> Delete </button> </td>
				 </tr>
			)
		})

		const sortedLog = expenseLog.sort()

		const CreateCatModal = () => {
			return (
				<Modal open={this.state.showCatCreateModal}>
					<Header>Edit Movie</Header>
      				<Modal.Content>
        				<Form onSubmit={this.createCategory}>
          					<Label>
            					Create a new category:
          					</Label>
          					<Form.Input type='text' name='name'/>
          					
          					<Modal.Actions>
           						<Button>Create new Category</Button>
          					</Modal.Actions>
        				</Form>
      				</Modal.Content>
    			</Modal>
			)
		}

		return (
			<div>
				<h4> Expense Log </h4>
				<button> Create new Category </button>
				{expenseForm}
				<table>
					<thead>
						<tr>
							<th>DATE</th>
							<th>CATEGORY</th>
							<th>AMOUNT</th>
						</tr>
					</thead>
					<tbody>
						{sortedLog}
					</tbody>
				</table>
				<CreateCatModal/>

			</div>
		)
	}
}


export default Expenses;
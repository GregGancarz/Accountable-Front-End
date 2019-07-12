import React from 'react';
import { Button, Modal, Form } from 'semantic-ui-react';

class CreateCatModal extends React.Component {
	constructor(props) {
		super();
		this.state = {
			newCatName: undefined, 
		}
	}

	handleChange = (e) => {
		this.setState({[e.target.name]: e.target.value});
	}

	createCategory = async (e) => {
		e.preventDefault()
		if (!this.state.newCatName || this.state.newCatName.length === 0) {
			console.log("Please enter a valid name for the category");
			return;
		} 
		//this.state.newCatName
		const bodyToSend = [{
			name: this.state.newCatName,
		}]
		console.log("--Expense entry creation has been initiated--");
		try {
			const entryResponse = await fetch(process.env.REACT_APP_BACKEND_URL + 'category/user/' + this.props.activeUserId,  {
				method: 'POST',
				credentials: 'include',
				body: JSON.stringify(bodyToSend),
				headers: {
					'Content-Type': 'application/json'
				}
			})
			const parsedResponse = await entryResponse.json();
			this.props.retrieveExpensesAndCategories();
			this.props.closeModals()
			this.props.loadCatList();
		} catch(err) {
			console.log(err);
		}
	}

	render() {

		return (
			<div>
				<Modal open={this.props.showCatCreateModal}>
      				<Modal.Header>Create a new category</Modal.Header>
      				<Modal.Content>
        				<Form onSubmit={this.createCategory}>
          					<Form.Input type='text' name='newCatName' value={this.state.newCatName} onChange={this.handleChange}/>
          					<Modal.Actions>
           						<Button>Create new Category</Button>
           						<Button onClick={this.props.closeModals}>Cancel</Button>
          					</Modal.Actions>
        				</Form>
      				</Modal.Content>
    			</Modal>
    		</div>
		)
	}
}

export default CreateCatModal
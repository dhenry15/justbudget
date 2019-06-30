import React, { Component } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

import '../css/Modal.css';

Modal.setAppElement('#root');

class AddCategoryModal extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            modalIsOpen: false,
            info: {
                name: "",
                budget: 0,
                actual: 0,
            },
            budgetType: props.budgetType,
            categoryExists: false
        };
    }

    openModal = () => {
      this.setState({modalIsOpen: true});
    }

    closeModal = () => {
        this.setState({modalIsOpen: false});
    }

    handleModalCloseRequest = () => {
        // opportunity to validate something and keep the modal open even if it
        // requested to be closed
        this.setState({
          modalIsOpen: false,
          info: {
            name: "",
            budget: 0,
            actual: 0,
          },
          budgetType: this.props.budgetType,
          categoryExists: false
          });
    }

    handleSaveClicked = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5000/api/users/addcategory',
            {info: this.state.info, budgetType: this.state.budgetType},{
            headers: {
                    Authorization: localStorage.getItem('token')
            } 
        }).then(res => {
          if (res.data.categoryExists) {
            this.setState({
              info: {name: "", budget: this.state.info.budget, actual: 0}, //shouldn't have to do all of this
              categoryExists : true
            });
          } else {
            this.props.onCategoriesChange(res.data.categories)
            this.setState({
              info: {name: "", budget: 0, actual: 0},   //I shouldn't have to do this
              categoryExists : false
            });
            this.closeModal();
          }
        }).catch(err => console.log(err));
    }

    handleChange = (e) => {

      let newInfo = this.state.info;
      newInfo[e.target.name] =  e.target.name === "budget" ? parseFloat(e.target.value) : e.target.value;
      this.setState({info: newInfo});

    }

  render() {
    return (
      <div className = "AddCategoryModal">
          <button type="button" className="btn-sm btn-primary" onClick={this.openModal} style = {{float: "right"}}>
            Add Category
          </button>
        <Modal
          className="Modal__Bootstrap modal-dialog"
          closeTimeoutMS={150}
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.handleModalCloseRequest}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Add Category</h4>
              <button type="button" className="close" onClick={this.handleModalCloseRequest}>
                <span aria-hidden="true">&times;</span>
                <span className="sr-only">Close</span>
              </button>
            </div>
            <div className="modal-body">
              <div className = "col-lg-12 mb-3" id ="myForm">

                {
                  this.state.categoryExists ?
                    <div className="alert alert-danger mt-4" role="alert"> Category Exists! </div> :
                    null
                }
    
                  <form onSubmit = {this.handleSaveClicked} >
                      <div className="form-group mt-3">
                        <label htmlFor="name">Name:</label>
                        <input type="text"
                            className = "form-control"
                            id = "name" 
                            name  = "name"
                            aria-describedby = "name" 
                            value = {this.state.info.name}
                            onChange = {this.handleChange}
                            placeholder = "Enter name"
                        required />
                      </div>
                      <div className="form-group mt-3">
                        <label htmlFor="budget">Budget:</label>
                        <input type="number"
                            className = "form-control"
                            id = "budget" 
                            name  = "budget"
                            aria-describedby = "budget" 
                            min = "0"
                            max = "1000000"
                            step = "0.01"
                            onChange = {this.handleChange}
                            placeholder = "0.00"
                        required />
                      </div>
                      <div className="modal-footer">
                          <button type="button" className="btn btn-secondary cancelBTN" onClick={this.handleModalCloseRequest}>Cancel</button>
                          <button type="submit" className="btn btn-primary addBTN">Add</button>
                      </div>
                  </form>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default AddCategoryModal;
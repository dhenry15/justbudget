
import React, { Component } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

import moment from 'moment';


import '../css/Modal.css';

Modal.setAppElement('#root');

class AddTransactionModal extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            modalIsOpen: false,
            info: {
                title: "",
                amount: 0,
                category: "",
                date: "" ,
            }
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
      this.setState({modalIsOpen: false});
  }

  handleSaveClicked = (e) => {
      e.preventDefault();
      axios.post('http://localhost:5000/api/users/addtransaction',
          {info: this.state.info},{
          headers: {
                  Authorization: localStorage.getItem('token')
          } 
      }).then(res => {
          this.props.onTransactionsChange(res.data.transactions)
          this.closeModal();
      }).catch(err => console.log(err));
  }

  handleChange = (e) => {
    let newInfo = this.state.info;
    newInfo[e.target.name] =  e.target.name === "amount" ? parseFloat(e.target.value)  : e.target.value;
    this.setState({info: newInfo});
  }

  getMaxDate = () => {
    return moment().format("YYYY-MM-DD").toString();
  }
  getMinDate = () => {
    return moment().subtract(1, 'years').format("YYYY-MM-DD").toString();
  }
    
  render() {
    return (
      <div className = "AddTransactionModal">
          <button type="button" className="btn-sm btn-primary mb-2 " onClick={this.openModal} style = {{float: "right"}}>
            Add Transaction
          </button>
        <Modal
          className="Modal__Bootstrap modal-dialog"
          closeTimeoutMS={150}
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.handleModalCloseRequest}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Add Transaction</h4>
              <button type="button" className="close" onClick={this.handleModalCloseRequest}>
                <span aria-hidden="true">&times;</span>
                <span className="sr-only">Close</span>
              </button>
            </div>
            <div className="modal-body">
              <div className = "col-lg-12 mb-3" id ="myForm">
                  <form onSubmit = {this.handleSaveClicked} >
                      <div className="form-group mt-3">
                          <label htmlFor="title">Title:</label>
                          <input type="text"
                              className = "form-control"
                              id = "title" 
                              name  = "title"
                              aria-describedby = "title" 
                              onChange = {this.handleChange}
                              placeholder = "Enter title"
                          required />
                      </div>
                      <div className="form-group mt-3">
                          <label htmlFor="amount">Amount:</label>
                          <input type="number"
                              className = "form-control"
                              id = "amount" 
                              name  = "amount"
                              aria-describedby = "amount" 
                              value = {this.state.amount}
                              min = "any"
                              max = "1000000"
                              step = "0.01"
                              onChange = {this.handleChange}
                              placeholder = "0.00"
                          required />
                      </div>
                      <div className="form-group mt-3">
                          <label htmlFor="category">Category:</label>
                          <select
                              className = "form-control"
                              id = "category" 
                              name  = "category"
                              aria-describedby = "category"
                              defaultValue = ""
                              onChange = {this.handleChange}
                              required>
                              <option disabled  value=''>Pick one of your categories</option>
                              {this.props.categories.map(categoryDict => {
                                return <option key = {categoryDict.id} value = {categoryDict.name}>{categoryDict.name}</option>
                              })}
                          </select>
                      </div>
                      <div className="form-group">
                          <label htmlFor="date">Date:</label>
                          <input 
                              type = "date" 
                              className = "form-control" 
                              id = "date" 
                              name = "date"
                              min = {this.getMinDate()}
                              max = {this.getMaxDate()}
                              value = {this.state.date}
                              onChange = {this.handleChange}
                              placeholder = "Enter date"
                          required/>
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

export default AddTransactionModal;
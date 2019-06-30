import React from 'react';
import axios from 'axios';

import Header from './Header';
import AddTransactionModal from './AddTransactionModal';

class TransactionsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            transactions: []
        }
        this.handleTransactionsChange = this.handleTransactionsChange.bind(this);
    }

    componentDidMount() {
        if (this.props.loggedIn) {
            axios.get('http://localhost:5000/api/users/gettransactions',
                {
                headers: {
                        Authorization: localStorage.getItem('token')
                } 
            }).then(res => this.setState({
                transactions: res.data.transactions
                })
            ).catch(err => console.log(err.response));

            axios.get('http://localhost:5000/api/users/getcategories',
                {
                headers: {
                        Authorization: localStorage.getItem('token')
                } 
            }).then(res => {
                let categories = [];
                res.data.categories.weekly.forEach(categoryDict => {
                    let add = true;
                    categories.forEach(myCategory => {
                        if (categoryDict.name === myCategory.name) {
                            add = false;
                        }
                    })
                    if (add) {
                        categories.push({name: categoryDict.name, id: categoryDict.id})
                    }
                    
                });
                res.data.categories.monthly.forEach(categoryDict => {
                    let add = true;
                    categories.forEach(myCategory => {
                        if (categoryDict.name === myCategory.name) {
                            add = false;
                        }
                    })
                    if (add) {
                        categories.push({name: categoryDict.name, id: categoryDict.id})
                    }
                });
                res.data.categories.yearly.forEach(categoryDict => {
                    let add = true;
                    categories.forEach(myCategory => {
                        if (categoryDict.name === myCategory.name) {
                            add = false;
                        }
                    })
                    if (add) {
                        categories.push({name: categoryDict.name, id: categoryDict.id})
                    }
                });
                this.setState({categories})
            }).catch(err => console.log(err));
        }
    }

    handleTransactionsChange(newTransactions) {
        this.setState({transactions : newTransactions})
    }



    render(){
        return (
            <div className = "TransactionsPage">
                <Header transactionsActive = {"active"} loggedIn =  {this.props.loggedIn}/>

                {this.props.loggedIn ? (
                    <>
                    <h2 style = {{textAlign: "center", marginTop: 25, textDecoration: "underline"}}>Your Transactions</h2>
                    <div className = "container" style = {{width: "50%", margin: "auto"}}>
                        <AddTransactionModal
                            onTransactionsChange = {this.handleTransactionsChange}
                            categories = {this.state.categories}
                            />
                        <table 
                            className ="table table-sm table-striped table-bordered mt-2">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Amount</th>
                                    <th>Category</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody style = {{textAlign: "left"}}>
                                {this.state.transactions.map(transaction => {
                                    return <tr key = {transaction.id}>
                                        <td>{transaction.title}</td>
                                        <td>{transaction.amount}</td>
                                        <td >{transaction.category}</td>
                                        <td>{transaction.date}</td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                    </div>
                    </>

                ) : (
                    <h2 style = {{textAlign: "center", marginTop: 25}}>Please log in or register to begin!</h2>
                )}


                
            </div>
        )


    }
}

export default TransactionsPage;
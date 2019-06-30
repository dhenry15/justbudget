import React from 'react';
import axios from 'axios';

import AddCategoryModal from './AddCategoryModal';
import CategoryTable from './CategoryTable';

class Budget extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            categories: {
                weekly: [],
                monthly: [],
                yearly: [],
            }
        }
        this.handleCategoriesChange = this.handleCategoriesChange.bind(this);
    }

    componentDidMount() {
        if (this.props.loggedIn) {
            axios.get('http://localhost:5000/api/users/getcategories',
                {
                headers: {
                        Authorization: localStorage.getItem('token')
                } 
            }).then(res => {this.setState({categories: res.data.categories})}
            ).catch(err => console.log(err.response.data.message));
        }

    }

    handleCategoriesChange(newCategories) {
        this.setState({categories : newCategories});
    }
    render(){
        return (
            <div className = "Budget">
                <h2 style = {{textAlign: "center", marginTop: 25, textDecoration: "underline"}}>Your Budgets</h2>
                <div className = "container" style = {{width: "50%", margin: "auto"}}>
                    <AddCategoryModal
                        onCategoriesChange = {this.handleCategoriesChange}
                        categories = {this.state.categories.weekly}
                        budgetType = "weekly"
                        />
                    <h3 style = {{textAlign: "left", marginTop: 10}}>Weekly:</h3>

                    <CategoryTable categories = {this.state.categories.weekly}/>
                    <AddCategoryModal
                        onCategoriesChange = {this.handleCategoriesChange}
                        categories = {this.state.categories.monthly}
                        budgetType = "monthly"
                        />
                    <h3 style = {{textAlign: "left", marginTop: 10}}>Monthly:</h3>
                    <CategoryTable categories = {this.state.categories.monthly}/>

                    <AddCategoryModal
                        onCategoriesChange = {this.handleCategoriesChange}
                        categories = {this.state.categories.yearly}
                        budgetType = "yearly"
                        />
                    <h3 style = {{textAlign: "left", marginTop: 10}}>Yearly:</h3>
                    <CategoryTable categories = {this.state.categories.yearly}/>
                </div>
            </div>
        )
    }
}

export default Budget;
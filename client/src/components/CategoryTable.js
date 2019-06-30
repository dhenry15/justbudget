import React from 'react';

class CategoryTable extends React.Component {
    render() {
        return (
            <table className ="table table-sm table-striped table-bordered mt-1">
            <thead>
                <tr>
                    <th>Category</th>
                    <th>Budget</th>
                    <th>Actual</th>
                    <th>Surplus/Deficit</th>
                </tr>
            </thead>
            <tbody style = {{textAlign: "left"}}>
                {this.props.categories.map(category => {
                    return <tr key = {category.id}>
                        <td>{category.name}</td>
                        <td>{category.budget}</td>
                        <td>{category.actual}</td>
                        <td style = {
                            category.budget - category.actual < 0 ? (
                                {color: "red"}
                            ) : (
                                {color: "green"}
                            )
                        }>
                            {(category.budget - category.actual).toFixed(2)}
                        </td>
                    </tr>
                })}
            </tbody>
        </table>
        )
    }
}

export default CategoryTable;
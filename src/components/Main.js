import React, { Component } from 'react';

class Main extends Component {

  render() {
    return (
        <div id= "content"> 
            <h1>Add product</h1>
            <form onSubmit={(event) => {
                    event.preventDefault()
                    const name = this.productName.value
                    const price = window.web3.utils.toWei(this.productPrice.value.toString(), 'Ether')
                    this.props.createProduct(name, price)
            }}>
            <div className="form-group mr-sm-2">
            <input
              id="productName"
              type="text"
              ref={(input) => { this.productName = input }}
              className="form-control"
              placeholder="Product Name"
              required />
            </div>
            <div className="form-group mr-sm-2">
            <input
              id="productPrice"
              type="text"
              ref={(input) => { this.productPrice = input }}
              className="form-control"
              placeholder="Product Price"
              required />
            </div>
          <button type="submit" className="btn btn-primary">Add Product</button>
        </form>
        <p>&nbsp;</p>
        <h2>Buy Product</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Price</th>
              <th scope="col">Owner</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="productList">
                <tr>
                  <th scope="row">1</th>
                  <td>Iphone x</td>
                  <td>1 Eth</td>
                  <td>0x3Fd2b12d238463dB3fB06c321106ead65d96FAf6</td>
                  <td> <button>Buy</button>
                    </td>
                </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default Main;

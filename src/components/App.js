import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import Marketplace from '../abis/Marketplace.json'
import Navbar from './Navbar'
import Main from './Main'

class App extends Component {

  /*state = {
    account: null // Itt tároljuk a fiókot
  };

  setAccount = (account) => {
    this.setState({ account });
  }
  */

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' })
    } else if (window.web3) {
      window.web3 = new Web3(window.ethereum);
    } else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = Marketplace.networks[networkId]
    if(networkData) {
      const marketplace = web3.eth.Contract(Marketplace.abi, networkData.address)
      this.setState({ marketplace })
      const productCount = await marketplace.methods.productCount().call()
      //console.log("mets " + marketplace.methods)
      //console.log("prodc:" + marketplace.methods.productCount())
      console.log("productCount: " + productCount )
      this.setState({ productCount })

      for(var i = 1 ; i<= productCount; i++){
        const product = await marketplace.methods.products(i).call()
        this.setState({
          products: [...this.state.products, product]
        })
      }
      this.setState({ loading: false })
      console.log(this.state.products)
    } else {
      window.alert('Marketplace contract not deployed to detected network.')
    }
  }
  

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      productCount: 0,
      products: [], // Inicializáld a products állapotot üres tömbként
      loading: true // Inicializáld a loading állapotot true-ként
    };

    this.createProduct = this.createProduct.bind(this)
    this.purchaseProduct = this.purchaseProduct.bind(this)
  }

  createProduct(name, price) {
  this.setState({ loading: true }, () => {
    console.log("elotte");
    console.log(this.state.marketplace.methods.createProduct(name, price));
    
    this.state.marketplace.methods.createProduct(name, price).send({ from: this.state.account })
    //console.log("ha ez megy, a once meg comment ezt kiírja")
      .once('receipt', (receipt) => {
        this.setState({ loading: false }, () => {
          console.log("utana: " + this.state.marketplace.methods.createProduct);
          console.log("price: " + price);
        });
      });
  });
}

purchaseProduct(id, price) {
  this.setState({ loading: true }, () => {
    
    this.state.marketplace.methods.purchaseProduct(id).send({ from: this.state.account, value: price })
      .once('receipt', (receipt) => {
        this.setState({ loading: false }, () => {
          console.log("price: " + price);
        });
      });
  });
}


  

  render() {
    return (
      <div> <Navbar setAccount={this.setAccount} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex">
              { this.state.loading
                ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                : <Main 
                    products={this.state.products} 
                    createProduct={this.createProduct}
                    purchaseProduct={this.purchaseProduct} />
              }
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
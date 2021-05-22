import React, { Component } from "react";
import AuctionContract from "./contracts/Auction.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { highestBid: 0, web3: null, accounts: null, contract: null, input: "", highestBidder: null, auctionBalance: 0, userbalance: 0};

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = AuctionContract.networks[networkId];
      const instance = new web3.eth.Contract(
        AuctionContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      
      const response = await instance.methods.highestBid().call();
      const response2 = await instance.methods.highestBidder().call();
      const response3 = await instance.methods.getContractBalance().call();
      const response4 = await instance.methods.userBalances(accounts[0]).call();

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance, highestBid: response, highestBidder: response2, auctionBalance:response3, userbalance: response4});
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  bid = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.bid().send({ from: accounts[0], value: this.state.input });

    // Get the value from the contract to prove it worked.


    // Update state with the result.
      this.setState({ highestBid: await contract.methods.highestBid().call()});
      this.setState({ highestBidder: await contract.methods.highestBidder().call() });
      this.setState({ auctionBalance: await contract.methods.getContractBalance().call() });
      this.setState({ userbalance: await contract.methods.userBalances(accounts[0]).call() });
  };
  
  withdraw = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.withdraw().send({ from: accounts[0]});

    this.setState({ highestBid: await contract.methods.highestBid().call()});
    this.setState({ highestBidder: await contract.methods.highestBidder().call() });
    this.setState({ auctionBalance: await contract.methods.getContractBalance().call() });
    this.setState({ userbalance: await contract.methods.userBalances(accounts[0]).call() });
    
  };
  

  myChangeHandler = (event) => {
    this.setState({input: event.target.value}, () => {
    console.log(this.state.input)
    });
  } 
  
  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Auction App</h1>
         <p>
        </p>
        <h2>Info</h2>
        <div>The highest Bid is: {this.state.highestBid}</div>
        <div>The highest Bidder is: {this.state.highestBidder}</div>
        <div>The Auction balance is: {this.state.auctionBalance}</div>
        <p>
        </p>
        <h2>Bid</h2>
        <div>Enter the amount you wish to bid:</div>
        <input type="text" onChange={this.myChangeHandler} /> 
        <button onClick = {this.bid}> Go</button>
        <p>
        </p>
        <h2>Withdraw</h2>
        <div>The available amount of the bidder to withdraw is: {this.state.userbalance}</div>  
        <button onClick = {this.withdraw}> Go</button>
      </div>
    );
  }
}

export default App;

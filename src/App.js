import React, { Component } from "react";
import axios from "axios";
import Pusher from "pusher-js";
import ChatList from "./ChatList";
import ChatBox from "./ChatBox";
import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      username: "",
      chats: [],
    };
  }

  componentDidMount() {
    const username = window.prompt("Username: ", "Anonymous");
    this.setState({ username });

    const pusher = new Pusher("ef8575c0c6ecb6f1f5bc", {
      cluster: "eu",
      encrypted: true,
      forceTLS: true,
      // authEndpoint: "http://localhost:3333/pusher/auth",
    });

    const channel = pusher.subscribe("orders");

    channel.bind("client-message", (data) => {
      this.setState({ chats: [...this.state.chats, data], text: "" });
    });
    this.handleTextChange = this.handleTextChange.bind(this);

    Pusher.logToConsole = true;
  }

  handleTextChange(e) {
    if (e.keyCode === 13) {
      const payload = {
        username: this.state.username,
        message: this.state.text,
      };

      axios.post(`http://localhost:3333/message`, payload);
    } else {
      this.setState({ text: e.target.value });
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React-Pusher Chat</h1>
        </header>
        <section>
          <ChatList chats={this.state.chats} />
          <ChatBox
            text={this.state.text}
            username={this.state.username}
            handleTextChange={this.handleTextChange}
          />
        </section>
      </div>
    );
  }
}

export default App;

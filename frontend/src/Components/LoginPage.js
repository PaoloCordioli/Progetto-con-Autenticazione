import React, { Component } from 'react'
import Login from './Login'
import AddMessage from './addMessage'

export default class LoginPage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            login: false,
            error: "",
            username: "",
            token: ""
        }
        this.signIn = this.signIn.bind(this)
    }

    componentWillMount = async () => {
        let login = localStorage.getItem("login")

        if (login === "true") {
            this.setState({ login: true })
            this.setState({ token: localStorage.getItem("token") })
            this.setState({ username: localStorage.getItem("username") })
        }
    }

    signIn = async (username, password, event) => {
        event.preventDefault()

        if (username === '' || password === '') {
            this.setState({ error: <h5 className="error">Password o username errati</h5> })
            return
        }

        let response = await fetch("http://localhost:8000/users/" + username, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password: password })
        }).then((res) => res.json())

        if (response.ok === true) {
            this.setState({ token: response.data.token })
            this.setState({ login: true })
            this.setState({ username: username })

            localStorage.setItem("login", this.state.login)
            localStorage.setItem("username", this.state.username)
            localStorage.setItem("token", this.state.token)
        }
        else this.setState({ error: <h5 className="error"> Password o username errati! </h5> })
    }

    logout = async () => {
        await this.setState({ login: false })
        await this.setState({ username: "" })
        await this.setState({ token: "" })
        await this.setState({ error: "" })

        localStorage.setItem("login", this.state.login)
        localStorage.setItem("username", this.state.username)
        localStorage.setItem("token", this.state.token)
    }

    render() {
        return (
            <div>
                {this.state.login ? <AddMessage logout={this.logout} username={this.state.username} token={this.state.token} /> : <Login signIn={this.signIn} error={this.state.error} />}
            </div>
        )
    }
}
import React, { Component } from "react";
import { notify } from "react-notify-toast";
import { API_URL } from "./config";
import { v4 as uuidv4 } from "uuid";

export default class Forgot extends Component {
  state = {
    sendingEmail: false
  }

  onSubmit = event => {
    event.preventDefault();
    this.setState({ sendingEmail: true })

    // Sending email in body to server
    fetch(`${API_URL}/forgotpassword/`, {
      method: 'post',
      headers: {
        accept: 'applications/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify({ 
        email: this.email.value,
        token: uuidv4()
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        this.setState({ sendingEmail: false });
        notify.show(data.msg);
        this.form.reset();
      })
      .catch(err => console.log(err));
  }

  render = () => {
    const { sendingEmail } = this.state;

    return (
      <form 
        onSubmit={this.onSubmit}
        ref={form => this.form = form }
        >
        <div>
          <input
            type="email"
            ref={input => this.email = input}
            required
          />
          <label htmlFor='email'> email</label>
        </div>
        <div>
          <button type='submit' className='btn' disabled={sendingEmail}>
            {sendingEmail
              ? "Sending reset link"
              : "Send a reset link"
            }
          </button>
        </div>
      </form>
    )
  }
}
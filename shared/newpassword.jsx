import React, { Component } from "react";
import { notify } from "react-notify-toast";
import { API_URL } from "./config";

export default class NewPassword extends Component {
  state = {
    settingNewPassword: false
  }

  onSubmit = event => {
    event.preventDefault();
    this.setState({ settingNewPassword: true })

    console.log(`PASS: ${this.newpassword}`);
    console.log(`STATE: ${this.state}`);
    

    // Sending email in body to server
    fetch(`${API_URL}/setnewpassword/${this.props.user_id}/${this.newpassword}`, {
      method: 'post',
      headers: {
        accept: 'applications/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify({ 
        email: this.newpassword.value
      })
    })
      .then(res => res.json())
      .then(data => {
        if (!data) {
          console.log("New Password error")
        } else {
          console.log("Got some data!")
          console.log(data);
          this.setState({ settingNewPassword: false });
          notify.show(data.msg);
          this.form.reset();
        }
      })
      .catch(err => console.log(err));
  }

  render = () => {
    const { settingNewPassword } = this.state;
    return (
      <form 
        onSubmit={this.onSubmit}
        ref={form => this.form = form }
        >
        <div>
          <input
            type="password"
            ref={input => this.newpassword = input}
            required
          />
          <label htmlFor='password'> Password</label>
        </div>
        <div>
          <input
            type="password"
            ref={input => this.passwordconfirmation = input}
            required
          />
          <label htmlFor='password'>Password Confirmation</label>
        </div>
        <div>
          <button type='submit' className='btn' disabled={settingNewPassword}>
            {settingNewPassword
              ? "Updating new password"
              : "Submit new password"
            }
          </button>
        </div>
      </form>
    )
  }
}
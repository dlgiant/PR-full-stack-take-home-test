import React from "react";
import { Link } from "react-router-dom";

class ForgotForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {email: ''};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({email: event.target.value});
    console.log("EVENT: ", event.target.email);
    console.log("EMAIL: ", this.state.email);

  }

  handleSubmit(event) {
    alert('An email was submitted: '+this.state.email)
    if (process.env.NODE_ENV == 'production' ){
      console.log("Submitted email with reset token to: ", this.state.email);
    } else {
      console.log("Development: Send email to ", this.state.email, " using stub");
    }
    event.preventDefault();
  }

  render() {
    return (
    <div>
      <form onSubmit={this.handleSubmit}>
        <label>
          Email
          <input name="email" type="email" value={this.state.email} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    </div>
    );
  }

}

export const Forgot = (props) => (
  <ForgotForm />
  );

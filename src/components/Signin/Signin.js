import React from 'react';


//nebude mit state, muzu udelat pure function
//pripojeni front na back - je nutne udelat predelat na React
//co bylo onRouteChange musim prepsat na this.props.onRouteChange (nebo dekompozice)
class Signin extends React.Component {

  constructor(props) {
    super();
    this.state = {
      signInEmail: '',
      signInPassword: ''
    }
  }

  onEmailChange = (event) => {
    this.setState({ signInEmail: event.target.value })
  }

  onPasswordChange = (event) => {
    this.setState({ signInPassword: event.target.value })
  }

  onSubmitSignIn = () => {
    //console.log(this.state);
    //fetch defaultne dela GET, proto v objektu popisu jak ma vypadat POST
    fetch('http://localhost:3000/signin', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: this.state.signInEmail,
        password: this.state.signInPassword
      })
    })//kontrola co se vraci v response a podle toho route
      // .then(response => response.json())
      // .then(data => {
      //   if(data === 'success'){
      //     this.props.onRouteChange('home');
      //   }
      // })
      //zmena?
      .then(response => response.json())
      .then(user => {
        if (user.id) {
          this.props.loadUser(user);
          this.props.onRouteChange('home');
        }
      })
  }

  render() {
    return (
      <article className="br3 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow center">
        <main className="pa4 black-80">
          <div className="measure">
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f1 fw6 ph0 mh0 center">Sign In</legend>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                <input onChange={this.onEmailChange}
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="email" name="email-address" id="email-address" />
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                <input onChange={this.onPasswordChange}
                  className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="password" name="password" id="password" />
              </div>
            </fieldset>
            <div>
              <input
                onClick={this.onSubmitSignIn}
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                type="submit"
                defaultValue="Sign in" />
            </div>
            <div className="lh-copy mt3">
              <p onClick={() => this.props.onRouteChange('registger')} className="f6 link dim black db pointer">Register</p>
            </div>
          </div>
        </main>
      </article >
    );
  }
}

export default Signin;
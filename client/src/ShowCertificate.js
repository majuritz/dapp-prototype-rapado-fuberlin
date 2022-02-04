// ============================
// Imports
// ============================
import React, { Component } from "react";

// ============================
// Component: Show uploaded data of a certificate
// ============================
class ShowCertificate extends Component {

  constructor(props) {
    super(props)

    // Set initial values of state
    this.state = {
      certificateHash: '',
      certificateData: []
    }

    this.onSubmitShowCertificate = this.onSubmitShowCertificate.bind(this);

}

// ============================
// Function: Handler for the submit button
// ============================
onSubmitShowCertificate = async (event) => {

  // Prevent reload of website
  event.preventDefault();

  // Get URI of the certificate
  this.state.certificateHash = event.target[0].value;


  // Get key of certificate
  const key = await this.props.getKey(this.state.certificateHash);

  // Get json data from IPFS by hash and convert to map
  const jsonData = await this.props.ipfsDownload(this.state.certificateHash, key);

  this.setState({ certificateData: Array.from(Object.entries(jsonData)) });

}

  // ============================
  // Render HTML elements
  // ============================
  render() {

    return (
      <div className="showCertificate">

          <h1>Display certificate details</h1>

          <form onSubmit={this.onSubmitShowCertificate} >

            <div className="row">
              <div className="col-md-6 d-flex">
                <div className="form-group" id="partIdDetails">
                  <label htmlFor="partIdDetails">Certificate hash</label>
                  <input type="text" className="form-control" />
                </div>
              </div>

              <div className="col-md-6 d-flex">
                <div className="form-group">
                  <input type='submit' className="btn btn-block btn-primary btn-lg" value="Show certificate" />
                </div>
              </div>
            </div>

          </form>

          {this.state.certificateData.map}

          <div className="row text-center">
            { this.state.certificateData.map(obj => {
                return(
                  <div id="formField" key={obj[0].toUpperCase()} className="col-md-4">
                    <div id="formFieldHeader">{obj[0].toUpperCase()}</div>
                    <div id="formFieldContent">{String(obj[1])}</div>
                  </div>
                )
              })
            }
          </div>

        </div>
    );
  }
}
export default ShowCertificate;

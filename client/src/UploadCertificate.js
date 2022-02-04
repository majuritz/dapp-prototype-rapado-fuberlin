// ============================
// Imports
// ============================
import React, { Component } from "react";

// ============================
// Component: Upload a new Certificate as .json file
// ============================
class UploadCertificate extends Component {

  constructor(props) {
    super(props)

    this.onSubmitaddCertificateHandler = this.onSubmitaddCertificateHandler.bind(this);

  }

  // ============================
  // Function: Handler for the submit button
  // ============================
  onSubmitaddCertificateHandler = async (event) => {

    // Prevent reload of website
    event.preventDefault();

    // Get token id for which the certificate will be added
    const formPartId = event.target[0].value;

    // Add certificate data to token with respective part id
    this.props.addCertificate(formPartId, this.props.state.uploadCertificate);

  }

  // ============================
  // Render HTML elements
  // ============================
  render() {

    return (
      <div className="uploadCertificate">

          <h1>Upload a new Certificate to IPFS</h1>

          <form onSubmit={this.onSubmitaddCertificateHandler} >

            <div className="row">
              <div className="col-md-12 d-flex justify-content-center">
                <div className="form-group">
                  <label htmlFor="partId">Part Id</label>
                  <input type="text" className="form-control" id="partId" />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12 d-flex justify-content-center">
                <div className="form-group">
                  <input className="form-control" type='file' onChange={this.props.captureCertificate} />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12 d-flex justify-content-center">
                <input type='submit' className="btn btn-block btn-primary btn-lg" value="Upload certificate" />
              </div>
            </div>

          </form>

        </div>
    );
  }
}
export default UploadCertificate;

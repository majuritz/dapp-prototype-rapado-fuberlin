// ============================
// Imports
// ============================
import React, { Component } from "react";
import "./App.css";
import { Link } from 'react-router-dom';

// ============================
// Component: Selection of new certificate type
// ============================
class Cards extends Component {

  // ============================
  // Render HTML elements
  // ============================
  render() {

    return (

      <div className="cards">

        <div className="row">
          <h1>Create a new Certificate</h1>
        </div>

        <div className="row">

          <div className="col-md-4">
            <div className="card shadow-lg">
              <img src={require("./assets/cards1.jpg")} className="card-img-top" alt="Form1 Img" />
              <div className="card-body">
                <h5 className="card-title">EASA Form 1</h5>
                <p className="card-text">The release certificate for components and is used in manufacturing as well as in maintenance. In general, any component can only be installed on an aircraft if it has a release certificate EASA Form 1. Only manufacturers or maintenance organizations with a respective approval from EASA are eligible to issue an EASA Form 1. </p>
                <Link to="/FormOne" className="btn btn-primary">Create EASA Form 1</Link>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-lg">
              <img src={require("./assets/cards2.jpg")} className="card-img-top" alt="Ata 106 Img" />
              <div className="card-body">
                <h5 className="card-title">ATA 106</h5>
                <p className="card-text">Initially created by the Air Transport Association (ATA). Outlines and identifies some procedures that the airlines and/or suppliers, buyers and quality assurance / control inspectors could follow in approved parts quality assurance programs. The document is used as commercial trace document, which is not mandatory and has no legal foundation in aviation law context.</p>
                <Link to="/Ata" className="btn btn-primary">Create ATA 106</Link>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-lg">
              <img src={require("./assets/cards3.jpg")} className="card-img-top" alt="Upload Img" />
              <div className="card-body">
                <h5 className="card-title">Upload Certificate</h5>
                <p className="card-text">Import your own certificate as .json file.</p>
                <Link to="/UploadCertificate" className="btn btn-primary">Import file</Link>
              </div>
            </div>
          </div>

        </div>

      </div>
    );
  }
}

export default Cards;

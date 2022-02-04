// ============================
// Imports
// ============================
import React from "react";
import "./App.css";
import { useForm } from 'react-hook-form';

// ============================
// Component: ATA 106 form
// ============================
const Ata = ({onSubmitAddCertificate}) => {

  // Variable for form inputs
  const {register, handleSubmit} = useForm();

  // Handle form inputs
  const onSubmit = (data) => {

    onSubmitAddCertificate(data);
  }

  // ============================
  // Render HTML elements
  // ============================
    return (
      <div id="aircraftForm" className="ata">

          <form className="shadow-lg" onSubmit={handleSubmit(onSubmit)}>

            <h1>ATA 106</h1>

            <hr/>

            <div className="row">
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="partId">Aircraft Part ID</label>
                  <input type="number" className="form-control" id="partId" {...register('partId', { required: true })} />
                </div>
              </div>
            </div>

            <hr/>

            <div className="row">

              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="formName">1. Form Name</label>
                  <input type="text" className="form-control" id="formName" {...register('formName', { required: true })} />
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="sellerName">2. Seller Name</label>
                  <input type="text" className="form-control" id="sellerName" {...register('sellerName', { required: true })} />
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="reference">3. Reference</label>
                  <input type="text" className="form-control" id="reference" {...register('reference', { required: true })} />
                </div>
              </div>

            </div>

            <div className="row">

              <div className="col-md-12">
                <div className="form-group">
                  <label htmlFor="ownerName">4a. Seller Address</label>
                  <input type="text" className="form-control" id="sellerAddress" {...register('sellerAddress', { required: true })} />
                </div>
              </div>

            </div>

            <div className="row">

              <div className="col-md-12">
                <div className="form-group">
                  <label htmlFor="ownerName">4b. Seller Additional Remarks</label>
                  <input type="text" className="form-control" id="sellerAdditionalRemarks" {...register('sellerAdditionalRemarks', { required: true })} />
                </div>
              </div>

            </div>

            <div className="row">

              <div className="col-md-5">
                <div className="form-group">
                  <label htmlFor="sellerContractNo">5a. Seller Contract No</label>
                  <input type="text" className="form-control" id="sellerContractNo" {...register('sellerContractNo', { required: true })} />
                </div>
              </div>

              <div className="col-md-5">
                <div className="form-group">
                  <label htmlFor="buyerContractNo">5b. Buyer Contract No</label>
                  <input type="text" className="form-control" id="buyerContractNo" {...register('buyerContractNo', { required: true })} />
                </div>
              </div>

              <div className="col-md-2">
                <div className="form-group">
                  <label htmlFor="itemOfContract">6. Item of Contract</label>
                  <input type="number" className="form-control" id="itemOfContract" {...register('itemOfContract', { required: true })} />
                </div>
              </div>

            </div>

            <div className="row">

              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="partDescription">7. Part Description</label>
                  <input type="text" className="form-control" id="partDescription" {...register('partDescription', { required: true })} />
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="manufacturer">8a. Manufacturer</label>
                  <input type="text" className="form-control" id="manufacturer" {...register('manufacturer', { required: true })} />
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="partNo">8b. Part No</label>
                  <input type="text" className="form-control" id="partNo" {...register('partNo', { required: true })} />
                </div>
              </div>

            </div>

            <div className="row">

              <div className="col-md-8">
                <div className="form-group">
                  <label htmlFor="eligibility">9. Eligibility</label>
                  <input type="text" className="form-control" id="eligibility" {...register('eligibility', { required: true })} />
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="quantity">10. Quantity</label>
                  <input type="number" className="form-control" id="quantity" {...register('quantity', { required: true })} />
                </div>
              </div>

            </div>

            <div className="row">

            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="serialNumber">11. Serial Number</label>
                <input type="text" className="form-control" id="serialNumber" {...register('serialNumber', { required: true })} />
              </div>
            </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="status">12. Status</label>
                  <input type="text" className="form-control" id="status" {...register('status', { required: true })} />
                </div>
              </div>

            </div>

            <div className="row">

              <div className="col-md-12">
                <div className="form-group">
                  <label htmlFor="remarks">13a. Remarks</label>
                  <textarea type="text" rows="3" className="form-control" id="remarks" {...register('remarks', { required: true })} >
                  </textarea>
                </div>
              </div>

            </div>

            <div className="row">

              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="obtainedFrom">13b. Obtained From</label>
                  <input type="text" className="form-control" id="obtainedFrom" {...register('obtainedFrom', { required: true })} />
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="lastCertificatedAgency">13c. Last Certificated Agency</label>
                  <input type="text" className="form-control" id="lastCertificatedAgency" {...register('lastCertificatedAgency', { required: true })} />
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="partNo">14/18. NE/SV Verification</label>
                  <input type="text" className="form-control" id="neSvVerification" {...register('neSvVerification', { required: true })} />
                </div>
              </div>

            </div>

            <div className="row">

              <div className="col-md-12">
                <div className="form-group">
                  <label htmlFor="signature">15/19. Signature</label>
                  <input type="text" className="form-control" id="signature" {...register('signature', { required: true })} />
                </div>
              </div>

            </div>

            <div className="row">

              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="name">16/20. Name</label>
                  <input type="text" className="form-control" id="name" {...register('name', { required: true })} />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="shopName">17/21. Date</label>
                  <input type="date" className="form-control" id="date" {...register('date', { required: true })} />
                </div>
              </div>

            </div>

            <hr/>

            <div className="row">

              <div className="col-md-12 d-flex justify-content-center">
                <input type='submit' className="btn btn-block btn-primary btn-lg" value="Submit form" />
              </div>

            </div>

          </form>

      </div>
    );
}
export default Ata;

// ============================
// Imports
// ============================
import React from "react";
import "./App.css";
import { useForm } from 'react-hook-form';

// ============================
// Component: EASA Form 1 form
// ============================
const FormOne = ({onSubmitAddCertificate}) => {

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
      <div id="aircraftForm" className="formOne">

          <form className="shadow-lg" onSubmit={handleSubmit(onSubmit)}>

            <h1>EASA Form 1</h1>

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
                  <label htmlFor="approvingCivilAviationAuthority">1. Approving Civil Aviation Authority</label>
                  <input type="text" className="form-control" id="approvingCivilAviationAuthority" {...register('approvingCivilAviationAuthority', { required: true })} />
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="formType">2. Form Type</label>
                  <input type="text" className="form-control" id="formType" {...register('formType', { required: true })} />
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="formTrackingNumber">3. Form Tracking Number</label>
                  <input type="text" className="form-control" id="formTrackingNumber" {...register('formTrackingNumber', { required: true })} />
                </div>
              </div>

            </div>

            <div className="row">

              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="ownerName">4a. Owner Name</label>
                  <input type="text" className="form-control" id="ownerName" {...register('ownerName', { required: true })} />
                </div>
              </div>

              <div className="col-md-8">
                <div className="form-group">
                  <label htmlFor="ownerAddress">4b. Owner Address</label>
                  <input type="text" className="form-control" id="ownerAddress" {...register('ownerAddress', { required: true })} />
                </div>
              </div>

            </div>

            <div className="row">

              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="workOrder">5. Work Order</label>
                  <input type="text" className="form-control" id="workOrder" {...register('workOrder', { required: true })} />
                </div>
              </div>

              <div className="col-md-3">
                <div className="form-group">
                  <label htmlFor="itemOfWorkOrder">6. Item of Work Order</label>
                  <input type="number" className="form-control" id="itemOfWorkOrder" {...register('itemOfWorkOrder', { required: true })} />
                </div>
              </div>

              <div className="col-md-5">
                <div className="form-group">
                  <label htmlFor="partDescription">7. Part Description</label>
                  <input type="text" className="form-control" id="partDescription" {...register('partDescription', { required: true })} />
                </div>
              </div>

            </div>

            <div className="row">

              <div className="col-md-3">
                <div className="form-group">
                  <label htmlFor="partNumber">8. Part Number</label>
                  <input type="text" className="form-control" id="partNumber" {...register('partNumber', { required: true })} />
                </div>
              </div>

              <div className="col-md-2">
                <div className="form-group">
                  <label htmlFor="quantity">9. Quantity</label>
                  <input type="number" className="form-control" id="quantity" {...register('quantity', { required: true })} />
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="serialNumber">10. Serial Number</label>
                  <input type="text" className="form-control" id="serialNumber" {...register('serialNumber', { required: true })} />
                </div>
              </div>

              <div className="col-md-3">
                <div className="form-group">
                  <label htmlFor="status">11. Status</label>
                  <input type="text" className="form-control" id="status" {...register('status', { required: true })} />
                </div>
              </div>

            </div>

            <div className="row">

              <div className="col-md-12">
                <div className="form-group">
                  <label htmlFor="remarks">12. Remarks</label>
                  <textarea type="text" rows="3" className="form-control" id="remarks" {...register('remarks', { required: true })} >
                  </textarea>
                </div>
              </div>

            </div>

            <div className="row">

              <div className="col-md-12">
                <div className="form-check">
                  <label className="form-check-label" htmlFor="approvedDesign">13a. Approved Design</label>
                  <input type="checkbox" className="form-check-input" id="approvedDesign" {...register('approvedDesign', { required: false })} />
                </div>
              </div>

            </div>

            <div className="row">

              <div className="col-md-12">
                <div className="form-group">
                  <label htmlFor="shopResponsibleSignature">13b. Shop Responsible Signature</label>
                  <input type="text" className="form-control" id="shopResponsibleSignature" {...register('shopResponsibleSignature', { required: true })} />
                </div>
              </div>

            </div>

            <div className="row">

              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="shopCertificateNo">13c. Shop Certificate No</label>
                  <input type="text" className="form-control" id="shopCertificateNo" {...register('shopCertificateNo', { required: true })} />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="shopName">13d. Shop Name</label>
                  <input type="text" className="form-control" id="shopName" {...register('shopName', { required: true })} />
                </div>
              </div>

            </div>

            <div className="row">

              <div className="col-md-12">
                <div className="form-check">
                  <label className="form-check-label" htmlFor="returnToService">14aa. Return to Service</label>
                  <input type="checkbox" className="form-check-input" id="returnToService" {...register('returnToService', { required: false })} />
                </div>
              </div>

            </div>

            <div className="row">

              <div className="col-md-12">
                <div className="form-check">
                  <label className="form-check-label" htmlFor="otherRegulationsApply">14ab. Other Regulations Apply</label>
                  <input type="checkbox" className="form-check-input" id="otherRegulationsApply" {...register('otherRegulationsApply', { required: false })} />
                </div>
              </div>

            </div>

            <div className="row">

              <div className="col-md-12">
                <div className="form-group">
                  <label htmlFor="mechanicSignature">14b. Mechanic Signature</label>
                  <input type="text" className="form-control" id="mechanicSignature" {...register('mechanicSignature', { required: true })} />
                </div>
              </div>

            </div>

            <div className="row">

              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="mechanicCertificateNo">14c. Mechanic Certificate No</label>
                  <input type="text" className="form-control" id="mechanicCertificateNo" {...register('mechanicCertificateNo', { required: true })} />
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="mechanicName">14d. Mechanic Name</label>
                  <input type="text" className="form-control" id="mechanicName" {...register('mechanicName', { required: true })} />
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="dateOfIssue">14e. Date of Issue</label>
                  <input type="date" className="form-control" id="dateOfIssue" {...register('dateOfIssue', { required: true })} />
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
export default FormOne;

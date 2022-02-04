// ============================
// Imports
// ============================
import React, { Component } from "react";
import "datatables.net-dt/css/jquery.dataTables.css";
import 'datatables.net-buttons';

// ============================
// Component: List of all aircraft parts and certificates
// ============================
class Home extends Component {

  // ============================
  // Constructor: Get props
  // ============================
  constructor(props) {
    super(props)

    // Set initial values of state
    this.state = {
      descriptionValue: '',
      valPartId: ''
    };

    this.updateDescriptionValueHandler = this.updateDescriptionValueHandler.bind(this);
    this.updateTable = this.updateTable.bind(this);
  }

  // ============================
  // Function: First call of page
  // ============================
  componentDidMount = async () => {

    // Get data of all parts for user/address
    var data = await this.props.getListOfParts();

    const $ = require('jquery');
    $.DataTable = require('datatables.net');
    var me = this;

    // Build datatable
    $(document).ready(function () {
      var table = $('#partTable').DataTable({
        dom: 'lBfrtip',
        buttons: [
          {
            text: 'Refresh',
            action: async function (e, dt, node, config) {
              me.updateTable();
            },
            "className": 'btn btn-secondary'
          }
        ],
        responsive: true,
        columns: [
          { 'data': 'partId', "width": "10%", "className": "dt-center" },
          { 'data': 'description', "width": "30%" },
          { 'data': 'certificates', "width": "50%" },
          { 'data': 'isValidated', "width": "10%",
            render: function(data, type) {
                if (data === true) {
                  return '<span id="validation-icon"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="green" class="bi bi-check-square-fill" viewBox="0 0 16 16"> <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/></svg></span>';
                } else {
                  return '<span id="validation-icon"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="red" class="bi bi-x-square-fill" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z"/></svg></span>';
                }
            }
          }
        ],
        data: data
      });

      table.buttons().container().appendTo( $('.col-sm-6:eq(0)', table.table().container() ) );
    });
  }

  // ============================
  // Function: Update table data
  // ============================
  updateTable = async () => {

    // Load library
    const $ = require('jquery');
    $.DataTable = require('datatables.net');

    // Get data of all parts for user/address
    var newData = await this.props.getListOfParts();

    // Write updated data to table
    $('#partTable').DataTable().clear().rows.add(newData).draw();
  }

  // ============================
  // Function: Handler for part id input field of creation
  // ============================
  updateDescriptionValueHandler = async (event) => {

    // Prevent reload of website
    event.preventDefault();

    // Get value of input field
    this.state.descriptionValue = event.target.value;
  }

  // ============================
  // Render HTML elements
  // ============================
  render() {

    return (
      <div className="home">

        <h1>Overview of your parts and certificates</h1>

        <div id="overview">
          <table id="partTable" className="display cell-border">
             <thead>
               <tr>
                 <th>Part ID</th>
                 <th>Description</th>
                 <th>Certificates</th>
                 <th>Validated</th>
               </tr>
             </thead>
           </table>
         </div>

         <div id="create_validate" className="row">

          <div className="col-md-5">
            <form id="createAirCraftPart" onSubmit={event => this.props.onSubmitAirCraftPart(event, this.state.descriptionValue)} >
              <input className="form-control" type='text' placeholder="Description of the aircraft part" onChange={event => this.updateDescriptionValueHandler(event)} />
              <input type='submit' className="btn btn-block btn-primary btn-lg" value="Create aircraft part" />
            </form>
           </div>

          </div>

      </div>
    );
  }
}
export default Home;

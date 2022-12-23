import { MaxHealthStorage } from "@shared/services/storage";
export namespace BillingForm {

    // Payment Methods Form Data
    export const refundFormData = {
        title: "",
        type: "object",
        properties: {
          cashamount: {
            title: "Amount",
             type: "number",
             defaultValue: "0.00",
             required: true,
           },
          chequeno: {
            title: "Cheque No",
            type: "number",
            required: true,
          },
          chequeissuedate: {
            title: "Issue Date",
            type: "date",
            maximum: new Date(),
            defaultValue: new Date(),
            required: true,
          },
          chequebankname: {
            title: "Bank Name",
            type: "autocomplete",
            required: true,
          },
          chequebranchname: {
            title: "Branch Name",
            type: "string",
            required: true,
          },
          chequeamount: {
            title: "Amount",
            type: "number",
            defaultValue: "0.00",
            required: true,
          },
          chequeauth: {
            title: "Authorised By",
            type: "string",
            required: true,
          },
          creditcardno: {
            type: "number",
            required: true,
            title: "Card No.",
          },
          creditholdername: {
            type: "string",
            required: true,
            title: "Card Holder Name",
          },
          creditbankname: {
            type: "autocomplete",
            required: true,
            title:"Bank Name",
          },
          creditbatchno:{
            type: "string",
            required: true,
            title:"Batch No.",
          }, //10
          creditamount: {
            type: "number",
            defaultValue: "0.00",
            required: true,
            title: "Amount",
          },
          creditapproval: {
            type: "string",
            required: true,
            title:"Approval Code",
          },
          creditterminal: {
            type: "string",
            required: true,
            title:"Terminal ID",
          },
          creditacquiring: {
            type: "string",
            required: true,
            title:"Acquiring Bank",
          },
          demandddno: {
            type: "string",
            required: true,
            title:"DD No.",
          },
          demandissuedate: {
            type: "date",
            maximum: new Date(),
            defaultValue: new Date(),
            required: true,
            title:"Issue Date",
          },
          demandbankname: {
            type: "autocomplete",
            required: true,
            title:"Bank Name",
          },
          demandbranchname: {
            type: "string",
            required: true,
            title:"Branch Name",
          },
          demandamount: {
            type: "number",
            defaultValue: "0.00",
            required: true,
            title:"Amount",
          },
          demandauth: {
            type: "string",
            required: true,
            title:"Authorised By",
          }, //20
          mobilesendermobile: {
            type: "number",
            title:"Sender Mobile",
            required: true,
          },
          mobilesendermmid: {
            type: "number",
            title:"Sender MMID No.",
            required: true,
          },
          mobilesendername: {
            type: "string",
            title:"Sender Name",
            required: true,
          },
          mobilebankname: {
            type: "string",
            title:"Bank Name",
            required: true,
          },
          mobilebranchname: {
            type: "string",
            title:"Branch Name",
            required: true,
          },
          mobilebeneficary: {
            type: "number",
            title:"Beneficiary Mob No.",
            required: true,
          },
          mobiletransactionamt: {
            type: "number",
            title:"Transaction Amount",
            required: true,
          },
          mobiletransactionref: {
            type: "string",
            title:"Transaction Reference",
            required: true,
          },
          onlinetransacid: {
            type: "string",
            required: true,
            title:"Transaction ID",
          },
          onlinebookingid: {
            type: "string",
            required: true,
            title:"Booking ID",
          }, //30
          onlinecardvalidate: {
            type: "radio",
            required: true,
           // title: "Card Validation",
            options: [
              { title: "Yes", value: "yes" },
              { title: "No", value: "no" }
            ]
          },
          onlinecontactno: {
            type: "number",
            required: true,
            title:"Contact No.",
          },
          onlineamount: {
            type: "number",
            defaultValue: "0.00",
            required: true,
            title:"Amount",
          },
          paytmamount: {
            type: "number",
            defaultValue: "0.00",
            required: true,
            title:"Amount",
          },
          paytmwallet: {
            type: "string",
            required: true,
            title: "Wallet"
          },
          paytmsendermobile: {
            type: "number",
            required: true,
            title:"Sender Mobile No.",
          },
          paytmsenername: {
            type: "string",
            required: true,
            title:"Branch Name",
          },
          paytmotp: {
            type: "number",
            required: true,
            title:"OTP",
          },
          paytmtransacref: {
            type: "string",
            required: true,
            title:"Transaction Reference",
          },
          paytmorderid: {
            type: "string",
            required: true,
            title:"Order ID",
          }, ///40
          upicardno: {
            type: "number",
            required: true,
            title:"Card No.",
          },
          upitransactionid: {
            type: "string",
            required: true,
            title:"Transaction ID",
          },
          upibankname: {
            type: "string",
            required: true,
            title:"Bank Name"
          },
          upiamount : {
            type: "number",
            defaultValue: "0.00",
            required: true,
            title:"Amount",
          },
          upibatchno: {
            type: "string",
            required: true,
            title:"Batch No."
          },
          upiapproval: {
            type: "string",
            required: true,
            title:"Approval Code"
          },
          upiterminal: {
            type: "string",
            required: true,
            title: "Terminal ID",
          },
          upiacquiring: {
            type: "string",
            required: true,
            title: "Acquiring Bank",
          },
          internetmobile: {
              type: "tel",
              required: true,
              title: "Mobile No.",
              pattern: "^[1-9]{1}[0-9]{9}",
          },
          internetemail: {
              type: "string",
              required: true,
              title: "Email Id"
          }, //50
          internetamount: {
              type: "number",
              defaultValue: "0.00",
              required: true,
              title: "Amount"
          },
	        dueamount: {
              type: "number",
              defaultValue: "0.00",
              title: "Amount"
          },
          dueamountauthorisedby: {
              type: "string",
              title: "Authorised By"
          },
          dueamountduebillremarks: {
              type: "textarea",
              title: "Remarks",
          },
          chequevaliditydate:{
            type: "date",
            defaultValue: new Date(),
            minimum: new Date()
          },
          demandvaliditydate:{
            type: "date",
            defaultValue: new Date(),
            minimum: new Date()
          },
          mobilewallet:{
            type: "dropdown",
          },
          mobileotp:{
            type: "string",
            title: "OTP"
          },
          mobileorderid:{
            type: "string",
            title: "Order Id"
          }, //60
          posimei:{
            type: "string",
            required: true,
            title: "POS IMEI",
            defaultValue: MaxHealthStorage.getCookie("MAXMachineName"),
            readonly: true,
          },
          creditcardtransactionid:{
            type: "string",
            required: true,
            title: "Transaction ID",
          },
          internetremarks: {
            type: "textarea",
            required: true,
            title:"Remarks"
        },
        upicardholdername:{
          type: "string",
          required: true,
          title: "Card Holder Name",
        },
        upivalidity:{
          type: "date",
          defaultValue: new Date(),
          minimum: new Date(),
          title: "Validity",
          required: true,
        },
        creditvaliditydate:{
          type: "date",
          defaultValue: new Date(),
          minimum: new Date(),
          title:"Validity",
          required: true,
        },
        creditbanktid:{
          type: "string",
          required: true,
          title: "Bank TID",
        },//66
        upiposimei:{
          type: "string",
          title: "POS IMEI",
          required: true,
          defaultValue: MaxHealthStorage.getCookie("MAXMachineName"),
          readonly: true,
        },
        upibanktid:{
          type: "string",
          title: "Bank TID",
          required: true,
        }
        },
    };
    
    // Form 60 Form Data
    export const form60FormData = {
        title: "",
        type: "object",
        properties: {
          aadharno: {
            title: "Aadhar No.",
            type: "string",
            pattern: /(^[0-9]{4}[0-9]{4}[0-9]{4}$)/,
           // pattern: /(^[0-9]{4}[0-9]{4}[0-9]{4}$)|(^[0-9]{4}\s[0-9]{4}\s[0-9]{4}$)|(^[0-9]{4}-[0-9]{4}-[0-9]{4}$)/,
          },
          appliedforpan: {
            type: "checkbox",
            options: [{
              title: ''
            }]
          },
          dateofapplication: {
            type: "date",
            maximum: new Date(),
          },
          applicationno: {
            type: "number"
          },
          agriculturalincome: {
            type: "string"
          },
          otherthanagriculturalincome: {
            type: "string"
          },
          iddocumenttype: {
            type: "dropdown",
            placeholder: "<--Select-->",
          },
          iddocidentityno: {
            type: "string"
          },
          idnameofauthority: {
            type: "string"
          },
          tickforsamedoc: {
            type: "checkbox",
            options: [{
              title: ''
            }]
          },
          addressdocumenttype: {
            type: "dropdown",
            placeholder: "<--Select-->",
          },
          addressdocidentityno: {
            type: "string"
          },
          addressnameofauthority: {
            type: "string"
          },
          remarks: {
            type: "string"
          }
        },
    };
      //service deposit form data
  export const servicedepositFormData = {
    type: "object",

    title: "",

    properties: {
      servicetype: {
        type: "dropdown",
      },

      deposithead: {
        type: "dropdown",
       emptySelect: true,
       placeholder: "Select Advance Type",
      },
    },
  };
}
export namespace BillingForm {

    // Payment Methods Form Data
    export const refundFormData = {
        title: "",
        type: "object",
        properties: {
          cashamount: {
             type: "number",
             defaultValue: "0.00",
             required: true,
           },
          chequeno: {
            type: "number",
            required: true,
          },
          chequeissuedate: {
            type: "date",
            maximum: new Date(),
            defaultValue: new Date(),
            required: true,
          },
          chequebankname: {
            type: "autocomplete",
            required: true,
          },
          chequebranchname: {
            type: "string",
            required: true,
          },
          chequeamount: {
            type: "number",
            defaultValue: "0.00",
            required: true,
          },
          chequeauth: {
            type: "string",
            required: true,
          },
          creditcardno: {
            type: "number",
            required: true,
          },
          creditholdername: {
            type: "string",
            required: true,
          },
          creditbankname: {
            type: "autocomplete",
            required: true,
          },
          creditbatchno:{
            type: "string",
            required: true,
          }, //10
          creditamount: {
            type: "number",
            defaultValue: "0.00",
            required: true,
          },
          creditapproval: {
            type: "string",
            required: true,
          },
          creditterminal: {
            type: "string",
            required: true,
          },
          creditacquiring: {
            type: "string",
            required: true,
          },
          demandddno: {
            type: "string",
            required: true,
          },
          demandissuedate: {
            type: "date",
            maximum: new Date(),
            defaultValue: new Date(),
            required: true,
          },
          demandbankname: {
            type: "autocomplete",
            required: true,
          },
          demandbranchname: {
            type: "string",
            required: true,
          },
          demandamount: {
            type: "number",
            defaultValue: "0.00",
            required: true,
          },
          demandauth: {
            type: "string",
            required: true,
          }, //20
          mobilesendermobile: {
            type: "number"
          },
          mobilesendermmid: {
            type: "number"
          },
          mobilesendername: {
            type: "string"
          },
          mobilebankname: {
            type: "string"
          },
          mobilebranchname: {
            type: "string"
          },
          mobilebeneficary: {
            type: "number"
          },
          mobiletransactionamt: {
            type: "number"
          },
          mobiletransactionref: {
            type: "string"
          },
          onlinetransacid: {
            type: "string"
          },
          onlinebookingid: {
            type: "string"
          }, //30
          onlinecardvalidate: {
            type: "radio",
            required: false,
            options: [
              { title: "Yes", value: "yes" },
              { title: "No", value: "no" }
            ]
          },
          onlinecontactno: {
            type: "number"
          },
          onlineamount: {
            type: "number",
            defaultValue: "0.00"
          },
          paytmamount: {
            type: "number",
            defaultValue: "0.00",
            required: true,
          },
          paytmwallet: {
            type: "string",
            required: true,
          },
          paytmsendermobile: {
            type: "number",
            required: true,
          },
          paytmsenername: {
            type: "string",
            required: true,
          },
          paytmotp: {
            type: "number",
            required: true,
          },
          paytmtransacref: {
            type: "string",
            required: true,
          },
          paytmorderid: {
            type: "string",
            required: true,
          }, ///40
          upicardno: {
            type: "number",
            required: true,
          },
          upitransactionid: {
            type: "string",
            required: true,
          },
          upibankname: {
            type: "string",
            required: true,
          },
          upiamount : {
            type: "number",
            defaultValue: "0.00",
            required: true,
          },
          upibatchno: {
            type: "string",
            required: true,
          },
          upiapproval: {
            type: "string",
            required: true,
          },
          upiterminal: {
            type: "string",
            required: true,
          },
          upiacquiring: {
            type: "string",
            required: true,
          },
          internetmobile: {
              type: "tel",
              required: true,
          },
          internetemail: {
              type: "string",
              required: true,
          }, //50
          internetamount: {
              type: "number",
              defaultValue: "0.00",
              required: true,
          },
	        dueamount: {
              type: "string",
              defaultValue: "0.00"
          },
          dueamountauthorisedby: {
              type: "string"
          },
          dueamountduebillremarks: {
              type: "textarea"
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
          },
          mobileorderid:{
            type: "string",
          }, //60
          posimei:{
            type: "string",
            required: true,
          },
          creditcardtransactionid:{
            type: "string",
            required: true,
          },
          internetremarks: {
            type: "textarea",
            required: true,
        },
        },
    };
    
    // Form 60 Form Data
    export const form60FormData = {
        title: "",
        type: "object",
        properties: {
          aadharno: {
            type: "number",
           // pattern: "^[2-9]{1}[0-9]{3}\\s[0-9]{4}\\s[0-9]{4}$"
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
export namespace PaymentMethods {
  export const methods: any = {
    cash: {
      label: "Cash",
      form: "cashForm",
    },
    cheque: {
      label: "Cheque",
      form: "chequeForm",
      payloadKey: "tab_cheque",
    },
    credit: { label: "Credit / Debit Card", form: "creditForm", payloadKey: "tab_credit", },
    debit: { label: "Debit Card", form: "debitForm", payloadKey: "tab_debit", },
    demand: {
      label: "Demand Draft",
      form: "demandDraftForm",
      payloadKey: "tab_dd",
    },
    mobilepayment: { label: "Mobile Payment", form: "mobilePaymentForm", payloadKey: "tab_Mobile",},
    onlinepayment: { label: "Online Payment", form: "onlinePaymentForm" , payloadKey: "tab_Online",},
    upi: { label: "UPI", form: "upiForm" , payloadKey: "tab_UPI",},
  };

  export const tab_cheque = (values: any) => {
    return {
      chequeNo: values.chequeNo,
      chequeDate: values.chequeDate,
      bankName: values.bankName.title,
      branchName: values.branchName,
      city: "",
      flag: 1,
    };
  };

  export const tab_dd = (values: any) => {
    return {
      ddNumber: values.ddNumber,
      ddDate: values.ddDate,
      bankName: values.bankName.title,
      branchName: values.branchName,
      flag: 1,
    };
  };

  export const tab_credit = (values: any) => {
    return {
      posimei:values.posimei,
      transactionid:values.transactionid,
      ccNumber: values.ccNumber,
      creditholdername: values.creditholdername,
      cCvalidity:values.cCvalidity,
      bankName: values.bankName.title,
      approvalno: values.approvalno,
      approvalcode:values.approvalcode,
      terminalID:values.terminalID,
      acquirer:values.acquirer,
      banktid:values.banktid,
    };
  };

   export const tab_debit = (values: any) => {
    return {
      posimei:values.posimei,
      transactionid:values.transactionid,
      ccNumber: values.ccNumber,
      creditholdername: values.creditholdername,
      cCvalidity:values.cCvalidity,
      bankName: values.bankName.title,
      creditbatchno: values.creditbatchno,
      creditapproval:values.creditapproval,
      creditterminal:values.creditterminal,
      creditacquiring:values.creditacquiring,
      banktid:values.banktid,
    };
  };


  export const tab_Mobile = (values: any) => {
    return {     
      mobileNo:values.mobileNo,
      mmid: values.mmid,
      senderName: values.senderName,
      bankName: values.bankName,
      branchName:values.branchName,
      beneficiaryMobile:values.beneficiaryMobile,
      transactionRef:values.transactionRef,
    };
  };

  export const tab_Online = (values: any) => {
    return {
      transactionId:values.transactionId,
      bookingId:values.bookingId,
      cardValidation: values.cardValidation,
      onlineContact: values.onlineContact,
    };
  };

   export const tab_UPI = (values: any) => {
    return {
      ccNumber_UPI:values.ccNumber_UPI,
      cCvalidity_UPI:values.cCvalidity_UPI,
      approvalno_UPI:values.approvalno_UPI,
      bankname_UPI: values.bankname_UPI,
      flagman_UPI: values.flagman_UPI,
      approvalcode_UPI:values.approvalcode_UPI,
      terminalID_UPI:values.terminalID_UPI,
      acquirer_UPI: values.acquirer_UPI,
      cardholdername_UPI:values.cardholdername_UPI,
    };
  };


  export const cashForm = (options: any) => {
    return {
      title: "Cash Details",
      type: "object",
      properties: {
        modeOfPayment: {
          type: "hidden",
          value: "Cash",
        },
        price: {
          type: "number",
          defaultValue: "0.00",
          label: "Amount",
        },
      },
    };
  };

  export const chequeForm = (options: any) => {
    return {
      title: "Cheque Details",
      type: "object",
      properties: {
        modeOfPayment: {
          type: "hidden",
          value: "Cheque",
        },
        price: {
          type: "number",
          defaultValue: "0.00",
          label: "Amount",
        },
        chequeNo: {
          type: "number",
          label: "Cheque No",
        },
        chequeDate: {
          type: "date",
          maximum: new Date(),
          label: "Issue Date",
        },
        bankName: {
          type: "autocomplete",
          label: "Bank Name",
          options: options.bankList,
        },
        branchName: {
          type: "string",
          label: "Branch Name",
        },
        chequeauth: {
          type: "string",
          label: "Authorised By",
        },
      },
    };
  };

  export const creditForm = (options: any) => {
    return {
      title: "Credit Card Details",
      type: "object",
      properties: {
         modeOfPayment: {
          type: "hidden",
          value: "Credit Card",
        },
        price: {
          type: "number",
          defaultValue: "0.00",
          label: "Amount",
        },
        posimei: {
          type: "dropdown",
          label: "POS IMEI",
        },
         transactionid: {
          type: "string",
          label: "Transaction ID",
        },
        ccNumber: {
          type: "number",
          label: "Card No.",
        },
        creditholdername: {
          type: "string",
          label: "Card Holder Name",
        },
         cCvalidity: {
          type: "date",        
          label: "Validity",
        },
        bankName: {
          type: "autocomplete",
          label: "Bank Name",
          options: options.bankList,
        },
        approvalno: {
          type: "string",
          label: "Batch No.",
        }, //10

        approvalcode: {
          type: "number",
          label: "Approval Code",
        },
        terminalID: {
          type: "string",
          label: "Terminal ID",
        },
        acquirer: {
          type: "string",
          label: "Acquiring Bank",
        },
        banktid: {
          type: "string",
          label: "Bank TID",
        },
      },
    };
  };

   export const debitForm = (options: any) => {
    return {
      title: "Debit Card Details",
      type: "object",
      properties: {
         modeOfPayment: {
          type: "hidden",
          value: "Debit Card",
        },
        price: {
          type: "number",
          defaultValue: "0.00",
          label: "Amount",
        },
        posimei: {
          type: "dropdown",
          label: "POS IMEI",
        },
         transactionid: {
          type: "string",
          label: "Transaction ID",
        },
        ccNumber: {
          type: "number",
          label: "Card No.",
        },
        creditholdername: {
          type: "string",
          label: "Card Holder Name",
        },
         cCvalidity: {
          type: "date",        
          label: "Validity",
        },
        bankName: {
          type: "autocomplete",
          label: "Bank Name",
          options: options.bankList,
        },
        creditbatchno: {
          type: "string",
          label: "Batch No.",
        }, //10

        creditapproval: {
          type: "number",
          label: "Approval Code",
        },
        creditterminal: {
          type: "string",
          label: "Terminal ID",
        },
        creditacquiring: {
          type: "string",
          label: "Acquiring Bank",
        },
        banktid: {
          type: "string",
          label: "Bank TID",
        },
      },
    };
  };


  export const demandDraftForm = (options: any) => {
    return {
      title: "Demand Draft Details",
      type: "object",
      properties: {
        modeOfPayment: {
          type: "hidden",
          value: "Demand Draft",
        },
        price: {
          type: "number",
          defaultValue: "0.00",
          label: "Amount",
        },
        ddNumber: {
          type: "string",
          label: "DD No.",
        },
        ddDate: {
          type: "date",
          maximum: new Date(),
          label: "Issue Date",
        },
        bankName: {
          type: "autocomplete",
          label: "Bank Name",
          options: options.bankList,
        },
        branchName: {
          type: "string",
          label: "Branch Name",
        },
        demandauth: {
          type: "string",
          label: "Authorised By",
        }, //20
      },
    };
  };

  export const mobilePaymentForm = (options: any) => {
    return {
      title: "Mobile Payment Details",
      type: "object",
      properties: {
        modeOfPayment: {
          type: "hidden",
          value: "Cash Payment by Mobile",
        },
        price: {
          type: "number",
          defaultValue: "0.00",
          label: "Amount",
        },
        mobileNo: {
          type: "number",
          label: "Sender Mobile",
        },
        mmid: {
          type: "number",
          label: "Sender MMID No.",
        },
        senderName: {
          type: "string",
          label: "Sender Name",
        },
        bankName: {
          type: "string",
          label: "Bank Name",
        },
        branchName: {
          type: "string",
          label: "Branch Name",
        },
        beneficiaryMobile: {
          type: "number",
          label: "Beneficiary Mob No.",
        },
        // mobiletransactionamt: {
        //   type: "number",
        //   label: "Transaction Amount",
        // },
        transactionRef: {
          type: "string",
          label: "Transaction Reference",
        },
      },
    };
  };

  export const onlinePaymentForm = (options: any) => {
    return {
      title: "Online Payment Details",
      type: "object",
      properties: {
         modeOfPayment: {
          type: "hidden",
          value: "Online Payment",
        },
        price: {
          type: "number",
          defaultValue: "0.00",
          label: "Amount",
        },
        transactionId: {
          type: "string",
          label: "Transaction ID",
        },
        bookingId: {
          type: "string",
          label: "Booking ID",
        }, //30
        cardValidation: {
          type: "radio",
          required: false,
          options: [
            { title: "Yes", value: "yes" },
            { title: "No", value: "no" },
          ],
          label: "Card Validation",
        },
        onlineContact: {
          type: "number",
          label: "Contact No.",
        },
      },
    };
  };

  export const paytmForm = (options: any) => {
    return {
      title: "Mobile Payment Details",
      type: "object",
      properties: {
          modeOfPayment: {
          type: "hidden",
          value: "Cash Payment by Mobile",
        },
        price: {
          type: "number",
          defaultValue: "0.00",
          label: "Amount",
        },
        paytmwallet: {
          type: "autocomplete",
          label: "Wallet",
          options: options.bankList,
        },
        mobileNo: {
          type: "number",
          label: "Sender Mobile No.",
        },
        // paytmsenername: {
        //   type: "string",
        // },
        paytmotp: {
          type: "number",
          label: "OTP",
        },
        paytmtransacref: {
          type: "string",
          label: "Transaction Reference",
        },
        paytmorderid: {
          type: "string",
          label: "Order ID",
        }, ///40
      },
    };
  };

  export const upiForm = (options: any) => {
    return {
      title: "UPI Payment Details",
      type: "object",
      properties: {
          modeOfPayment: {
          type: "hidden",
          value: "UPI",
        },
        price: {
          type: "number",
          defaultValue: "0.00",
          label: "Amount",
        },
        ccNumber_UPI: {
          type: "number",
          label: "Card No.",
        },
        cardholdername_UPI:{
          type: "string",
          label: "Card Holder Name",
        },
        cCvalidity_UPI: {
          type: "date",         
          label: "Validity",
        },
        approvalno_UPI: {
          type: "string",
          label: "Transaction ID",
        },
        bankname_UPI: {
          type: "string",
          label: "Bank Name",
        },
        flagman_UPI: {
          type: "string",
          label: "Batch No.",
        },
        approvalcode_UPI: {
          type: "string",
          label: "Approval Code",
        },
        terminalID_UPI: {
          type: "string",
          label: "Terminal ID",
        },
        acquirer_UPI: {
          type: "string",
          label: "Acquiring Bank",
        },
      },
    };
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
        options: [
          {
            title: "",
          },
        ],
      },
      dateofapplication: {
        type: "date",
        maximum: new Date(),
      },
      applicationno: {
        type: "number",
      },
      agriculturalincome: {
        type: "string",
      },
      otherthanagriculturalincome: {
        type: "string",
      },
      iddocumenttype: {
        type: "dropdown",
        placeholder: "<--Select-->",
      },
      iddocidentityno: {
        type: "string",
      },
      idnameofauthority: {
        type: "string",
      },
      tickforsamedoc: {
        type: "checkbox",
        options: [
          {
            title: "",
          },
        ],
      },
      addressdocumenttype: {
        type: "dropdown",
        placeholder: "<--Select-->",
      },
      addressdocidentityno: {
        type: "string",
      },
      addressnameofauthority: {
        type: "string",
      },
      remarks: {
        type: "string",
      },
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

export namespace MaxModules {
  const modules = [
    {
      title: "Dashboard",
      id: 0,
      defaultPath: "/dashboard",
      moreOptions: false,
      globalSearchKey: "global",
      childrens: [],
      dontShow: true,
    },
    {
      title: "Out Patients",
      id: 2,
      defaultPath: "/out-patients",
      moreOptions: true,
      childrens: [
        {
          id: -1,
          title: "Registration",
          defaultPath: "registration",
          moreOptions: true,
          tenentPath: "/out-patients",
          childrens: [
            {
              id: 60,
              title: "OP Registration",
              defaultPath: "/registration/op-registration",
              globalSearchKey: "global",
            },
            {
              id: 61,
              title: "Find Patient",
              defaultPath: "/registration/find-patient",
              globalSearchKey: "global",
            },
            {
              id: 460,
              title: "Duplicate Reg Merging",
              defaultPath: "/registration/dup-reg-merging",
              globalSearchKey: "merge",
            },
            {
              id: 461,
              title: "Registration Unmerging",
              defaultPath: "/registration/registration-unmerging",
              globalSearchKey: "unmerge",
            },
            {
              id: 115,
              title: "Registration Modification",
              defaultPath: "/registration/op-registration",
              globalSearchKey: "global",
            },
            {
              id: 595,
              title: "OP Patient Reg Approval List",
              defaultPath: "/registration/op-reg-approval",
              globalSearchKey: "opapproval",
            },
            {
              id: 597,
              title: "Hot Listing Approval",
              defaultPath: "/registration/hot-listing-approval",
              globalSearchKey: "opapproval",
            },
            {
              id: 118,
              title: "Bulk Upload Registration",
              globalSearchKey: "global",
            },
            {
              id: 119,
              title: "Search Patient Admit/Discharge",
              globalSearchKey: "global",
            },
            {
              id: 120,
              title: "Report for Bulk Upload Reg",
              globalSearchKey: "global",
            },
            {
              id: 121,
              title: "For Ambulance and Reg Charges",
              globalSearchKey: "global",
            },
            {
              id: 122,
              title: "Blood Group Entry",
              globalSearchKey: "global",
            },
          ],
        },
        {
          id: -1,
          title: "Out Patient Billing",
          defaultPath: "",
          tenentPath: "/out-patients",
          childrens: [
            {
              id: 62,
              title: "Out Patient Billing",
              defaultPath: "/out-patient-billing/",
              globalSearchKey: "global",
            },
            {
              id: 64,
              title: "Deposit",
              defaultPath: "/out-patient-billing/deposit",
              globalSearchKey: "global",
            },
            {
              id: 63,
              title: "Bill Details",
              defaultPath: "/out-patient-billing/details",
              globalSearchKey: "global",
            },
            {
              id: 214,
              title: "Online Generated OP Bills",
              defaultPath: "/out-patient-billing/online-op-bill",
              globalSearchKey: "global",
            },
            {
              id: 215,
              title: "OP Order Request",
              defaultPath: "/out-patient-billing/op-order-request",
              globalSearchKey: "global",
            },
            {
              id: 216,
              title: "Miscellaneous Billing",
              defaultPath: "/out-patient-billing/miscellaneous-billing",
              globalSearchKey: "global",
            },
            {
              id: 217,
              title: "Initiate Deposit",
              defaultPath: "/out-patient-billing/initiate-deposit",
              globalSearchKey: "global",
            },
            {
              id: 218,
              title: "OP Refund Approval",
              defaultPath: "/out-patient-billing/op-refund-approval",
              globalSearchKey: "opapproval",
            },
            {
              id: 219,
              title: "DMG Mapping",
              defaultPath: "/out-patient-billing/dmg-mapping",
              globalSearchKey: "global",
            },
            {
              id: 220,
              title: "Post Discharge Follow Up Billing",
              defaultPath: "/out-patient-billing/post-discharge-follow-up-billing",
              globalSearchKey: "global",
            },
            {
              id: 67,
              title: "Dispatch Report",
              defaultPath: "/out-patient-billing/dispatch-report",
              globalSearchKey: "global",
            },
            {
              id: 222,
              title: "Expired Patient Check",
              defaultPath: "/out-patient-billing/expired-patient-check",
              globalSearchKey: "global",
            },
          ],
          moreOptions: true,
        },
        {
          id: -1,
          title: "ACD",
          tenentPath: "/out-patients",
          defaultPath: "/acd",
          childrens: [],
          moreOptions: false,
        },
        {
          id: -1,
          title: "Patient History",
          tenentPath: "/out-patients",
          defaultPath: "/patient-history",
          childrens: [],
          moreOptions: false,
        },
        {
          id: -1,
          title: "Configure",
          defaultPath: "",
          childrens: [],
          moreOptions: false,
        },
        {
          id: -1,
          title: "QMS",
          tenentPath: "/out-patients",
          defaultPath: "/qms",
          childrens: [],
          moreOptions: false,
        },
        {
          id: -1,
          title: "Staff Dependents",
          tenentPath: "/out-patients",
          defaultPath: "/staff-dept",
          childrens: [],
          moreOptions: false,
        },
        {
          id: -1,
          title: "Employee Sponsor Tagging",
          tenentPath: "/out-patients",
          defaultPath: "/employee-sponsor-tagging",
          childrens: [],
          moreOptions: false,
        },
        {
          id: -1,
          title: "Reports",
          tenentPath: "/out-patients",
          defaultPath: "",
          childrens: [
            {
              id: 911,
              title: "Doctor Schedule",
              defaultPath: "doctor-schedule",
              globalSearchKey: "global",
            },
            {
              id: 912,
              title: "Cash Scroll",
              defaultPath: "cash-scroll",
              globalSearchKey: "global",
            },
            {
              id: 913,
              title: "Happy Family Report",
              defaultPath: "happy-family-report",
              globalSearchKey: "global",
            },
            {
              id: 914,
              title: "Equipment Schedule",
              defaultPath: "equipment-schedule",
              globalSearchKey: "global",
            },
            {
              id: 915,
              title: "General OPD Scroll Report",
              defaultPath: "general-opd-scroll-report",
              globalSearchKey: "global",
            },
            {
              id: 916,
              title: "Expired Patient Check",
              defaultPath: "expired-patient-check",
              globalSearchKey: "global",
            },
            {
              id: 917,
              title: "Monthly OP Consultation Report",
              defaultPath: "Monthly-op-consultation-report",
              globalSearchKey: "global",
            },
            {
              id: 918,
              title: "Acknowledge Scroll Amount Report",
              defaultPath: "acknowledge-scroll-amount-report",
              globalSearchKey: "global",
            },
            {
              id: 919,
              title: "Expired Deposits",
              defaultPath: "expired-deposits",
              globalSearchKey: "global",
            },
            {
              id: 920,
              title: "Online Deposit Report",
              defaultPath: "online-deposit-report",
              globalSearchKey: "global",
            },
          ],
          moreOptions: true,
        },
        {
          id: -1,
          title: "MIME",
          defaultPath: "",
          childrens: [],
          moreOptions: false,
        },
      ],
    },
    {
      title: "Emergency",
      id: 32,
      defaultPath: "",
      childrens: [],
      type: "module",
    },
    {
      title: "In-Patients",
      id: 1,
      defaultPath: "",
      childrens: [],
    },
    {
      title: "MMS",
      id: 3,
      defaultPath: "",
      childrens: [],
    },
    {
      title: "Operation Theater",
      id: 5,
      defaultPath: "",
      childrens: [],
      type: "module",
    },
    {
      title: "MIS reports",
      id: 34,
      defaultPath: "",
      childrens: [],
      type: "module",
    },
    {
      title: "Physicians",
      id: 5,
      defaultPath: "",
      childrens: [],
    },
    {
      title: "Laboratory",
      id: 4,
      defaultPath: "",
      childrens: [],
    },
    {
      title: "Adverse Events",
      id: 42,
      defaultPath: "",
      childrens: [],
      type: "module",
    },
    {
      title: "Donate Blood",
      id: 11,
      defaultPath: "",
      childrens: [],
    },
    {
      title: "Administration",
      id: 6,
      defaultPath: "",
      childrens: [],
    },
  ];

  export function getModules() {
    return modules;
  }
}

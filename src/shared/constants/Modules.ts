export namespace MaxModules {
  const modules = [
    {
      title: "Out Patients",
      id: 1,
      defaultPath: "/out-patients",
      moreOptions: true,
      childrens: [
        {
          id: 11,
          title: "Registration",
          defaultPath: "registration",
          moreOptions: true,
          childrens: [
            {
              id: 111,
              title: "OP Registration",
              defaultPath: "/registration/op-registration",
              globalSearchKey: "global",
            },
            {
              id: 112,
              title: "Find Patient",
              defaultPath: "/registration/find-patient",
              globalSearchKey: "global",
            },
            {
              id: 113,
              title: "Duplicate Reg Merging",
              defaultPath: "/registration/dup-reg-merging",
              globalSearchKey: "merge",
            },
            {
              id: 114,
              title: "Registration Unmerging",
              defaultPath: "/registration/registration-unmerging",
              globalSearchKey: "unmerge",
            },
            {
              id: 115,
              title: "Registration Modification",
              defaultPath: "/registration/op-registration",
            },
            {
              id: 116,
              title: "Op Patient Reg Approval List",
              defaultPath: "/registration/op-reg-approval",
              globalSearchKey: "opapproval",
            },
            {
              id: 117,
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
          id: 12,
          title: "Out Patient Billing",
          defaultPath: "",
          childrens: [],
          moreOptions: true,
        },
        {
          id: 13,
          title: "ACD",
          defaultPath: "",
          childrens: [],
          moreOptions: true,
        },
        {
          id: 14,
          title: "Patient History",
          defaultPath: "",
          childrens: [],
          moreOptions: true,
        },
        {
          id: 15,
          title: "Configure",
          defaultPath: "",
          childrens: [],
          moreOptions: true,
        },
        {
          id: 16,
          title: "QMS",
          defaultPath: "",
          childrens: [],
          moreOptions: true,
        },
        {
          id: 17,
          title: "Staff Dependents",
          defaultPath: "",
          childrens: [],
          moreOptions: true,
        },
        {
          id: 18,
          title: "Employee Sponsor Tagging",
          defaultPath: "",
          childrens: [],
          moreOptions: true,
        },
        {
          id: 19,
          title: "Reports",
          defaultPath: "",
          childrens: [],
          moreOptions: true,
        },
        {
          id: 20,
          title: "MIME",
          defaultPath: "",
          childrens: [],
          moreOptions: true,
        },
      ],
    },
    {
      title: "Emergency",
      id: 2,
      defaultPath: "",
      childrens: [],
    },
    {
      title: "In-Patients",
      id: 3,
      defaultPath: "",
      childrens: [],
    },
    {
      title: "MMS",
      id: 4,
      defaultPath: "",
      childrens: [],
    },
    {
      title: "Operation Theater",
      id: 5,
      defaultPath: "",
      childrens: [],
    },
    {
      title: "MIS reports",
      id: 6,
      defaultPath: "",
      childrens: [],
    },
    {
      title: "Physicians",
      id: 7,
      defaultPath: "",
      childrens: [],
    },
    {
      title: "Laboratory",
      id: 8,
      defaultPath: "",
      childrens: [],
    },
    {
      title: "Adverse Events",
      id: 9,
      defaultPath: "",
      childrens: [],
    },
    {
      title: "Donate Blood",
      id: 10,
      defaultPath: "",
      childrens: [],
    },
    {
      title: "Administration",
      id: 11,
      defaultPath: "",
      childrens: [],
    },
  ];

  export function getModules() {
    return modules;
  }
}

import applicationsStorage from "../storages/applicationsStorage.js";
import { body, validationResult } from "express-validator";

const statuses = [
  "Applied",
  "Assessment / Online Test",
  "Interviewing",
  "Offer Received",
  "Rejected",
  "Ghosted / Closed"
];

const applicationFields = [
  "companyName", "jobTitle", "jobId", "jdLink", "location", "workMode",
  "dateApplied", "platform", "resumeVersion", "status", "nextSteps",
  "followUpDate", "recruiterName", "contactEmail", "contactPhone",
  "interviewDate", "interviewTime", "meetingLink", "salary", "notes"
];

const collectApplication = req => Object.fromEntries(applicationFields.map(field => [
  field,
  typeof req.body[field] === "string" ? req.body[field].trim() : ""
]));

const validateApplication = [
  body("companyName").trim().notEmpty().withMessage("Company name is required."),
  body("jobTitle").trim().notEmpty().withMessage("Job title is required."),
  body("dateApplied").trim().notEmpty().withMessage("Date applied is required."),
  body("status").isIn(statuses).withMessage("Choose a valid application status."),
  body("jdLink").optional({ values: "falsy" }).trim().isURL().withMessage("JD link must be a valid URL."),
  body("contactEmail").optional({ values: "falsy" }).trim().isEmail().withMessage("Contact email must be valid."),
  body("meetingLink").optional({ values: "falsy" }).trim().isURL().withMessage("Meeting link must be a valid URL.")
];

const renderForm = (res, title, application = {}, errors) => res.render("createUser", {
  title,
  application,
  statuses,
  errors
});

export const applicationsListGet = (req, res) => {
  const applications = applicationsStorage.getApplications();
  res.render("index", {
    title: "Application Tracker",
    applications,
    stats: {
      total: applications.length,
      active: applications.filter(application => ["Applied", "Assessment / Online Test", "Interviewing"].includes(application.status)).length,
      interviews: applications.filter(application => application.status === "Interviewing").length,
      offers: applications.filter(application => application.status === "Offer Received").length
    }
  });
};

export const applicationsCreateGet = (req, res) => renderForm(res, "Add Application", {}, undefined);

export const applicationsCreatePost = [
  validateApplication,
  (req, res) => {
    const errors = validationResult(req);
    const application = collectApplication(req);
    if (!errors.isEmpty()) return renderForm(res.status(400), "Add Application", application, errors.array());
    applicationsStorage.addApplication(application);
    res.redirect("/");
  }
];

export const applicationsUpdateGet = (req, res) => {
  const application = applicationsStorage.getApplication(req.params.id);
  if (!application) return res.status(404).render("notFound", { title: "Application not found" });
  res.render("updateUser", { title: "Edit Application", application, statuses });
};

export const applicationsUpdatePost = [
  validateApplication,
  (req, res) => {
    const current = applicationsStorage.getApplication(req.params.id);
    const errors = validationResult(req);
    const application = { ...current, ...collectApplication(req) };
    if (!errors.isEmpty()) return res.status(400).render("updateUser", { title: "Edit Application", application, statuses, errors: errors.array() });
    applicationsStorage.updateApplication(req.params.id, application);
    res.redirect("/");
  }
];

export const applicationsDeletePost = (req, res) => {
  applicationsStorage.deleteApplication(req.params.id);
  res.redirect("/");
};

export const applicationsSearchGet = (req, res) => {
  const query = req.query.query || "";
  res.render("search", {
    title: "Search Applications",
    results: applicationsStorage.searchApplications(query),
    query
  });
};

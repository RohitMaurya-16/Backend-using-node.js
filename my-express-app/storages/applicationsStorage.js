import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDirectory = path.join(__dirname, "..", "data");
const dataFile = path.join(dataDirectory, "applications.json");

const emptyApplication = {
  companyName: "",
  jobTitle: "",
  jobId: "",
  jdLink: "",
  location: "",
  workMode: "",
  dateApplied: "",
  platform: "",
  resumeVersion: "",
  status: "Applied",
  nextSteps: "",
  followUpDate: "",
  recruiterName: "",
  contactEmail: "",
  contactPhone: "",
  interviewDate: "",
  interviewTime: "",
  meetingLink: "",
  salary: "",
  notes: ""
};

class ApplicationsStorage {
  constructor() {
    this.applications = this.read();
    this.nextId = this.applications.reduce((highest, application) => Math.max(highest, application.id), -1) + 1;
  }

  read() {
    try {
      return JSON.parse(fs.readFileSync(dataFile, "utf8"));
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
      return [];
    }
  }

  persist() {
    fs.mkdirSync(dataDirectory, { recursive: true });
    fs.writeFileSync(dataFile, `${JSON.stringify(this.applications, null, 2)}\n`);
  }

  getApplications() {
    return [...this.applications].sort((first, second) => second.id - first.id);
  }

  getApplication(id) {
    return this.applications.find(application => application.id === Number(id));
  }

  addApplication(details) {
    const application = { ...emptyApplication, ...details, id: this.nextId++ };
    this.applications.push(application);
    this.persist();
    return application;
  }

  updateApplication(id, details) {
    const index = this.applications.findIndex(application => application.id === Number(id));
    if (index === -1) return;
    this.applications[index] = { ...this.applications[index], ...details, id: Number(id) };
    this.persist();
  }

  deleteApplication(id) {
    this.applications = this.applications.filter(application => application.id !== Number(id));
    this.persist();
  }

  searchApplications(query) {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return [];
    return this.getApplications().filter(application => [
      application.companyName,
      application.jobTitle,
      application.jobId,
      application.platform,
      application.status,
      application.location
    ].some(value => value.toLowerCase().includes(normalizedQuery)));
  }
}

export default new ApplicationsStorage();

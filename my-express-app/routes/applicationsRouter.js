import { Router } from "express";
import * as applicationsController from "../controllers/applicationsController.js";

const applicationsRouter = Router();

applicationsRouter.get("/", applicationsController.applicationsListGet);
applicationsRouter.get("/search", applicationsController.applicationsSearchGet);
applicationsRouter.get("/create", applicationsController.applicationsCreateGet);
applicationsRouter.post("/create", applicationsController.applicationsCreatePost);
applicationsRouter.get("/:id/update", applicationsController.applicationsUpdateGet);
applicationsRouter.post("/:id/update", applicationsController.applicationsUpdatePost);
applicationsRouter.post("/:id/delete", applicationsController.applicationsDeletePost);

export default applicationsRouter;

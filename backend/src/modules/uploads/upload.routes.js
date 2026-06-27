const { Router } = require("express");
const { authenticate, authorize } = require("../../middlewares/auth.middleware");
const { criarUploadMiddleware } = require("../../cloudflare/upload");
const uploadController = require("./upload.controller");

const router = Router();

router.use(authenticate);

router.post(
  "/candidatura",
  authorize("discente"),
  criarUploadMiddleware("documento"),
  uploadController.uploadCandidatura
);

module.exports = router;

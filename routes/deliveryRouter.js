import express from "express";
import { updateDelivery,requestDelivery,getKipDelivery,getRequestDelivery,getAllRequestDelivery } from "../controllers/deliveryController.js";

const deliveryRouter = express.Router();

deliveryRouter.post("/update/delivery", updateDelivery);
deliveryRouter.get("/get/delivery", getRequestDelivery);
deliveryRouter.get("/get/kip/deliverys", getKipDelivery);
deliveryRouter.post("/delivery/request", requestDelivery);
deliveryRouter.get("/get/all/deliverys", getAllRequestDelivery);

export default deliveryRouter;

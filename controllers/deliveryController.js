import { io as socket } from "../index.js";
import Delivery from "../models/Delivery.js";

export const updateDelivery = async (req, res) => {
  try {
    const { id, type, courier, courierId, photo, whatsapp } = req.body;
    const updateData1 = [
      {
        text: "tunggu kurir",
        available: false,
      },
      {
        text: type == "Belanja" ? "membeli" : "mengambil",
        available: true,
      },
      {
        text: "mengantar",
        available: false,
      },
      {
        text: "selesai",
        available: false,
      },
    ];
    const updateData2 = [
      {
        courierId: courierId,
        courierName: courier,
        photo: photo,
        whatsapp: whatsapp,
      },
    ];
    const updatedDelivery = await Delivery.updateOne(
      { _id: id },
      {
        $set: {
          status: updateData1,
          courier: updateData2,
        },
      }
    );
    if (updatedDelivery) {
      socket.emit("delivery-procces", { id, updateData1, updateData2 });
      res.status(200).json({
        code: 200,
        success: true,
        updatedDelivery,
        message: "Delivery updated successfully",
      });
    } else {
      res.status(404).json({
        code: 404,
        success: false,
        message: "Delivery not found",
      });
    }
  } catch (error) {
    res.status(500).json({ code: 500, success: false, error: error.message });
  }
};

export const requestDelivery = async (req, res) => {
  try {
    const {
      author,
      location1,
      location2,
      time,
      price,
      distance,
      desc,
      status,
      courier,
      type,
    } = req.body;
    const newDelivery = new Delivery({
      author,
      location1,
      location2,
      time,
      price,
      distance,
      desc,
      status,
      courier,
      type,
    });
    await newDelivery.save();
    socket.emit("new-delivery-request", newDelivery);
    res.status(200).json({
      code: 200,
      success: true,
      message: "Delivery request created successfully",
    });
  } catch (error) {
    res.status(500).json({ code: 500, success: false, error: error.message });
  }
};

export const getKipDelivery = async (req, res) => {
  try {
    const { courierName } = req.query;
    const deliverys = await Delivery.find({
      "courier.courierName": courierName,
    });
    deliverys.reverse();
    if (deliverys.length > 0) {
      res.status(200).json({
        code: 200,
        success: true,
        deliverys,
        message: "delivery requests found",
      });
    } else {
      res.status(404).json({
        code: 404,
        success: false,
        message: "No delivery requests found",
      });
    }
  } catch (error) {
    res.status(500).json({ code: 500, success: false, error: error.message });
  }
};

export const getRequestDelivery = async (req, res) => {
  try {
    const { author } = req.query;
    let finished = [];
    let unFinished = [];
    const deliverys = await Delivery.find({ author });
    if (deliverys.length > 0) {
      deliverys.forEach((elem) => {
        if (elem.status[3].available === true) {
          finished.push(elem);
        } else {
          unFinished.push(elem);
        }
      });
      finished.reverse();
      unFinished.reverse();
      res.status(200).json({
        code: 200,
        success: true,
        finished,
        unFinished,
        message: "delivery requests found",
      });
    } else {
      res.status(404).json({
        code: 404,
        success: false,
        finished,
        unFinished,
        message: "No delivery requests found",
      });
    }
  } catch (error) {
    res.status(500).json({
      code: 500,
      success: false,
      finished: [],
      unFinished: [],
      error: error.message,
    });
  }
};

export const getAllRequestDelivery = async (req, res) => {
  try {
    const { courierName } = req.query;
    const courier = { $or:[{courier: []},{"courier.courierName": courierName}] };
    let finished = [];
    let unFinished = [];
    const deliverys = await Delivery.find(courier);
    if (deliverys.length > 0) {
      deliverys.forEach((elem) => {
        if (elem.status[3].available === true) {
          finished.push(elem);
        } else {
          unFinished.push(elem);
        }
      });
      finished.reverse();
      unFinished.reverse();
      res.status(200).json({
        code: 200,
        success: true,
        finished,
        unFinished,
        message: "All delivery requests found",
      });
    } else {
      res.status(404).json({
        code: 404,
        success: false,
        finished,
        unFinished,
        message: "No delivery requests found",
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        code: 500,
        success: false,
        finished: [],
        unFinished: [],
        error: error.message,
      });
  }
};

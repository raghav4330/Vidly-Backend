const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { Customer, validate } = require("../modals/customer");

router.get("/", auth, async (req, res) => {
  const customers = await Customer.find().sort("name");
  res.send(customers);
});

router.get("/:id", auth, async (req, res) => {
  const customer = await Customer.find({ _id: req.params.id });
  if (!customer)
    res.status(404).send("The customer with the specified id not found");
  res.send(customer);
});

router.post("/", auth, async (req, res) => {
  const result = validate(req.body);
  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  let customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone,
  });
  customer = await customer.save();
  res.send(customer);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone,
      },
    },
    { new: true }
  );
  if (!customer)
    return res.status(404).send("The customer with the specified id not found");

  res.send(customer);
});

router.delete("/:id", auth, async (req, res) => {
  const customer = await Customer.findByIdAndRemove({ _id: req.params.id });
  if (!customer)
    return res.status(404).send("The customer with the specified id not found");

  res.send(customer);
});

module.exports = router;

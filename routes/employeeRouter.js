const upload = require("../services/upload");
const authGuard = require("../services/authGuard");
const employeeController = require('../controllers/employeeController')
const employeeRouter = require("express").Router();

employeeRouter.get("/addEmployee", authGuard, async (req, res) => {
    try {
        res.render("pages/employeeForm.twig", {
        })
    } catch (error) {
        console.log(error);
        res.json(error)
    }
})

employeeRouter.post("/addEmployee", authGuard, upload.single('img'), async (req, res) => {
    try {
        let error = await employeeController.validateAndCreateEmployee(req)
        if (error) {
            throw error
        }
        res.redirect("/")
    } catch (error) {
        res.render("pages/employeeForm.twig", {
            fileError: error.fileError,
            mongooseError: error.mongooseError,
            employee: req.body
        })
    }
})

employeeRouter.get("/blameEmployee/:id", authGuard, async (req, res) => {
    try {
        employeeController.blameEmployee(req)
        res.redirect('/')
    } catch (error) {
        res.json(error)
    }
})

employeeRouter.get("/deleteEmployee/:id", authGuard, async (req, res) => {
    try {
        employeeController.deleteEmployee(req)
        res.redirect('/')
    } catch (error) {
        console.log(error);
        res.json(error)
    }
})

employeeRouter.get("/updateEmployee/:id", authGuard, async (req, res) => {
    try {
        let employeeUpdate = await employeeController.getEmployee(req)
        res.render('pages/employeeForm.twig', {
            employee: employeeUpdate,
            action: "update"
        })
    } catch (error) {
        res.json(error)
    }
})

employeeRouter.post("/updateEmployee/:id", authGuard, upload.single("img"), async (req, res) => {
    try {
        employeeController.updateEmployee(req)
        res.redirect('/')
    } catch (error) {
        console.log(error);
        res.render("pages/employeeForm.twig", {
            fileError: error.fileError,
            mongooseError: error.mongooseError,
            employee: req.body
        })
    }
})

module.exports = employeeRouter;
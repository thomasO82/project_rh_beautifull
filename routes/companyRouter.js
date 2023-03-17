const authGuard = require("../services/authGuard");
const companyRouter = require("express").Router()
const companyController = require("../controllers/companyController")

companyRouter.get("/", authGuard, async (req, res)=>{
    let employees = await companyController.getEmployeeFromCompany(req)
    res.render('pages/home.twig',{
        employees: employees
    })
})

companyRouter.get('/register', async (req, res) => {
    try {
        res.render("pages/register.twig")
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})

companyRouter.post('/register', async (req, res) => {
    try {
        let errors = await companyController.validateAndCreateCompany(req)
        if (errors) {
            throw errors
        }
        res.redirect('/login')         
    } catch (errors) {
        res.render('pages/register.twig', {
            mongooseError: errors.mongooseValidate,
            preValidateError: errors.preValidateError, 
            company: req.body,
        })
    }
})

companyRouter.get("/login", (req, res) => {
    try {
        res.render('pages/login.twig')
    } catch (error) {
        res.send(error)
    }
})

companyRouter.post("/login", async(req, res) => {
    try {
       await companyController.login(req) 
       res.redirect('/')
    } catch (error) {
        res.render('pages/login.twig',{
            error: error,
            company: req.body
        })
    }
})

companyRouter.get("/logout", (req, res)=>{
    try {
        req.session.destroy()
        res.redirect('/login')
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})


module.exports = companyRouter

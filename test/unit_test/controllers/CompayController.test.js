const mongoose = require('mongoose')
const CompanyModel = require('../../../models/companyModel')
const CompanyController = require("../../../controllers/companyController")
const EmployeeModel = require('../../../models/employeeModel')
const employeeModel = require('../../../models/employeeModel')
const companyModel = require('../../../models/companyModel')

require('dotenv').config()
const db = process.env.BDD_UNIT_URL

beforeEach(async () => {
    await CompanyModel.deleteMany()
    await EmployeeModel.deleteMany()
})

beforeAll(async () => {
    await mongoose.connect(db)
})

afterAll(async () => {
    setTimeout(async () => {
        await mongoose.connection.close()
    }, 1500)
})

/**
 * @function CompanyController.getEmployeeFromCompany
 */

describe("tester la recuperation des employees d'une entreprise donné", () => {
    it("devrait retourner une compagnie avec un employe", async () => {
        const employeeData = {
            img: "monimage",
            name: "Norris",
            firstname: "Chuck",
            role: "TOUS",
            blame: -4000
        }
        const employee = new employeeModel(employeeData)
        await employee.save()
        const companyData = {
            name: "Ma société",
            siret: 12345678912345,
            mail: "masociete@live.fr",
            name_director: "john doe",
            employees: [employee._id],
            password: "azerty"
        }
        const company = new companyModel(companyData)
        await company.save()

        req = {
            session: {
                companyId: company._id
            }
        }
        const res = await CompanyController.getEmployeeFromCompany(req)
        expect(res[0].name).toEqual(employeeData.name)
        expect(res[0]._id).toEqual(employee._id)

    })
    it("devrait retourner une erreur de typage", async () => {

        const res = await CompanyController.getEmployeeFromCompany()
        const err = new TypeError("Cannot read properties of undefined (reading 'session')")
        expect(res).toEqual(err)

    })
    it("devrait retourner une erreur 'non connecte'", async () => {
        const req = {
            session: {

            }
        }
        const res = await CompanyController.getEmployeeFromCompany(req)
        expect(res).toEqual("non connecté")

    })
})

describe("on va tester la fonction zob",()=>{
    it("devrait retourner la valeur Vous etes admin",async()=>{
        const obj = {
            status: 4
        }
        const res = await CompanyController.zob(obj)
        expect(res).toEqual("Vous etes admin")
    })
    it("devrait retourner la valeur Vous etes rien",async()=>{
        const obj = {
            status: 1
        }
        const res = await CompanyController.zob(obj)
        expect(res).toEqual("vous n'etes rien")
    })
    it("devrait retourner la valeur Vous etes rien",async()=>{
    
        const res = await CompanyController.zob()
        const err = new TypeError("Cannot read properties of undefined (reading 'statu')")       
         expect(res).not.toEqual(err)
    })
})

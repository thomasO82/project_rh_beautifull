const mongoose = require('mongoose');
const CompanyController = require('../../../controllers/companyController')
const CompanyModel = require('../../../models/companyModel')
const employeeModel = require('../../../models/employeeModel')

require('dotenv').config()
const db = process.env.BDD_UNIT_URL;

//la methode beforeEach() de jest permet d'executer le code situé a l'interieur avant chaques tests

beforeEach(async () => {
    await CompanyModel.deleteMany()
    await employeeModel.deleteMany()
})

beforeAll(async ()=>{
    mongoose.connect(db)

})

// la methode afterAll() de jest permet d'executer le bloc de code a l'interieur apres les tests
afterAll(async()=>{
    setTimeout(async() => {await mongoose.connection.close()}, 1500)
})

/**
* @function CompanyController.getEmployeeFromCompany
*/

//la methode describe donne un nom a notre groupe de test relatif a la fonction testé
describe("tester la recuperation des employee d'une entrprise donnée", () => {
    //la methode it de jest permet de donner un nom a notre test et defini notre test
    it("devrait retourner un tableau d'employes", async () => {
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
        const company = new CompanyModel(companyData)
        await company.save()
        const req = {
            session: {
                companyId: company._id
            },

        }
        const res = await CompanyController.getEmployeeFromCompany(req)
        expect(res[0]._id).toEqual(employee._id)
        expect(res[0].name).toEqual(employee.name)
        expect(res[0].firstname).toEqual(employee.firstname)
        expect(res[0].role).toEqual(employee.role)
        expect(res[0].blame).toEqual(employee.blame)
    })
    it("devrait retourner une erreur", async () => {
        const error = new TypeError("Cannot read properties of undefined (reading 'session')")

        const res = await CompanyController.getEmployeeFromCompany()
        expect(res).toEqual(error)
    })
})

/**
* @function CompanyController.validateAndCreateCompany
*/
describe("tester la validation d'une company", () => {
    it("devrait retourner la compagnie valider", async () => {
       
        const body = {
            name: "Ma société",
            siret: 12345678912345,
            mail: "masociete@live.fr",
            name_director: "john doe",
            password: "Azertyui78",
            confirmPassword: "Azertyui78"
        }

        const req = {
            body: body
        }

        const res = await CompanyController.validateAndCreateCompany(req)
        await expect(res.mail).toEqual("masociete@live.fr")
        console.log(body.password);
       await expect(res.password).not.toBe(body.confirmPassword)
    })
    it("devrait retourner use erreur", async () => {
        const body = {
            name: "Ma société",
            siret: 12345678912345,
            mail: "masociete2@live.fr",
            name_director: "john doe",
            password: "a",
            confirmPassword: "a"
        }

        const req = {
            body: body
        }
        const res = await CompanyController.validateAndCreateCompany(req)
        expect(res).toEqual({"preValidateError": {"passwordError": "le mot de passe est invalide"}})
    })
})


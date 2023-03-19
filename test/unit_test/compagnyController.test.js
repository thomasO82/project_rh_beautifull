const mongoose = require('mongoose');
const CompanyController = require('../../controllers/companyController')
const Company = require('../../models/companyModel')
require('dotenv').config()
const db = process.env.BDD_UNIT_URL;

//la methode beforeAll() de jest permet d'executer le code situé a l'interieur avant tout les tests
beforeEach(async () => {
    mongoose.connect(db)
   await Company.deleteMany()
})

// la methode afterAll() de jest permet d'executer le bloc de code a l'interieur apres tout les tests
afterEach(async () => {
   await mongoose.connection.close(/*force:*/ true); // <-- important
});

/**
* @function CompanyController.validateAndCreateEmployee

*/

//la methode describe donne un nom a notre groupe de test relatif a la fonction testé
describe('tester la methode de test', ()=>{
    //la methode it de jest permet de donner un nom a notre test et defini notre test
    it('devrait afficher un truc', () => {
        
        const res = CompanyController.validateAndCreateEmployee()
        expect(res).toEqual('yahou')
    });
    

})

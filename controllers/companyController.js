const companyModel = require('../models/companyModel')
const bcrypt = require('bcrypt')
exports.getEmployeeFromCompany = async(req)=>{
    try {
        let company = await companyModel.findOne({_id: req.session.companyId}).populate({path: "employees"})
        if (!company) {
            throw "non connecté"
        }
        let employees = company.employees
        return employees
    } catch (error) {
       return error
    }
}

exports.preValidateCompany = async(req)=>{
    let errors = {}
    const findedCompany = await companyModel.findOne({ mail: req.body.mail })
    if (req.body.password !== req.body.confirmPassword) {
        errors.confirmPassword = "les mots de passe doivent etre identique";
    }
    if (findedCompany) {
        errors.mailSign = "Cette adresse mail est deja utilisé" 
    }
    if (!/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/g.test(req.body.password)) {
        errors.passwordError = "le mot de passe est invalide";
    }
    let result = (Object.keys(errors).length == 0) ? null : errors
    return result
}

exports.validateAndCreateCompany = async(req)=>{
    let errors = {} 
    let prevalidateError = await this.preValidateCompany(req);
    if (prevalidateError) {
        errors.preValidateError = prevalidateError
    }
    req.body.password = bcrypt.hashSync(req.body.password, parseInt(process.env.SALT))
    const newCompany = new companyModel(req.body)
    let mongooseErr = newCompany.validateSync()
    if (mongooseErr) {
        errors.mongooseValidate = mongooseErr
    }
    if (Object.keys(errors).length == 0) {
        newCompany.save()
        return newCompany
    }else{
        return errors
    }
}

exports.login = async(req)=>{
    let company = await companyModel.findOne({mail: req.body.mail})
    if (company) {
     if (bcrypt.compareSync(req.body.password, company.password)) {
         req.session.companyId = company._id
     }else{
         throw {password: "mot de passe incorrect"}
     }
    }else{
     throw {mail: "La compagnie n'existe pas"}
    } 
}

exports.zob = async (obj)=>{
    try {
        if (obj.status == 4) {
            return "Vous etes admin"
        }else{
            return "vous n'etes rien"
        }
    } catch (error) {
        return error
    }
}





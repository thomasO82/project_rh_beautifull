const employeeModel = require("../models/employeeModel");
const companyModel = require("../models/companyModel")


exports.validateAndCreateEmployee = async (req) => {
    let errors = {}
    if (req.multerError || !req.file) {
        errors.fileError = "Veuillez entrer un fichier valide"
    } else {
        req.body.img = req.file.filename
    }
    let newEmployee = new employeeModel(req.body)
    let error = newEmployee.validateSync()
    if (error) {
        errors.mongooseError = error
    }
    if (Object.keys(errors).length == 0) {
        await companyModel.updateOne({ _id: req.session.companyId }, { $push: { employees: newEmployee._id } })
        await newEmployee.save()
        return
    } else {
        return errors
    }
}

//increment blame for employee or delete it
exports.blameEmployee = async(req)=>{
    let employee = await employeeModel.findOne({ _id: req.params.id })
    let nmbBlame = employee.blame
    nmbBlame = nmbBlame + 1
    if (nmbBlame >= 3) {
        this.deleteEmployee(req)
    } else {
        await employeeModel.updateOne({ _id: req.params.id }, { blame: nmbBlame })
    }
}

//delete a single employee
exports.deleteEmployee = async(req)=>{
    await employeeModel.deleteOne({ _id: req.params.id })
    await companyModel.updateOne({ _id: req.session.companyId }, { $pull: { employees: req.params.id } })
}

//update a single employee
exports.updateEmployee = async(req)=>{
    if (req.file) {
        if (req.multerError) {
            errors.fileError = "Veuillez entrer un fichier valide"
        }
        req.body.img = req.file.filename
    }
    try {
        await employeeModel.updateOne({ _id: req.params.id }, req.body, { runValidators: true })
    } catch (error) {
        return error
    }
}

//return a single employee
exports.getEmployee = async(req)=>{
    return await employeeModel.findById(req.params.id)
}
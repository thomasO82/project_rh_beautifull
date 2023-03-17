const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    img: {
        type: String,
        required: [true, "image requise"],
    },
    name: {
        type: String,
        required: [true, "nom requis"],
        validate: {
            validator: function(v) {
                return /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u.test(v);
            },
            message: "Entrez un nom valide"
        },
    },
    firstname: {
        type: String,
        required: [true, "prenom requis"],
        validate: {
            validator: function(v) {
                return /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u.test(v);
            },
            message: "Entrez un prenom valide"
        },
    },
    role: {
        type: String,
        required: [true, "role requis"],
        validate: {
            validator: function(v) {
                return /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u.test(v);
            },
            message: "Please enter a valid name"
        },
    },
    blame: {
        type: Number,
        default: 0
    }
})

const employeeModel = mongoose.model("employees", employeeSchema)
module.exports = employeeModel
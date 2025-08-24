const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    title: {
        type: String
    },
    companyDetails: {
        name: {
            type: String
        },
        location: {
            type: String
        },
        salary: {
            type: Number
        },
        jobType: {
            type: String
        }
    },
    description: {
        type: String
    },
    Qualifications: {
        type: [String]
    }
});

const job = mongoose.model("job", jobSchema);

module.exports = { job };
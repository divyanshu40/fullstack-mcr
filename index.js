const express = require("express");
const cors = require("cors");
const { job } = require("./models/jobs.model");
const { initializeDatabase } = require("./db/db.connect");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

initializeDatabase().then(() => {
    console.log("Connected to mongoDB database");
    app.listen(PORT, () => {
        console.log(`Server is running on PORT ${PORT}`);
    });
});

// function to add jobs/job to the database
async function addJobs(jobsData) {
    if (typeof jobsData === "object" && Array.isArray(jobsData)) {
        let addedJobs = await job.insertMany(jobsData);
        return addedJobs;
    } else if (typeof jobsData === "object" && !Array.isArray(jobsData)) {
        let addedJob = await new job(jobsData).save();
        return addedJob
    }
}

// POST route to add jobs data
app.post("/jobs/new", async (req, res) => {
    let jobsData = req.body;
    try {
        let response = await addJobs(jobsData);
        return res.status(201).json(response);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});
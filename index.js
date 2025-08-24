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

// function to get all jobs
async function getAllJobs() {
    let jobs = await job.find();
    return jobs;
}

// function to get job details by id
async function getJobDetailsById(jobId) {
    let jobDetails = await job.findById(jobId);
    if (!jobDetails) {
        return null
    }
    return jobDetails;
}

// function to delete all documents
async function deleteAllJobs() {
    let deletedJobs = await job.deleteMany({});
    return deletedJobs
}

// function to delete job by id
async function deleteJobById(jobId) {
    let deletedJob = await job.findByIdAndDelete(jobId);
    if (!deletedJob) {
        return null
    } 
    return deletedJob;
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

// GET route to fetch all jobs
app.get("/jobs", async (req, res) => {
    try {
        let response = await getAllJobs();
        if (response.length === 0) {
            return res.status(404).json({ message: "No jobs found" });
        }
        return res.status(200).json(response);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});

// GET Route to get job details by id
app.get("/job/details/:id", async (req, res) => {
    let jobId = req.params.id;
    try {
        let response = await getJobDetailsById(jobId);
        if (response === null) {
            return res.status(404).json({ message: "Job not found"});
        }
        return res.status(200).json(response);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE route to delete all jobs
app.delete("/jobs/delete", async (req, res) => {
    try {
        let response = await deleteAllJobs();
        return res.status(200).json(response);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete("/job/delete/:id", async (req, res) => {
    let jobId = req.params.id;
    try {
        let response = await deleteJobById(jobId);
        if (response === null) {
            return res.status(404).json({ message: "Job to be deleted not found"});
        }
        return res.status(200).json(response);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});
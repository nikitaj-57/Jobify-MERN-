import Job from '../models/jobs.js'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, NotFoundError } from '../errors/index.js'

const getAllJobs = async(req, res) => {
    const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt');
    res.status(StatusCodes.OK).json({ jobs, count: jobs.length })
}

const getJob = async(req, res) => {
    const {user:{userId}, params:{id: jobId}} = req;
    const job = await Job.findOne({ _id: jobId, createdBy: userId })

    if(!job) {
        throw new NotFoundError('No job with the following ID')
    }
    res.status(StatusCodes.OK).json({ job })
}

const createJob = async(req, res) => {
    req.body.createdBy = req.user.userId;
    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({ job });
}

const updateJob = async(req, res) => {
    // Destructuring req to get userId, jobId and body is set to company and position
    const {
        body: { company, position },
        user: { userId },
        params: { id: jobId }
    } = req

    // Checking if both are not empty values
    if(company === '' || position === '') {
        throw new BadRequestError('Company and position fields cannot be empty');
    }
    // job
    const job = await Job.findOneAndUpdate(
        {_id: jobId, createdBy: userId }, 
        req.body, 
        { new: true, runValidators: true})

    // if job doesn't exist throw not-found error
    if(!job) {
        throw new NotFoundError(`No job with ID ${jobId}`)
    }
    res.status(StatusCodes.OK).json({ job })
}

const deleteJob = async(req, res) => {
    const {
        user: { userId },
        params: { id: jobId }
    } = req

    const job = await Job.findOneAndDelete({ _id: jobId, createdBy: userId })

    if(!job) {
        throw new NotFoundError(`No job with ID ${jobId}`)
    }
    res.status(StatusCodes.OK).send();
}

export { getAllJobs, getJob, createJob, updateJob, deleteJob };
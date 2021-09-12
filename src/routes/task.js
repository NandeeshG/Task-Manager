const express = require('express')
const { Task, allowedFieldsTask } = require('../models/task').module
const { auth } = require('../middleware/auth').module
const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {
    try {
        const task = new Task({
            ...req.body,
            owner: req.user._id,
        })

        await task.save()
        res.status(201).send(task)
    } catch (e) {
        console.log(e)
        return res.status(500).send({ error: e.message })
    }
})

router.get('/tasks', auth, async (req, res) => {
    try {
        const task = await Task.find({ owner: req.user._id })
        return res.send(task)
    } catch (e) {
        console.log(e)
        return res.status(500).send({ error: e.message })
    }
})

router.get('/tasks/:id', (req, res) => {
    const _id = req.params.id
    Task.findById(_id)
        .then((r) => {
            if (!r) return res.status(404).send()
            res.send(r)
        })
        .catch((e) => res.status(500).send(e))
})

router.patch('/tasks/:id', async (req, res) => {
    try {
        const isV = Object.keys(req.body).every((u) =>
            allowedFieldsTask.includes(u)
        )
        if (!isV)
            return res.status(400).send({ error: 'Invalid Update Request!' })
    } catch (e) {
        return res.status(500).send(e)
    }

    try {
        const t = await Task.findById(req.params.id)
        if (!t) return res.status(404).send()
        Object.keys(req.body).forEach((upd) => (t[upd] = req.body[upd]))
        const u = await t.save()
        if (!u) return res.status(404).send()
        return res.send(task)
    } catch (e) {
        return res.status(400).send(e)
    }
})

router.delete('/tasks/:id', async (req, res) => {
    try {
        const deleted = await Task.findByIdAndDelete(req.params.id)
        if (!deleted) return res.status(404).send()
        else return res.send(deleted)
    } catch (e) {
        return res.status(500).send(e)
    }
})

exports.module = router

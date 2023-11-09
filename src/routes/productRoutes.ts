import express from 'express'

const router = express.Router()

router.route('/').get().post
router.route('/search').get()
router.route('/:id').get().patch().delete

export default router

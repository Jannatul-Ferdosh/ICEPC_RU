const _ = require('lodash');

const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const superadmin = require('../middleware/superadmin');

const {About, validateAbout} = require('../models/about');
const express = require('express');
const router = express.Router();


/**
 * @swagger
 * /about:
 *   get:
 *     summary: Get all committee list
 *     tags:
 *       - About
 *     responses:
 *       200:
 *         description: List of all committees
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/About'
 */
router.get('/', async (req, res) => {
    const about = await About.find();
    res.send(about);
});



/**
 * @swagger
 * /about:
 *   post:
 *     summary: Create a new committee
 *     tags:
 *       - About
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/About'
 *     responses:
 *       200:
 *         description: Committee created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/About'
 *       404:
 *         description: Validation error
 */
router.post('/', [auth,admin,superadmin], async(req, res) =>{
    // Validating received data
    const {error} = validateAbout(req.body);
    if(error) return res.status(404).send(error.details[0].message);

    // Creating a new committee
    let about = new About(_.pick(req.body, ['committee', 'studentCommittee']));
    await about.save();

    return res.send(about);
});


/**
 * @swagger
 * /about/{id}:
 *   put:
 *     summary: Update an existing committee by ID
 *     tags:
 *       - About
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Committee ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/About'
 *     responses:
 *       200:
 *         description: Committee updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/About'
 *       404:
 *         description: Validation error
 */
router.put('/:id', [auth,admin,superadmin], async(req, res) =>{
    // Validating received Data 
    const {error} = validateAbout(req.body);
    if(error) return res.status(404).send(error.details[0].message);

    // Updating the committee
    let about = await About.findByIdAndUpdate(req.params.id, _.pick(req.body, ['committee', 'studentCommittee']));

    return res.send(about);
});



/**
 * @swagger
 * components:
 *   schemas:
 *     About:
 *       type: object
 *       properties:
 *         committee:
 *           type: object
 *           properties:
 *             president:
 *               $ref: '#/components/schemas/CommitteeMember'
 *             vicePresident1:
 *               $ref: '#/components/schemas/CommitteeMember'
 *             vicePresident2:
 *               $ref: '#/components/schemas/CommitteeMember'
 *             treasurer:
 *               $ref: '#/components/schemas/CommitteeMember'
 *           required:
 *             - president
 *             - vicePresident1
 *             - vicePresident2
 *             - treasurer
 *         studentCommittee:
 *           type: object
 *           properties:
 *             generalSecretary:
 *               $ref: '#/components/schemas/StudentCommitteeMember'
 *             assistantGeneralSecretary:
 *               $ref: '#/components/schemas/StudentCommitteeMember'
 *             officeSecretary:
 *               $ref: '#/components/schemas/StudentCommitteeMember'
 *             assistantOfficeSecretary:
 *               $ref: '#/components/schemas/StudentCommitteeMember'
 *             financeSecretary:
 *               $ref: '#/components/schemas/StudentCommitteeMember'
 *             assistantFinanceSecretary:
 *               $ref: '#/components/schemas/StudentCommitteeMember'
 *             publicationSecretary:
 *               $ref: '#/components/schemas/StudentCommitteeMember'
 *             assistantPublicationSecretary:
 *               $ref: '#/components/schemas/StudentCommitteeMember'
 *             socialWelfareSecretary:
 *               $ref: '#/components/schemas/StudentCommitteeMember'
 *             assistantSocialWelfareSecretary:
 *               $ref: '#/components/schemas/StudentCommitteeMember'
 *           required:
 *             - generalSecretary
 *             - assistantGeneralSecretary
 *             - officeSecretary
 *             - assistantOfficeSecretary
 *             - financeSecretary
 *             - assistantFinanceSecretary
 *             - publicationSecretary
 *             - assistantPublicationSecretary
 *             - socialWelfareSecretary
 *             - assistantSocialWelfareSecretary
 *       required:
 *         - committee
 *         - studentCommittee
 *
 *     CommitteeMember:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the committee member
 *         designation:
 *           type: string
 *           description: Designation of the committee member
 *       required:
 *         - name
 *         - designation
 *
 *     StudentCommitteeMember:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the student committee member
 *         profileId:
 *           type: string
 *           description: MongoDB ObjectId referencing Profile
 *       required:
 *         - name
 *         - profileId
 */

module.exports = router;
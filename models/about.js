const Joi = require('joi');
const mongoose = require('mongoose');


const aboutSchema = new mongoose.Schema({
    committee : new mongoose.Schema({
        president: new mongoose.Schema({
            name: {
                type: String,
                required: true
            },
            designation: {
                type: String,
                required: true
            }
        }),
        vicePresident1: new mongoose.Schema({
            name: {
                type: String,
                required: true
            },
            designation: {
                type: String,
                required: true
            }
        }),
        vicePresident2:new mongoose.Schema({
            name: {
                type: String,
                required: true
            },
            designation: {
                type: String,
                required: true
            }
        }),
        treasurer: new mongoose.Schema({
            name: {
                type: String,
                required: true
            },
            designation: {
                type: String,
                required: true
            }
        })
    }),
    studentCommittee: new mongoose.Schema({
        generalSecretary: new mongoose.Schema({
            name: {
                type: String,
                required: true
            },
            profileId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Profile',
                required: true
            }
        }),
        assistantGeneralSecretary: new mongoose.Schema({
            name: {
                type: String,
                required: true
            },
            profileId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Profile',
                required: true
            }
        }),
        officeSecretary: new mongoose.Schema({
            name: {
                type: String,
                required: true
            },
            profileId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Profile',
                required: true
            }
        }),
        assistantOfficeSecretary: new mongoose.Schema({
            name: {
                type: String,
                required: true
            },
            profileId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Profile',
                required: true
            }
        }),
        financeSecretary: new mongoose.Schema({
            name: {
                type: String,
                required: true
            },
            profileId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Profile',
                required: true
            }
        }),
        assistantFinanceSecretary: new mongoose.Schema({
            name: {
                type: String,
                required: true
            },
            profileId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Profile',
                required: true
            }
        }),
        publicationSecretary: new mongoose.Schema({
            name: {
                type: String,
                required: true
            },
            profileId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Profile',
                required: true
            }
        }),
        assistantPublicationSecretary: new mongoose.Schema({
            name: {
                type: String,
                required: true
            },
            profileId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Profile',
                required: true
            }
        }),
        socialWelfareSecretary: new mongoose.Schema({
            name: {
                type: String,
                required: true
            },
            profileId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Profile',
                required: true
            }
        }),
        assistantSocialWelfareSecretary: new mongoose.Schema({
            name: {
                type: String,
                required: true
            },
            profileId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Profile',
                required: true
            }
        }) 
    })
});


const About = mongoose.model('About', aboutSchema);

function validateAbout(about)
{
    const schema = Joi.object({
        committee: Joi.object({
            president: Joi.object({
                name: Joi.string().required(),
                designation: Joi.string().required(),
            }),
            vicePresident1: Joi.object({
                name: Joi.string().required(),
                designation: Joi.string().required(),
            }),
            vicePresident2: Joi.object({
                name: Joi.string().required(),
                designation: Joi.string().required(),
            }),
            treasurer: Joi.object({
                name: Joi.string().required(),
                designation: Joi.string().required(),
            })
        }),
        studentCommittee: Joi.object({
            generalSecretary: Joi.object({
                name: Joi.string().required(),
                profileId: Joi.objectId().required()
            }),
            assistantGeneralSecretary:Joi.object({
                name: Joi.string().required(),
                profileId: Joi.objectId().required()
            }),
            officeSecretary: Joi.object({
                name: Joi.string().required(),
                profileId: Joi.objectId().required()
            }),
            assistantOfficeSecretary: Joi.object({
                name: Joi.string().required(),
                profileId: Joi.objectId().required()
            }),
            financeSecretary: Joi.object({
                name: Joi.string().required(),
                profileId: Joi.objectId().required()
            }),
            assistantFinanceSecretary: Joi.object({
                name: Joi.string().required(),
                profileId: Joi.objectId().required()
            }),
            publicationSecretary: Joi.object({
                name: Joi.string().required(),
                profileId: Joi.objectId().required()
            }),
            assistantPublicationSecretary: Joi.object({
                name: Joi.string().required(),
                profileId: Joi.objectId().required()
            }),
            socialWelfareSecretary: Joi.object({
                name: Joi.string().required(),
                profileId: Joi.objectId().required()
            }),
            assistantSocialWelfareSecretary: Joi.object({
                name: Joi.string().required(),
                profileId: Joi.objectId().required()
            }),
        })
        
    });

    return schema.validate(about);
}

exports.About = About;
exports.validateAbout = validateAbout;
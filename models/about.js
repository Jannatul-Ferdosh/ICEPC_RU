const Joi = require('joi');
const mongoose = require('mongoose');


// Database Schema
const aboutSchema = new mongoose.Schema({
    committee : {
        type: new mongoose.Schema({
            president: {
                type: new mongoose.Schema({
                    name: {
                        type: String,
                        required: true
                    },
                    designation: {
                        type: String,
                        required: true
                    }
                }),
                required: true,
            },
            vicePresident1: {
                type: new mongoose.Schema({
                    name: {
                        type: String,
                        required: true
                    },
                    designation: {
                        type: String,
                        required: true
                    }
                }),
                required: true,
            },
            vicePresident2: {
                type: new mongoose.Schema({
                    name: {
                        type: String,
                        required: true
                    },
                    designation: {
                        type: String,
                        required: true
                    }
                }),
                required: true,
            },
            treasurer: {
                type: new mongoose.Schema({
                    name: {
                        type: String,
                        required: true
                    },
                    designation: {
                        type: String,
                        required: true
                    }
                }),
                required: true,
            }
        }),
        required: true
    },
    studentCommittee: {
        type: new mongoose.Schema({
            generalSecretary: {
                type: new mongoose.Schema({
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
                required: true,
            },
            assistantGeneralSecretary: {
                type: new mongoose.Schema({
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
                required: true,
            },
            officeSecretary: {
                type: new mongoose.Schema({
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
                required: true,
            },
            assistantOfficeSecretary: {
                type: new mongoose.Schema({
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
                required: true,
            },
            financeSecretary: {
                type: new mongoose.Schema({
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
                required: true,
            },
            assistantFinanceSecretary: {
                type: new mongoose.Schema({
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
                required: true,
            },
            publicationSecretary: {
                type: new mongoose.Schema({
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
                required: true,
            },
            assistantPublicationSecretary: {
                type: new mongoose.Schema({
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
                required: true,
            },
            socialWelfareSecretary: {
                type: new mongoose.Schema({
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
                required: true,
            },
            assistantSocialWelfareSecretary: {
                type: new mongoose.Schema({
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
                required: true,
            },
        }),
        required: true
    }
});


const About = mongoose.model('About', aboutSchema);

// Validation with joi module
function validateAbout(about)
{
    const schema = Joi.object({
        committee: Joi.object({
            president: Joi.object({
                name: Joi.string().required(),
                designation: Joi.string().required(),
            }).required(),
            vicePresident1: Joi.object({
                name: Joi.string().required(),
                designation: Joi.string().required(),
            }).required(),
            vicePresident2: Joi.object({
                name: Joi.string().required(),
                designation: Joi.string().required(),
            }).required(),
            treasurer: Joi.object({
                name: Joi.string().required(),
                designation: Joi.string().required(),
            }).required()
        }).required(),
        studentCommittee: Joi.object({
            generalSecretary: Joi.object({
                name: Joi.string().required(),
                profileId: Joi.objectId().required()
            }).required(),
            assistantGeneralSecretary:Joi.object({
                name: Joi.string().required(),
                profileId: Joi.objectId().required()
            }).required(),
            officeSecretary: Joi.object({
                name: Joi.string().required(),
                profileId: Joi.objectId().required()
            }).required(),
            assistantOfficeSecretary: Joi.object({
                name: Joi.string().required(),
                profileId: Joi.objectId().required()
            }).required(),
            financeSecretary: Joi.object({
                name: Joi.string().required(),
                profileId: Joi.objectId().required()
            }).required(),
            assistantFinanceSecretary: Joi.object({
                name: Joi.string().required(),
                profileId: Joi.objectId().required()
            }).required(),
            publicationSecretary: Joi.object({
                name: Joi.string().required(),
                profileId: Joi.objectId().required()
            }).required(),
            assistantPublicationSecretary: Joi.object({
                name: Joi.string().required(),
                profileId: Joi.objectId().required()
            }).required(),
            socialWelfareSecretary: Joi.object({
                name: Joi.string().required(),
                profileId: Joi.objectId().required()
            }).required(),
            assistantSocialWelfareSecretary: Joi.object({
                name: Joi.string().required(),
                profileId: Joi.objectId().required()
            }).required(),
        })
        
    });

    return schema.validate(about);
}

exports.About = About;
exports.validateAbout = validateAbout;
const Tool = require('../models/tool');
const Disaster = require("../models/disaster");
const APIFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");


exports.newTool = async (req, res, next) => {
    const { tname, tdescription, disasterNames } = req.body;
    console.log(req.files)
    console.log(req.body)
    console.log(disasterNames)
    try {
        // Fetch disasters based on the provided disasterNames
        let disasters;

        // Check if disasterNames is an array
        if (Array.isArray(disasterNames)) {
            console.log('Disaster Names Array:', disasterNames);

            // Fetch disasters based on the provided disasterNames
            disasters = await Disaster.find({ name: { $in: disasterNames } });

            console.log('Disasters Found:', disasters);

            // Check if all provided disasterNames correspond to valid disasters
            if (disasters.length !== disasterNames.length) {
                console.log('Invalid disasterNames:', disasterNames.filter(name => !disasters.some(disaster => disaster.name === name)));
                return res.status(400).json({ error: 'Invalid disasterName provided' });
            }
        } else {
            // If disasterNames is not an array, handle it as a single disaster name
            console.log('Single Disaster Name:', disasterNames);

            const singleDisaster = await Disaster.findOne({ name: disasterNames });

            // Check if the single disaster name is valid
            if (!singleDisaster) {
                console.log('Invalid disasterName:', disasterNames);
                return res.status(400).json({ error: 'Invalid disasterName provided' });
            }

            disasters = [singleDisaster];
        }
        // Image upload logic
        let timages = [];

        if (!req.files) {
            timages.push(req.file);
        } else {
            timages = req.files;
        }

        let timagesLinks = [];

        for (let i = 0; i < timages.length; i++) {
            let timageDataUri = timages[i].path;

            try {
                const result = await cloudinary.v2.uploader.upload(timageDataUri, {
                    folder: 'area',
                    width: 150,
                    crop: 'scale',
                });

                timagesLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                });
            } catch (error) {
                console.log('Error uploading image:', error);
                // Handle the error as needed (return an error response or use default image)
            }
        }

        // Create the Tool with the associated disasters and uploaded images
        const toolData = {
            tname,
            tdescription,
            disasterTool: disasters.map((disaster) => ({
                name: disaster.name,
            })),
            timages: timagesLinks,
        };

        const createdTool = await Tool.create(toolData);
        return res.json(createdTool);
    } catch (error) {
        console.error('Error creating tool:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.getTool = async (req, res, next) => {
    const resPerPage = 4;
    const toolCount = await Tool.countDocuments();
    const apiFeatures = new APIFeatures(Tool.find(), req.query)
        .search()
        .filter();

    apiFeatures.pagination(resPerPage);
    const tool = await apiFeatures.query;
    let filteredToolCount = tool.length;
    res.status(200).json({
        success: true,
        filteredToolCount,
        toolCount,
        tool,
        resPerPage,
    });
};
exports.updateTool = async (req, res, next) => {
    const { toolId } = req.params;
    const { tname, tdescription, disasterNames, timages } = req.body;
    console.log(req.files)
    console.log(toolId)

    try {
        // Check if disasterNames is an array
        let disasters;
        if (Array.isArray(disasterNames)) {
            // Fetch disasters based on the provided disasterNames
            disasters = await Disaster.find({ name: { $in: disasterNames } });

            // Check if all provided disasterNames correspond to valid disasters
            if (disasters.length !== disasterNames.length) {
                return res.status(400).json({ error: 'Invalid disasterName provided' });
            }
        } else {
            // If disasterNames is not an array, handle it as a single disaster name
            const singleDisaster = await Disaster.findOne({ name: disasterNames });

            // Check if the single disaster name is valid
            if (!singleDisaster) {
                return res.status(400).json({ error: 'Invalid disasterName provided' });
            }

            disasters = [singleDisaster];
        }

        // Image upload logic (similar to createArea)
        let timages = [];
        if (!req.files) {
            timages.push(req.file);
        } else {
            timages = req.files;
        }

        let timagesLinks = [];

        for (let i = 0; i < timages.length; i++) {
            let timageDataUri = timages[i].path;

            try {
                const result = await cloudinary.v2.uploader.upload(timageDataUri, {
                    folder: 'tool',
                    width: 150,
                    crop: 'scale',
                });

                timagesLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                });
            } catch (error) {
                console.log('Error uploading image:', error);
                return res.status(500).json({ error: 'Error uploading image' });
            }
        }

        // Update the Area with the associated disasters and uploaded images
        const updatedTool = await Tool.findByIdAndUpdate(
            toolId,
            {
                $set: {
                    tname,
                    tdescription,
                    disasterTool: disasters.map((disaster) => ({
                        name: disaster.name,
                    })),
                    timages: timagesLinks,
                },
            },
            { new: true } // Return the updated document
        );

        if (!updatedTool) {
            return res.status(404).json({ error: 'Tool not found' });
        }

        return res.json(updatedTool);s
    } catch (error) {
        console.error('Error updating tool:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.deleteTool = async (req, res, next) => {
    const tool = await Tool.findByIdAndDelete(req.params.toolId);
    if (!tool) {
        return res.status(404).json({
            success: false,
            message: "Tool not found",
        });
    }
    res.status(200).json({
        success: true,
        message: "Tool deleted",
    });
};
const Unit = require('../model/unitsModel');




const createUnit = async (req, res) => {
    try {

        const { unitName, description } = req.body;

        if (!unitName) {
            return res.status(400).json({
                success: false,
                message: "Please fill all madatory fields"
            })
        }

        const unitExist = await Unit.findOne({ unitName: unitName })

        if (unitExist) {
            return res.status(400).json({
                success: false,
                message: "This category is already registered"
            })
        }

        const newUnit = await Unit.create({
            unitName,
            description,
        });


        return res.status(200).json({
            success: true,
            message: "Unit create successfully"
        });

    } catch (error) {
        console.log(error);

        return res.status.json({
            success: false,
            message: `Server Error: ${error.message}`,
            error: error.message,
        })
    }
}

const updateUnit = async (req, res) =>{
    try {
        const {unitId, unitName, description} = req.body

        // console.log(unitName, description)

        if(!unitId){
            return res.status(400).json({
                success: false,
                message: "Please fill all the madatory fields"
            })
        }

        const updatedUnit = await Unit.findByIdAndUpdate(unitId, {unitName, description});

        return res.status(200).json({
            success: true,
            message : "Unit update succesfully",
            updatedUnit,   
        });

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `Server Error : ${error.message}`,
            error : error.message
        })
    }
}


const getAllUnits = async (req, res) => {
    try {

        const allUnits = await Unit.find();

        return res.status(200).json({
            success: true,
            message: 'All units fetched',
            allUnits,
        })


    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: `Server Error ${error.message}`
        })
    }
}


const getUnitById = async (req, res) => {
    try {
        const { unitId } = req.body;

        if (!unitId) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all the madatory fields'
            })
        }

        const unit = await Unit.findById(unitId);


        return res.status(200).json({
            success: true,
            message: "Unit fetched succesfully",
            unit,
        });


    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: `Server Error : ${error.message}`
        });
    }
}

const deleteUnit = async (req, res) => {
    try {
        const {unitId} = req.body;
        
        if(!unitId){
            return res.status(400).json({
                success: false,
                message: 'Please fill all the madatory fields',
            })
        }

        await Unit.findByIdAndDelete(unitId);

        return res.status(200).json({
            success: true,
            message: "Unit delete successfully"
        });
    } catch (error) {
        console.log(error)

        return res.status(500).json({
            success: false,
            message: `Server Error : ${error.message}`
        })
    }
}



module.exports = {createUnit, updateUnit, getAllUnits, getUnitById, deleteUnit}
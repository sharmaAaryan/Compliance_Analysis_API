import {Framework} from "../models/framework.schema.js";

export const createFrameWork = async (req, res, next) => {
  try {
    const {
      name,
      shortCode,
      description,
      authority,
      country,
      industry,
      controls,
      version,
      createdBy,
      appliesTo,
    } = req.body;
//""= false value
    if (
      !name ||
      !shortCode ||
      !description ||
      !authority ||
      !country ||
      !industry ||
      !controls ||
      !appliesTo
    ) {
      return res.status(400).json({message: "All fields are required"});
    }
    const findFramework = {
      $or: [{shortCode}, {version}],
    };

    const isFrameworkExist = await Framework.findOne(findFramework);

    if (isFrameworkExist) {
      res.status(400).json({message: "Framework is already exists"});
    }

    const framework = await Framework.create({
      name,
      shortCode,
      description,
      authority,
      country,
      industry,
      controls,
      version,
      appliesTo,
      createdBy: req.user.id,
    });

    res.status(201).json({message: "Framework created successfully"});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

export const getFramework = async (req, res, next) => {
  try {
    const framework = await Framework.find({isActive: true});

    if (!framework || framework.length === 0) {
      res.status(400).json({message: "No framework found!"});
    }
    return res.status(200).json({data: framework});
  } catch (err) {
    res.status(500).json({message: err.message});
  }
};
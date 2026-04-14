import {Organization} from "../models/organization.schema.js";

export const createOrganization = async (req, res, next) => {
  try {
    const {
      legalName,
      dbaName,
      address,
      primaryContact,
      phoneNumber,
      website,
      createdBy,
      identifiers,
    } = req.body;

    if (!legalName || !dbaName) {
      return res
        .status(400)
        .json({message: "Legan Name and dbaName is required"});
    }

    const organization = await Organization.create({
      legalName,
      dbaName,
      address,
      primaryContact,
      phoneNumber,
      website,
      createdBy: req.user.id,
      identifiers,
    });
    res
      .status(201)
      .json({message: "organization created successfully", data: organization});
  } catch (error) {
    res.status(500).json({message: error.messsage});
  }
};
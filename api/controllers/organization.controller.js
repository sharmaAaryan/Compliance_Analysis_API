import express from "express";
import {Organization} from "../models/organization.schema.js";
//import {Organization} from "../models/organization.schema.js";

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

    const isCompanyExists = {
      $or: [{dbaName}, {phoneNumber}, {website}],
    };

    const isCompany = await Organization.findOne(isCompanyExists);

    if (isCompany) {
      return res.status(400).json({message: "Company already exists"});
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
    res.status(500).json({message: error.message});
  }
};

// read

export const getAllCompanies = async (req, res, next) => {
  try {
    const companies = await Organization.find();
    if (!companies || companies.length === 0) {
      return res.status(400).json({
        message: "No Company Available",
      });
    }

    return res.status(200).json({data: companies});
  } catch (err) {
    res.status(500).json({message: err.message});
  }
};
export const createOrganization = async (req, res, next) => {
  try {
    //create query
    return res.status(201).json({
      message: "organization created successfully ",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

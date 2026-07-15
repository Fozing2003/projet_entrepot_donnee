// Cube configuration options: https://cube.dev/docs/config
/** @type{ import('@cubejs-backend/server-core').CreateOptions } */
module.exports = {
  checkAuth: async (req, authorization) => {
    const expectedToken = process.env.CUBE_API_TOKEN || "dev-token";

    if (authorization !== expectedToken) {
      throw new Error("Invalid Cube API token");
    }

    req.securityContext = {
      project: "projet_entrepot_donnee"
    };
  }
};

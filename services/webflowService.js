const rateLimiter = require("../middleware/rateLimiter");
const airtableService = require("../services/airtableService");

exports.syncToWebflow = async (payload) => {
  const fieldMapping = {
    "Webflow Item ID (From Updates)": "Updates",
  };

  const mapAirtableToWebflow = (airtableFields) => {
    const webflowFields = {};

    // Iterate over each field in the mapping object
    for (const [airtableField, webflowField] of Object.entries(fieldMapping)) {
      if (airtableFields[airtableField]) {
        webflowFields[webflowField] = airtableFields[airtableField];
      }
    }

    return webflowFields;
  };

  // Handle Created Records
  if (payload.createdRecordsById) {
    for (const [recordId, recordData] of Object.entries(
      payload.createdRecordsById
    )) {
      const fieldData = mapAirtableToWebflow(recordData.cellValuesByFieldId);

      try {
        // Create the new item in Webflow
        const response = await rateLimiter.webflowAxios.post(
          `https://api.webflow.com/v2/collections/${collection_id}/items/live`,
          { fieldData },
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
              "accept-version": "1.0.0",
            },
          }
        );

        // Extract the Webflow Item ID from the response
        const webflowItemId = response.data._id; // Assuming Webflow returns the item ID in the _id field

        // Update the corresponding Airtable record with the new Webflow Item ID

        await airtableService.updateAirtableWithWebflowItemId(
          recordId,
          webflowItemId
        );
        console.log(
          `Successfully created Webflow item and updated Airtable record ${recordId}`
        );
      } catch (error) {
        console.error(
          `Error handling created record ${recordId}:`,
          error.response ? error.response.data : error.message
        );
      }
    }
  }

  // Handle Changed Records
  if (payload.changedRecordsById) {
    for (const [recordId, recordData] of Object.entries(
      payload.changedRecordsById
    )) {
      const fieldData = mapAirtableToWebflow(
        recordData.current.cellValuesByFieldId
      );
      const itemId = recordData.WebflowItemId;
      await rateLimiter.webflowAxios.patch(
        `https://api.webflow.com/v2/collections/${collection_id}/items/${itemId}/live`,
        { fieldData },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "accept-version": "1.0.0",
          },
        }
      );
    }
  }

  // Handle Destroyed Records
  if (payload.destroyedRecordIds) {
    for (const recordId of payload.destroyedRecordIds) {
      const itemId = recordData.WebflowItemId;
        await rateLimiter.webflowAxios.delete(
          `https://api.webflow.com/v2/collections/${collection_id}/items/${itemId}/live`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
              "accept-version": "1.0.0",
            },
          }
        );
    }
  }
};

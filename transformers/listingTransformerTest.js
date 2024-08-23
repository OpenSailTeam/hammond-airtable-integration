module.exports = {
  transformToAdsFormat: (recordId, internalObject) => {
    const result = {
      final_urls: internalObject["Slug"]
        ? [slugToUrl(internalObject["Slug"])]
        : undefined,
      dynamic_real_estate_asset: {
        listing_id: recordId,
        listing_name: internalObject["Name"]
          ? trimString(internalObject["Name"], 25)
          : undefined,
        //city_name:
        //  internalObject["Name (from Closest Town)"]?.["valuesByLinkedRecordId"]?.[
        //    internalObject["fldc7RlwdErEiIli1"]["linkedRecordIds"]?.[0]
        //  ]?.[0],
        description: internalObject["General Description"],
        property_type: "farmland",
        listing_type: "sale",
        address: internalObject["Coordinates"],
        price: internalObject["Price (P)"]
          ? formatPrice(internalObject["Price (P)"])
          : undefined,
      },
    };

    // Remove undefined fields from final_urls and dynamic_real_estate_asset
    if (!result.final_urls) delete result.final_urls;
    result.dynamic_real_estate_asset = Object.fromEntries(
      Object.entries(result.dynamic_real_estate_asset).filter(
        ([_, v]) => v !== undefined
      )
    );

    return result;
  },
};

function slugToUrl(slug) {
  return "https://hammondrealty.ca/listings/" + slug;
}

function formatPrice(number) {
  return number.toString() + " CAD";
}

function trimString(string, length) {
  return string.substring(0, length);
}

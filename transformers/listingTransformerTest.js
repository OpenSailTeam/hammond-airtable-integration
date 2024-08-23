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
        description: internalObject["General Description"] && internalObject["General Description"].trim()
          ? trimString(internalObject["General Description"], 100)
          : undefined,
        property_type: "farmland",
        listing_type: "sale",
        address: internalObject["Coordinates"]
          ? internalObject["Coordinates"]
          : undefined,
        price: internalObject["Price (P)"]
          ? formatPrice(internalObject["Price (P)"])
          : undefined,
      },
    };

    return result;
  },
};

function slugToUrl(slug) {
  return `https://hammondrealty.ca/listings/${slug}`;
}

function formatPrice(number) {
  return `${number} CAD`;
}

function trimString(string, length) {
  return string ? string.substring(0, length) : '';
}

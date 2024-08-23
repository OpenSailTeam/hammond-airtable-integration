module.exports = {
  transformToAdsFormat: (internalObject) => {
    const result = {
      final_urls: internalObject["fldkkNCldg9MufIKi"]
        ? [slugToUrl(internalObject["fldkkNCldg9MufIKi"])]
        : undefined,
      dynamic_real_estate_asset: {
        listing_id: internalObject["fldsSdgGBKmG3Stvi"],
        listing_name: internalObject["fldw8YroAQYa4eja5"]
          ? trimString(internalObject["fldw8YroAQYa4eja5"], 23)
          : undefined,
        city_name:
          internalObject["fldc7RlwdErEiIli1"]?.["valuesByLinkedRecordId"]?.[
            internalObject["fldc7RlwdErEiIli1"]["linkedRecordIds"]?.[0]
          ]?.[0],
        description: internalObject["fldWz4IkS9h1Nfdr4"],
        property_type: "farmland",
        listing_type: "sale",
        address: internalObject["fldpjQcD4ABxDFmIZ"],
        price: internalObject["fld3OAds8z2vDEnqz"]
          ? formatPrice(internalObject["fld3OAds8z2vDEnqz"])
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

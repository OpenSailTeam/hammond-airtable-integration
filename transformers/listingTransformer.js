module.exports = {

transformToAdsFormat: (internalObject) => {
    return {
        final_urls: [slugToUrl(internalObject["fldkkNCldg9MufIKi"])],
        dynamic_real_estate_asset: {
            listing_id: internalObject["fldsSdgGBKmG3Stvi"],
            listing_name: trimString(internalObject["fldw8YroAQYa4eja5"], 23),
            city_name: internalObject["fldc7RlwdErEiIli1"]["valuesByLinkedRecordId"][internalObject["fldc7RlwdErEiIli1"]["linkedRecordIds"][0]][0],
            //description: internalObject["fldWz4IkS9h1Nfdr4"],
            property_type: "farmland",
            listing_type: "sale",
            //address: internalObject["fldpjQcD4ABxDFmIZ"],
            price: formatPrice(internalObject["fld3OAds8z2vDEnqz"])
        }
    };
}

  
}

function slugToUrl(slug) {
    return "https://hammondrealty.ca/listings/" + slug;
  }

  function formatPrice(number) {
    return number.toString() + " CAD";
  }

  function trimString(string, length) {
    return string.substring(0, length);
  }
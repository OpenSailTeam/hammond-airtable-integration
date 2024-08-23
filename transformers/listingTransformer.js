module.exports = {

  transformToAdsFormat: (internalObject) => {
    return {
        final_urls: [slugToUrl(internalObject["fldkkNCldg9MufIKi"])],
        dynamic_real_estate_asset: {
            listing_id: internalObject["fldsSdgGBKmG3Stvi"],
            listing_name: trimString(internalObject["fldw8YroAQYa4eja5"], 23),
            city_name: internalObject["fldc7RlwdErEiIli1"]["valuesByLinkedRecordId"][internalObject["fldc7RlwdErEiIli1"]["linkedRecordIds"][0]][0],
            description: internalObject["fldWz4IkS9h1Nfdr4"],
            property_type: "farmland",
            listing_type: "sale",
            address: internalObject["fldpjQcD4ABxDFmIZ"],
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















  module.exports = {

    transformToAdsFormat: (internalObject) => {
      return {
          "listing_id": internalObject["fldsSdgGBKmG3Stvi"],
          "listing_name": internalObject["fldw8YroAQYa4eja5"],
          "final_url": slugToUrl(internalObject["fldkkNCldg9MufIKi"]),
          "city_name": internalObject["fldc7RlwdErEiIli1"]["valuesByLinkedRecordId"][internalObject["fldc7RlwdErEiIli1"]["linkedRecordIds"][0]][0],
          "description": internalObject["fldWz4IkS9h1Nfdr4"],
          "property_type": "farmland",
          "listing_type": "sale",
          //"contextual_keywords": [],
          "address": internalObject["fldpjQcD4ABxDFmIZ"],
          "price": internalObject["fld3OAds8z2vDEnqz"].toString(),
          //"formatted_price": internalObject,
          //"tracking_template": internalObject,
          //"final_mobile_URL": internalObject,
          "image_URL": internalObject["fldsaCnr0pnZMh2k7"][0]["url"],
          //"android_app_link": internalObject,
          //"ios_app_link": internalObject,
          //"ios_app_store_id": internalObject,
          //"similar_listing_ids": internalObject
      };
    }
    
  }
  
  function slugToUrl(slug) {
      return "https://hammondrealty.ca/listings/" + slug;
    }
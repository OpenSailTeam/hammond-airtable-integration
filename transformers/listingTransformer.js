module.exports = {

  transformToAdsFormat: (internalObject) => {
    return {
        "listing_id": "65a946859824a73cd3f87e44",
        "listing_name": "Yorkton 1/3 Share o",
        //"final_url": slugToUrl(internalObject["fldkkNCldg9MufIKi"]),
        //"city_name": "Yorkton",
        //"description": internalObject["fldWz4IkS9h1Nfdr4"],
        //"property_type": "farmland",
        //"listing_type": "sale",
        //"contextual_keywords": [],
        //"address": "51.250618,-102.456942",
        //"price": "123 CAD",
        //"formatted_price": internalObject,
        //"tracking_template": internalObject,
        //"final_mobile_URL": internalObject,
        //"image_url": "https://cdn.prod.website-files.com/61a9429c69570225f140d3b0/65a946e3e3cb4fa6a6ab3f05_NkgCaYS9eUESlSV7B8ZFTAi9C8K7XgoInOKt_VA0uf4.jpeg",
        //"listing_id": internalObject["fldsSdgGBKmG3Stvi"],
        //"listing_name": internalObject["fldw8YroAQYa4eja5"],
        "final_url": "https://hammondrealty.ca/properties-new"
        //"city_name": internalObject["fldc7RlwdErEiIli1"]["valuesByLinkedRecordId"][internalObject["fldc7RlwdErEiIli1"]["linkedRecordIds"][0]][0],
        //"description": internalObject["fldWz4IkS9h1Nfdr4"],
        //"property_type": "farmland",
        //"listing_type": "sale",
        //"contextual_keywords": [],
        //"address": internalObject["fldpjQcD4ABxDFmIZ"],
        //"price": internalObject["fld3OAds8z2vDEnqz"].toString(),
        //"formatted_price": internalObject,
        //"tracking_template": internalObject,
        //"final_mobile_URL": internalObject,
        //"image_url": internalObject["fldsaCnr0pnZMh2k7"][0]["url"],
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
module.exports = {
  transformToMetaFormat: (recordId, internalObject, status = 'active') => {
    const result = {
        home_listing_id: recordId,
        name: internalObject['Name']
          ? trimString(internalObject['Name'], 100)
          : `Archived Listing ${recordId}`,
        description: internalObject['General Description']
          ? trimString(internalObject['General Description'], 5000)
          : undefined,
        property_type: 'land',
        // REQUIRED: availability must always be present for Meta Ads
        availability: internalObject['Listing Status (New)'] && 
          availabilityMapping[internalObject['Listing Status (New)'][0]] &&
          internalObject['Service Type'] &&
          availabilityMapping[internalObject['Listing Status (New)'][0]][internalObject['Service Type'][0]]
          ? availabilityMapping[internalObject['Listing Status (New)'][0]][internalObject['Service Type'][0]]
          : 'off_market',
        // REQUIRED: address components must always be present for Meta Ads
        address: {
          city: internalObject['Name (from Closest Town)'] 
            ? internalObject['Name (from Closest Town)'][0] 
            : 'Unknown',
          region: 'Saskatchewan',
          country: 'Canada',
          postal_code: 'S0A 0A0'
        },
        // REQUIRED: coordinates must always be present for Meta Ads  
        latitude: internalObject['Coordinates']
          ? parseFloat(internalObject['Coordinates'].split(',')[0])
          : 0,
        longitude: internalObject['Coordinates']
          ? parseFloat(internalObject['Coordinates'].split(',')[1])
          : 0,
        // OPTIONAL: neighborhood can be undefined
        neighborhood: internalObject['Name (from Rural Municipality)']
          ? internalObject['Name (from Rural Municipality)'][0]
          : undefined,
        // REQUIRED: price must always be present for Meta Ads
        price: internalObject['Price (P)']
          ? formatPrice(internalObject['Price (P)'])
          : '0 CAD',
        // REQUIRED: url must always be present for Meta Ads
        url: internalObject['Link']
          ? internalObject['Link']
          : 'https://www.hammondrealty.ca/listings/',  
        // REQUIRED: image must always be present for Meta Ads
        image: internalObject['Webflow Image URL']
          ? imageObject(internalObject['Webflow Image URL'], trimString(internalObject['Name'], 25))
          : imageObject('https://cdn.prod.website-files.com/6176cec6a4e37b6a55ae0553/657c93e2e29e21a8243c1962_default%20image.png', 'Default Image'),
        status: status  // Status can be 'active' or 'archived'
    };
  
    return result;
  },
  
  transformToGoogleFormat: (recordId, internalObject) => {
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
        listing_type: internalObject["Listing Status (New)"] && 
        statusServiceMapping[internalObject["Listing Status (New)"][0]] &&
        internalObject["Service Type"] &&
        statusServiceMapping[internalObject["Listing Status (New)"][0]][internalObject["Service Type"][0]]
? statusServiceMapping[internalObject["Listing Status (New)"][0]][internalObject["Service Type"][0]]
: undefined,
        address: internalObject["Coordinates"]
          ? internalObject["Coordinates"]
          : undefined,
        price: internalObject["Price (P)"]
          ? formatPrice(internalObject["Price (P)"])
          : undefined,
        city_name: internalObject['Name (from Closest Town)']
          ? internalObject['Name (from Closest Town)'][0]
          : undefined,
        image_url: internalObject["Webflow Image URL"]
          ? internalObject["Webflow Image URL"]
          : undefined
      },
    };

    return result;
  },
};

function slugToUrl(slug) {
  return `https://hammondrealty.ca/listings/${slug}`;
};

function formatPrice(number) {
  return `${number} CAD`;
};

function trimString(string, length) {
  return string ? string.substring(0, length) : '';
};

const statusServiceMapping = {
  'recM9mTgZ2PBOjvUC': {
    'recnvvs22bNVHt6nB': 'For Sale',
    'recC0MUZAQzP8VGbm': 'For Sale by Tender',
    'reciaqpuSjraedHCE': 'For Sale by Auction',
    'recJPEBzZT1VXQUxT': 'For Lease',
    'recO7KhyAKDypJ4dF': 'Active Buyer Contract',
  },
  'recjAvvcQYE4AsK9a': {
    'recnvvs22bNVHt6nB': 'Sale Pending',
    'recJPEBzZT1VXQUxT': 'Lease Pending',
    'recO7KhyAKDypJ4dF': 'Pending Buyer Contract',
  },
  'recDdogg7WL8iRLFd': {
    'recnvvs22bNVHt6nB': 'Sold',
    'recJPEBzZT1VXQUxT': 'Leased',
    'recO7KhyAKDypJ4dF': 'Fulfilled Buyer Contract',
  },
};

const availabilityMapping = {
  'recM9mTgZ2PBOjvUC': {
    'recnvvs22bNVHt6nB': 'for_sale',
    'recC0MUZAQzP8VGbm': 'for_sale',
    'reciaqpuSjraedHCE': 'for_sale',
    'recJPEBzZT1VXQUxT': 'for_rent',
  },
  'recjAvvcQYE4AsK9a': {
    'recnvvs22bNVHt6nB': 'sale_pending',
    'recJPEBzZT1VXQUxT': 'sale_pending',
  },
  'recDdogg7WL8iRLFd': {
    'recnvvs22bNVHt6nB': 'off_market',
    'recJPEBzZT1VXQUxT': 'off_market',
  },
};

function imageObject(url, tag) {
  return {url, tag};
};

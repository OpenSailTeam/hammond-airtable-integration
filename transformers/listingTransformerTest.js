module.exports = {
  transformToMetaFormat: (recordId, internalObject) => {
    const result = {
        home_listing_id: recordId,
        name: internalObject['Name']
          ? trimString(internalObject['Name'], 100)
          : undefined,
        description: internalObject['General Description']
          ? trimString(internalObject['General Description'], 5000)
          : undefined,
        property_type: 'land',
        availability: internalObject['Listing Status (New)'] && 
          availabilityMapping[internalObject['Listing Status (New)'][0]] &&
          internalObject['Service Type'] &&
          availabilityMapping[internalObject['Listing Status (New)'][0]][internalObject['Service Type'][0]]
          ? availabilityMapping[internalObject['Listing Status (New)'][0]][internalObject['Service Type'][0]]
          : undefined,
        address: {
          city: internalObject['Name (from Closest Town)'] ? internalObject['Name (from Closest Town)'][0] : undefined,
          region: 'Saskatchewan',
          country: 'Canada',
          postal_code: 'S0A 0A0'
        },
        latitude: internalObject['Coordinates']
          ? parseFloat(internalObject['Coordinates'].split(',')[0])
          : undefined,
        longitude: internalObject['Coordinates']
          ? parseFloat(internalObject['Coordinates'].split(',')[1])
          : undefined,
        neighborhood: internalObject['Name (from Rural Municipality)']
          ? internalObject['Name (from Rural Municipality)'][0]
          : undefined,
        price: internalObject['Price (P)']
          ? formatPrice(internalObject['Price (P)'])
          : undefined,
        url: internalObject['Link']
          ? formatPrice(internalObject['Link'])
          : undefined,  
        image: internalObject['Webflow Image URL']
          ? imageObject(internalObject['Webflow Image URL'], trimString(internalObject['Name'], 25))
          : undefined,
        status: 'active'
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

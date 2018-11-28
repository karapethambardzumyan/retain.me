export const MM_TO_PX = 3.7795275591;

export const SIZES = [
  { width: 136, height: 150 },
  { width: 140, height: 81 },
  { width: 200, height: 139 },
  { width: 100, height: 150 }
];

export const CONFIG = {
  background: {
    base64: null,
    position: {
      x: null,
      y: null
    },
    scale: {
      x: null,
      y: null
    }
  },
  size: 0,
  texts: []
};

export const FONTS = [
  'DancingScript-Regular',
  'IndieFlower',
  'JosefinSans-Regular',
  'Niramit-Regular',
  'Pacifico-Regular',
  'Ranga-Regular',
  'ShadowsIntoLight'
];

export const TEXT_TOOLBAR = {
  fontSize: 50,
  fontFamily: 'Arial',
  fontWeight: 'normal',
  fontAlign: 'left',
  fontColor: '#000000',
  text: 'Enter your text'
};

export const TEMPLATES = [
  { text: 'Order - Currency', value: '<~o:Currency~>' },
  { text: 'Order - Total Price', value: '<~o:TotalPrice~>' },
  { text: 'Order - Subtotal Price', value: '<~o:SubTotalPrice~>' },
  { text: 'Order - Total Shipping Price', value: '<~o:TotalShippingPrice~>' },
  { text: 'Order - Total Tax', value: '<~o:TotalTax~>' },
  { text: 'Order - Language', value: '<~o:Language~>' },
  { text: 'Order - Document Barcode', value: '<~o:DocumentBarcode~>' },

  { text: 'BillingAddress - First Name', value: '<~ba:FirstName~>' },
  { text: 'BillingAddress - Last Name', value: '<~ba:LastName~>' },
  { text: 'BillingAddress - Address 1', value: '<~ba:Address1~>' },
  { text: 'BillingAddress - Address 2', value: '<~ba:Address2~>' },
  { text: 'BillingAddress - Address 3', value: '<~ba:Address3~>' },
  { text: 'BillingAddress - Address 4', value: '<~ba:Address4~>' },
  { text: 'BillingAddress - City', value: '<~ba:City~>' },
  { text: 'BillingAddress - Zip/Postal Code', value: '<~ba:Zip_PostalCode~>' },
  { text: 'BillingAddress - Phone', value: '<~ba:Phone~>' },
  { text: 'BillingAddress - Country Code', value: '<~ba:CountryCode~>' },

  { text: 'Customer - Title', value: '<~c:Title~>' },
  { text: 'Customer - Email', value: '<~c:Email~>' },
  { text: 'Customer - FirstName', value: '<~c:FirstName~>' },
  { text: 'Customer - Last Name', value: '<~c:LastName~>' },
  { text: 'Customer - Phone', value: '<~c:Phone~>' },
  { text: 'Customer - Is New', value: '<~c:IsNew~>' },

  { text: 'Shipment - Title', value: '<~s:Title~>' },
  { text: 'Shipment - First Name', value: '<~s:FirstName~>' },
  { text: 'Shipment - Last Name', value: '<~s:Last Name~>' },
  { text: 'Shipment - Is Gift', value: '<~s:IsGift~>' },
  { text: 'Shipment - Gift Message', value: '<~s:GiftMessage~>' },
  { text: 'Shipment - Address 1', value: '<~s:Address1~>' },
  { text: 'Shipment - Address 2', value: '<~s:Address2~>' },
  { text: 'Shipment - Address 3', value: '<~s:Address3~>' },
  { text: 'Shipment - Address 4', value: '<~s:Address4~>' },
  { text: 'Shipment - City', value: '<~s:City~>' },
  { text: 'Shipment - Zip/Postal Code', value: '<~s:Zip_PostalCode~>' },
  { text: 'Shipment - Phone', value: '<~s:Phone~>' },
  { text: 'Shipment - Country Code', value: '<~s:CountryCode~>' },

  { text: 'OrderOffer - Offer Type', value: '<~oo:OfferType~>' },
  { text: 'OrderOffer - Offer Code', value: '<~oo:OfferCode~>' },
  { text: 'OrderOffer - Offer Url', value: '<~oo:OfferUrl~>' },
  { text: 'OrderOffer - Offer Discount', value: '<~oo:OfferDiscount~>' },
  { text: 'OrderOffer - Offer Min Spend', value: '<~oo:OfferMinSpend~>' },
  { text: 'OrderOffer - Offer Expiry Date', value: '<~oo:OfferExpiryDate~>' }
];

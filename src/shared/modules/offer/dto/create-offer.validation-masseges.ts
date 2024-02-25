// validation-messages.ts
export const validationMessages = {
  title: {
    isString: 'Title must be a string',
    length: 'Title must be at least 10 characters & no more than 100 characters',
  },
  description: {
    isString: 'Description must be a string',
    length: 'Description must be at least 20 characters & no more than 1024 characters',
  },
  city: {
    isEnum: 'City must be one of the predefined values',
  },
  previewImage: {
    isUrl: 'Preview image must be a valid URL',
  },
  photos: {
    isString: 'Each photo must be a string',
    arrayMinSize: 'There must be at least 6 photos',
    arrayMaxSize: 'There must be no more than 6 photos',
    arrayNotEmpty: 'Photos array must not be empty',
  },
  isPremium: {
    isBoolean: 'IsPremium must be a boolean',
  },
  isFavorite: {
    isBoolean: 'IsFavorite must be a boolean',
  },
  rating: {
    isInt: 'Rating must be a number',
    min: 'Rating must be at least 1',
    max: 'Rating must be no more than 5',
  },
  type: {
    isEnum: 'Type must be one of the predefined values',
  },
  rooms: {
    isInt: 'Rooms must be a number',
    min: 'There must be at least 1 room',
    max: 'There must be no more than 8 rooms',
  },
  guests: {
    isInt: 'Guests must be a number',
    min: 'There must be at least 1 guest',
    max: 'There must be no more than 10 guests',
  },
  cost: {
    isInt: 'Cost must be a number',
    min: 'Cost must be at least 100',
    max: 'Cost must be no more than 100000',
  },
  amenities: {
    isEnum: 'Each amenity must be one of the predefined values',
  },
  authorId: {
    isMongoId: 'AuthorId must be a existing user id',
  },
  commentsCount: {
    isInt: 'CommentsCount must be a number',
  },
  coordinates: {
    latitude: {
      isLatitude: 'Latitude must be a valid latitude',
    },
    longitude: {
      isLongitude: 'Longitude must be a valid longitude',
    },
  },
} as const;

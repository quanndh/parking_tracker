export const CacheKey = {
  parkingDetail: (id: string) => `parking:${id}`,
  parkingLots: (id: string) => `parking_lots:${id}`,
  parkingSet: 'parking_set',
};

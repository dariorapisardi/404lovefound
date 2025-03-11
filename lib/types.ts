export interface Pet {
    id: string
    attributes: {
      name: string
      ageString: string
      breedString: string
      descriptionText: string
      pictureThumbnailUrl: string
      url: string
    }
    relationships: {
      pictures: {
        data: Array<{
          id: string
        }>
      }
    }
  }
  
export class Card {
[x: string]: any
    data!: {
        products: [
            {
            id: number,
            name: string,
            description: string,
            vegeterian: boolean,
            spiciness: number,
            rate: number,
            price: number,
            image: string,
            canDelete: boolean
            }
        ],
        hasMore: boolean
    }
    meta!: {
        name: string,
        description: string,
        website: string,
        location: string,
        email: string
    }
}



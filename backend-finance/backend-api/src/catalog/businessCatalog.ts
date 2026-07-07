export interface BusinessEntity {

    dimension: string;

    value: string;

}

export class BusinessCatalog {

    private entities: BusinessEntity[] = [];

    setEntities(values: BusinessEntity[]) {

        this.entities = values;

    }

    getEntities() {

        return this.entities;

    }

}
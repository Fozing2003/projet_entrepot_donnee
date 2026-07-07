import cubeApi from "../cube/client";

export class CubeService {

    async execute(query: any) {

        const resultSet = await cubeApi.load(query);

        return resultSet.tablePivot();

    }

}
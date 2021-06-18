/** @typedef {import("../dist/webapi").WebApi} WebApi */
/** @typedef {import("../dist/webapi").WebModel} WebModel */
/** @typedef {import("../dist/model").MatrixName} MatrixName */
/** @typedef {import("../dist/model").ModelInfo} ModelInfo */
/** @typedef {import("../dist/matrix").Matrix} Matrix */


/** @type WebApi */
var webApi = webApi;

describe("matrix requests", async function () {
  this.timeout(10000);

  it("WebModel.matrix", async () => {
    console.log("load matrices from models:");
    await eachMatrix((model, name, matrix) => {
      const rows = matrix.rows;
      const cols = matrix.cols;
      chai.expect(rows).greaterThan(0);
      chai.expect(cols).greaterThan(0);
      console.log(
        `  - loaded ${rows} x ${cols} matrix ${name} from ${model.id}`);
    });
  });

  it("Matrix.getCol", async () => {
    console.log("check matrix columns of models:");
    await eachMatrix((model, name, matrix) => {
      console.log(`  - check columns of matrix ${name} in mode ${model.id}`);
      for (let j = 0; j < matrix.cols; j++) {
        const column = matrix.getCol(j);
        for (let i = 0; i < matrix.rows; i++) {
          chai.expect(matrix.get(i, j)).equals(column[i]);
        }
      }
    })
  });


});


/**
 * @param {(model: WebModel) => void} fn the model callback
 */
async function eachModel(fn) {
  for (const info of await webApi.getModelInfos()) {
    /** @type WebModel */
    const model = new useeio.WebModel(webApi, info.id);
    fn(model);
  }
}

/**
 * Iterates over each matrix in each of the available models. 
 *
 * @param fn {(i: ModelInfo, n: MatrixName, m: Matrix) => void} the consumer
 * function
 */
async function eachMatrix(fn) {
  const infos = await webApi.getModelInfos();
  /** @type MatrixName[] */
  const names = ["A", "B", "C", "D", "L", "N"];
  for (const info of infos) {
    /** @type WebModel */
    const model = new useeio.WebModel(webApi, info.id);
    for (const name of names) {
      const matrix = await model.matrix(name);
      fn(info, name, matrix);
    }
  }
}
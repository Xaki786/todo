/** @format */

import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
} from "sequelize";
import { sequelizeConnection } from "./dbConfig";
class Todo extends Model<InferAttributes<Todo>, InferCreationAttributes<Todo>> {
  declare id: CreationOptional<string>;
  declare label?: string;
}

Todo.init(
  {
    id: { type: DataTypes.STRING, primaryKey: true, field: "id" },
    label: { type: DataTypes.STRING, field: "label" },
  },
  {
    sequelize: sequelizeConnection,
    tableName: "tasks",
    createdAt: false,
    updatedAt: false,
    timestamps: false,
  }
);

export { Todo };

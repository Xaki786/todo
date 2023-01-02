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
  declare id: CreationOptional<number>;
  declare label?: string;
}

Todo.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, field: "id" },
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

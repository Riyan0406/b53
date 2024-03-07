import { Model, DataTypes } from "sequelize";

export default function (sequelize, DataTypes) {
  class Projects extends Model {
    static associate(models) {
      // define association here
    }
  }
  Projects.init(
    {
      title: DataTypes.STRING,
      start_date: DataTypes.DATE,
      end_date: DataTypes.DATE,
      description: DataTypes.STRING,
      technologies: DataTypes.ARRAY(DataTypes.STRING),
      image: DataTypes.STRING,
      author: DataTypes.STRING,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "projects",
    }
  );
  return Projects;
}

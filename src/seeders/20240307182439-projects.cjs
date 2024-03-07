"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "projects",
      [
        {
          title: "John Doe",
          start_date: "2024-02-02",
          end_date: "2024-03-03",
          description: "aaaaaaaa",
          technologies: ["java"],
          image: "acong.jpg",
          author: "hari",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("People", null, {});
  },
};

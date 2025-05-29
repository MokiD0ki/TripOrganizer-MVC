using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TripOrganizer.Migrations
{
    public partial class AddUserAndParticipants : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "OwnerId",
                table: "Trips",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Username = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Password = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TripParticipants",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    TripId = table.Column<int>(type: "INTEGER", nullable: false),
                    UserId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TripParticipants", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TripParticipants_Trips_TripId",
                        column: x => x.TripId,
                        principalTable: "Trips",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TripParticipants_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Trips_OwnerId",
                table: "Trips",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_TripParticipants_TripId",
                table: "TripParticipants",
                column: "TripId");

            migrationBuilder.CreateIndex(
                name: "IX_TripParticipants_UserId",
                table: "TripParticipants",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Trips_Users_OwnerId",
                table: "Trips",
                column: "OwnerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Trips_Users_OwnerId",
                table: "Trips");

            migrationBuilder.DropTable(
                name: "TripParticipants");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Trips_OwnerId",
                table: "Trips");

            migrationBuilder.DropColumn(
                name: "OwnerId",
                table: "Trips");
        }
    }
}

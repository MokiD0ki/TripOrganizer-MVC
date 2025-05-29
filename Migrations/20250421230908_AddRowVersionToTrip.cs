using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TripOrganizer.Migrations
{
    public partial class AddRowVersionToTrip : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                table: "Trips",
                type: "BLOB",
                rowVersion: true,
                nullable: false,
                defaultValue: new byte[0]);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RowVersion",
                table: "Trips");
        }
    }
}

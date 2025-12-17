-- CreateTable
CREATE TABLE `Flight` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `flightNumber` VARCHAR(191) NOT NULL,
    `airplaneId` INTEGER NOT NULL,
    `departureAirportId` VARCHAR(191) NOT NULL,
    `arrivalAirportId` VARCHAR(191) NOT NULL,
    `arrivalTime` DATETIME(3) NOT NULL,
    `departureTime` DATETIME(3) NOT NULL,
    `price` INTEGER NOT NULL,
    `boardingGate` VARCHAR(191) NULL,
    `totalSeats` INTEGER NOT NULL,

    UNIQUE INDEX `Flight_flightNumber_key`(`flightNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Flight` ADD CONSTRAINT `Flight_airplaneId_fkey` FOREIGN KEY (`airplaneId`) REFERENCES `airplane`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

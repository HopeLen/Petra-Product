-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               12.1.2-MariaDB - MariaDB Server
-- Server OS:                    Win64
-- HeidiSQL Version:             12.13.0.7147
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for petra_test
CREATE DATABASE IF NOT EXISTS `petra_test` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci */;
USE `petra_test`;

-- Dumping structure for table petra_test.menu
CREATE TABLE IF NOT EXISTS `menu` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '',
  `section_id` int(5) NOT NULL DEFAULT 3,
  `price` int(5) DEFAULT NULL,
  `visibility` tinyint(4) DEFAULT 1,
  `type` varchar(50) NOT NULL DEFAULT 'KITCHEN',
  `printers` varchar(13) NOT NULL DEFAULT '1-0-0-0-0-0-0',
  `extra` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`extra`)),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='Our main menu';

-- Dumping data for table petra_test.menu: ~53 rows (approximately)
INSERT INTO `menu` (`id`, `name`, `section_id`, `price`, `visibility`, `type`, `printers`, `extra`) VALUES
	(1, 'ברי בתנור', 0, 68, 1, 'KITCHEN', '1-0-1-0-0-0-0', NULL),
	(2, 'צלחת חריפים', 0, 32, 1, 'KITCHEN', '1-0-1-0-0-0-0', NULL),
	(3, 'תפוח אדמה עלומה', 0, 74, 1, 'KITCHEN', '1-0-1-0-0-0-0', NULL),
	(4, 'בליני בשרי', 0, 58, 1, 'KITCHEN', '1-0-1-0-0-0-0', NULL),
	(5, 'בליני חלבי', 0, 58, 1, 'KITCHEN', '1-0-1-0-0-0-0', NULL),
	(6, 'פלמני', 0, 72, 1, 'KITCHEN', '1-0-1-0-0-0-0', NULL),
	(7, 'איקרה אדומה', 0, 68, 1, 'KITCHEN', '1-0-1-0-0-0-0', NULL),
	(8, 'פלטת מעושנים', 0, 84, 1, 'KITCHEN', '1-0-1-0-0-0-0', NULL),
	(9, 'חומוס', 0, NULL, 1, 'KITCHEN', '1-0-1-0-0-0-0', '{\r\n  "variations": {\r\n    "type": "radio",\r\n    "items": [\r\n      { "name": "חומוס", "price": 36 },\r\n      { "name": "חומוס פטריות", "price": 44 }\r\n    ]\r\n  }\r\n}\r\n'),
	(11, 'צלחת אדממה', 0, 46, 1, 'KITCHEN', '1-0-1-0-0-0-0', NULL),
	(12, 'חמוצים גיאורגיים', 0, 58, 1, 'KITCHEN', '1-0-1-0-0-0-0', NULL),
	(13, 'פטה כבד עוף', 0, 54, 1, 'KITCHEN', '1-0-1-0-0-0-0', NULL),
	(14, 'לחם הבית', 0, 42, 1, 'KITCHEN', '1-0-1-0-0-0-0', NULL),
	(15, 'ארטישוק קרצ\'ופי', 0, 84, 1, 'KITCHEN', '1-0-1-0-0-0-0', NULL),
	(16, 'פטריות מוקפצות', 0, NULL, 1, 'KITCHEN', '1-0-1-0-0-0-0', NULL),
	(17, 'קרפצ\'ו', 0, NULL, 1, 'KITCHEN', '1-0-1-0-0-0-0', NULL),
	(18, 'בטטה שמנת פטריות', 0, 56, 1, 'KITCHEN', '1-0-1-0-0-0-0', NULL),
	(19, 'טרטר פילה בקר', 0, 86, 1, 'KITCHEN', '1-0-1-0-0-0-0', NULL),
	(20, 'שיפוד פילה בקר', 0, 128, 1, 'KITCHEN', '1-0-1-0-0-0-0', NULL),
	(21, 'גלילות חצילים גיאורגיים', 0, 48, 1, 'KITCHEN', '1-0-1-0-0-0-0', NULL),
	(22, 'חציל', 0, 62, 1, 'KITCHEN', '1-0-1-0-0-0-0', NULL),
	(23, 'טרטר סלמון', 0, 86, 1, 'KITCHEN', '1-0-1-0-0-0-0', NULL),
	(24, 'מרק כיסוני ים', 1, 88, 1, 'KITCHEN', '1-0-1-0-0-0-0', NULL),
	(25, 'מרק חרצו', 1, 64, 1, 'KITCHEN', '1-0-1-0-0-0-0', NULL),
	(26, 'מרק בורשט', 1, 66, 1, 'KITCHEN', '1-0-1-0-0-0-0', NULL),
	(27, 'מרק לוביאו', 1, 66, 1, 'KITCHEN', '1-0-1-0-0-0-0', NULL),
	(28, 'מרק פטריות חלבי', 1, 66, 1, 'KITCHEN', '1-0-1-0-0-0-0', NULL),
	(29, 'מרק בצל', 1, 58, 1, 'KITCHEN', '1-0-1-0-0-0-0', NULL),
	(30, 'מרק דגים', 1, 68, 1, 'KITCHEN', '1-0-1-0-0-0-0', NULL),
	(31, 'מרק מיקס פירות ים', 1, 78, 1, 'KITCHEN', '1-0-1-0-0-0-0', NULL),
	(32, 'סלט גיאורגי', 2, 62, 1, 'KITCHEN', '1-0-1-0-0-0-0', NULL),
	(33, 'סלט אנדיב', 2, 78, 1, 'KITCHEN', '1-0-1-0-0-0-0', NULL),
	(34, 'סלט קיסר', 2, 86, 1, 'KITCHEN', '1-0-1-0-0-0-0', NULL),
	(35, 'סלט חלומי', 2, 80, 1, 'KITCHEN', '1-0-1-0-0-0-0', NULL),
	(36, 'סלט יווני', 2, 78, 1, 'KITCHEN', '1-0-1-0-0-0-0', NULL),
	(37, 'סלט קצוץ', 2, 72, 1, 'KITCHEN', '1-0-1-0-0-0-0', NULL),
	(38, 'סלט סלמון', 2, 86, 1, 'KITCHEN', '1-0-1-0-0-0-0', NULL),
	(39, 'סלט פטרה', 2, 88, 1, 'KITCHEN', '1-0-1-0-0-0-0', NULL),
	(40, 'חצפורי אצרולי', 3, NULL, 1, 'KITCHEN', '1-0-1-0-0-0-0', NULL),
	(41, 'צבורקי', 3, NULL, 1, 'KITCHEN', '1-0-1-0-0-0-0', NULL),
	(42, 'חינקלי בשרי', 3, 74, 1, 'KITCHEN', '1-0-1-0-0-0-0', NULL),
	(43, 'אימרולי', 3, NULL, 1, 'KITCHEN', '1-0-1-0-0-0-0', NULL),
	(44, 'לובואני', 3, 78, 1, 'KITCHEN', '1-0-1-0-0-0-0', NULL),
	(45, 'חורציאני', 3, 82, 1, 'KITCHEN', '1-0-1-0-0-0-0', NULL),
	(46, 'פרשקי', 3, NULL, 1, 'KITCHEN', '1-0-1-0-0-0-0', NULL),
	(47, 'ביף סטרוגונוף', 3, 74, 1, 'KITCHEN', '1-0-1-0-0-0-0', NULL),
	(48, 'סליאנקה כבדים', 3, 84, 1, 'KITCHEN', '1-0-1-0-0-0-0', NULL),
	(49, 'וואזיס תולמה', 3, 78, 1, 'KITCHEN', '1-0-1-0-0-0-0', NULL),
	(50, 'צנחי', 3, 98, 1, 'KITCHEN', '1-0-1-0-0-0-0', NULL),
	(51, 'כיסוני גבינות', 3, NULL, 1, 'KITCHEN', '1-0-1-0-0-0-0', NULL),
	(52, 'אוסרי', 3, 84, 1, 'KITCHEN', '1-0-1-0-0-0-0', NULL),
	(53, 'ווינשטפן', 10, NULL, 1, 'BAR', '1-1-0-0-0-0-0', '{\r\n  "variations": {\r\n    "type": "radio",\r\n    "items": [\r\n      { "name": "ווינשטפן 0.3", "price": 34 },\r\n      { "name": "ווינשטפן 0.5", "price": 40 }\r\n    ]\r\n  }\r\n}\r\n'),
	(54, 'המבורגר', 4, NULL, 1, 'KITCHEN', '1-0-1-0-0-0-0', '{\r\n  "variations": {\r\n    "type": "radio",\r\n    "items": [\r\n      { "name": "המבורגר", "price": 78 },\r\n      { "name": "המבורגר צ\'יז", "price": 86 },\r\n      { "name": "המבורגר כבד אווז", "price": 132 },\r\n      { "name": "המבורגר אסאדו", "price": 106 },\r\n      { "name": "המבורגר פטרה", "price": 112 }\r\n    ]\r\n  },\r\n\r\n  "doneness": {\r\n    "type": "radio",\r\n    "items": [{ "name": "M" }, { "name": "MW" }, { "name": "WD" }]\r\n  },\r\n\r\n  "additions": {\r\n    "type": "checkbox",\r\n    "items": [\r\n      { "name": "קציצה", "price": 38 },\r\n      { "name": "בצל מטוגן", "price": 6 },\r\n      { "name": "ביצת עין", "price": 10 },\r\n      { "name": "פטריות", "price": 8 },\r\n      { "name": "גבינת צ\'דר", "price": 10 },\r\n      { "name": "3 טבעות בצל", "price": 12 },\r\n      { "name": "ריבת בצל", "price": 6 }\r\n    ]\r\n  },\r\n\r\n  "extra": {\r\n    "type": "radio",\r\n    "items": [{ "name": "צ\'יפס" }, { "name": "פירה" }, { "name": "אורז" }]\r\n  }\r\n}\r\n');

-- Dumping structure for table petra_test.orders
CREATE TABLE IF NOT EXISTS `orders` (
  `orderID` int(11) NOT NULL AUTO_INCREMENT,
  `information` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`information`)),
  `order` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`order`)),
  `status` varchar(15) DEFAULT 'TAKEN',
  PRIMARY KEY (`orderID`)
) ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table petra_test.orders: ~54 rows (approximately)
INSERT INTO `orders` (`orderID`, `information`, `order`, `status`) VALUES
	(20, '{"waiter":"1","table":"21","openTime":"17:12:38","openDate":"05/01/2026","closeTime":"17:12:48","closeDate":"05/01/2026"}', '[{"id":4,"name":"בליני בשרי","amount":1,"price":58,"extra":null},{"id":3,"name":"תפוח אדמה עלומה","amount":1,"price":74,"extra":null},{"id":2,"name":"צלחת חריפים","amount":1,"price":32,"extra":null},{"id":1,"name":"ברי בתנור","amount":1,"price":68,"extra":null}]', 'AWAITING'),
	(21, '{"waiter":"1","table":"21","openTime":"17:13:06","openDate":"05/01/2026","closeTime":"17:13:14","closeDate":"05/01/2026"}', '[{"id":27,"name":"מרק לוביאו","amount":1,"price":66,"extra":null},{"id":26,"name":"מרק בורשט","amount":1,"price":66,"extra":null},{"id":25,"name":"מרק חרצו","amount":1,"price":64,"extra":null},{"id":24,"name":"מרק כיסוני ים","amount":1,"price":88,"extra":null},{"id":28,"name":"מרק פטריות חלבי","amount":1,"price":66,"extra":null},{"id":29,"name":"מרק בצל","amount":1,"price":58,"extra":null},{"id":31,"name":"מרק מיקס פירות ים","amount":1,"price":78,"extra":null},{"id":30,"name":"מרק דגים","amount":1,"price":68,"extra":null}]', 'AWAITING'),
	(22, '{"waiter":"1","table":"21","openTime":"17:13:36","openDate":"05/01/2026","closeTime":"17:13:40","closeDate":"05/01/2026"}', '[{"id":51,"name":"כיסוני גבינות","amount":1,"price":null,"extra":null},{"id":50,"name":"צנחי","amount":1,"price":98,"extra":null},{"id":46,"name":"פרשקי","amount":1,"price":null,"extra":null},{"id":47,"name":"ביף סטרוגונוף","amount":1,"price":74,"extra":null},{"id":43,"name":"אימרולי","amount":1,"price":null,"extra":null},{"id":42,"name":"חינקלי בשרי","amount":1,"price":74,"extra":null},{"id":41,"name":"צבורקי","amount":1,"price":null,"extra":null},{"id":45,"name":"חורציאני","amount":1,"price":82,"extra":null}]', 'AWAITING'),
	(23, '{"waiter":"1","table":"21","openTime":"17:13:36","openDate":"05/01/2026","closeTime":"17:13:40","closeDate":"05/01/2026"}', '[{"id":51,"name":"כיסוני גבינות","amount":1,"price":null,"extra":null},{"id":50,"name":"צנחי","amount":1,"price":98,"extra":null},{"id":46,"name":"פרשקי","amount":1,"price":null,"extra":null},{"id":47,"name":"ביף סטרוגונוף","amount":1,"price":74,"extra":null},{"id":43,"name":"אימרולי","amount":1,"price":null,"extra":null},{"id":42,"name":"חינקלי בשרי","amount":1,"price":74,"extra":null},{"id":41,"name":"צבורקי","amount":1,"price":null,"extra":null},{"id":45,"name":"חורציאני","amount":1,"price":82,"extra":null}]', 'AWAITING'),
	(24, '{"waiter":"1","table":"21","openTime":"17:12:38","openDate":"05/01/2026","closeTime":"17:12:48","closeDate":"05/01/2026"}', '[{"id":4,"name":"בליני בשרי","amount":1,"price":58,"extra":null},{"id":3,"name":"תפוח אדמה עלומה","amount":1,"price":74,"extra":null},{"id":2,"name":"צלחת חריפים","amount":1,"price":32,"extra":null},{"id":1,"name":"ברי בתנור","amount":1,"price":68,"extra":null}]', 'AWAITING'),
	(25, '{"waiter":"1","table":"21","openTime":"17:12:38","openDate":"05/01/2026","closeTime":"17:12:48","closeDate":"05/01/2026"}', '[{"id":4,"name":"בליני בשרי","amount":1,"price":58,"extra":null},{"id":3,"name":"תפוח אדמה עלומה","amount":1,"price":74,"extra":null},{"id":2,"name":"צלחת חריפים","amount":1,"price":32,"extra":null},{"id":1,"name":"ברי בתנור","amount":1,"price":68,"extra":null}]', 'AWAITING'),
	(26, '{"waiter":"1","table":"21","openTime":"17:12:38","openDate":"05/01/2026","closeTime":"17:12:48","closeDate":"05/01/2026"}', '[{"id":4,"name":"בליני בשרי","amount":1,"price":58,"extra":null},{"id":3,"name":"תפוח אדמה עלומה","amount":1,"price":74,"extra":null},{"id":2,"name":"צלחת חריפים","amount":1,"price":32,"extra":null},{"id":1,"name":"ברי בתנור","amount":1,"price":68,"extra":null}]', 'AWAITING'),
	(27, '{"waiter":"1","table":"21","openTime":"17:12:38","openDate":"05/01/2026","closeTime":"17:12:48","closeDate":"05/01/2026"}', '[{"id":4,"name":"בליני בשרי","amount":1,"price":58,"extra":null},{"id":3,"name":"תפוח אדמה עלומה","amount":1,"price":74,"extra":null},{"id":2,"name":"צלחת חריפים","amount":1,"price":32,"extra":null},{"id":1,"name":"ברי בתנור","amount":1,"price":68,"extra":null}]', 'AWAITING'),
	(28, '{"waiter":"1","table":"21","openTime":"17:12:38","openDate":"05/01/2026","closeTime":"17:12:48","closeDate":"05/01/2026"}', '[{"id":4,"name":"בליני בשרי","amount":1,"price":58,"extra":null},{"id":3,"name":"תפוח אדמה עלומה","amount":1,"price":74,"extra":null},{"id":2,"name":"צלחת חריפים","amount":1,"price":32,"extra":null},{"id":1,"name":"ברי בתנור","amount":1,"price":68,"extra":null}]', 'AWAITING'),
	(29, '{"waiter":"1","table":"21","openTime":"17:12:38","openDate":"05/01/2026","closeTime":"17:12:48","closeDate":"05/01/2026"}', '[{"id":4,"name":"בליני בשרי","amount":1,"price":58,"extra":null},{"id":3,"name":"תפוח אדמה עלומה","amount":1,"price":74,"extra":null},{"id":2,"name":"צלחת חריפים","amount":1,"price":32,"extra":null},{"id":1,"name":"ברי בתנור","amount":1,"price":68,"extra":null}]', 'AWAITING'),
	(30, '{"waiter":"1","table":"21","openTime":"17:12:38","openDate":"05/01/2026","closeTime":"17:12:48","closeDate":"05/01/2026"}', '[{"id":4,"name":"בליני בשרי","amount":1,"price":58,"extra":null},{"id":3,"name":"תפוח אדמה עלומה","amount":1,"price":74,"extra":null},{"id":2,"name":"צלחת חריפים","amount":1,"price":32,"extra":null},{"id":1,"name":"ברי בתנור","amount":1,"price":68,"extra":null}]', 'AWAITING'),
	(31, '{"waiter":"1","table":"21","openTime":"17:12:38","openDate":"05/01/2026","closeTime":"17:12:48","closeDate":"05/01/2026"}', '[{"id":4,"name":"בליני בשרי","amount":1,"price":58,"extra":null},{"id":3,"name":"תפוח אדמה עלומה","amount":1,"price":74,"extra":null},{"id":2,"name":"צלחת חריפים","amount":1,"price":32,"extra":null},{"id":1,"name":"ברי בתנור","amount":1,"price":68,"extra":null}]', 'AWAITING'),
	(32, '{"waiter":"1","table":"21","openTime":"17:12:38","openDate":"05/01/2026","closeTime":"17:12:48","closeDate":"05/01/2026"}', '[{"id":4,"name":"בליני בשרי","amount":1,"price":58,"extra":null},{"id":3,"name":"תפוח אדמה עלומה","amount":1,"price":74,"extra":null},{"id":2,"name":"צלחת חריפים","amount":1,"price":32,"extra":null},{"id":1,"name":"ברי בתנור","amount":1,"price":68,"extra":null}]', 'AWAITING'),
	(33, '{"waiter":"1","table":"21","openTime":"17:12:38","openDate":"05/01/2026","closeTime":"17:12:48","closeDate":"05/01/2026"}', '[{"id":4,"name":"בליני בשרי","amount":1,"price":58,"extra":null},{"id":3,"name":"תפוח אדמה עלומה","amount":1,"price":74,"extra":null},{"id":2,"name":"צלחת חריפים","amount":1,"price":32,"extra":null},{"id":1,"name":"ברי בתנור","amount":1,"price":68,"extra":null}]', 'AWAITING'),
	(34, '{"waiter":"1","table":"21","openTime":"17:12:38","openDate":"05/01/2026","closeTime":"17:12:48","closeDate":"05/01/2026"}', '[{"id":4,"name":"בליני בשרי","amount":1,"price":58,"extra":null},{"id":3,"name":"תפוח אדמה עלומה","amount":1,"price":74,"extra":null},{"id":2,"name":"צלחת חריפים","amount":1,"price":32,"extra":null},{"id":1,"name":"ברי בתנור","amount":1,"price":68,"extra":null}]', 'AWAITING'),
	(35, '{"waiter":"1","table":"21","openTime":"17:12:38","openDate":"05/01/2026","closeTime":"17:12:48","closeDate":"05/01/2026"}', '[{"id":4,"name":"בליני בשרי","amount":1,"price":58,"extra":null},{"id":3,"name":"תפוח אדמה עלומה","amount":1,"price":74,"extra":null},{"id":2,"name":"צלחת חריפים","amount":1,"price":32,"extra":null},{"id":1,"name":"ברי בתנור","amount":1,"price":68,"extra":null}]', 'AWAITING'),
	(36, '{"waiter":"1","table":"21","openTime":"17:12:38","openDate":"05/01/2026","closeTime":"17:12:48","closeDate":"05/01/2026"}', '[{"id":4,"name":"בליני בשרי","amount":1,"price":58,"extra":null},{"id":3,"name":"תפוח אדמה עלומה","amount":1,"price":74,"extra":null},{"id":2,"name":"צלחת חריפים","amount":1,"price":32,"extra":null},{"id":1,"name":"ברי בתנור","amount":1,"price":68,"extra":null}]', 'AWAITING'),
	(37, '{"waiter":"1","table":"21","openTime":"17:12:38","openDate":"05/01/2026","closeTime":"17:12:48","closeDate":"05/01/2026"}', '[{"id":4,"name":"בליני בשרי","amount":1,"price":58,"extra":null},{"id":3,"name":"תפוח אדמה עלומה","amount":1,"price":74,"extra":null},{"id":2,"name":"צלחת חריפים","amount":1,"price":32,"extra":null},{"id":1,"name":"ברי בתנור","amount":1,"price":68,"extra":null}]', 'AWAITING'),
	(38, '{"waiter":"1","table":"21","openTime":"17:12:38","openDate":"05/01/2026","closeTime":"17:12:48","closeDate":"05/01/2026"}', '[{"id":4,"name":"בליני בשרי","amount":1,"price":58,"extra":null},{"id":3,"name":"תפוח אדמה עלומה","amount":1,"price":74,"extra":null},{"id":2,"name":"צלחת חריפים","amount":1,"price":32,"extra":null},{"id":1,"name":"ברי בתנור","amount":1,"price":68,"extra":null}]', 'AWAITING'),
	(39, '{"waiter":"1","table":"21","openTime":"17:12:38","openDate":"05/01/2026","closeTime":"17:12:48","closeDate":"05/01/2026"}', '[{"id":4,"name":"בליני בשרי","amount":1,"price":58,"extra":null},{"id":3,"name":"תפוח אדמה עלומה","amount":1,"price":74,"extra":null},{"id":2,"name":"צלחת חריפים","amount":1,"price":32,"extra":null},{"id":1,"name":"ברי בתנור","amount":1,"price":68,"extra":null}]', 'AWAITING'),
	(40, '{"waiter":"1","table":"21","openTime":"17:12:38","openDate":"05/01/2026","closeTime":"17:12:48","closeDate":"05/01/2026"}', '[{"id":4,"name":"בליני בשרי","amount":1,"price":58,"extra":null},{"id":3,"name":"תפוח אדמה עלומה","amount":1,"price":74,"extra":null},{"id":2,"name":"צלחת חריפים","amount":1,"price":32,"extra":null},{"id":1,"name":"ברי בתנור","amount":1,"price":68,"extra":null}]', 'AWAITING'),
	(41, '{"waiter":"1","table":"21","openTime":"17:12:38","openDate":"05/01/2026","closeTime":"17:12:48","closeDate":"05/01/2026"}', '[{"id":4,"name":"בליני בשרי","amount":1,"price":58,"extra":null},{"id":3,"name":"תפוח אדמה עלומה","amount":1,"price":74,"extra":null},{"id":2,"name":"צלחת חריפים","amount":1,"price":32,"extra":null},{"id":1,"name":"ברי בתנור","amount":1,"price":68,"extra":null}]', 'AWAITING'),
	(42, '{"waiter":"1","table":"21","openTime":"17:12:38","openDate":"05/01/2026","closeTime":"17:12:48","closeDate":"05/01/2026"}', '[{"id":4,"name":"בליני בשרי","amount":1,"price":58,"extra":null},{"id":3,"name":"תפוח אדמה עלומה","amount":1,"price":74,"extra":null},{"id":2,"name":"צלחת חריפים","amount":1,"price":32,"extra":null},{"id":1,"name":"ברי בתנור","amount":1,"price":68,"extra":null}]', 'AWAITING'),
	(43, '{"waiter":"1","table":"21","openTime":"17:12:38","openDate":"05/01/2026","closeTime":"17:12:48","closeDate":"05/01/2026"}', '[{"id":4,"name":"בליני בשרי","amount":1,"price":58,"extra":null},{"id":3,"name":"תפוח אדמה עלומה","amount":1,"price":74,"extra":null},{"id":2,"name":"צלחת חריפים","amount":1,"price":32,"extra":null},{"id":1,"name":"ברי בתנור","amount":1,"price":68,"extra":null}]', 'AWAITING'),
	(44, '{"waiter":"1","table":"21","openTime":"17:12:38","openDate":"05/01/2026","closeTime":"17:12:48","closeDate":"05/01/2026"}', '[{"id":4,"name":"בליני בשרי","amount":1,"price":58,"extra":null},{"id":3,"name":"תפוח אדמה עלומה","amount":1,"price":74,"extra":null},{"id":2,"name":"צלחת חריפים","amount":1,"price":32,"extra":null},{"id":1,"name":"ברי בתנור","amount":1,"price":68,"extra":null}]', 'AWAITING'),
	(45, '{"waiter":"1","table":"21","openTime":"17:12:38","openDate":"05/01/2026","closeTime":"17:12:48","closeDate":"05/01/2026"}', '[{"id":4,"name":"בליני בשרי","amount":1,"price":58,"extra":null},{"id":3,"name":"תפוח אדמה עלומה","amount":1,"price":74,"extra":null},{"id":2,"name":"צלחת חריפים","amount":1,"price":32,"extra":null},{"id":1,"name":"ברי בתנור","amount":1,"price":68,"extra":null}]', 'AWAITING'),
	(46, '{"waiter":"1","table":"21","openTime":"17:12:38","openDate":"05/01/2026","closeTime":"17:12:48","closeDate":"05/01/2026"}', '[{"id":4,"name":"בליני בשרי","amount":1,"price":58,"extra":null},{"id":3,"name":"תפוח אדמה עלומה","amount":1,"price":74,"extra":null},{"id":2,"name":"צלחת חריפים","amount":1,"price":32,"extra":null},{"id":1,"name":"ברי בתנור","amount":1,"price":68,"extra":null}]', 'AWAITING'),
	(47, '{"waiter":"1","table":"21","openTime":"17:12:38","openDate":"05/01/2026","closeTime":"17:12:48","closeDate":"05/01/2026"}', '[{"id":4,"name":"בליני בשרי","amount":1,"price":58,"extra":null},{"id":3,"name":"תפוח אדמה עלומה","amount":1,"price":74,"extra":null},{"id":2,"name":"צלחת חריפים","amount":1,"price":32,"extra":null},{"id":1,"name":"ברי בתנור","amount":1,"price":68,"extra":null}]', 'AWAITING'),
	(48, '{"waiter":"1","table":"21","openTime":"17:12:38","openDate":"05/01/2026","closeTime":"17:12:48","closeDate":"05/01/2026"}', '[{"id":4,"name":"בליני בשרי","amount":1,"price":58,"extra":null},{"id":3,"name":"תפוח אדמה עלומה","amount":1,"price":74,"extra":null},{"id":2,"name":"צלחת חריפים","amount":1,"price":32,"extra":null},{"id":1,"name":"ברי בתנור","amount":1,"price":68,"extra":null}]', 'AWAITING'),
	(49, '{"waiter":"1","table":"21","openTime":"17:12:38","openDate":"05/01/2026","closeTime":"17:12:48","closeDate":"05/01/2026"}', '[{"id":4,"name":"בליני בשרי","amount":1,"price":58,"extra":null},{"id":3,"name":"תפוח אדמה עלומה","amount":1,"price":74,"extra":null},{"id":2,"name":"צלחת חריפים","amount":1,"price":32,"extra":null},{"id":1,"name":"ברי בתנור","amount":1,"price":68,"extra":null}]', 'AWAITING'),
	(50, '{"waiter":"1","table":"21","openTime":"17:12:38","openDate":"05/01/2026","closeTime":"17:12:48","closeDate":"05/01/2026"}', '[{"id":4,"name":"בליני בשרי","amount":1,"price":58,"extra":null},{"id":3,"name":"תפוח אדמה עלומה","amount":1,"price":74,"extra":null},{"id":2,"name":"צלחת חריפים","amount":1,"price":32,"extra":null},{"id":1,"name":"ברי בתנור","amount":1,"price":68,"extra":null}]', 'AWAITING'),
	(51, '{"waiter":"1","table":"21","openTime":"17:12:38","openDate":"05/01/2026","closeTime":"17:12:48","closeDate":"05/01/2026"}', '[{"id":4,"name":"בליני בשרי","amount":1,"price":58,"extra":null},{"id":3,"name":"תפוח אדמה עלומה","amount":1,"price":74,"extra":null},{"id":2,"name":"צלחת חריפים","amount":1,"price":32,"extra":null},{"id":1,"name":"ברי בתנור","amount":1,"price":68,"extra":null}]', 'AWAITING'),
	(52, '{"waiter":"1","table":"21","openTime":"17:12:38","openDate":"05/01/2026","closeTime":"17:12:48","closeDate":"05/01/2026"}', '[{"id":4,"name":"בליני בשרי","amount":1,"price":58,"extra":null},{"id":3,"name":"תפוח אדמה עלומה","amount":1,"price":74,"extra":null},{"id":2,"name":"צלחת חריפים","amount":1,"price":32,"extra":null},{"id":1,"name":"ברי בתנור","amount":1,"price":68,"extra":null}]', 'AWAITING'),
	(53, '{"waiter":"1","table":"21","openTime":"17:12:38","openDate":"05/01/2026","closeTime":"17:12:48","closeDate":"05/01/2026"}', '[{"id":4,"name":"בליני בשרי","amount":1,"price":58,"extra":null},{"id":3,"name":"תפוח אדמה עלומה","amount":1,"price":74,"extra":null},{"id":2,"name":"צלחת חריפים","amount":1,"price":32,"extra":null},{"id":1,"name":"ברי בתנור","amount":1,"price":68,"extra":null}]', 'AWAITING'),
	(54, '{"waiter":"1","table":"21","openTime":"17:12:38","openDate":"05/01/2026","closeTime":"17:12:48","closeDate":"05/01/2026"}', '[{"id":4,"name":"בליני בשרי","amount":1,"price":58,"extra":null},{"id":3,"name":"תפוח אדמה עלומה","amount":1,"price":74,"extra":null},{"id":2,"name":"צלחת חריפים","amount":1,"price":32,"extra":null},{"id":1,"name":"ברי בתנור","amount":1,"price":68,"extra":null}]', 'AWAITING'),
	(55, '{"waiter":"1","table":"21","openTime":"17:12:38","openDate":"05/01/2026","closeTime":"17:12:48","closeDate":"05/01/2026"}', '[{"id":4,"name":"בליני בשרי","amount":1,"price":58,"extra":null},{"id":3,"name":"תפוח אדמה עלומה","amount":1,"price":74,"extra":null},{"id":2,"name":"צלחת חריפים","amount":1,"price":32,"extra":null},{"id":1,"name":"ברי בתנור","amount":1,"price":68,"extra":null}]', 'AWAITING'),
	(56, '{"waiter":"1","table":"21","openTime":"17:12:38","openDate":"05/01/2026","closeTime":"17:12:48","closeDate":"05/01/2026"}', '[{"id":4,"name":"בליני בשרי","amount":1,"price":58,"extra":null},{"id":3,"name":"תפוח אדמה עלומה","amount":1,"price":74,"extra":null},{"id":2,"name":"צלחת חריפים","amount":1,"price":32,"extra":null},{"id":1,"name":"ברי בתנור","amount":1,"price":68,"extra":null}]', 'AWAITING'),
	(57, '{"waiter":"1","table":"21","openTime":"17:12:38","openDate":"05/01/2026","closeTime":"17:12:48","closeDate":"05/01/2026"}', '[{"id":4,"name":"בליני בשרי","amount":1,"price":58,"extra":null},{"id":3,"name":"תפוח אדמה עלומה","amount":1,"price":74,"extra":null},{"id":2,"name":"צלחת חריפים","amount":1,"price":32,"extra":null},{"id":1,"name":"ברי בתנור","amount":1,"price":68,"extra":null}]', 'AWAITING'),
	(58, '{"waiter":"1","table":"21","openTime":"17:12:38","openDate":"05/01/2026","closeTime":"17:12:48","closeDate":"05/01/2026"}', '[{"id":4,"name":"בליני בשרי","amount":1,"price":58,"extra":null},{"id":3,"name":"תפוח אדמה עלומה","amount":1,"price":74,"extra":null},{"id":2,"name":"צלחת חריפים","amount":1,"price":32,"extra":null},{"id":1,"name":"ברי בתנור","amount":1,"price":68,"extra":null}]', 'AWAITING'),
	(59, '{"waiter":"1","table":"21","openTime":"17:12:38","openDate":"05/01/2026","closeTime":"17:12:48","closeDate":"05/01/2026"}', '[{"id":4,"name":"בליני בשרי","amount":1,"price":58,"extra":null},{"id":3,"name":"תפוח אדמה עלומה","amount":1,"price":74,"extra":null},{"id":2,"name":"צלחת חריפים","amount":1,"price":32,"extra":null},{"id":1,"name":"ברי בתנור","amount":1,"price":68,"extra":null}]', 'AWAITING'),
	(60, '{"waiter":"1","table":"21","openTime":"17:12:38","openDate":"05/01/2026","closeTime":"17:12:48","closeDate":"05/01/2026"}', '[{"id":4,"name":"בליני בשרי","amount":1,"price":58,"extra":null},{"id":3,"name":"תפוח אדמה עלומה","amount":1,"price":74,"extra":null},{"id":2,"name":"צלחת חריפים","amount":1,"price":32,"extra":null},{"id":1,"name":"ברי בתנור","amount":1,"price":68,"extra":null}]', 'AWAITING'),
	(61, '{"waiter":"1","table":"21","openTime":"17:12:38","openDate":"05/01/2026","closeTime":"17:12:48","closeDate":"05/01/2026"}', '[{"id":4,"name":"בליני בשרי","amount":1,"price":58,"extra":null},{"id":3,"name":"תפוח אדמה עלומה","amount":1,"price":74,"extra":null},{"id":2,"name":"צלחת חריפים","amount":1,"price":32,"extra":null},{"id":1,"name":"ברי בתנור","amount":1,"price":68,"extra":null}]', 'AWAITING'),
	(62, '{"waiter":"1","table":"21","openTime":"17:12:38","openDate":"05/01/2026","closeTime":"17:12:48","closeDate":"05/01/2026"}', '[{"id":4,"name":"בליני בשרי","amount":1,"price":58,"extra":null},{"id":3,"name":"תפוח אדמה עלומה","amount":1,"price":74,"extra":null},{"id":2,"name":"צלחת חריפים","amount":1,"price":32,"extra":null},{"id":1,"name":"ברי בתנור","amount":1,"price":68,"extra":null}]', 'AWAITING'),
	(63, '{"waiter":"1","table":"21","openTime":"17:12:38","openDate":"05/01/2026","closeTime":"17:12:48","closeDate":"05/01/2026"}', '[{"id":4,"name":"בליני בשרי","amount":1,"price":58,"extra":null},{"id":3,"name":"תפוח אדמה עלומה","amount":1,"price":74,"extra":null},{"id":2,"name":"צלחת חריפים","amount":1,"price":32,"extra":null},{"id":1,"name":"ברי בתנור","amount":1,"price":68,"extra":null}]', 'AWAITING'),
	(64, '{"waiter":"1","table":"21","openTime":"17:12:38","openDate":"05/01/2026","closeTime":"17:12:48","closeDate":"05/01/2026"}', '[{"id":4,"name":"בליני בשרי","amount":1,"price":58,"extra":null},{"id":3,"name":"תפוח אדמה עלומה","amount":1,"price":74,"extra":null},{"id":2,"name":"צלחת חריפים","amount":1,"price":32,"extra":null},{"id":1,"name":"ברי בתנור","amount":1,"price":68,"extra":null}]', 'AWAITING'),
	(65, '{"waiter":"1","table":"21","openTime":"17:12:38","openDate":"05/01/2026","closeTime":"17:12:48","closeDate":"05/01/2026"}', '[{"id":4,"name":"בליני בשרי","amount":1,"price":58,"extra":null},{"id":3,"name":"תפוח אדמה עלומה","amount":1,"price":74,"extra":null},{"id":2,"name":"צלחת חריפים","amount":1,"price":32,"extra":null},{"id":1,"name":"ברי בתנור","amount":1,"price":68,"extra":null}]', 'AWAITING'),
	(66, '{"waiter":"1","table":"21","openTime":"17:12:38","openDate":"05/01/2026","closeTime":"17:12:48","closeDate":"05/01/2026"}', '[{"id":4,"name":"בליני בשרי","amount":1,"price":58,"extra":null},{"id":3,"name":"תפוח אדמה עלומה","amount":1,"price":74,"extra":null},{"id":2,"name":"צלחת חריפים","amount":1,"price":32,"extra":null},{"id":1,"name":"ברי בתנור","amount":1,"price":68,"extra":null}]', 'AWAITING'),
	(67, '{"waiter":"1","table":"21","openTime":"17:12:38","openDate":"05/01/2026","closeTime":"17:12:48","closeDate":"05/01/2026"}', '[{"id":4,"name":"בליני בשרי","amount":1,"price":58,"extra":null},{"id":3,"name":"תפוח אדמה עלומה","amount":1,"price":74,"extra":null},{"id":2,"name":"צלחת חריפים","amount":1,"price":32,"extra":null},{"id":1,"name":"ברי בתנור","amount":1,"price":68,"extra":null}]', 'AWAITING'),
	(68, '{"waiter":"1","table":"21","openTime":"17:12:38","openDate":"05/01/2026","closeTime":"17:12:48","closeDate":"05/01/2026"}', '[{"id":4,"name":"בליני בשרי","amount":1,"price":58,"extra":null},{"id":3,"name":"תפוח אדמה עלומה","amount":1,"price":74,"extra":null},{"id":2,"name":"צלחת חריפים","amount":1,"price":32,"extra":null},{"id":1,"name":"ברי בתנור","amount":1,"price":68,"extra":null}]', 'AWAITING'),
	(69, '{"waiter":"1","table":"21","openTime":"17:12:38","openDate":"05/01/2026","closeTime":"17:12:48","closeDate":"05/01/2026"}', '[{"id":4,"name":"בליני בשרי","amount":1,"price":58,"extra":null},{"id":3,"name":"תפוח אדמה עלומה","amount":1,"price":74,"extra":null},{"id":2,"name":"צלחת חריפים","amount":1,"price":32,"extra":null},{"id":1,"name":"ברי בתנור","amount":1,"price":68,"extra":null}]', 'AWAITING'),
	(70, '{"waiter":"1","table":"21","openTime":"17:12:38","openDate":"05/01/2026","closeTime":"17:12:48","closeDate":"05/01/2026"}', '[{"id":4,"name":"בליני בשרי","amount":1,"price":58,"extra":null},{"id":3,"name":"תפוח אדמה עלומה","amount":1,"price":74,"extra":null},{"id":2,"name":"צלחת חריפים","amount":1,"price":32,"extra":null},{"id":1,"name":"ברי בתנור","amount":1,"price":68,"extra":null}]', 'AWAITING'),
	(71, '{"waiter":"1","table":"21","openTime":"17:12:38","openDate":"05/01/2026","closeTime":"17:12:48","closeDate":"05/01/2026"}', '[{"id":4,"name":"בליני בשרי","amount":1,"price":58,"extra":null},{"id":3,"name":"תפוח אדמה עלומה","amount":1,"price":74,"extra":null},{"id":2,"name":"צלחת חריפים","amount":1,"price":32,"extra":null},{"id":1,"name":"ברי בתנור","amount":1,"price":68,"extra":null}]', 'AWAITING'),
	(72, '{"waiter":"1","table":"21","openTime":"17:12:38","openDate":"05/01/2026","closeTime":"17:12:48","closeDate":"05/01/2026"}', '[{"id":4,"name":"בליני בשרי","amount":1,"price":58,"extra":null},{"id":3,"name":"תפוח אדמה עלומה","amount":1,"price":74,"extra":null},{"id":2,"name":"צלחת חריפים","amount":1,"price":32,"extra":null},{"id":1,"name":"ברי בתנור","amount":1,"price":68,"extra":null}]', 'AWAITING'),
	(73, '{"waiter":"1","table":"21","openTime":"17:12:38","openDate":"05/01/2026","closeTime":"17:12:48","closeDate":"05/01/2026"}', '[{"id":4,"name":"בליני בשרי","amount":1,"price":58,"extra":null},{"id":3,"name":"תפוח אדמה עלומה","amount":1,"price":74,"extra":null},{"id":2,"name":"צלחת חריפים","amount":1,"price":32,"extra":null},{"id":1,"name":"ברי בתנור","amount":1,"price":68,"extra":null}]', 'AWAITING');

-- Dumping structure for table petra_test.printers
CREATE TABLE IF NOT EXISTS `printers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(10) NOT NULL DEFAULT '0',
  `address` varchar(20) NOT NULL DEFAULT '192.168.10.',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table petra_test.printers: ~8 rows (approximately)
INSERT INTO `printers` (`id`, `name`, `address`) VALUES
	(1, 'OUT', '192.168.10.59'),
	(2, 'BAR', '192.168.10.52'),
	(3, 'K', '192.168.10.50'),
	(4, 'KITCHEN', '192.168.10.60'),
	(5, 'MAFIM', '192.168.10.66'),
	(6, 'OUT2', '192.168.10.78'),
	(7, 'OUTTER', '192.168.10.79'),
	(8, 'GRILL', '192.168.10.80');

-- Dumping structure for table petra_test.tables
CREATE TABLE IF NOT EXISTS `tables` (
  `id` varchar(20) NOT NULL,
  `section_id` int(11) NOT NULL DEFAULT 4,
  `status` varchar(50) DEFAULT 'OPEN',
  `location` varchar(10) DEFAULT NULL,
  `order` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`order`)),
  `information` int(11) DEFAULT NULL,
  `shape` char(1) DEFAULT 'S',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='The table for the tables in the resturant';

-- Dumping data for table petra_test.tables: ~109 rows (approximately)
INSERT INTO `tables` (`id`, `section_id`, `status`, `location`, `order`, `information`, `shape`) VALUES
	('100', 3, 'OPEN', '2-7', '[]', NULL, 'S'),
	('1000', 2, 'OPEN', '2-5', '[]', NULL, 'S'),
	('11', 0, 'OPEN', '1-1', '[]', NULL, 'S'),
	('1100', 2, 'OPEN', '3-5', '[]', NULL, 'S'),
	('12', 0, 'OPEN', '1-2', '[]', NULL, 'S'),
	('1200', 2, 'OPEN', '4-5', '[]', NULL, 'S'),
	('13', 0, 'OPEN', '1-3', '[]', NULL, 'S'),
	('1300', 2, 'OPEN', '5-5', '[]', NULL, 'S'),
	('14', 0, 'OPEN', '1-4', '[]', NULL, 'S'),
	('15', 0, 'OPEN', '1-5', '[]', NULL, 'S'),
	('16', 3, 'OPEN', '3-2', '[]', NULL, 'C'),
	('17', 3, 'OPEN', '3-1', '[]', NULL, 'C'),
	('18', 3, 'OPEN', '4-1', '[]', NULL, 'S'),
	('19', 3, 'OPEN', '4-2', '[]', NULL, 'S'),
	('20', 3, 'OPEN', '4-3', '[]', NULL, 'S'),
	('200', 3, 'OPEN', '3-7', '[]', NULL, 'S'),
	('21', 0, 'OPEN', '2-1', '[]', NULL, 'C'),
	('22', 0, 'OPEN', '2-2', '[]', NULL, 'S'),
	('24', 0, 'OPEN', '2-4', '[]', NULL, 'C'),
	('25', 0, 'OPEN', '2-5', '[]', NULL, 'S'),
	('27', 3, 'OPEN', '5-1', '[]', NULL, 'S'),
	('28', 3, 'OPEN', '5-2', '[]', NULL, 'S'),
	('29', 3, 'OPEN', '5-3', '[]', NULL, 'S'),
	('30', 3, 'OPEN', '1-1', '[]', NULL, 'S'),
	('300', 3, 'OPEN', '4-7', '[]', NULL, 'S'),
	('31', 0, 'OPEN', '3-1', '[]', NULL, 'S'),
	('32', 0, 'OPEN', '3-2', '[]', NULL, 'S'),
	('34', 0, 'OPEN', '3-4', '[]', NULL, 'C'),
	('35', 0, 'OPEN', '3-5', '[]', NULL, 'S'),
	('36', 3, 'OPEN', '6-1', '[]', NULL, 'S'),
	('37', 3, 'OPEN', '6-2', '[]', NULL, 'S'),
	('38', 3, 'OPEN', '6-3', '[]', NULL, 'S'),
	('40', 3, 'OPEN', '1-2', '[]', NULL, 'S'),
	('400', 3, 'OPEN', '5-7', '[]', NULL, 'S'),
	('41', 0, 'OPEN', '4-1', '[]', NULL, 'S'),
	('42', 0, 'OPEN', '4-2', '[]', NULL, 'S'),
	('43', 0, 'OPEN', '4-3', '[]', NULL, 'S'),
	('45', 0, 'OPEN', '4-5', '[]', NULL, 'S'),
	('46', 3, 'OPEN', '7-1', '[]', NULL, 'S'),
	('47', 3, 'OPEN', '7-2', '[]', NULL, 'S'),
	('48', 3, 'OPEN', '7-3', '[]', NULL, 'S'),
	('50', 3, 'OPEN', '1-3', '[]', NULL, 'S'),
	('500', 3, 'OPEN', '6-7', '[]', NULL, 'S'),
	('51', 0, 'OPEN', '5-1', '[]', NULL, 'S'),
	('52', 0, 'OPEN', '5-2', '[]', NULL, 'S'),
	('53', 0, 'OPEN', '5-3', '[]', NULL, 'S'),
	('54', 0, 'OPEN', '5-4', '[]', NULL, 'S'),
	('55', 0, 'OPEN', '5-5', '[]', NULL, 'S'),
	('56', 3, 'OPEN', '8-1', '[]', NULL, 'S'),
	('57', 3, 'OPEN', '8-2', '[]', NULL, 'S'),
	('60', 3, 'OPEN', '1-4', '[]', NULL, 'S'),
	('600', 3, 'OPEN', '7-7', '[]', NULL, 'S'),
	('70', 3, 'OPEN', '1-5', '[]', NULL, 'S'),
	('700', 3, 'OPEN', '8-7', '[]', NULL, 'S'),
	('7000', 4, 'OPEN', '1-1', '[]', NULL, 'S'),
	('7001', 4, 'OPEN', '1-2', '[]', NULL, 'S'),
	('7002', 4, 'OPEN', '1-3', '[]', NULL, 'S'),
	('7003', 4, 'OPEN', '1-4', '[]', NULL, 'S'),
	('7004', 4, 'OPEN', '1-5', '[]', NULL, 'S'),
	('7005', 4, 'OPEN', '1-6', '[]', NULL, 'S'),
	('7006', 4, 'OPEN', '2-1', '[]', NULL, 'S'),
	('7007', 4, 'OPEN', '2-2', '[]', NULL, 'S'),
	('7008', 4, 'OPEN', '2-3', '[]', NULL, 'S'),
	('7009', 4, 'OPEN', '2-4', '[]', NULL, 'S'),
	('7010', 4, 'OPEN', '2-5', '[]', NULL, 'S'),
	('7011', 4, 'OPEN', '2-6', '[]', NULL, 'S'),
	('7012', 4, 'OPEN', '3-1', '[]', NULL, 'S'),
	('7013', 4, 'OPEN', '3-2', '[]', NULL, 'S'),
	('7014', 4, 'OPEN', '3-3', '[]', NULL, 'S'),
	('7015', 4, 'OPEN', '3-4', '[]', NULL, 'S'),
	('7016', 4, 'OPEN', '3-5', '[]', NULL, 'S'),
	('7018', 4, 'OPEN', '3-6', '[]', NULL, 'S'),
	('7019', 4, 'OPEN', '4-1', '[]', NULL, 'S'),
	('7020', 4, 'OPEN', '4-2', '[]', NULL, 'S'),
	('7021', 4, 'OPEN', '4-3', '[]', NULL, 'S'),
	('7022', 4, 'OPEN', '4-4', '[]', NULL, 'S'),
	('7023', 4, 'OPEN', '4-5', '[]', NULL, 'S'),
	('7024', 4, 'OPEN', '4-6', '[]', NULL, 'S'),
	('7025', 4, 'OPEN', '5-1', '[]', NULL, 'S'),
	('7026', 4, 'OPEN', '5-2', '[]', NULL, 'S'),
	('7027', 4, 'OPEN', '5-3', '[]', NULL, 'S'),
	('7028', 4, 'OPEN', '5-4', '[]', NULL, 'S'),
	('7029', 4, 'OPEN', '5-5', '[]', NULL, 'S'),
	('7030', 4, 'OPEN', '5-6', '[]', NULL, 'S'),
	('71', 2, 'OPEN', '3-1', '[]', NULL, 'S'),
	('72', 2, 'OPEN', '3-2', '[]', NULL, 'S'),
	('73', 2, 'OPEN', '3-3', '[]', NULL, 'S'),
	('80', 3, 'OPEN', '1-6', '[]', NULL, 'S'),
	('800', 3, 'OPEN', '9-7', '[]', NULL, 'S'),
	('81', 2, 'OPEN', '4-1', '[]', NULL, 'S'),
	('82', 2, 'OPEN', '4-2', '[]', NULL, 'S'),
	('83', 2, 'OPEN', '4-3', '[]', NULL, 'S'),
	('90', 3, 'OPEN', '1-7', '[]', NULL, 'S'),
	('91', 2, 'OPEN', '5-1', '[]', NULL, 'S'),
	('92', 2, 'OPEN', '5-2', '[]', NULL, 'S'),
	('93', 2, 'OPEN', '5-3', '[]', NULL, 'S'),
	('G1', 0, 'OPEN', '6-2', '[]', NULL, 'S'),
	('G2', 0, 'OPEN', '6-3', '[]', NULL, 'S'),
	('G3', 0, 'OPEN', '6-4', '[]', NULL, 'S'),
	('G4', 0, 'OPEN', '6-5', '[]', NULL, 'S'),
	('G5', 2, 'OPEN', '1-2', '[]', NULL, 'S'),
	('G6', 2, 'OPEN', '2-1', '[]', NULL, 'S'),
	('G7', 2, 'OPEN', '2-2', '[]', NULL, 'S'),
	('V1', 1, 'OPEN', '2-1', '[]', NULL, 'S'),
	('V2', 1, 'OPEN', '2-2', '[]', NULL, 'S'),
	('V3', 1, 'OPEN', '2-3', '[]', NULL, 'S'),
	('V4', 1, 'OPEN', '4-1', '[]', NULL, 'S'),
	('V5', 1, 'OPEN', '4-2', '[]', NULL, 'S'),
	('V6', 1, 'OPEN', '4-3', '[]', NULL, 'S');

-- Dumping structure for table petra_test.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(10) DEFAULT NULL,
  `admin` tinyint(4) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table petra_test.users: ~0 rows (approximately)
INSERT INTO `users` (`id`, `name`, `admin`) VALUES
	(1, 'רוני', 1),
	(2, 'טוני', 0);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;

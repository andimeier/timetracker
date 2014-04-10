-- MySQL dump 10.13  Distrib 5.1.73, for debian-linux-gnu (x86_64)
--
-- Host: db4free.net    Database: timetracker
-- ------------------------------------------------------
-- Server version	5.6.17

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `clients` (
  `client_id` int(11) NOT NULL AUTO_INCREMENT,
  `abbreviation` varchar(30) NOT NULL,
  `name` varchar(100) NOT NULL,
  `rate` decimal(6,2) DEFAULT NULL,
  `invoice_template` varchar(250) DEFAULT NULL,
  `invoice_generator` varchar(255) DEFAULT NULL,
  `mime_type` varchar(100) DEFAULT NULL,
  `active` int(11) NOT NULL DEFAULT '1',
  `cdate` datetime DEFAULT NULL,
  PRIMARY KEY (`client_id`),
  UNIQUE KEY `client_nameIX` (`name`)
) ENGINE=MyISAM AUTO_INCREMENT=19 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
INSERT INTO `clients` VALUES (1,'Cli1','Testclient 1',NULL,NULL,NULL,NULL,1,NULL),(2,'Cli2','Testclient 2','29.07',NULL,'templates/latexize.sh','application/pdf',0,NULL),(3,'Cli3','Testclient 3','32.70',NULL,'templates/latexize.sh','application/pdf',0,NULL),(6,'Cli6','Testclient 6','50.00',NULL,NULL,NULL,1,NULL),(11,'Cli11','Testclient 11',NULL,NULL,NULL,NULL,1,'2010-01-22 19:18:18'),(14,'Cli14','Testclient 14',NULL,NULL,NULL,NULL,1,'2010-03-22 18:19:29'),(15,'Cli15','Testclient 15','50.00',NULL,NULL,NULL,1,'2010-09-20 21:12:51'),(16,'Cli16','Testclient 16','50.00',NULL,NULL,NULL,1,'2011-02-15 09:41:13');
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoices`
--

DROP TABLE IF EXISTS `invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `invoices` (
  `invoice_id` int(11) NOT NULL AUTO_INCREMENT,
  `invoice_year` int(11) NOT NULL DEFAULT '0',
  `invoice_number` int(11) DEFAULT NULL,
  `client_id` int(11) NOT NULL DEFAULT '0',
  `cancelled` tinyint(4) NOT NULL DEFAULT '0',
  `sum_net` decimal(10,2) DEFAULT NULL,
  `sum_gross` decimal(10,2) DEFAULT NULL,
  `invoice_date` date DEFAULT NULL,
  `paid` tinyint(4) NOT NULL DEFAULT '0',
  `paid_on` date DEFAULT NULL,
  `comment` text,
  `cdate` datetime DEFAULT NULL,
  PRIMARY KEY (`invoice_id`)
) ENGINE=MyISAM AUTO_INCREMENT=3408 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoices`
--

LOCK TABLES `invoices` WRITE;
/*!40000 ALTER TABLE `invoices` DISABLE KEYS */;
INSERT INTO `invoices` VALUES (1608,2013,195,6,0,'9750.00',NULL,'2013-02-04',1,NULL,'Comment for invoice nr. 195',NULL),(1609,2013,196,6,0,'9800.00',NULL,'2013-07-30',1,NULL,'Comment for invoice nr. 196','0000-00-00 00:00:00'),(1610,2013,197,6,0,'9850.00',NULL,'2013-10-16',1,NULL,'To be deleted',NULL),(1611,2014,211,18,0,'10550.00',NULL,'2014-01-15',0,NULL,'Comment for invoice nr. 211',NULL),(1595,2013,194,6,1,'10000.00','12000.00','2013-03-02',0,NULL,'For update','2014-04-10 10:16:52'),(1594,2012,190,18,1,'6000.00','7200.00',NULL,0,NULL,'Comment for invoice nr. 190','2014-04-10 10:19:16'),(3401,2010,21,6,0,NULL,NULL,'2010-04-10',0,NULL,NULL,NULL),(3402,2010,22,6,0,NULL,NULL,'2010-04-10',0,NULL,NULL,NULL),(3403,2010,23,6,0,NULL,NULL,'2010-04-10',0,NULL,NULL,NULL),(3404,2010,24,6,0,NULL,NULL,'2010-04-10',0,NULL,NULL,NULL),(3405,2010,25,6,0,NULL,NULL,'2010-04-10',0,NULL,NULL,NULL),(3406,2010,26,6,0,NULL,NULL,'2010-04-10',0,NULL,NULL,NULL),(3407,2010,27,6,0,NULL,NULL,'2010-04-10',0,NULL,NULL,NULL);
/*!40000 ALTER TABLE `invoices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `log`
--

DROP TABLE IF EXISTS `log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `log` (
  `loh_id` int(11) NOT NULL AUTO_INCREMENT,
  `category_hash` varchar(5) NOT NULL DEFAULT '',
  `text` varchar(200) DEFAULT NULL,
  `obj_humanreadable` varchar(100) DEFAULT NULL,
  `additional_text` varchar(200) DEFAULT NULL,
  `username` varchar(20) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `ip` varchar(15) DEFAULT NULL,
  `cdate` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`loh_id`)
) ENGINE=MyISAM AUTO_INCREMENT=92 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `log`
--

LOCK TABLES `log` WRITE;
/*!40000 ALTER TABLE `log` DISABLE KEYS */;
/*!40000 ALTER TABLE `log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `projects` (
  `project_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `abbreviation` varchar(20) DEFAULT NULL,
  `client_id` int(11) NOT NULL DEFAULT '0',
  `active` int(11) NOT NULL DEFAULT '1',
  `estimated_hours` int(11) DEFAULT NULL,
  PRIMARY KEY (`project_id`),
  UNIQUE KEY `projects_ix1` (`client_id`,`name`)
) ENGINE=MyISAM AUTO_INCREMENT=156 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES (1,'Active Project 1','Proj1',3,1,NULL),(3,'Active Project 3','Proj3',2,1,NULL),(5,'Active Project 5','Proj5',1,1,200),(25,'Active Project 25','Proj25',2,1,NULL),(26,'Active Project 26','Proj26',2,1,NULL),(28,'Active Project 28','Proj28',2,1,NULL),(70,'Active Project 70','Proj70',2,1,NULL),(147,'Project 147','Proj147',14,0,NULL),(149,'Project 149','Proj149',15,0,NULL),(150,'Project 150','Proj150',15,0,NULL),(151,'Project 151','Proj151',6,0,NULL),(152,'Project 152','Proj152',11,0,NULL),(153,'Project 153','Proj153',16,0,NULL);
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `records`
--

DROP TABLE IF EXISTS `records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `records` (
  `record_id` int(11) NOT NULL AUTO_INCREMENT,
  `starttime` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `endtime` datetime DEFAULT NULL,
  `pause` time DEFAULT NULL,
  `project_id` int(11) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `user_id` int(11) NOT NULL DEFAULT '0',
  `invoice_id` int(11) DEFAULT NULL,
  `cdate` datetime NOT NULL,
  `mdate` datetime NOT NULL,
  PRIMARY KEY (`record_id`),
  KEY `hours_ix1` (`user_id`,`starttime`)
) ENGINE=MyISAM AUTO_INCREMENT=3659 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `records`
--

LOCK TABLES `records` WRITE;
/*!40000 ALTER TABLE `records` DISABLE KEYS */;
INSERT INTO `records` VALUES (3504,'2010-10-01 09:48:00','2010-10-01 15:58:00','00:00:00',147,'Test-Eintrag mit gewissen Taetigkeiten am 01.10.2010',1,NULL,'2010-10-01 15:57:44','2010-10-01 15:57:44'),(3505,'2010-10-04 09:50:00','2010-10-04 17:38:00','00:00:00',147,'Test-Eintrag mit gewissen Taetigkeiten am 04.10.2010',1,NULL,'2010-10-04 09:50:46','2010-10-04 09:50:46'),(3506,'2010-10-04 23:10:00','2010-10-04 23:57:00','00:00:00',149,'Test-Eintrag mit gewissen Taetigkeiten am 04.10.2010',1,NULL,'2010-10-04 23:11:55','2010-10-04 23:11:55'),(3507,'2010-10-05 09:40:00','2010-10-05 18:53:00','00:00:00',147,'Test-Eintrag mit gewissen Taetigkeiten am 05.10.2010',1,NULL,'2010-10-05 09:40:51','2010-10-05 09:40:51'),(3508,'2010-10-05 20:49:00','2010-10-05 20:52:00','00:00:00',149,'Test-Eintrag mit gewissen Taetigkeiten am 05.10.2010',1,NULL,'2010-10-05 20:50:04','2010-10-05 20:50:04'),(3509,'2010-10-06 09:48:00','2010-10-06 19:55:00','00:00:00',147,'Test-Eintrag mit gewissen Taetigkeiten am 06.10.2010',1,NULL,'2010-10-06 19:55:45','2010-10-06 19:55:45'),(3510,'2010-10-07 09:48:00','2010-10-07 18:00:00','00:00:00',147,'Test-Eintrag mit gewissen Taetigkeiten am 07.10.2010',1,NULL,'2010-10-07 09:48:14','2010-10-07 09:48:14'),(3511,'2010-10-08 09:35:00','2010-10-08 17:33:00','00:00:00',147,'Test-Eintrag mit gewissen Taetigkeiten am 08.10.2010',1,NULL,'2010-10-08 09:36:35','2010-10-08 09:36:35'),(3512,'2010-10-10 15:50:00','2010-10-10 17:18:00','00:00:00',150,'Test-Eintrag mit gewissen Taetigkeiten am 10.10.2010',1,NULL,'2010-10-10 15:53:24','2010-10-10 15:53:24'),(3513,'2010-10-10 17:25:00','2010-10-10 20:21:00','00:00:00',149,'Test-Eintrag mit gewissen Taetigkeiten am 10.10.2010',1,NULL,'2010-10-10 17:25:25','2010-10-10 17:25:25'),(3514,'2010-10-11 09:51:00','2010-10-11 17:48:00','00:00:00',147,'Test-Eintrag mit gewissen Taetigkeiten am 11.10.2010',1,NULL,'2010-10-11 09:51:43','2010-10-11 09:51:43'),(3515,'2010-10-11 23:22:00','2010-10-12 00:38:00','00:00:00',150,'Test-Eintrag mit gewissen Taetigkeiten am 11.10.2010',1,NULL,'2010-10-11 23:22:41','2010-10-11 23:22:41'),(3516,'2010-10-12 09:50:00','2010-10-12 17:46:00','00:00:00',147,'Test-Eintrag mit gewissen Taetigkeiten am 12.10.2010',1,NULL,'2010-10-12 10:03:52','2010-10-12 10:03:52'),(3517,'2010-10-13 09:43:00','2010-10-13 19:18:00','00:00:00',147,'Test-Eintrag mit gewissen Taetigkeiten am 13.10.2010',1,NULL,'2010-10-13 09:43:48','2010-10-13 09:43:48'),(3518,'2010-10-13 21:14:00','2010-10-13 23:15:00','00:00:00',150,'Test-Eintrag mit gewissen Taetigkeiten am 13.10.2010',1,NULL,'2010-10-13 21:14:50','2010-10-13 21:14:50'),(3519,'2010-10-14 09:30:00','2010-10-14 18:15:00','00:00:00',147,'Test-Eintrag mit gewissen Taetigkeiten am 14.10.2010',1,NULL,'2010-10-14 09:30:32','2010-10-14 09:30:32'),(3520,'2010-10-15 11:10:00','2010-10-15 12:31:00','00:00:00',147,'Test-Eintrag mit gewissen Taetigkeiten am 15.10.2010',1,NULL,'2010-10-15 11:15:24','2010-10-15 11:15:24'),(3521,'2010-10-15 08:00:00','2010-10-15 11:10:00','00:00:00',147,'Test-Eintrag mit gewissen Taetigkeiten am 15.10.2010',1,NULL,'2010-10-15 11:15:48','2010-10-15 11:15:48'),(3522,'2010-10-18 09:51:00','2010-10-18 17:34:00','00:00:00',147,'Test-Eintrag mit gewissen Taetigkeiten am 18.10.2010',1,NULL,'2010-10-18 09:52:03','2010-10-18 09:52:03'),(3523,'2010-10-19 09:50:00','2010-10-19 20:54:00','00:00:00',147,'Test-Eintrag mit gewissen Taetigkeiten am 19.10.2010',1,NULL,'2010-10-19 20:54:09','2010-10-19 20:54:09'),(3524,'2010-10-20 09:50:00','2010-10-20 18:35:00','00:00:00',147,'Test-Eintrag mit gewissen Taetigkeiten am 20.10.2010',1,NULL,'2010-10-20 09:51:39','2010-10-20 09:51:39'),(3525,'2010-10-21 08:40:00','2010-10-21 17:55:00','00:00:00',147,'Test-Eintrag mit gewissen Taetigkeiten am 21.10.2010',1,NULL,'2010-10-21 12:06:43','2010-10-21 12:06:43'),(3526,'2010-10-22 09:50:00','2010-10-22 17:14:00','00:00:00',147,'Test-Eintrag mit gewissen Taetigkeiten am 22.10.2010',1,NULL,'2010-10-22 09:51:22','2010-10-22 09:51:22'),(3527,'2010-10-25 11:10:00','2010-10-25 17:37:00','00:00:00',147,'Test-Eintrag mit gewissen Taetigkeiten am 25.10.2010',1,NULL,'2010-10-25 11:15:31','2010-10-25 11:15:31'),(3528,'2010-10-27 09:50:00','2010-10-27 19:12:00','00:00:00',147,'Test-Eintrag mit gewissen Taetigkeiten am 27.10.2010',1,NULL,'2010-10-27 19:12:40','2010-10-27 19:12:40'),(3529,'2010-10-28 09:47:00','2010-10-28 18:41:00','00:00:00',147,'Test-Eintrag mit gewissen Taetigkeiten am 28.10.2010',1,NULL,'2010-10-28 09:47:06','2010-10-28 09:47:06'),(3530,'2010-10-29 09:53:00','2010-10-29 15:12:00','00:00:00',147,'Test-Eintrag mit gewissen Taetigkeiten am 29.10.2010',1,NULL,'2010-10-29 09:53:44','2010-10-29 09:53:44'),(3531,'2010-11-02 09:50:00','2010-11-02 18:58:00','00:00:00',147,'Test-Eintrag mit gewissen Taetigkeiten am 02.11.2010',1,NULL,'2010-11-02 18:58:18','2010-11-02 18:58:18'),(3532,'2010-11-03 09:35:00','2010-11-03 18:18:00','00:00:00',147,'Test-Eintrag mit gewissen Taetigkeiten am 03.11.2010',1,NULL,'2010-11-03 18:19:07','2010-11-03 18:19:07'),(3533,'2010-11-04 09:37:00','2010-11-04 17:55:00','00:00:00',147,'Test-Eintrag mit gewissen Taetigkeiten am 04.11.2010',1,NULL,'2010-11-04 17:43:34','2010-11-04 17:43:34'),(3534,'2010-11-05 10:01:00','2010-11-05 18:30:00','00:00:00',147,'Test-Eintrag mit gewissen Taetigkeiten am 05.11.2010',1,NULL,'2010-11-05 16:58:55','2010-11-05 16:58:55'),(3535,'2010-11-09 08:57:00','2010-11-09 19:11:00','00:00:00',147,'Test-Eintrag mit gewissen Taetigkeiten am 09.11.2010',1,NULL,'2010-11-09 19:11:10','2010-11-09 19:11:10'),(3536,'2010-11-10 10:46:00','2010-11-10 20:40:00','00:00:00',147,'Test-Eintrag mit gewissen Taetigkeiten am 10.11.2010',1,NULL,'2010-11-10 20:40:15','2010-11-10 20:40:15'),(3537,'2010-11-11 09:46:00','2010-11-11 17:51:00','00:00:00',147,'Test-Eintrag mit gewissen Taetigkeiten am 11.11.2010',1,NULL,'2010-11-11 15:24:13','2010-11-11 15:24:13'),(3538,'2010-11-12 08:33:00','2010-11-12 15:52:00','00:00:00',147,'Test-Eintrag mit gewissen Taetigkeiten am 12.11.2010',1,NULL,'2010-11-12 08:33:45','2010-11-12 08:33:45'),(3539,'2010-11-16 09:05:00','2010-11-16 18:15:00','00:00:00',147,'Test-Eintrag mit gewissen Taetigkeiten am 16.11.2010',1,NULL,'2010-11-16 09:06:33','2010-11-16 09:06:33'),(3540,'2010-11-17 10:15:00','2010-11-17 19:17:00','00:00:00',147,'Test-Eintrag mit gewissen Taetigkeiten am 17.11.2010',1,NULL,'2010-11-17 12:02:03','2010-11-17 12:02:03'),(3541,'2010-11-18 09:15:00','2010-11-18 09:45:00','00:00:00',147,'Test-Eintrag mit gewissen Taetigkeiten am 18.11.2010',1,NULL,'2010-11-18 10:46:43','2010-11-18 10:46:43'),(3542,'2010-11-18 10:15:00','2010-11-18 18:15:00','00:00:00',147,'Test-Eintrag mit gewissen Taetigkeiten am 18.11.2010',1,NULL,'2010-11-18 10:46:51','2010-11-18 10:46:51'),(3543,'2010-11-19 09:01:00','2010-11-19 12:00:00','00:00:00',147,'Test-Eintrag mit gewissen Taetigkeiten am 19.11.2010',1,NULL,'2010-11-18 10:46:51','2010-11-18 10:46:51'),(3544,'2010-11-22 09:37:00','2010-11-22 17:44:00','00:00:00',147,'Test-Eintrag mit gewissen Taetigkeiten am 22.11.2010',1,NULL,'2010-11-22 09:38:16','2010-11-22 09:38:16'),(3545,'2010-11-23 09:54:00','2010-11-23 18:10:00','00:00:00',147,'Test-Eintrag mit gewissen Taetigkeiten am 23.11.2010',1,NULL,'2010-11-23 11:43:58','2010-11-23 11:43:58'),(3546,'2010-11-23 21:15:00','2010-11-23 23:50:00','00:00:00',147,'Test-Eintrag mit gewissen Taetigkeiten am 23.11.2010',1,NULL,'2010-11-23 11:43:58','2010-11-23 11:43:58'),(3547,'2010-11-24 09:29:00','2010-11-24 20:44:00','00:00:00',147,'Test-Eintrag mit gewissen Taetigkeiten am 24.11.2010',1,NULL,'2010-11-24 18:24:00','2010-11-24 18:24:00'),(3548,'2010-11-25 09:30:00','2010-11-25 18:31:00','00:00:00',147,'Test-Eintrag mit gewissen Taetigkeiten am 25.11.2010',1,NULL,'2010-11-25 09:38:59','2010-11-25 09:38:59'),(3549,'2010-11-26 09:38:00','2010-11-26 16:30:00','00:00:00',147,'Test-Eintrag mit gewissen Taetigkeiten am 26.11.2010',1,NULL,'2010-11-26 16:28:42','2010-11-26 16:28:42'),(3550,'2010-11-29 10:04:00','2010-11-29 17:40:00','00:00:00',147,'Test-Eintrag mit gewissen Taetigkeiten am 29.11.2010',1,NULL,'2010-11-26 16:28:42','2010-11-26 16:28:42'),(3551,'2010-12-01 09:04:00','2010-12-01 18:31:00','00:00:00',147,'Test-Eintrag mit gewissen Taetigkeiten am 01.12.2010',1,NULL,'2010-11-30 10:26:33','2010-11-30 10:26:33'),(3552,'2010-11-30 10:25:00','2010-11-30 18:44:00','00:00:00',147,'Test-Eintrag mit gewissen Taetigkeiten am 30.11.2010',1,NULL,'2010-11-30 10:26:34','2010-11-30 10:26:34'),(3553,'2010-12-02 09:52:00','2010-12-02 17:55:00','00:00:00',147,'Test-Eintrag mit gewissen Taetigkeiten am 02.12.2010',1,NULL,'2010-12-02 09:52:18','2010-12-02 09:52:18'),(3554,'2010-11-08 09:35:00','2010-11-08 17:45:00','00:00:00',147,'Test-Eintrag mit gewissen Taetigkeiten am 08.11.2010',1,NULL,'2010-12-02 10:03:54','2010-12-02 10:03:54'),(3555,'2010-12-03 09:36:00','2010-12-03 18:14:00','00:00:00',147,'Test-Eintrag mit gewissen Taetigkeiten am 03.12.2010',1,NULL,'2010-12-03 09:36:38','2010-12-03 09:36:38'),(3556,'2010-12-06 09:45:00','2010-12-06 17:46:00','00:00:00',147,'Test-Eintrag mit gewissen Taetigkeiten am 06.12.2010',1,NULL,'2010-12-06 09:45:15','2010-12-06 09:45:15'),(3557,'2010-12-09 09:39:00','2010-12-09 18:10:00','00:00:00',147,'Test-Eintrag mit gewissen Taetigkeiten am 09.12.2010',1,NULL,'2010-12-09 09:39:26','2010-12-09 09:39:26'),(3558,'2010-12-13 09:43:00','2010-12-13 17:43:00','00:00:00',147,'Test-Eintrag mit gewissen Taetigkeiten am 13.12.2010',1,NULL,'2010-12-13 09:45:17','2010-12-13 09:45:17'),(3559,'2010-12-14 09:43:00','2010-12-14 18:07:00','00:00:00',147,'Test-Eintrag mit gewissen Taetigkeiten am 14.12.2010',1,NULL,'2010-12-13 09:45:17','2010-12-13 09:45:17'),(3560,'2010-12-15 09:43:00','2010-12-15 17:26:00','00:00:00',147,'Test-Eintrag mit gewissen Taetigkeiten am 15.12.2010',1,NULL,'2010-12-15 09:43:46','2010-12-15 09:43:46'),(3561,'2010-12-16 09:59:00','2010-12-16 18:14:00','00:00:00',147,'Test-Eintrag mit gewissen Taetigkeiten am 16.12.2010',1,NULL,'2010-12-16 10:00:22','2010-12-16 10:00:22'),(3562,'2010-12-17 10:38:00','2010-12-17 17:07:00','00:00:00',147,'Test-Eintrag mit gewissen Taetigkeiten am 17.12.2010',1,NULL,'2010-12-17 10:39:40','2010-12-17 10:39:40'),(3563,'2010-12-20 10:01:00','2010-12-20 17:58:00','00:00:00',147,'Test-Eintrag mit gewissen Taetigkeiten am 20.12.2010',1,NULL,'2010-12-20 10:01:46','2010-12-20 10:01:46'),(3564,'2010-12-21 09:24:00','2010-12-21 12:03:00','00:00:00',147,'Test-Eintrag mit gewissen Taetigkeiten am 21.12.2010',1,NULL,'2010-12-21 09:24:54','2010-12-21 09:24:54'),(3565,'2010-12-22 09:15:00','2010-12-22 17:06:00','00:00:00',147,'Test-Eintrag mit gewissen Taetigkeiten am 22.12.2010',1,NULL,'2010-12-22 09:17:30','2010-12-22 09:17:30'),(3566,'2011-02-04 10:15:00','2011-02-04 10:45:00','00:00:00',151,'Test-Eintrag mit gewissen Taetigkeiten am 04.02.2011',1,196,'2011-02-04 11:38:24','2011-02-04 11:38:24'),(3567,'2011-02-04 11:25:00','2011-02-04 11:35:00','00:00:00',151,'Test-Eintrag mit gewissen Taetigkeiten am 04.02.2011',1,196,'2011-02-04 11:38:47','2011-02-04 11:38:47'),(3568,'2011-02-04 11:35:00','2011-02-04 12:34:00','00:00:00',151,'Test-Eintrag mit gewissen Taetigkeiten am 04.02.2011',1,196,'2011-02-04 11:39:00','2011-02-04 11:39:00'),(3569,'2011-02-04 13:35:00','2011-02-04 14:03:00','00:00:00',152,'Test-Eintrag mit gewissen Taetigkeiten am 04.02.2011',1,NULL,'2011-02-04 13:35:59','2011-02-04 13:35:59'),(3570,'2011-02-04 14:03:00','2011-02-04 15:00:00','00:00:00',152,'Test-Eintrag mit gewissen Taetigkeiten am 04.02.2011',1,NULL,'2011-02-04 14:04:14','2011-02-04 14:04:14'),(3571,'2011-02-08 14:48:00','2011-02-08 16:50:00','00:00:00',151,'Test-Eintrag mit gewissen Taetigkeiten am 08.02.2011',1,196,'2011-02-08 14:48:32','2011-02-08 14:48:32'),(3572,'2011-02-09 12:34:00','2011-02-09 16:51:00','00:00:00',152,'Test-Eintrag mit gewissen Taetigkeiten am 09.02.2011',1,NULL,'2011-02-09 12:34:45','2011-02-09 12:34:45'),(3573,'2011-02-14 09:00:00','2011-02-14 11:30:00','00:00:00',153,'Test-Eintrag mit gewissen Taetigkeiten am 14.02.2011',1,197,'2011-02-15 09:44:58','2011-02-15 09:44:58'),(3574,'2011-02-15 10:45:00','2011-02-15 12:45:00','00:00:00',153,'Test-Eintrag mit gewissen Taetigkeiten am 15.02.2011',1,197,'2011-02-15 10:58:48','2011-02-15 10:58:48'),(3575,'2011-02-16 10:00:00','2011-02-16 17:00:00','00:00:00',153,'Test-Eintrag mit gewissen Taetigkeiten am 16.02.2011',1,197,'2011-02-16 10:13:13','2011-02-16 10:13:13'),(3576,'2011-02-17 12:00:00','2011-02-17 16:00:00','00:00:00',153,'Test-Eintrag mit gewissen Taetigkeiten am 17.02.2011',1,197,'2011-02-17 12:16:15','2011-02-17 12:16:15'),(3577,'2011-02-18 08:30:00','2011-02-18 16:30:00','00:00:00',153,'Test-Eintrag mit gewissen Taetigkeiten am 18.02.2011',1,197,'2011-02-18 08:47:53','2011-02-18 08:47:53'),(3578,'2011-02-19 22:15:00','2011-02-19 22:45:00','00:00:00',152,'Test-Eintrag mit gewissen Taetigkeiten am 19.02.2011',1,NULL,'2011-02-19 22:58:13','2011-02-19 22:58:13'),(3579,'2011-02-21 13:12:00','2011-02-21 16:37:00','00:00:00',152,'Test-Eintrag mit gewissen Taetigkeiten am 21.02.2011',1,NULL,'2011-02-21 13:12:45','2011-02-21 13:12:45'),(3580,'2011-02-22 09:15:00','2011-02-22 15:30:00','00:00:00',153,'To be deleted',1,197,'2011-02-22 09:40:39','2011-02-22 09:40:39'),(3581,'2011-02-23 10:06:00','2011-02-23 12:28:00','00:00:00',152,'Test-Eintrag mit gewissen Taetigkeiten am 23.02.2011',1,NULL,'2011-02-23 10:06:46','2011-02-23 10:06:46'),(3582,'2011-02-23 12:28:00','2011-02-23 12:47:00','00:00:00',152,'Test-Eintrag mit gewissen Taetigkeiten am 23.02.2011',1,NULL,'2011-02-23 12:28:52','2011-02-23 12:28:52'),(3583,'2011-02-23 12:47:00','2011-02-23 14:39:00','00:00:00',152,'Test-Eintrag mit gewissen Taetigkeiten am 23.02.2011',1,NULL,'2011-02-23 14:39:39','2011-02-23 14:39:39'),(3584,'2011-02-23 15:30:00','2011-02-23 17:50:00','00:00:00',152,'Test-Eintrag mit gewissen Taetigkeiten am 23.02.2011',1,NULL,'2011-02-23 18:35:34','2011-02-23 18:35:34'),(3585,'2011-02-24 11:00:00','2011-02-24 13:45:00','00:00:00',152,'Test-Eintrag mit gewissen Taetigkeiten am 24.02.2011',1,NULL,'2011-02-24 13:45:49','2011-02-24 13:45:49'),(3589,'2011-03-01 10:27:00','2011-03-01 11:24:00','00:00:00',151,'Test-Eintrag mit gewissen Taetigkeiten am 01.03.2011',1,196,'2011-03-01 10:27:51','2011-03-01 10:27:51'),(3590,'2011-03-01 11:24:00','2011-03-01 16:52:00','00:00:00',151,'Test-Eintrag mit gewissen Taetigkeiten am 01.03.2011',1,196,'2011-03-01 11:24:59','2011-03-01 11:24:59'),(3591,'2011-03-01 15:52:00','2011-03-01 16:25:00','00:00:00',25,'For update test',1,NULL,'2011-03-01 17:24:01','2014-01-27 17:30:49'),(3592,'2011-03-02 12:03:00','2011-03-02 15:00:00','00:00:00',152,'Test-Eintrag mit gewissen Taetigkeiten am 02.03.2011',1,NULL,'2011-03-02 13:23:03','2011-03-02 13:23:03'),(3593,'2011-03-03 13:17:00','2011-03-03 13:39:00','00:00:00',151,'Newest record so far',1,196,'2011-03-03 13:17:49','2011-03-03 13:17:49'),(3635,'2011-03-03 12:17:00','2011-03-03 12:39:00','00:00:00',151,'Test-Eintrag mit gewissen Taetigkeiten am 03.03.2011',10,196,'2014-01-31 15:28:16','2014-01-31 15:28:16');
/*!40000 ALTER TABLE `records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userprojects`
--

DROP TABLE IF EXISTS `userprojects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `userprojects` (
  `user_id` int(11) NOT NULL DEFAULT '0',
  `project_id` int(11) NOT NULL DEFAULT '0',
  KEY `userprojects_ix1` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userprojects`
--

LOCK TABLES `userprojects` WRITE;
/*!40000 ALTER TABLE `userprojects` DISABLE KEYS */;
INSERT INTO `userprojects` VALUES (1,147),(1,153),(1,151);
/*!40000 ALTER TABLE `userprojects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(30) NOT NULL DEFAULT '',
  `password` varchar(32) DEFAULT NULL,
  `first_name` varchar(30) DEFAULT NULL,
  `last_name` varchar(30) DEFAULT NULL,
  `sex` char(1) DEFAULT NULL,
  `uid` varchar(20) DEFAULT NULL,
  `cdate` datetime DEFAULT NULL,
  `lastlogin` datetime DEFAULT NULL,
  `active` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'zimmer','098f6bcd4621d373cade4e832627b4f6','Alexander','Zimmer','M',NULL,'2001-09-20 16:39:01','2013-10-16 21:17:00',1),(2,'test','098f6bcd4621d373cade4e832627b4f6','Vorname','Nachname','M',NULL,'2002-05-10 13:47:03',NULL,1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2014-04-10 11:14:58

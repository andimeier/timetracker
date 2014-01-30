-- anonymize clients
update clients set
  client_name = concat('Testclient ', client_id),
  client_abbr=concat('Cli', client_id),
  clients set invoice_template = null;

-- anonymize invoices
set @enddate = date_sub(current_date(), interval rand()*100 DAY);
set @startdate = date_sub(@enddate, interval 1 month);
update invoices set 
  sum = invoice_number * 50,
  comment = concat('Test-Rechnung fuer die Arbeit vom ',
    @startdate,
    ' bis ',
    @enddate)
;

-- anonymize logs
update log set text=concat('Logeintrag ', id);

-- anonymize projects
update projects set
  project=concat('Project ', project_id),		
  project_abbr=concat('Proj', project_id);

-- anonymize users
update users set password=md5('username'), uid=null;

-- anomymize records
update hours set description = concat('Test-Eintrag mit gewissen Taetigkeiten am ',  date_format(starttime, '%d.%m.%Y'));

-- some DDL
rename table hours to records;
alter table records change hour_id record_id int NOT NULL AUTO_INCREMENT;

-- instead of enum('Y', 'N') use 1/0:
alter table projects modify active int not null default 1;
alter table projects change project name varchar(100) not null;
alter table projects change project_abbr abbreviation varchar(20);
update projects set active=active-1; -- map 1/2 -> 0/1
update projects set name=concat('Active ', name) where active;
alter table projects add description text;

alter table clients modify active int not null default 1;
alter table clients change client_name name varchar(100) not null;
alter table clients change client_abbr abbreviation varchar(30) not null;

update users set active=1 where active='Y';
alter table users modify active int not null default 1;

alter table records modify cdate datetime not null;
alter table records add mdate datetime not null;
update records set mdate=cdate where mdate='0000-00-00 00:00:00';
alter table records modify pause time ; -- pause should be nullable

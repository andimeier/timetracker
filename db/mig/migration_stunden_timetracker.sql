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

-- rename table
rename table hours to records;
alter table hours change hour_id record_id int NOT NULL AUTO_INCREMENT;

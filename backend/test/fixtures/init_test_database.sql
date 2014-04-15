delete from records where project_id in (
  select project_id from projects where name like '[{E2E-TEST}]%'
);
delete from projects where name like '[{E2E-TEST}]%';
delete from clients where name like '[{E2E-TEST}]%';

-- clients
insert into clients(client_id,abbreviation,name,rate,active,cdate)
values(1,'TST1','[{E2E-TEST}] Test Client 1',40,1,'2014-01-01');
insert into clients(client_id,abbreviation,name,rate,active,cdate)
values(2,'TST2','[{E2E-TEST}] Test Client 2',75,1,'2014-01-02');

-- projects
insert into projects(project_id, name, abbreviation, client_id, active, description, start, end, estimated_hours, rate, fixed_price)
values(1, '[{E2E-TEST}] Test Project 1', 'TST1', 1, 1, 'A super description', '2014-01-01 08:00:00', null, 100, 40, null);
insert into projects(project_id, name, abbreviation, client_id, active, description, start, end, estimated_hours, rate, fixed_price)
values(2, '[{E2E-TEST}] Test Project 2', 'TST2', 1, 1, 'One more super description', '2014-01-10 09:00:00', null, null, 40, 10000);
insert into projects(project_id, name, abbreviation, client_id, active, description, start, end, estimated_hours, rate, fixed_price)
values(3, '[{E2E-TEST}] Test Project for other client 3', 'TST3', 1, 1, 'Superb description', '2014-01-12 09:00:00', null, null, 40, 7500);
insert into projects(project_id, name, abbreviation, client_id, active, description, start, end, estimated_hours, rate, fixed_price)
values(4, '[{E2E-TEST}] Closed Project', 'TST4', 1, 0, 'Old description', '2014-01-12 09:00:00', null, null, 40, 7500);

-- records

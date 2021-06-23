select 
from historico_estaciones
limit 10


alter table historico_estaciones add column fecha date


INSERT INTO customers (name, email)
VALUES('Microsoft','hotline@microsoft.com') 
ON CONFLICT (name) 
DO NOTHING;

SELECT TO_DATE('2017/02/30', 'YYYY/MM/DD');

update historico_estaciones set fecha =TO_DATE(to_char(year ,'9999') || to_char(mes ,'00') || to_char(dia ,'00'),'YYYYMMDD') 
ON CONFLICT (fecha)
DO NOTHING;

select to_char(year ,'9999'),to_char(mes ,'00'),to_char(dia ,'00'),fecha 
,TO_DATE(to_char(year ,'9999') || to_char(mes ,'00') || to_char(dia ,'00'),'YYYYMMDD') 
from historico_estaciones
limit 20


select TO_DATE('20200306', 'YYYYMMDD')


import tweepy, psycopg2, os, json, datetime, sys, requests, time
import pandas as pd
import numpy as np

#connstr para bd
#dev str
conn_string = "host='localhost' dbname='clima' user='postgres' password='Guatemala1'"

#produccion str
#conn_string = "host='localhost' dbname='clima' user='postgres' password='postgres2020!Incyt'"
prediccion = 5

def getProcessDate():
    try:
        from datetime import date
        today = date.today()
        yesterday = today - datetime.timedelta(days=1)
        return yesterday
    except:
        write("error en getProcessDate")
        
def convUTF8(cadena):
    try:
        return str(cadena).replace("á","a").replace("é","e").replace("í","i").replace("ó","o").replace("ú","u").replace("ñ","n").replace("Á","A").replace("É","E").replace("Í","I").replace("Ó","O").replace("Ú","U").replace("Ñ","Ñ")
    except:
        return cadena

    
def getLocation():
    try:
        from psycopg2.extras import RealDictCursor
        conn = psycopg2.connect(conn_string)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute("select distinct estacion from historico_estaciones ")
        l = json.dumps(cursor.fetchall(),indent = 2)
        conn.close()
        return l
    except:
        write("error en getLocation")

def ejecutaComandoPsql(query):
    try:
        print(query)
        conn = psycopg2.connect(conn_string)
        cursor = conn.cursor()
        cursor.execute(query)
        conn.commit()
        conn.close()
    except:
        write("error en ejecutar comando psql")

def cargaUltimoAnio(estacion):
    m = 0
    conn = psycopg2.connect(conn_string)
    cursor = conn.cursor()
    cursor.execute("select max(year) from  historico_estaciones where estacion = '"+estacion+"'")
    rows = cursor.fetchall()
 
    for row in rows:
        #m.append([row[0],row[1].upper()])
        m = row[0]
        #print(row[0],row[1])
    conn.close()
    print(m)
    return m


def cargaEstaciones():
    m = []
    conn = psycopg2.connect(conn_string)
    cursor = conn.cursor()
    cursor.execute('select distinct estacion from historico_estaciones')
    rows = cursor.fetchall()
 
    for row in rows:
        #m.append([row[0],row[1].upper()])
        m.append(row[0])
        #print(row[0],row[1])
    conn.close()
    #print(m)
    return m


def getAVGLluvia(estacion,mes):
    m = []
    conn = psycopg2.connect(conn_string)
    cursor = conn.cursor()
    #q = "select estacion,mes,dia,round(avg(lluvia),1) as \"avgLluvia\" ,count(*)  from historico_estaciones  where lluvia >=-10  and lluvia <> 0  and estacion = '" + estacion +"'  group by estacion,mes,dia order by mes,dia "
    q = "select estacion,year,mes,round(avg(lluvia),5) as \"avgLluvia\" from historico_estaciones where lluvia >=-10 and mes = " + str(mes) + "and estacion = '" + estacion + "' group by estacion,year,mes order by mes,year "

    cursor.execute(q)
    rows = cursor.fetchall()
    for row in rows:
        #m.append([row[0],row[1].upper()])
        m.append([row[0],row[1],row[2],row[3],0])
        #print(([row[0],row[1],row[2],row[3],row[4]]))
    conn.close()
    print(m)
    return m


def ejecutaComandoPsql(query):
    try:
        #print(query)
        conn = psycopg2.connect(conn_string)
        cursor = conn.cursor()
        cursor.execute(query)
        conn.commit()
        conn.close()
    except:
        write("error en ejecutar comando psql")



def cargaLLuviaPorDia():
    print('inicia la carga en un arreglo')
    arr = []
    arr.append([1,2,3])
    arr.append([4,5,6])
    np_arr = np.array(arr)
    print(arr)
    print(np_arr)
    

def calculaProyeccionAbsoluto(ultimoAnio, datosLluvia, estacion):
    print(estacion)#estacion,mes,dia,avg,count
    p = []
    for x in range(1, 5):
        anio = ultimoAnio + x
        print(anio)
        for d in datosLluvia:
            print(d)
            p.append([estacion,anio,mes,dia])
            

def proyeccionAbsoluta(lista,ultimoAnio):
    #print('proyectando')
    i = 1
    promedio = 0
    while (i < len(lista)-1):
        lista[i][4] = lista[i][3] - lista[i - 1][3]
        promedio += lista[i][4]
        #print(lista[i]);
        i+=1
    promedio = promedio / len(lista)
    print(promedio)
    estacion = lista[i][0]
    mes = lista[i][2]
    ultimoValor = lista[i][3]
    i = 1
    futuro = []
    
    while ( i <= prediccion):
        #y = (ultimoAnio) + 100
        #print(estacion)
        #print(y)
        #print(mes)
        #print(ultimoValor + promedio)
        futuro.append([estacion ,ultimoAnio + i, mes, ultimoValor + promedio])
        ultimoValor = ultimoValor + promedio
        i += 1
    #print(futuro)
    return futuro
        
def ejecutaComandoPsql(query):
    try:
        #print(query)
        conn = psycopg2.connect(conn_string)
        cursor = conn.cursor()
        cursor.execute(query)
        conn.commit()
        conn.close()
    except:
        write("error en ejecutar comando psql")

    
if __name__ == "__main__":
  print('inicia proceso de proyecciones')
  #cargaLLuviaPorDia()
  estaciones = cargaEstaciones()

  #ultimoAnio = cargaUltimoAnio('INSIVUMEH')
  #lista = getAVGLluvia('INSIVUMEH',12)
  #proyeccionAbsoluta(lista,ultimoAnio)
  

  for e in estaciones:
    print(e)
    for x in range(1, 12):
      lista = getAVGLluvia(e,x)
      ultimoAnio = cargaUltimoAnio(e)
      futuro = proyeccionAbsoluta(lista,ultimoAnio)
#      print('***********************')
#      print(futuro)
      for f in futuro:
          #print('******************************')
          #print(f)
          q = 'insert into proyeccion_absoluta (estacion,anio,mes,proyeccion) values (\'' + str(f[0]) + '\','+ str(f[1]) + ',' + str(f[2]) + ',' + str(f[3]) + ' )'
          ejecutaComandoPsql(q)
    
    #calculaProyeccionAbsoluto(ultimoAnio,datosLluvia,e)

'''
select estacion,mes,dia,round(avg(lluvia),1) as "avgLluvia" ,count(*)
from historico_estaciones
where lluvia >=-10
and lluvia <> 0
and estacion = 'INSIVUMEH'
group by estacion,mes,dia
order by mes,dia

select estacion,year,mes,round(avg(lluvia),5) as "avgLluvia" 
from historico_estaciones
where lluvia >=-10
and mes = 1
and estacion = 'INSIVUMEH'
group by estacion,year,mes
order by mes,year


create table proyeccion_absoluta(
	 id SERIAL,
	estacion text not null,
	anio numeric not null,
	mes numeric not null,
	proyeccion numeric not null
)
'''

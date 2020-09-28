import tweepy, psycopg2, os, json, datetime, sys, requests, time
import pandas as pd
import numpy as np

#connstr para bd
#dev str
conn_string = "host='localhost' dbname='sosagua' user='postgres' password='Guatemala1'"

#produccion str
#conn_string = "host='localhost' dbname='sosagua' user='postgres' password='postgres2020!Incyt'"



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
        cursor.execute("select ")
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


def cargaLLuviaPorDia():
    print('inicia la carga en un arreglo')
    arr = []
    arr.append([1,2,3])
    arr.append([4,5,6])
    np_arr = np.array(arr)
    print(arr)
    print(np_arr)

    
if __name__ == "__main__":
  print('inicia proceso de proyecciones')
  cargaLLuviaPorDia()

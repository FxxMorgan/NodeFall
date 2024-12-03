import requests
import json

# URL de la API de Deepl
url = 'https://api-free.deepl.com/v2/translate'

# Asegúrate de definir `api_key`
api_key = 'ed7c0e19-1c20-40f7-be96-6300984b8848:fx'

# Función para traducir texto usando la API de Deepl
def traducir_texto(texto, idioma_destino='es'):
    params = {
        'auth_key': api_key,
        'text': texto,
        'target_lang': idioma_destino
    }
    try:
        response = requests.post(url, data=params)
        response.raise_for_status()  # Lanza un error para códigos de estado 4xx o 5xx
        return response.json()['translations'][0]['text']
    except requests.exceptions.RequestException as e:
        print(f"Error en la solicitud de traducción: {e}")
        return None

# Función para traducir el contenido de un archivo JSON
def traducir_json(archivo_entrada, archivo_salida, idioma_destino='es'):
    try:
        with open(archivo_entrada, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Comprobar la estructura del JSON
        print("Contenido original del JSON:", data)

        # Suponiendo que el JSON tiene texto que se puede traducir en valores de cadenas
        for key, value in data.items():
            if isinstance(value, dict):
                # Traducir 'name' si existe
                if 'name' in value:
                    original_name = value['name']
                    print(f"Traduciendo 'name': {original_name}")
                    texto_traducido_name = traducir_texto(original_name, idioma_destino)
                    if texto_traducido_name:
                        value['name'] = texto_traducido_name
                        print(f"Traducido 'name': {texto_traducido_name}")
                
                # Traducir 'aliasOf' si existe
                if 'aliasOf' in value:
                    original_alias = value['aliasOf']
                    print(f"Traduciendo 'aliasOf': {original_alias}")
                    texto_traducido_alias = traducir_texto(original_alias, idioma_destino)
                    if texto_traducido_alias:
                        value['aliasOf'] = texto_traducido_alias
                        print(f"Traducido 'aliasOf': {texto_traducido_alias}")

                # Traducir 'parent' si existe
                if 'parent' in value:
                    original_parent = value['parent']
                    print(f"Traduciendo 'parent': {original_parent}")
                    texto_traducido_parent = traducir_texto(original_parent, idioma_destino)
                    if texto_traducido_parent:
                        value['parent'] = texto_traducido_parent
                        print(f"Traducido 'parent': {texto_traducido_parent}")
                
                # Traducir elementos en 'category' si existen
                if 'category' in value:
                    for i, categoria in enumerate(value['category']):
                        print(f"Traduciendo 'category': {categoria}")
                        texto_traducido_categoria = traducir_texto(categoria, idioma_destino)
                        if texto_traducido_categoria:
                            value['category'][i] = texto_traducido_categoria
                            print(f"Traducido 'category': {texto_traducido_categoria}")
        
        with open(archivo_salida, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
            print(f"Archivo traducido guardado como: {archivo_salida}")
    except FileNotFoundError:
        print(f"Archivo no encontrado: {archivo_entrada}")
    except json.JSONDecodeError:
        print(f"Error al decodificar JSON en el archivo: {archivo_entrada}")
    except Exception as e:
        print(f"Error al procesar el archivo {archivo_entrada}: {e}")

# Cambia las rutas a las absolutas si es necesario
archivo_tags = 'C:/Users/FxxMo/Documents/Fictionner-Tags/fictioneer-taxonomies-es/es-cl/tags.json'

# Traducir los archivos
traducir_json(archivo_tags, 'tags_traducido.json')

print("Traducción completada.")
